export function toNumber(value, fallback = 0) {
    const parsed = typeof value === "string" ? Number(value.replace(/,/g, "")) : Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeStocks(stocks) {
    if (!Array.isArray(stocks)) return [];
    return stocks
        .map((s) => ({
            symbol: String(s?.symbol ?? "").toUpperCase(),
            name: s?.name ?? "",
            sector: s?.sector ?? "Diversified",
            price: s?.price ?? s?.currentPrice ?? 0,
            changePercent: toNumber(s?.changePercent ?? s?.change_percent ?? 0, 0),
            volume: toNumber(s?.volume ?? s?.tradingVolume ?? 0, 0),
            change: toNumber(s?.change ?? 0, 0),
            volatility: s?.volatility ?? s?.stdDev ?? s?.vol ?? 0,
        }))
        .filter((s) => s.symbol);
}

function getVolatilityScore(stock) {
    // App doesn't expose a volatility field in stock list; fallback to abs daily movement.
    const base = toNumber(stock?.volatility, 0);
    const movement = Math.abs(toNumber(stock?.changePercent, 0));
    return base > 0 ? base : movement;
}

export function getTopGainers(stocks, count = 5) {
    const items = normalizeStocks(stocks);
    return items
        .filter((s) => s.changePercent > 0)
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, count);
}

export function getTopLosers(stocks, count = 5) {
    const items = normalizeStocks(stocks);
    return items
        .filter((s) => s.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, count);
}

export function getMostTraded(stocks, count = 5) {
    const items = normalizeStocks(stocks);
    return items
        .sort((a, b) => b.volume - a.volume)
        .slice(0, count);
}

export function getMostVolatile(stocks, count = 5) {
    const items = normalizeStocks(stocks);
    const scored = items.map((s) => ({
        ...s,
        volScore: getVolatilityScore(s),
    }));

    return scored
        .sort((a, b) => b.volScore - a.volScore)
        .slice(0, count)
        .map((s) => {
            const rest = { ...s };
            delete rest.volScore;
            return rest;
        });
}

export function getHighestVolumeSpike(stocks) {
    const items = normalizeStocks(stocks);
    if (!items.length) return null;

    const volumes = items.map((s) => Math.max(0, toNumber(s.volume, 0)));
    const avg = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;

    if (!avg) {
        // fallback: highest volume
        return items.sort((a, b) => b.volume - a.volume)[0] || null;
    }

    // “Spike” heuristic: how many times above average the volume is.
    const withSpike = items
        .map((s) => {
            const v = Math.max(0, toNumber(s.volume, 0));
            const multiplier = v / avg; // 1.0 = avg, >1 spike
            return { ...s, _multiplier: multiplier };
        })
        .sort((a, b) => b._multiplier - a._multiplier);

    const top = withSpike[0];
    if (!top) return null;

    const spikePercent = (top._multiplier - 1) * 100;
    const result = {
        symbol: top.symbol,
        name: top.name,
        sector: top.sector,
        volume: top.volume,
        spikePercent: Number.isFinite(spikePercent) ? spikePercent : 0,
    };

    return result;
}
