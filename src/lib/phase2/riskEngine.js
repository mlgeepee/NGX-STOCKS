export function computeRiskScore(stocks = [], { portfolioSymbols = [] } = {}) {
    const toNumber = (v, fallback = 0) => {
        const n =
            typeof v === "string" ? Number(v.replace(/,/g, "").trim()) : Number(v);
        return Number.isFinite(n) ? n : fallback;
    };

    const safeStocks = Array.isArray(stocks) ? stocks : [];
    if (!safeStocks.length) {
        return {
            score: 0,
            volatilityComponent: 0,
            movementComponent: 0,
            label: "Low",
            band: "low",
        };
    }

    const scoped = (() => {
        if (!Array.isArray(portfolioSymbols) || !portfolioSymbols.length) {
            return safeStocks;
        }
        const set = new Set(
            portfolioSymbols.map((s) => String(s).toUpperCase()),
        );
        const hit = safeStocks.filter((s) =>
            set.has(String(s?.symbol || "").toUpperCase()),
        );
        return hit.length ? hit : safeStocks;
    })();

    const volatilityAvg =
        scoped.reduce((sum, s) => {
            const vol = toNumber(s.volatility ?? s.stdDev ?? s.vol, 0);
            const fallbackMove = Math.abs(
                toNumber(s.changePercent ?? s.change_percent, 0),
            );
            return sum + (vol > 0 ? vol : fallbackMove);
        }, 0) / scoped.length;

    const movementAvg =
        scoped.reduce((sum, s) => {
            return sum + Math.abs(toNumber(s.changePercent ?? s.change_percent, 0));
        }, 0) / scoped.length;

    // Lightweight normalization heuristics:
    const volatilityComponent = Math.min(60, volatilityAvg);
    const movementComponent = Math.min(40, movementAvg / 1.5);

    const score = Math.max(
        0,
        Math.min(100, volatilityComponent * 0.6 + movementComponent * 0.4),
    );

    const band = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
    const label =
        band === "high" ? "High risk" : band === "medium" ? "Medium risk" : "Low risk";

    return {
        score: Math.round(score),
        volatilityComponent: Math.round(volatilityComponent),
        movementComponent: Math.round(movementComponent),
        label,
        band,
    };
}
