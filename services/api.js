const RAW_API_BASE = import.meta.env.VITE_NGXPULSE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_NGXPULSE_API_KEY;

function normalizeApiBaseUrl(value) {
  const fallback = "https://ngxpulse.ng/api/ngxdata";
  const normalized = String(value || fallback)
    .trim()
    .replace(/\/$/, "")
    .replace("://www.ngxpulse.ng", "://ngxpulse.ng");

  return normalized || fallback;
}

const API_BASE = normalizeApiBaseUrl(RAW_API_BASE);
const API_ORIGIN = API_BASE.replace(/\/api\/ngxdata$/, "");
const NEWS_API_URL = `${API_ORIGIN}/api/news`;

const STOCK_METADATA = {
  ACCESS: {
    name: "Access Holdings",
    sector: "Banking",
    volume: 46200000,
    logo: "/logos/Access.png",
  },
  AIRTELAFRI: {
    name: "Airtel Africa",
    sector: "Telecommunications",
    volume: 8400000,
    logo: "/logos/Airtel.png",
  },
  ARADEL: {
    name: "Aradel Holdings",
    sector: "Energy",
    volume: 5400000,
    logo: "/logos/Aradel-holdings.png",
  },
  BUAFOODS: {
    name: "BUA Foods",
    sector: "Consumer Goods",
    volume: 12100000,
    logo: "/logos/Bua-foods.png",
  },
  CONOIL: {
    name: "Conoil",
    sector: "Energy",
    volume: 3600000,
    logo: "/logos/Conoil.svg",
  },
  DANGCEM: {
    name: "Dangote Cement",
    sector: "Industrial Goods",
    volume: 9800000,
    logo: "/logos/Dangote-cement.png",
  },
  FCMB: {
    name: "FCMB Group",
    sector: "Banking",
    volume: 28700000,
    logo: "/logos/FCMB.png",
  },
  GTCO: {
    name: "GTCO",
    sector: "Banking",
    volume: 31400000,
    logo: "/logos/GTCO.png",
  },
  GUINNESS: {
    name: "Guinness Nigeria",
    sector: "Consumer Goods",
    volume: 2200000,
    logo: "/logos/Guinness.svg",
  },
  MTNN: {
    name: "MTN Nigeria Communications Plc",
    sector: "ICT",
    volume: 52400000,
    logo: "/logos/MTN.png",
  },
  MTN: {
    name: "MTN Nigeria",
    sector: "Telecommunications",
    volume: 52400000,
    logo: "/logos/MTN.png",
  },
  NESTLE: {
    name: "Nestle Nigeria",
    sector: "Consumer Goods",
    volume: 1500000,
    logo: "/logos/Nestle.png",
  },
  OANDO: {
    name: "Oando",
    sector: "Energy",
    volume: 17800000,
    logo: "/logos/Oando.png",
  },
  SEPLAT: {
    name: "Seplat Energy",
    sector: "Energy",
    volume: 4300000,
    logo: "/logos/Seplat-energy.svg",
  },
  TRANSCORP: {
    name: "Transcorp",
    sector: "Conglomerates",
    volume: 26800000,
    logo: "/logos/Transcorp.svg",
  },
  UBA: {
    name: "United Bank for Africa",
    sector: "Banking",
    volume: 35800000,
    logo: "/logos/UBA.png",
  },
  ZENITH: {
    name: "Zenith Bank",
    sector: "Banking",
    volume: 40100000,
    logo: "/logos/Zenith.png",
  },
};

