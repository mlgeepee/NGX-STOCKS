export function compareStocks(stocks = [], aSymbol, bSymbol) {
    if (!Array.isArray(stocks)) return null;

    const map = new Map(
        stocks.map((s) => [String(s?.symbol || "").toUpperCase(), s]),
    );

    const a = map.get(String(aSymbol || "").toUpperCase());
    const b = map.get(String(bSymbol || "").toUpperCase());
    if (!a || !b) return null;

    const toNumber = (v, fallback = 0) => {
        const n =
            typeof v === "string" ? Number(v.replace(/,/g, "").trim()) : Number(v);
        return Number.isFinite(n) ? n : fallback;
    };

    const normalize = (s) => ({
        symbol: String(s.symbol || "").toUpperCase(),
        name: s.name || "",
        sector: s.sector || "Diversified",
        price: toNumber(s.currentPrice ?? s.price, 0),
        changePercent: toNumber(s.changePercent ?? s.change_percent, 0),
        volume: toNumber(s.volume ?? s.tradingVolume, 0),
    });

    const na = normalize(a);
    const nb = normalize(b);

    return {
        a: na,
        b: nb,
        delta: {
            price: na.price - nb.price,
            changePercent: na.changePercent - nb.changePercent,
            volume: na.volume - nb.volume,
        },
    };
}
