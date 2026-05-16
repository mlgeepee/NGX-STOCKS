export function simulateNextDay({
    stocks = [],
    allocation = [],
    initialCapital = 10000,
} = {}) {
    const toNumber = (v, fallback = 0) => {
        const n =
            typeof v === "string"
                ? Number(
                    v
                        .replace(/,/g, "")
                        .replace(/%/g, "")
                        .replace(/[^\d.-]/g, "")
                        .trim(),
                )
                : Number(v);
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

    // allow allocation entries to be either:
    // - symbol (case-insensitive, punctuation tolerant)
    // - company name (case-insensitive, punctuation tolerant)
    const normalizeKeyLoose = (v) =>
        String(v || "")
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, ""); // remove spaces, hyphens, dots, etc.

    const symbolKeyLoose = (v) => normalizeKeyLoose(v);
    const nameKeyLoose = (v) =>
        String(v || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

    const weightsBySymbolOrName = new Map(
        alloc
            .map((x) => {
                const rawName = x?.name ?? x?.company ?? x?.companyName ?? x?.symbol;
                return {
                    keySym: symbolKeyLoose(x?.symbol),
                    keyName: nameKeyLoose(rawName),
                    weight: toNumber(x?.weight, 0),
                };
            })
            .filter((x) => x.keySym || x.keyName),
    );

    // Because we need per-stock weights (normalized across chosen allocations),
    // we resolve allocation weights against the current safeStocks snapshot.
    const resolvedWeightsBySymbol = new Map();

    safeStocks.forEach((s) => {
        const symLoose = symbolKeyLoose(s?.symbol);
        if (!symLoose) return;

        const w =
            (weightsBySymbolOrName.get(symLoose) || 0) ||
            (weightsBySymbolOrName.get(nameKeyLoose(s?.name)) || 0);

        if (w > 0) resolvedWeightsBySymbol.set(symLoose, w);
    });

    const weightSum = Array.from(resolvedWeightsBySymbol.values()).reduce(
        (sum, w) => sum + w,
        0,
    );

    const getWeight = (symbol) => {
        if (!weightSum) return 0;
        return (resolvedWeightsBySymbol.get(symbolKeyLoose(symbol)) || 0) / weightSum;
    };

    const projectedReturnPercent = safeStocks.reduce((sum, s) => {
        const symbol = s?.symbol;
        const w = getWeight(symbol);
        const cp = toNumber(s.changePercent ?? s.change_percent, 0);
        return sum + w * cp;
    }, 0);

    const projectedCapital = initial * (1 + projectedReturnPercent / 100);

    const contributions = safeStocks
        .map((s) => {
            const symbol = symbolKeyLoose(s?.symbol);
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
        .sort(
            (a, b) =>
                Math.abs(b.contributionPercent) - Math.abs(a.contributionPercent),
        );

    return {
        initialCapital: initial,
        projectedCapital,
        nextDayReturnPercent: projectedReturnPercent,
        contributions,
    };
}