function getPlaceholderLogoUrl(symbol) {
  const colors = [
    "#1d4ed8",
    "#0f766e",
    "#c2410c",
    "#7c3aed",
    "#0891b2",
    "#15803d",
    "#b91c1c",
  ];
  const normalizedSymbol = normalizeSymbol(symbol) || "STK";
  const hash = normalizedSymbol
    .split("")
    .reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const initials = normalizedSymbol.slice(0, 2);
  const color = colors[hash % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="28" fill="${color}"/><text x="48" y="56" fill="white" font-size="30" font-family="Arial, sans-serif" font-weight="700" text-anchor="middle">${initials}</text></svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function normalizeSymbol(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function toNumber(value, fallback = 0) {
  const normalized =
    typeof value === "string" ? value.replace(/,/g, "").trim() : value;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getStockMetadata(symbol) {
  return STOCK_METADATA[normalizeSymbol(symbol)] || {};
}

export function getLogoUrl(symbol) {
  const metadata = getStockMetadata(symbol);
  return metadata.logo || getPlaceholderLogoUrl(symbol);
}

export function getFallbackLogoUrl(symbol) {
  return getPlaceholderLogoUrl(symbol);
}

export function enrichStock(stock = {}) {
  const symbol = normalizeSymbol(
    stock.symbol || stock.ticker || stock.code || stock.id,
  );
  const metadata = getStockMetadata(symbol);
  const price = toNumber(
    stock.current_price ?? stock.price ?? stock.lastPrice ?? stock.close,
  );
  const changePercent = toNumber(
    stock.change_percent ??
      stock.changePercent ??
      stock.change_pct ??
      stock.deltaPercent ??
      stock.percentChange,
  );
  const volume = toNumber(
    stock.volume ?? stock.tradingVolume ?? stock.sharesTraded ?? stock.vol,
    metadata.volume ?? 0,
  );
  const previousClose = toNumber(
    stock.previous_close ?? stock.previousClose ?? stock.prevClose,
  );
  const pctChange7d = toNumber(
    stock.pct_change_7d ?? stock.pctChange7d ?? stock.weekChangePercent,
  );

  return {
    symbol: symbol || "UNKNOWN",
    name:
      stock.name ||
      stock.company ||
      stock.fullName ||
      metadata.name ||
      symbol ||
      "Unknown stock",
    sector:
      stock.sector ||
      stock.industry ||
      stock.category ||
      metadata.sector ||
      "Diversified",
    price,
    changePercent,
    volume,
    previousClose,
    pctChange7d,
    logo:
      stock.logo ||
      stock.icon ||
      stock.image ||
      stock.logoUrl ||
      metadata.logo ||
      getPlaceholderLogoUrl(symbol),
  };
}

const sampleStocks = [
  { symbol: "MTN", price: 1428.5, changePercent: 1.93, volume: 52400000 },
  { symbol: "AIRTELAFRI", price: 2315.2, changePercent: 0.67, volume: 8400000 },
  { symbol: "DANGCEM", price: 485.4, changePercent: -0.35, volume: 9800000 },
  { symbol: "GTCO", price: 68.9, changePercent: 2.14, volume: 31400000 },
  { symbol: "UBA", price: 33.45, changePercent: 1.21, volume: 35800000 },
  { symbol: "ZENITH", price: 47.6, changePercent: -1.18, volume: 40100000 },
  { symbol: "ACCESS", price: 24.9, changePercent: 0.95, volume: 46200000 },
  { symbol: "BUAFOODS", price: 378.2, changePercent: 0.42, volume: 12100000 },
  { symbol: "SEPLAT", price: 5680, changePercent: -0.74, volume: 4300000 },
  { symbol: "OANDO", price: 79.5, changePercent: 3.41, volume: 17800000 },
  { symbol: "GUINNESS", price: 96.15, changePercent: -0.62, volume: 2200000 },
  { symbol: "TRANSCORP", price: 18.3, changePercent: 2.08, volume: 26800000 },
].map((stock) => enrichStock(stock));

const headers = API_KEY
  ? {
      "X-API-Key": API_KEY,
      "Content-Type": "application/json",
    }
  : {
      "Content-Type": "application/json",
    };

const timeLabelFormatter = new Intl.DateTimeFormat("en-NG", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Africa/Lagos",
});

const weekLabelFormatter = new Intl.DateTimeFormat("en-NG", {
  weekday: "short",
  timeZone: "Africa/Lagos",
});

const monthLabelFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  timeZone: "Africa/Lagos",
});

const FALLBACK_NEWS_TEMPLATES = {
  default: [
    {
      category: "Market brief",
      headline: "{name} stays in focus as traders monitor near-term price direction",
      summary:
        "{name} is being tracked after a {changeLabel} move, with attention on liquidity, short-term support, and broader {sector} sentiment.",
    },
    {
      category: "Investor watch",
      headline:
        "{name} remains on watchlists as market participants compare sector leaders",
      summary:
        "The latest pricing around {priceLabel} keeps {name} in the conversation for traders looking for relative strength inside {sector}.",
    },
    {
      category: "Session recap",
      headline:
        "{name} closes the session under fresh review from active NGX watchers",
      summary:
        "{name} continues to attract attention as investors weigh follow-through after the latest session and assess positioning for the next range move.",
    },
  ],
  Banking: [
    {
      category: "Banking pulse",
      headline: "{name} draws attention as banking names set the pace on NGX",
      summary:
        "With a {changeLabel} move, {name} is being watched for follow-through as traders compare leadership across banking counters.",
    },
    {
      category: "Investor watch",
      headline: "{name} remains active as investors rotate through major lenders",
      summary:
        "Flows within the banking complex keep {name} relevant, especially with price action hovering near {priceLabel}.",
    },
    {
      category: "Sector note",
      headline: "{name} features in conversations around dividend and liquidity positioning",
      summary:
        "Short-term sentiment around {name} is being shaped by liquidity, income expectations, and the broader tone across financials.",
    },
  ],
  Energy: [
    {
      category: "Energy pulse",
      headline: "{name} stays active as energy counters attract trader interest",
      summary:
        "{name} is back on active screens after a {changeLabel} move, with traders watching commodity-linked sentiment and liquidity.",
    },
    {
      category: "Market brief",
      headline: "{name} keeps a firm place on energy watchlists",
      summary:
        "Energy-focused investors continue to monitor {name} around {priceLabel} as they compare momentum across the sector.",
    },
    {
      category: "Session recap",
      headline: "{name} remains a talking point as market participants assess follow-through",
      summary:
        "Attention stays on {name} as the market looks for confirmation of trend strength and fresh participation on the tape.",
    },
  ],
  "Industrial Goods": [
    {
      category: "Industrial pulse",
      headline:
        "{name} remains in focus as industrial counters shape market leadership",
      summary:
        "{name} is being monitored after a {changeLabel} move, with the market watching whether industrial demand can support the next leg.",
    },
    {
      category: "Investor watch",
      headline:
        "{name} holds trader attention as heavyweight names influence board direction",
      summary:
        "At {priceLabel}, {name} remains central to discussions around market breadth and the strength of large-cap industrial plays.",
    },
    {
      category: "Session recap",
      headline:
        "{name} stays on radar as investors assess positioning in infrastructure-linked names",
      summary:
        "Participants continue to watch {name} for signs of sustained participation and cleaner trend structure into the next session.",
    },
  ],
  Telecommunications: [
    {
      category: "Telecom pulse",
      headline:
        "{name} keeps defensive investors interested within telecom-focused plays",
      summary:
        "Telecom counters remain on the radar, and {name} is being watched closely after a {changeLabel} move.",
    },
    {
      category: "Market brief",
      headline:
        "{name} remains part of the conversation as investors seek steadier large-cap exposure",
      summary:
        "Pricing near {priceLabel} leaves {name} in focus for traders balancing defensiveness with near-term momentum.",
    },
    {
      category: "Session recap",
      headline: "{name} continues to attract attention among high-liquidity names",
      summary:
        "The stock remains one to watch as traders compare volume, stability, and follow-through within telecom names.",
    },
  ],
  "Consumer Goods": [
    {
      category: "Consumer pulse",
      headline: "{name} stays on watch as investors compare demand-sensitive names",
      summary:
        "{name} is drawing attention after a {changeLabel} move, with traders assessing how consumer-facing counters are setting up.",
    },
    {
      category: "Market brief",
      headline:
        "{name} keeps its place on watchlists as market participants weigh pricing power stories",
      summary:
        "At around {priceLabel}, {name} remains a reference point for investors tracking consumer demand and margin resilience.",
    },
    {
      category: "Session recap",
      headline:
        "{name} remains under review as investors look for the next cleaner move",
      summary:
        "The latest session keeps {name} in focus for traders balancing valuation, liquidity, and short-term momentum.",
    },
  ],
};

const NEWS_STOP_WORDS = new Set([
  "plc",
  "nigeria",
  "holdings",
  "group",
  "company",
  "companies",
  "bank",
  "communications",
  "corp",
  "corporation",
  "ltd",
  "limited",
  "the",
]);

function normalizeTextForMatch(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getDefaultHistoryPointCount(rangeType) {
  if (rangeType === "1D") return 15;
  if (rangeType === "1W") return 5;
  return 20;
}

function buildGeneratedLabel(index, totalPoints, rangeType) {
  if (rangeType === "1D") {
    const start = new Date();
    start.setHours(9, 0, 0, 0);
    const pointTime = new Date(start);
    pointTime.setMinutes(start.getMinutes() + index * 30);
    return timeLabelFormatter.format(pointTime);
  }

  const pointDate = new Date();
  pointDate.setHours(0, 0, 0, 0);
  pointDate.setDate(pointDate.getDate() - (totalPoints - 1 - index));

  if (rangeType === "1W") {
    return weekLabelFormatter.format(pointDate);
  }

  return monthLabelFormatter.format(pointDate);
}

function formatLabelFromValue(value, index, totalPoints, rangeType) {
  if (value == null || value === "") {
    return buildGeneratedLabel(index, totalPoints, rangeType);
  }

  if (typeof value === "number") {
    return buildGeneratedLabel(index, totalPoints, rangeType);
  }

  const parsedDate = new Date(value);
  if (!Number.isNaN(parsedDate.getTime())) {
    if (rangeType === "1D") {
      return timeLabelFormatter.format(parsedDate);
    }

    if (rangeType === "1W") {
      return weekLabelFormatter.format(parsedDate);
    }

    return monthLabelFormatter.format(parsedDate);
  }

  return String(value);
}

function createTrendSeries(symbol, startPrice, endPrice, points, rangeType) {
  const seed = normalizeSymbol(symbol)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const safeEnd = Math.max(toNumber(endPrice, 1), 0.01);
  const safeStart = Math.max(toNumber(startPrice, safeEnd), 0.01);
  const amplitudeFactor =
    rangeType === "1D" ? 0.0045 : rangeType === "1W" ? 0.011 : 0.019;

  return Array.from({ length: points }).map((_, index) => {
    const progress = points === 1 ? 1 : index / (points - 1);
    const base = safeStart + (safeEnd - safeStart) * progress;
    const amplitude = Math.max(safeStart, safeEnd) * amplitudeFactor;
    const wave =
      Math.sin((seed + index) * 0.58) * amplitude * (1 - progress * 0.32) +
      Math.cos((seed + index * 1.4) * 0.24) * amplitude * 0.28;
    let price = base + wave;

    if (index === 0) price = safeStart;
    if (index === points - 1) price = safeEnd;

    return {
      label: buildGeneratedLabel(index, points, rangeType),
      price: Number(Math.max(price, 0.01).toFixed(2)),
    };
  });
}

function createIntradaySeries({
  symbol,
  currentPrice,
  previousClose,
  openPrice,
  highPrice,
  lowPrice,
}) {
  const safeCurrent = Math.max(toNumber(currentPrice, 1), 0.01);
  const safeOpen = Math.max(toNumber(openPrice, previousClose || safeCurrent), 0.01);
  const safePreviousClose = Math.max(
    toNumber(previousClose, safeOpen || safeCurrent),
    0.01,
  );
  const sessionHigh = Math.max(
    safeOpen,
    safeCurrent,
    toNumber(highPrice, Math.max(safeOpen, safeCurrent)),
  );
  const sessionLow = Math.min(
    safeOpen,
    safeCurrent,
    toNumber(lowPrice, Math.min(safeOpen, safeCurrent)),
  );

  const checkpoints = [
    safePreviousClose,
    safeOpen,
    (safeOpen + sessionLow) / 2,
    sessionLow,
    (sessionLow + sessionHigh) / 2,
    sessionHigh,
    (sessionHigh + safeCurrent) / 2,
    safeCurrent,
  ];

  if (sessionHigh === sessionLow && safeOpen === safeCurrent) {
    return createTrendSeries(symbol, safePreviousClose, safeCurrent, 8, "1D");
  }

  return checkpoints.map((price, index, collection) => ({
    label: buildGeneratedLabel(index, collection.length, "1D"),
    price: Number(Math.max(price, 0.01).toFixed(2)),
  }));
}

function normalizeHistoricalRows(payload, currentPrice) {
  const items =
    payload?.prices ??
    payload?.data?.prices ??
    payload?.history ??
    payload?.results ??
    [];

  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const open = toNumber(
        item?.open_price ?? item?.open ?? item?.o,
        currentPrice,
      );
      const close = toNumber(
        item?.close_price ??
          item?.close ??
          item?.price ??
          item?.current_price ??
          item?.c,
        open || currentPrice,
      );
      const high = toNumber(
        item?.high_price ?? item?.high ?? item?.h,
        Math.max(open, close),
      );
      const low = toNumber(
        item?.low_price ?? item?.low ?? item?.l,
        Math.min(open, close),
      );
      const date =
        item?.trade_date ??
        item?.date ??
        item?.timestamp ??
        item?.created_at ??
        item?.session;

      return {
        date,
        open,
        high,
        low,
        close,
        volume: toNumber(item?.volume ?? item?.vol, 0),
      };
    })
    .filter((item) => Number.isFinite(item.close))
    .sort((left, right) => {
      const leftTime = new Date(left.date).getTime();
      const rightTime = new Date(right.date).getTime();

      if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
        return 0;
      }

      return leftTime - rightTime;
    });
}

