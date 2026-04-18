import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowLeft, ArrowDownRight, ArrowUpRight, Star } from "lucide-react";
import Header from "../src/components/Header";
import StockLogo from "../src/components/StockLogo";
import { fetchStockHistory } from "../services/api";
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "../src/lib/market";
import { useWatchlistStore } from "../store/useWatchlistStore";
import { usePreferencesStore } from "../store/usePreferencesStore";
import { translate } from "../src/lib/i18n";

const ranges = ["1D", "1W", "1M"];

function DetailStatCard({ label, value }) {
  return (
    <div className="app-panel-soft p-6">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-3 text-[2rem] font-semibold leading-none text-foreground">
        {value}
      </p>
    </div>
  );
}

export default function StockDetail() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("1D");

  const language = usePreferencesStore((state) => state.language);
  const t = (path, vars) => translate(language, path, vars);

  const watchlist = useWatchlistStore((state) => state.watchlist);
  const toggleStock = useWatchlistStore((state) => state.toggleStock);

  useEffect(() => {
    const controller = new AbortController();

    const loadStock = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchStockHistory(symbol, controller.signal);
        setStockData(result);
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          return;
        }
        setError(fetchError.message || "Unable to load stock history.");
      } finally {
        setLoading(false);
      }
    };

    loadStock();
    return () => controller.abort();
  }, [symbol]);

  const isSaved = useMemo(() => {
    const currentSymbol = stockData?.symbol || symbol;
    return watchlist.some((stock) => stock.symbol === currentSymbol);
  }, [stockData?.symbol, symbol, watchlist]);

  const chartData = stockData?.history?.[range] || [];
  const isPositive = Number(stockData?.changePercent) >= 0;
  const chartColor = isPositive ? "#22c55e" : "#f43f5e";

  return (
    <div>
      <Header
        title={stockData?.name || symbol || t("stockDetail.fallbackTitle")}
        subtitle={t("stockDetail.subtitle")}
      />

      <div className="space-y-7">
        <Link
          to="/dashboard"
          className="app-control inline-flex items-center gap-2 rounded-[1.35rem] px-4 py-3 text-sm font-semibold text-foreground shadow-sm hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("stockDetail.back")}
        </Link>

        {loading ? (
          <div className="space-y-6">
            <div className="app-panel h-36 animate-pulse" />
            <div className="app-panel h-[420px] animate-pulse" />
          </div>
        ) : error ? (
          <div className="app-panel border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
            <h2 className="text-lg font-semibold">
              {t("stockDetail.unableLoadHistoryTitle")}
            </h2>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : (
          <>
            <div className="app-panel p-7">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-4">
                  <StockLogo
                    symbol={stockData.symbol}
                    name={stockData.name}
                    logo={stockData.logo}
                    size="xl"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-semibold text-foreground">
                        {stockData.name}
                      </h2>
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                        {stockData.symbol}
                      </span>
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                        {stockData.sector}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-end gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current price
                        </p>
                        <p className="mt-1 text-3xl font-semibold text-foreground">
                          {formatCurrency(stockData.currentPrice)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold ring-1 ${
                          isPositive
                            ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/20"
                            : "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/20"
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {formatPercent(stockData.changePercent)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    toggleStock({
                      symbol: stockData.symbol,
                      name: stockData.name,
                      sector: stockData.sector,
                      price: stockData.currentPrice,
                      changePercent: stockData.changePercent,
                      volume: stockData.volume,
                      logo: stockData.logo,
                    })
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isSaved
                      ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
                      : "app-control text-foreground hover:border-primary/25 hover:bg-white"
                  }`}
                >
                  <Star
                    className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                  />
                  {isSaved
                    ? t("stockDetail.savedToWatchlist")
                    : t("stockDetail.addToWatchlist")}
                </button>
              </div>
            </div>

            <div className="app-panel p-7">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    {t("stockDetail.priceHistoryTitle")}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t("stockDetail.priceHistoryDescription")}
                  </p>
                </div>

                <div className="inline-flex rounded-[1.35rem] border border-border/80 bg-secondary p-1">
                  {ranges.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRange(value)}
                      className={`rounded-[1rem] px-4 py-2.5 text-sm font-semibold transition ${
                        range === value
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 12, right: 0, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="price-gradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={chartColor}
                          stopOpacity={0.38}
                        />
                        <stop
                          offset="100%"
                          stopColor={chartColor}
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(148, 163, 184, 0.18)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#8da094", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      width={80}
                      tick={{ fill: "#8da094", fontSize: 12 }}
                      tickFormatter={(value) => `₦${Number(value).toFixed(0)}`}
                    />
                    <Tooltip
                      cursor={{
                        stroke: chartColor,
                        strokeOpacity: 0.25,
                        strokeWidth: 1,
                      }}
                      contentStyle={{
                        borderRadius: "18px",
                        border: "1px solid rgba(148, 163, 184, 0.2)",
                        backgroundColor: "rgba(15, 23, 42, 0.92)",
                        color: "#f8fafc",
                        boxShadow: "0 20px 45px rgba(2, 6, 23, 0.35)",
                      }}
                      formatter={(value) => [
                        formatCurrency(value),
                        t("stockDetail.priceLabel"),
                      ]}
                      labelFormatter={(value) =>
                        t("stockDetail.periodLabel", { value })
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={chartColor}
                      strokeWidth={3}
                      fill="url(#price-gradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DetailStatCard
                label={t("stockDetail.openPrice")}
                value={formatCurrency(stockData.openPrice)}
              />
              <DetailStatCard
                label={t("stockDetail.sessionHigh")}
                value={formatCurrency(stockData.highPrice)}
              />
              <DetailStatCard
                label={t("stockDetail.sessionLow")}
                value={formatCurrency(stockData.lowPrice)}
              />
              <DetailStatCard
                label={t("stockDetail.volume")}
                value={formatCompactNumber(stockData.volume)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
