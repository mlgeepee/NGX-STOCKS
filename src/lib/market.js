const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-NG");

const compactNumberFormatter = new Intl.NumberFormat("en-NG", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

export function formatNumber(value) {
  return numberFormatter.format(Number(value) || 0);
}

export function formatCompactNumber(value) {
  return compactNumberFormatter.format(Number(value) || 0);
}

export function formatPercent(value) {
  const amount = Number(value) || 0;
  const sign = amount > 0 ? "+" : "";
  return `${sign}${amount.toFixed(2)}%`;
}

export function getChangeTone(value) {
  if (Number(value) > 0) return "positive";
  if (Number(value) < 0) return "negative";
  return "neutral";
}

export function getMarketTrend(stocks) {
  if (!stocks.length) {
    return {
      label: "Quiet",
      description: "Waiting for market activity",
      averageChange: 0,
    };
  }

  const averageChange =
    stocks.reduce((sum, stock) => sum + (Number(stock.changePercent) || 0), 0) /
    stocks.length;

  if (averageChange >= 0.45) {
    return {
      label: "Bullish",
      description: `Average move ${formatPercent(averageChange)}`,
      averageChange,
    };
  }

  if (averageChange <= -0.45) {
    return {
      label: "Bearish",
      description: `Average move ${formatPercent(averageChange)}`,
      averageChange,
    };
  }

  return {
    label: "Balanced",
    description: `Average move ${formatPercent(averageChange)}`,
    averageChange,
  };
}
