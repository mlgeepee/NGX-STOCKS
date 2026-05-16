import { useMemo } from "react";

function getSectorMetrics(stocks = []) {
  const sectors = {};
  const list = Array.isArray(stocks) ? stocks : [];

  list.forEach((stock) => {
    const sector = stock.sector || "Other";
    const change = Number(stock.changePercent ?? stock.change_percent ?? 0);
    const volume = Number(stock.volume ?? stock.tradingVolume ?? 0);

    if (!sectors[sector]) {
      sectors[sector] = {
        symbolCount: 0,
        changeSum: 0,
        volumeSum: 0,
        topStock: null,
      };
    }

    sectors[sector].symbolCount += 1;
    sectors[sector].changeSum += change;
    sectors[sector].volumeSum += volume;

    if (
      !sectors[sector].topStock ||
      volume > Number(sectors[sector].topStock.volume ?? 0)
    ) {
      sectors[sector].topStock = stock;
    }
  });

  return Object.entries(sectors).map(([sector, data]) => ({
    sector,
    averageChange: data.symbolCount ? data.changeSum / data.symbolCount : 0,
    totalVolume: data.volumeSum,
    topStock: data.topStock,
    size: data.volumeSum,
  }));
}

export default function SectorHeatmap({ stocks = [] }) {
  const sectors = useMemo(() => getSectorMetrics(stocks), [stocks]);

  return (
    <section className="app-panel rounded-[1.75rem] border border-border/70 bg-white/70 p-5 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-kicker">Sector Heatmap</p>
          <h3 className="mt-2 text-2xl font-semibold text-foreground">
            Where the market is moving
          </h3>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          sector-averages
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((item) => {
          const isPositive = item.averageChange >= 0;
          const colorClass = isPositive
            ? "bg-emerald-100 text-emerald-800"
            : "bg-rose-100 text-rose-800";

          const topSymbol = item.topStock?.symbol || "—";
          const topName = item.topStock?.name || "—";
          const avgMove = `${item.averageChange.toFixed(2)}%`;
          const totalVolume = item.totalVolume;

          return (
            <div
              key={item.sector}
              className={`group relative overflow-hidden rounded-[1.35rem] border border-border/60 p-4 shadow-sm transition hover:-translate-y-1 ${colorClass}`}
            >
              {/* hover overlay summary */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_58%)]" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="rounded-[1.15rem] border border-white/35 bg-white/70 p-3 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Sector summary
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-foreground">
                      <p className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Top</span>
                        <span className="font-semibold">
                          {topSymbol}{" "}
                          <span className="font-normal">• {topName}</span>
                        </span>
                      </p>
                      <p className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          Avg movement
                        </span>
                        <span className="font-semibold">{avgMove}</span>
                      </p>
                      <p className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          Total volume
                        </span>
                        <span className="font-semibold">
                          {Number(totalVolume || 0).toLocaleString("en-NG")}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* default tile content */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{item.sector}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.symbolCount} names
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {item.averageChange.toFixed(2)}%
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    avg
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-full bg-white/70 p-3 text-sm leading-6 text-muted-foreground">
                Top: {topSymbol} • {topName}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
