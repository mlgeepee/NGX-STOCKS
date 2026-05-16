export function simulateNextDay({
    stocks = [],
    allocation = [],
    initialCapital = 10000,
} = {}) {
    const toNumber = (v, fallback = 0) => {
        const n =
            typeof v === "string" ? Number(v.replace(/,/g, "").trim()) : Number(v);
        return Number.isFinite(n) ? n : fallback;
    };

    const safeStocks = Array.isArray(stocks) ? stocks : [];
    const initial = toNumber(initialCapital, 0);

    if (!safeStocks.length) {
        return {
            initialCapital: initial,
            projectedCapital: initial,
            nextDayReturnPercent: 0,
            contributions: [],
        };
    }

    const alloc = Array.isArray(allocation) ? allocation : [];
    const weightsBySymbol = new Map(
        alloc
            .map((x) => ({
                symbol: String(x?.symbol || "").toUpperCase(),
                weight: toNumber(x?.weight, 0),
            }))
            .filter((x) => x.symbol),
    );

    const weightSum = Array.from(weightsBySymbol.values()).reduce(
        (s, w) => s + w,
        0,
    );

    const getWeight = (symbol) => {
        if (!weightSum) return 0;
        return weightsBySymbol.get(String(symbol).toUpperCase()) / weightSum;
    };

    const projectedReturnPercent = safeStocks.reduce((sum, s) => {
        const symbol = String(s?.symbol || "").toUpperCase();
        const w = getWeight(symbol);
        const cp = toNumber(s.changePercent ?? s.change_percent, 0);
        return sum + w * cp;
    }, 0);

    const projectedCapital = initial * (1 + projectedReturnPercent / 100);

    const contributions = safeStocks
        .map((s) => {
            const symbol = String(s?.symbol || "").toUpperCase();
            const w = getWeight(symbol);
            const cp = toNumber(s.changePercent ?? s.change_percent, 0);
            return {
                symbol,
                weight: w,
                expectedMovePercent: cp,
                contributionPercent: w * cp,
            };
        })
        .filter((x) => x.weight > 0)
        .sort((a, b) => Math.abs(b.contributionPercent) - Math.abs(a.contributionPercent));

    return {
        initialCapital: initial,
        projectedCapital,
        nextDayReturnPercent: projectedReturnPercent,
        contributions,
    };
}
