import { toNumber } from "./marketPulseEngine";

function getSectorTotals(stocks = []) {
    const totals = {};
    const normalized = Array.isArray(stocks) ? stocks : [];

    normalized.forEach((stock) => {
        const sector = stock.sector || "Other";
        const change = toNumber(stock.changePercent || stock.change_percent || 0);
        const volume = toNumber(stock.volume || stock.tradingVolume || 0);

        if (!totals[sector]) {
            totals[sector] = { count: 0, changeSum: 0, volumeSum: 0, positive: 0, negative: 0 };
        }

        totals[sector].count += 1;
        totals[sector].changeSum += change;
        totals[sector].volumeSum += volume;
        if (change >= 0) totals[sector].positive += 1;
        if (change < 0) totals[sector].negative += 1;
    });

    return totals;
}

export function getMarketMood(stocks = []) {
    const items = Array.isArray(stocks) ? stocks : [];
    const gainers = items.filter((item) => toNumber(item.changePercent || item.change_percent || 0) > 0);
    const losers = items.filter((item) => toNumber(item.changePercent || item.change_percent || 0) < 0);
    const totalChange = items.reduce((sum, item) => sum + toNumber(item.changePercent || item.change_percent || 0), 0);
    const avgChange = items.length ? totalChange / items.length : 0;
    const sectorTotals = getSectorTotals(items);

    const strongSector = Object.entries(sectorTotals).sort((a, b) => b[1].changeSum - a[1].changeSum)[0];
    const weakSector = Object.entries(sectorTotals).sort((a, b) => a[1].changeSum - b[1].changeSum)[0];

    const moodScore = avgChange + (gainers.length - losers.length) * 0.2;
    const mood = moodScore >= 0.15 ? "bullish" : moodScore <= -0.15 ? "bearish" : "neutral";
    const confidence = Math.min(100, Math.max(35, Math.round(Math.abs(moodScore) * 100)));

    const summary = strongSector
        ? `${strongSector[0]} stocks are driving ${mood} momentum while ${weakSector ? weakSector[0] : "other sectors"} lag behind.`
        : "Market moves are mixed across sectors.";

    return {
        mood,
        confidence,
        summary,
        strongestSector: strongSector ? strongSector[0] : null,
        weakestSector: weakSector ? weakSector[0] : null,
        averageMove: Number(avgChange.toFixed(2)),
    };
}