function mapHistoricalRowsToSeries(rows, rangeType, limit) {
  const relevantRows = rows.slice(-limit);

  return relevantRows.map((row, index, collection) => ({
    label: formatLabelFromValue(row.date, index, collection.length, rangeType),
    price: Number(row.close.toFixed(2)),
  }));
}

function isHistoricalSeriesFresh(rows, currentPrice) {
  if (!rows.length) {
    return false;
  }

  const latest = rows[rows.length - 1];
  const latestTime = new Date(latest.date).getTime();
  const daysSinceLatest = Number.isNaN(latestTime)
    ? Number.POSITIVE_INFINITY
    : (Date.now() - latestTime) / (1000 * 60 * 60 * 24);
  const priceGap = currentPrice
    ? Math.abs(latest.close - currentPrice) / currentPrice
    : 0;

  return daysSinceLatest <= 180 && priceGap <= 0.35;
}

function buildFallbackHistory({
  symbol,
  currentPrice,
  previousClose,
  pctChange7d,
  changePercent,
}) {
  const safeCurrent = Math.max(toNumber(currentPrice, 1), 0.01);
  const dailyStart =
    toNumber(
      previousClose,
      safeCurrent / (1 + toNumber(changePercent, 0) / 100 || 1),
    ) || safeCurrent;
  const weeklyStart =
    pctChange7d !== 0
      ? safeCurrent / (1 + pctChange7d / 100)
      : safeCurrent * (changePercent >= 0 ? 0.97 : 1.03);
  const monthlyStart =
    pctChange7d !== 0
      ? safeCurrent / (1 + (pctChange7d * 1.75) / 100)
      : safeCurrent * (changePercent >= 0 ? 0.91 : 1.09);

  return {
    "1D": createIntradaySeries({
      symbol,
      currentPrice: safeCurrent,
      previousClose: dailyStart,
      openPrice: dailyStart,
      highPrice: Math.max(safeCurrent, dailyStart) * 1.01,
      lowPrice: Math.min(safeCurrent, dailyStart) * 0.99,
    }),
    "1W": createTrendSeries(
      symbol,
      weeklyStart,
      safeCurrent,
      getDefaultHistoryPointCount("1W"),
      "1W",
    ),
    "1M": createTrendSeries(
      symbol,
      monthlyStart,
      safeCurrent,
      getDefaultHistoryPointCount("1M"),
      "1M",
    ),
  };
}

