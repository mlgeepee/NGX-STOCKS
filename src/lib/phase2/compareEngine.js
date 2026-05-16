export function compareStocks(stocks = [], aSymbol, bSymbol) {
    if (!Array.isArray(stocks)) return null;

    const normalizeKey = (v) => String(v || "").trim();
    const symbolKey = (v) => normalizeKey(v).toUpperCase();
    const nameKey = (v) => normalizeKey(v).toLowerCase();

    // allow lookup by: symbol (case-insensitive) OR company name (case-insensitive)
    const bySymbol = new Map(
        stocks.map((s) => [symbolKey(s?.symbol), s]).filter(([k]) => k),
    );

    const byName = new Map(
        stocks
            .map((s) => [nameKey(s?.name), s])
            .filter(([k]) => k),
    );

    const aInputSym = symbolKey(aSymbol);
    const bInputSym = symbolKey(bSymbol);

    const aInputName = nameKey(aSymbol);
    const bInputName = nameKey(bSymbol);

    const a = bySymbol.get(aInputSym) || byName.get(aInputName);
    const b = bySymbol.get(bInputSym) || byName.get(bInputName);

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
