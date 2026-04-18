const API_BASE = import.meta.env.VITE_NGXPULSE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_NGXPULSE_API_KEY;

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
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    }
  : {
      "Content-Type": "application/json",
    };

function createPriceSeries(symbol, currentPrice, points, rangeType) {
  const seed = normalizeSymbol(symbol)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const basePrice = toNumber(currentPrice, 1);

  return Array.from({ length: points }).map((_, index) => {
    const progress = points === 1 ? 1 : index / (points - 1);
    const wave =
      Math.sin((seed + index) * 0.42) * 0.018 +
      Math.cos((seed + index * 1.2) * 0.28) * 0.012;
    const drift = (progress - 0.5) * (rangeType === "1M" ? 0.09 : 0.04);
    const price = basePrice * (1 + drift + wave);

    if (rangeType === "1D") {
      const hour = 9 + Math.floor(index / 2);
      const minutes = index % 2 === 0 ? "00" : "30";
      return {
        label: `${String(hour).padStart(2, "0")}:${minutes}`,
        price: Number(price.toFixed(2)),
      };
    }

    if (rangeType === "1W") {
      const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return {
        label: labels[index % labels.length],
        price: Number(price.toFixed(2)),
      };
    }

    return {
      label: `Day ${index + 1}`,
      price: Number(price.toFixed(2)),
    };
  });
}

function buildStockDetail({
  symbol,
  name,
  sector,
  currentPrice,
  changePercent,
  volume,
  logo,
}) {
  const history1D = createPriceSeries(symbol, currentPrice, 14, "1D");
  const history1W = createPriceSeries(symbol, currentPrice, 7, "1W");
  const history1M = createPriceSeries(symbol, currentPrice, 30, "1M");
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
    openPrice: history1D[0]?.price || currentPrice,
    highPrice: Math.max(currentPrice, ...historyPrices),
    lowPrice: Math.min(currentPrice, ...historyPrices),
    logo,
    history: {
      "1D": history1D,
      "1W": history1W,
      "1M": history1M,
    },
  };
}

export async function fetchStockList(signal) {
  if (!API_BASE) {
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
  if (!API_BASE) {
    const stock =
      sampleStocks.find((item) => item.symbol === normalizeSymbol(symbol)) ||
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
            }),
          ),
        250,
      );
    });
  }

  const response = await fetch(`${API_BASE}/prices/${normalizeSymbol(symbol)}`, {
    headers,
    signal,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Price fetch failed: ${response.status} ${details}`);
  }

  const payload = await response.json();
  const normalized = enrichStock({
    symbol,
    name: payload.name,
    sector: payload.sector,
    price: payload.current_price ?? payload.price,
    changePercent: payload.change_percent ?? payload.changePercent,
    volume: payload.volume ?? payload.vol,
    logo: payload.logo || payload.image,
  });

  return buildStockDetail({
    symbol: normalized.symbol,
    name: normalized.name,
    sector: normalized.sector,
    currentPrice: normalized.price,
    changePercent: normalized.changePercent,
    volume: normalized.volume || Math.round(normalized.price * 10000),
    logo: normalized.logo,
  });
}