function buildHistoryFromSnapshotAndRows({
  symbol,
  currentPrice,
  previousClose,
  pctChange7d,
  changePercent,
  rows,
}) {
  if (rows.length && isHistoricalSeriesFresh(rows, currentPrice)) {
    const latest = rows[rows.length - 1];

    return {
      "1D": createIntradaySeries({
        symbol,
        currentPrice,
        previousClose: previousClose || latest.open,
        openPrice: latest.open,
        highPrice: latest.high,
        lowPrice: latest.low,
      }),
      "1W": mapHistoricalRowsToSeries(rows, "1W", 5),
      "1M": mapHistoricalRowsToSeries(rows, "1M", 20),
    };
  }

  return buildFallbackHistory({
    symbol,
    currentPrice,
    previousClose,
    pctChange7d,
    changePercent,
  });
}

function normalizeHistoryBucket(items, rangeType, symbol, currentPrice) {
  if (!Array.isArray(items) || !items.length) {
    return createPriceSeries(
      symbol,
      currentPrice,
      getDefaultHistoryPointCount(rangeType),
      rangeType,
    );
  }

  const normalized = items
    .map((item, index, collection) => {
      if (typeof item === "number") {
        return {
          label: buildGeneratedLabel(index, collection.length, rangeType),
          price: Number(item.toFixed(2)),
        };
      }

      const price = toNumber(
        item?.price ??
          item?.close_price ??
          item?.close ??
          item?.open_price ??
          item?.open ??
          item?.value ??
          item?.current_price ??
          item?.lastPrice ??
          item?.amount,
        currentPrice,
      );

      return {
        label: formatLabelFromValue(
          item?.label ??
            item?.time ??
            item?.date ??
            item?.timestamp ??
            item?.session,
          index,
          collection.length,
          rangeType,
        ),
        price: Number(price.toFixed(2)),
      };
    })
    .filter((item) => Number.isFinite(item.price));

  if (!normalized.length) {
    return createPriceSeries(
      symbol,
      currentPrice,
      getDefaultHistoryPointCount(rangeType),
      rangeType,
    );
  }

  return normalized;
}

