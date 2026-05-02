function toNumber(value, fallback = 0) {
  const normalized =
    typeof value === "string" ? value.replace(/,/g, "").trim() : value;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function buildStocksMap(stocks = []) {
  return new Map(
    (Array.isArray(stocks) ? stocks : []).map((stock) => [stock.symbol, stock]),
  );
}

export function calculatePortfolioSummary(positions = [], stocks = []) {
  const stocksMap = stocks instanceof Map ? stocks : buildStocksMap(stocks);
  const holdings = (Array.isArray(positions) ? positions : [])
    .map((position) => {
      const liveStock = stocksMap.get(position.symbol) || {};
      const shares = toNumber(position.shares);
      const averageCost = toNumber(position.averageCost);
      const currentPrice = toNumber(
        liveStock.currentPrice ??
          liveStock.price ??
          position.currentPrice ??
          averageCost,
      );
      const changePercent = toNumber(liveStock.changePercent);
      const marketValue = shares * currentPrice;
      const costValue = shares * averageCost;
      const unrealizedPnL = marketValue - costValue;
      const unrealizedPnLPercent = costValue
        ? (unrealizedPnL / costValue) * 100
        : 0;
      const dayMoveValue = marketValue * (changePercent / 100);

      return {
        ...position,
        ...liveStock,
        shares,
        averageCost,
        currentPrice,
        marketValue,
        costValue,
        unrealizedPnL,
        unrealizedPnLPercent,
        dayMoveValue,
      };
    })
    .filter((position) => position.shares > 0);

  const totalValue = holdings.reduce(
    (sum, position) => sum + position.marketValue,
    0,
  );
  const totalCost = holdings.reduce(
    (sum, position) => sum + position.costValue,
    0,
  );
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = totalCost ? (totalPnL / totalCost) * 100 : 0;
  const dayMoveValue = holdings.reduce(
    (sum, position) => sum + position.dayMoveValue,
    0,
  );
  const topHolding =
    [...holdings].sort((left, right) => right.marketValue - left.marketValue)[0] ||
    null;

  const sectorAllocation = Object.values(
    holdings.reduce((accumulator, position) => {
      const key = position.sector || "Diversified";
      if (!accumulator[key]) {
        accumulator[key] = {
          sector: key,
          marketValue: 0,
          count: 0,
        };
      }

      accumulator[key].marketValue += position.marketValue;
      accumulator[key].count += 1;
      return accumulator;
    }, {}),
  )
    .map((item) => ({
      ...item,
      weight: totalValue ? (item.marketValue / totalValue) * 100 : 0,
    }))
    .sort((left, right) => right.marketValue - left.marketValue);

  return {
    holdings,
    totalValue,
    totalCost,
    totalPnL,
    totalPnLPercent,
    dayMoveValue,
    positionsCount: holdings.length,
    topHolding,
    sectorAllocation,
  };
}

export function evaluateAlerts(alerts = [], stocks = []) {
  const stocksMap = stocks instanceof Map ? stocks : buildStocksMap(stocks);
  const items = (Array.isArray(alerts) ? alerts : [])
    .map((alert) => {
      const liveStock = stocksMap.get(alert.symbol) || {};
      const currentPrice = toNumber(
        liveStock.currentPrice ??
          liveStock.price ??
          alert.currentPriceSnapshot ??
          0,
      );
      const targetPrice = toNumber(alert.targetPrice);
      const direction = alert.direction === "below" ? "below" : "above";
      const triggered =
        direction === "above"
          ? currentPrice >= targetPrice
          : currentPrice <= targetPrice;
      const distanceValue =
        direction === "above"
          ? targetPrice - currentPrice
          : currentPrice - targetPrice;
      const distancePercent = currentPrice
        ? (Math.abs(targetPrice - currentPrice) / currentPrice) * 100
        : 0;

      return {
        ...alert,
        ...liveStock,
        direction,
        currentPrice,
        targetPrice,
        triggered,
        distanceValue,
        distancePercent,
      };
    })
    .sort((left, right) => {
      if (left.triggered !== right.triggered) {
        return left.triggered ? -1 : 1;
      }

      return Math.abs(left.distanceValue) - Math.abs(right.distanceValue);
    });

  return {
    items,
    activeCount: items.length,
    triggeredCount: items.filter((item) => item.triggered).length,
    nearestAlert:
      items.find((item) => !item.triggered) || items[0] || null,
  };
}

export function getSectorSnapshots(stocks = []) {
  return Object.values(
    (Array.isArray(stocks) ? stocks : []).reduce((accumulator, stock) => {
      const key = stock.sector || "Diversified";

      if (!accumulator[key]) {
        accumulator[key] = {
          sector: key,
          count: 0,
          totalChange: 0,
          totalVolume: 0,
          totalMarketCap: 0,
          leader: stock,
          laggard: stock,
        };
      }

      accumulator[key].count += 1;
      accumulator[key].totalChange += toNumber(stock.changePercent);
      accumulator[key].totalVolume += toNumber(stock.volume);
      accumulator[key].totalMarketCap += toNumber(stock.marketCap);

      if (
        toNumber(stock.changePercent) >
        toNumber(accumulator[key].leader?.changePercent)
      ) {
        accumulator[key].leader = stock;
      }

      if (
        toNumber(stock.changePercent) <
        toNumber(accumulator[key].laggard?.changePercent)
      ) {
        accumulator[key].laggard = stock;
      }

      return accumulator;
    }, {}),
  )
    .map((item) => ({
      ...item,
      averageChange: item.count ? item.totalChange / item.count : 0,
    }))
    .sort((left, right) => right.averageChange - left.averageChange);
}

export function getDividendCalendar(stocks = []) {
  return (Array.isArray(stocks) ? stocks : [])
    .filter((stock) => stock.exDividendDate || stock.paymentDate)
    .map((stock) => {
      const exDate = toDate(stock.exDividendDate);
      const paymentDate = toDate(stock.paymentDate);
      const now = new Date();
      const daysToExDate = exDate
        ? Math.ceil((exDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        ...stock,
        exDate,
        paymentDate,
        daysToExDate,
      };
    })
    .sort((left, right) => {
      const leftTime = left.exDate?.getTime() ?? Number.POSITIVE_INFINITY;
      const rightTime = right.exDate?.getTime() ?? Number.POSITIVE_INFINITY;
      return leftTime - rightTime;
    });
}

export function getMovingAverage(points = [], windowSize = 5) {
  const prices = (Array.isArray(points) ? points : [])
    .map((point) => toNumber(point.price))
    .filter((price) => price > 0);

  if (!prices.length) {
    return 0;
  }

  const slice = prices.slice(-windowSize);
  return slice.reduce((sum, value) => sum + value, 0) / slice.length;
}

function buildMovingAverageSeries(points = [], windowSize = 5) {
  const prices = (Array.isArray(points) ? points : []).map((point) =>
    toNumber(point.price),
  );

  return prices.map((_, index) => {
    const startIndex = index + 1 - windowSize;

    if (startIndex < 0) {
      return null;
    }

    const window = prices.slice(startIndex, index + 1);
    return window.reduce((sum, value) => sum + value, 0) / window.length;
  });
}

function buildRsiSeries(points = [], period = 14) {
  const prices = (Array.isArray(points) ? points : []).map((point) =>
    toNumber(point.price),
  );
  const series = Array(prices.length).fill(null);

  if (prices.length <= period) {
    return series;
  }

  let gains = 0;
  let losses = 0;

  for (let index = 1; index <= period; index += 1) {
    const change = prices[index] - prices[index - 1];
    gains += Math.max(change, 0);
    losses += Math.max(-change, 0);
  }

  let averageGain = gains / period;
  let averageLoss = losses / period;
  series[period] =
    averageLoss === 0
      ? 100
      : 100 - 100 / (1 + averageGain / averageLoss);

  for (let index = period + 1; index < prices.length; index += 1) {
    const change = prices[index] - prices[index - 1];
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);

    averageGain = (averageGain * (period - 1) + gain) / period;
    averageLoss = (averageLoss * (period - 1) + loss) / period;

    series[index] =
      averageLoss === 0
        ? 100
        : 100 - 100 / (1 + averageGain / averageLoss);
  }

  return series;
}

export function buildIndicatorSeries(points = []) {
  const movingAverage5 = buildMovingAverageSeries(points, 5);
  const movingAverage20 = buildMovingAverageSeries(points, 20);
  const rsi14 = buildRsiSeries(points, 14);

  return (Array.isArray(points) ? points : []).map((point, index) => ({
    ...point,
    ma5: movingAverage5[index],
    ma20: movingAverage20[index],
    rsi14: rsi14[index],
  }));
}

export function getMomentum(points = [], lookback = 5) {
  const prices = (Array.isArray(points) ? points : [])
    .map((point) => toNumber(point.price))
    .filter((price) => price > 0);

  if (prices.length < 2) {
    return 0;
  }

  const endPrice = prices[prices.length - 1];
  const startIndex = Math.max(0, prices.length - 1 - lookback);
  const startPrice = prices[startIndex];

  return startPrice ? ((endPrice - startPrice) / startPrice) * 100 : 0;
}

export function get52WeekPosition(stock = {}) {
  const low = toNumber(stock.week52Low);
  const high = toNumber(stock.week52High);
  const price = toNumber(stock.currentPrice ?? stock.price);

  if (!low || !high || high <= low) {
    return null;
  }

  return ((price - low) / (high - low)) * 100;
}

export function getValuationSignals(stock = {}, language = "en") {
  const signals = [];
  const peRatio = toNumber(stock.peRatio);
  const dividendYield = toNumber(stock.dividendYield);
  const rangePosition = get52WeekPosition(stock);
  const isPidgin = language === "pid";

  if (peRatio > 0) {
    signals.push({
      label: "P/E",
      value: `${peRatio.toFixed(1)}x`,
      tone:
        peRatio <= 6
          ? "positive"
          : peRatio >= 18
            ? "warning"
            : "neutral",
      note:
        peRatio <= 6
          ? isPidgin
            ? "This multiple low pass many big NGX names."
            : "Lower multiple than many NGX heavyweights."
          : peRatio >= 18
            ? isPidgin
              ? "Market don already price stronger growth expectation inside am."
              : "Market is pricing in stronger growth expectations."
            : isPidgin
              ? "This multiple dey middle range for active board names."
              : "Multiple sits in a middle range for active board names.",
    });
  }

  if (dividendYield > 0) {
    signals.push({
      label: "Yield",
      value: `${dividendYield.toFixed(1)}%`,
      tone: dividendYield >= 7 ? "positive" : "neutral",
      note:
        dividendYield >= 7
          ? isPidgin
            ? "Income investors fit keep this name close because of the yield."
            : "Income-focused investors may keep this name close."
          : isPidgin
            ? "Dividend support dey, but price behaviour still matter well."
            : "Dividend support exists, but price behaviour still matters.",
    });
  }

  if (rangePosition != null) {
    signals.push({
      label: "52W position",
      value: `${Math.max(0, Math.min(100, rangePosition)).toFixed(0)}%`,
      tone:
        rangePosition >= 75
          ? "positive"
          : rangePosition <= 25
            ? "warning"
            : "neutral",
      note:
        rangePosition >= 75
          ? isPidgin
            ? "Price dey trade near the top side of im one-year range."
            : "Price is trading near the top end of its one-year range."
          : rangePosition <= 25
            ? isPidgin
              ? "Price dey sit closer to the lower side of im one-year range."
              : "Price is sitting closer to the lower end of its one-year range."
            : isPidgin
              ? "Price dey around the middle of im one-year range."
              : "Price is trading around the middle of its one-year range.",
    });
  }

  return signals.slice(0, 3);
}

export function getStockIndicators(stock = {}) {
  const history1W = stock?.history?.["1W"] || [];
  const history1M = stock?.history?.["1M"] || [];
  const indicatorSeries = buildIndicatorSeries(history1M);
  const latestSeriesPoint = [...indicatorSeries]
    .reverse()
    .find((point) => point.rsi14 != null);

  return {
    movingAverage5: getMovingAverage(history1W, 5),
    movingAverage20: getMovingAverage(history1M, 20),
    rangePosition: get52WeekPosition(stock),
    rsi14: latestSeriesPoint?.rsi14 || 0,
    momentum5: getMomentum(history1W, 5),
  };
}
