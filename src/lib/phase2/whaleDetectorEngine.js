export function detectWhaleCandidates(stocks = [], { minMultiplier = 1.5 } = {}) {
    if (!Array.isArray(stocks) || !stocks.length) return [];

    const toNumber = (v, fallback = 0) => {
        const n =
            typeof v === "string" ? Number(v.replace(/,/g, "").trim()) : Number(v);
        return Number.isFinite(n) ? n : fallback;
    };

    const items = stocks
        .map((s) => ({
            symbol: String(s?.symbol || "").toUpperCase(),
            name: s?.name || "",
            sector: s?.sector || "Other",
            volume: toNumber(s?.volume ?? s?.tradingVolume, 0),
            changePercent: toNumber(s?.changePercent ?? s?.change_percent, 0),
        }))
        .filter((x) => x.symbol);

    if (!items.length) return [];

    const avg = items.reduce((sum, x) => sum + Math.max(0, x.volume), 0) / items.length;
    if (!avg) return [];

    return items
        .map((x) => {
            const volumeMultiplier = x.volume / avg;
            return {
                ...x,
                volumeMultiplier,
                isWhale: volumeMultiplier >= minMultiplier,
            };
        })
        .filter((x) => x.isWhale)
        .sort((a, b) => b.volumeMultiplier - a.volumeMultiplier);
}