function pickHistorySeries(container, keys) {
  if (Array.isArray(container)) {
    return container;
  }

  for (const key of keys) {
    const value = container?.[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return null;
}

function resolveHistoryBuckets(payload, symbol, currentPrice) {
  const root =
    payload?.history ??
    payload?.chart ??
    payload?.charts ??
    payload?.series ??
    payload?.prices ??
    payload;

  return {
    "1D": normalizeHistoryBucket(
      pickHistorySeries(root, ["1D", "1d", "daily", "intraday", "day"]),
      "1D",
      symbol,
      currentPrice,
    ),
    "1W": normalizeHistoryBucket(
      pickHistorySeries(root, ["1W", "1w", "weekly", "week"]),
      "1W",
      symbol,
      currentPrice,
    ),
    "1M": normalizeHistoryBucket(
      pickHistorySeries(root, ["1M", "1m", "monthly", "month"]),
      "1M",
      symbol,
      currentPrice,
    ),
  };
}

function buildFallbackNews({ symbol, name, sector, currentPrice, changePercent }) {
  const matchingSectorKey = Object.keys(FALLBACK_NEWS_TEMPLATES).find(
    (key) =>
      key !== "default" &&
      normalizeTextForMatch(key) === normalizeTextForMatch(sector),
  );
  const templates =
    FALLBACK_NEWS_TEMPLATES[matchingSectorKey || "default"] ||
    FALLBACK_NEWS_TEMPLATES.default;
  const changeValue = Number(changePercent) || 0;
  const changeLabel = `${Math.abs(changeValue).toFixed(2)}%`;
  const priceLabel = `₦${toNumber(currentPrice).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return templates.map((template, index) => {
    const replacements = {
      name,
      sector: sector || "the market",
      priceLabel,
      changeLabel,
    };

    return {
      id: `${symbol}-brief-${index + 1}`,
      headline: applyTemplate(template.headline, replacements),
      summary: applyTemplate(template.summary, replacements),
      source: "NGX Stocks Briefing",
      category: template.category,
      publishedAt: new Date(
        Date.now() - index * 1000 * 60 * 60 * 6,
      ).toISOString(),
      url: null,
      isFallback: true,
    };
  });
}

function extractNewsCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  return (
    payload?.news ??
    payload?.articles ??
    payload?.items ??
    payload?.results ??
    payload?.data ??
    []
  );
}

function applyTemplate(template, replacements) {
  return Object.entries(replacements).reduce(
    (text, [key, value]) => text.replace(new RegExp(`\\{${key}\\}`, "g"), value),
    template,
  );
}

function normalizeNewsItems(payload, stockContext) {
  const items = extractNewsCollection(payload);

  if (!Array.isArray(items) || !items.length) {
    return [];
  }

  return items
    .map((item, index) => {
      const headline = item?.headline ?? item?.title ?? item?.name;

      if (!headline) {
        return null;
      }

      const publishedAt = item?.publishedAt ?? item?.published_at ?? item?.date;
      const parsedDate = publishedAt ? new Date(publishedAt) : null;

      return {
        id:
          item?.id ??
          item?.slug ??
          `${stockContext.symbol}-news-${index + 1}-${String(headline)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")}`,
        headline: String(headline),
        summary:
          item?.summary ??
          item?.snippet ??
          item?.description ??
          item?.excerpt ??
          `${stockContext.name} remains on active watchlists as investors track fresh developments.`,
        source: item?.source ?? item?.publisher ?? item?.outlet ?? "NGX Pulse",
        category: item?.category ?? item?.type ?? "News",
        publishedAt:
          parsedDate && !Number.isNaN(parsedDate.getTime())
            ? parsedDate.toISOString()
            : new Date(Date.now() - index * 1000 * 60 * 60 * 4).toISOString(),
        url: item?.url ?? item?.link ?? item?.href ?? null,
        isFallback: false,
      };
    })
    .filter(Boolean);
}

function buildNewsSearchTerms(stockContext) {
  const normalizedName = normalizeTextForMatch(stockContext?.name);
  const nameParts = normalizedName
    .split(" ")
    .filter((part) => part.length >= 3 && !NEWS_STOP_WORDS.has(part));
  const phrases = [
    normalizeTextForMatch(stockContext?.symbol),
    normalizedName,
    nameParts.slice(0, 2).join(" "),
    ...nameParts,
  ];

  return Array.from(new Set(phrases.filter((term) => term.length >= 3)));
}

function filterNewsForStock(items, stockContext) {
  const terms = buildNewsSearchTerms(stockContext);

  if (!terms.length) {
    return items;
  }

  return items.filter((item) => {
    const haystack = normalizeTextForMatch(
      `${item.headline} ${item.summary} ${item.source}`,
    );

    return terms.some((term) => haystack.includes(term));
  });
}

async function fetchOptionalNewsPayload(signal) {
  if (!API_KEY) {
    return null;
  }

  try {
    const response = await fetch(NEWS_API_URL, {
      headers,
      signal,
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    return null;
  }
}

function createPriceSeries(symbol, currentPrice, points, rangeType) {
  const basePrice = Math.max(toNumber(currentPrice, 1), 0.01);
  const startPrice =
    rangeType === "1D"
      ? basePrice * 0.992
      : rangeType === "1W"
        ? basePrice * 0.965
        : basePrice * 0.92;

  return createTrendSeries(symbol, startPrice, basePrice, points, rangeType);
}

function buildStockDetail({
  symbol,
  name,
  sector,
  currentPrice,
  changePercent,
  volume,
  logo,
  openPrice,
  highPrice,
  lowPrice,
  history,
  news = [],
}) {
  const resolvedHistory =
    history || resolveHistoryBuckets({}, symbol, currentPrice);
  const history1D = resolvedHistory["1D"];
  const history1W = resolvedHistory["1W"];
  const history1M = resolvedHistory["1M"];
  const historyPrices = [...history1D, ...history1W, ...history1M].map(
    (item) => item.price,
  );

  return {
    symbol,
    name,
    sector,
    currentPrice,
    changePercent,
    volume,
    openPrice: toNumber(openPrice, history1D[0]?.price || currentPrice),
    highPrice: toNumber(highPrice, Math.max(currentPrice, ...historyPrices)),
    lowPrice: toNumber(lowPrice, Math.min(currentPrice, ...historyPrices)),
    logo,
    history: resolvedHistory,
    news,
  };
}

export async function fetchStockList(signal) {
  if (!RAW_API_BASE || !API_KEY) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(sampleStocks), 250);
    });
  }

  const response = await fetch(`${API_BASE}/stocks`, {
    headers,
    signal,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Stock list fetch failed: ${response.status} ${details}`);
  }

  const payload = await response.json();
  const items = payload.data || payload.stocks || payload;
  return Array.isArray(items) ? items.map(enrichStock) : [];
}

export async function fetchStockHistory(symbol, signal) {
  const normalizedSymbol = normalizeSymbol(symbol);

  if (!RAW_API_BASE || !API_KEY) {
    const stock =
      sampleStocks.find((item) => item.symbol === normalizedSymbol) ||
      enrichStock({ symbol });

    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            buildStockDetail({
              symbol: stock.symbol,
              name: stock.name,
              sector: stock.sector,
              currentPrice: stock.price,
              changePercent: stock.changePercent,
              volume: stock.volume,
              logo: stock.logo,
              openPrice: stock.previousClose || stock.price,
              highPrice: stock.price * 1.02,
              lowPrice: stock.price * 0.98,
              history: buildFallbackHistory({
                symbol: stock.symbol,
                currentPrice: stock.price,
                previousClose: stock.previousClose,
                pctChange7d: stock.pctChange7d,
                changePercent: stock.changePercent,
              }),
              news: buildFallbackNews({
                symbol: stock.symbol,
                name: stock.name,
                sector: stock.sector,
                currentPrice: stock.price,
                changePercent: stock.changePercent,
              }),
            }),
          ),
        250,
      );
    });
  }

  const [snapshotList, historyResponse, optionalNewsPayload] = await Promise.all([
    fetchStockList(signal),
    fetch(`${API_BASE}/prices/${normalizedSymbol}`, {
      headers,
      signal,
    }),
    fetchOptionalNewsPayload(signal),
  ]);

  const snapshot =
    snapshotList.find((item) => item.symbol === normalizedSymbol) ||
    enrichStock({ symbol: normalizedSymbol });

  if (!historyResponse.ok) {
    const details = await historyResponse.text();
    throw new Error(`Price fetch failed: ${historyResponse.status} ${details}`);
  }

  const payload = await historyResponse.json();
  const historicalRows = normalizeHistoricalRows(payload, snapshot.price);
  const latestHistoricalRow = historicalRows[historicalRows.length - 1];
  const currentPrice = toNumber(snapshot.price, latestHistoricalRow?.close ?? 0);
  const changePercent = toNumber(
    snapshot.changePercent,
    currentPrice && snapshot.previousClose
      ? ((currentPrice - snapshot.previousClose) / snapshot.previousClose) * 100
      : 0,
  );
  const normalized = enrichStock({
    symbol: snapshot.symbol || payload?.symbol || normalizedSymbol,
    name: snapshot.name || payload?.name,
    sector: snapshot.sector || payload?.sector,
    price: currentPrice,
    changePercent,
    volume: snapshot.volume || latestHistoricalRow?.volume,
    previous_close: snapshot.previousClose,
    pct_change_7d: snapshot.pctChange7d,
    logo: snapshot.logo,
  });

  const resolvedHistory =
    resolveHistoryBuckets(payload, normalized.symbol, normalized.price);
  const historyHasNonZeroPoints = Object.values(resolvedHistory).some((series) =>
    Array.isArray(series) && series.some((point) => Number(point.price) > 0),
  );
  const history = historyHasNonZeroPoints
    ? buildHistoryFromSnapshotAndRows({
        symbol: normalized.symbol,
        currentPrice: normalized.price,
        previousClose: normalized.previousClose,
        pctChange7d: normalized.pctChange7d,
        changePercent: normalized.changePercent,
        rows: historicalRows,
      })
    : buildFallbackHistory({
        symbol: normalized.symbol,
        currentPrice: normalized.price,
        previousClose: normalized.previousClose,
        pctChange7d: normalized.pctChange7d,
        changePercent: normalized.changePercent,
      });

  const mergedNews = filterNewsForStock(
    [
      ...normalizeNewsItems(payload, normalized),
      ...normalizeNewsItems(optionalNewsPayload, normalized),
    ],
    normalized,
  )
    .filter(
      (item, index, collection) =>
        collection.findIndex((candidate) => candidate.id === item.id) === index,
    )
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() -
        new Date(left.publishedAt).getTime(),
    );

  return buildStockDetail({
    symbol: normalized.symbol,
    name: normalized.name,
    sector: normalized.sector,
    currentPrice: normalized.price,
    changePercent: normalized.changePercent,
    volume: normalized.volume || Math.round(normalized.price * 10000),
    logo: normalized.logo,
    openPrice: toNumber(
      latestHistoricalRow?.open,
      normalized.previousClose || normalized.price,
    ),
    highPrice: toNumber(
      latestHistoricalRow?.high,
      Math.max(
        normalized.price,
        latestHistoricalRow?.open ?? normalized.price,
        latestHistoricalRow?.close ?? normalized.price,
      ),
    ),
    lowPrice: toNumber(
      latestHistoricalRow?.low,
      Math.min(
        normalized.price,
        latestHistoricalRow?.open ?? normalized.price,
        latestHistoricalRow?.close ?? normalized.price,
      ),
    ),
    history,
    news:
      mergedNews.length > 0
        ? mergedNews
        : buildFallbackNews({
            symbol: normalized.symbol,
            name: normalized.name,
            sector: normalized.sector,
            currentPrice: normalized.price,
            changePercent: normalized.changePercent,
          }),
  });
}
