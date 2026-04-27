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
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  ExternalLink,
  Newspaper,
  Star,
} from "lucide-react";
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

function getAnimatedDisplayValue(value, count) {
  if (typeof value !== "string") {
    return value;
  }

  if (value.includes("₦")) {
    return `₦${count.toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }

  const suffixMatch = value.match(/([KMBT])$/i);
  if (suffixMatch) {
    const suffix = suffixMatch[1];
    const originalDecimals = value.split(".")[1]?.replace(/[^\d]/g, "").length;
    return `${count.toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: originalDecimals ? 1 : 0,
    })}${suffix}`;
  }

  return value;
}

function getRangeSnapshot(points = []) {
  if (!points.length) {
    return {
      start: 0,
      end: 0,
      high: 0,
      low: 0,
      changePercent: 0,
    };
  }

  const prices = points.map((point) => Number(point.price) || 0);
  const start = prices[0] || 0;
  const end = prices[prices.length - 1] || 0;
  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const changePercent = start ? ((end - start) / start) * 100 : 0;

  return {
    start,
    end,
    high,
    low,
    changePercent,
  };
}

function DetailStatCard({ label, value, animate = true }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate || !value) return;

    const target =
      typeof value === "number"
        ? value
        : parseFloat(String(value).replace(/[^\d.-]/g, ""));

    if (!Number.isFinite(target)) {
      return;
    }

    let frameId = 0;
    const duration = 1200;
    const startTime = Date.now();

    const animateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(target * easedProgress);

      if (progress < 1) {
        frameId = requestAnimationFrame(animateCount);
      } else {
        setCount(target);
      }
    };

    animateCount();

    return () => cancelAnimationFrame(frameId);
  }, [value, animate]);

  const displayValue =
    typeof value === "number"
      ? animate
        ? count.toLocaleString("en-NG")
        : value.toLocaleString("en-NG")
      : animate
        ? getAnimatedDisplayValue(value, count)
        : value;

  return (
    <div className="app-panel-soft border-border/60 bg-gradient-to-br from-white/75 via-white/55 to-white/20 p-5 transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold leading-tight text-foreground sm:text-[2rem]">
        {displayValue}
      </p>
    </div>
  );
}

function NewsCard({ item, t }) {
  const publishedAt = new Date(item?.publishedAt);
  const hasValidPublishedAt = !Number.isNaN(publishedAt.getTime());
  const publishedLabel = hasValidPublishedAt
    ? new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(publishedAt)
    : t("stockDetail.updatedOnFallback");

  return (
    <article className="app-panel-soft border-border/60 bg-white/75 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
          {item.category || "News"}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock3 className="h-3.5 w-3.5" />
          {hasValidPublishedAt
            ? t("stockDetail.updatedOn", { value: publishedLabel })
            : publishedLabel}
        </span>
      </div>

      <h4 className="mt-4 text-base font-semibold leading-7 text-foreground sm:text-lg">
        {item.headline}
      </h4>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {item.summary}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{item.source}</p>
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
          >
            {t("stockDetail.readMore")}
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function StockDetailSpinner() {
  return (
    <div className="app-panel flex min-h-[320px] items-center justify-center p-8">
      <div
        className="h-12 w-12 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary"
        role="status"
        aria-label="Loading stock history"
      />
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

  const watchlist = useWatchlistStore((state) =>
    Array.isArray(state.watchlist) ? state.watchlist : [],
  );
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
        setError(
          translate(language, "stockDetail.fetchError", { symbol }),
        );
      } finally {
        setLoading(false);
      }
    };

    loadStock();

    return () => controller.abort();
  }, [symbol, language]);

  const chartData = useMemo(
    () =>
      Array.isArray(stockData?.history?.[range]) ? stockData.history[range] : [],
    [range, stockData],
  );
  const rangeSnapshot = useMemo(() => getRangeSnapshot(chartData), [chartData]);
  const newsItems = Array.isArray(stockData?.news) ? stockData.news : [];
  const currentSymbol = stockData?.symbol || String(symbol || "").toUpperCase();
  const isSaved = watchlist.some((stock) => stock.symbol === currentSymbol);
  const isPositive = Number(stockData?.changePercent) >= 0;
  const rangePositive = rangeSnapshot.changePercent >= 0;
  const chartColor = rangePositive ? "#22c55e" : "#f43f5e";
  const hasLiveNews = newsItems.some((item) => !item.isFallback);
  const hasRenderableStock = Boolean(
    stockData &&
      (stockData.symbol || stockData.name || chartData.length || newsItems.length),
  );

  return (
    <div>
      <Header
        title={stockData?.name || symbol || t("stockDetail.fallbackTitle")}
        subtitle={t("stockDetail.subtitle")}
      />

      <div className="space-y-6 sm:space-y-7">
        <Link
          to="/dashboard"
          className="app-control inline-flex items-center gap-2 rounded-[1.35rem] px-4 py-3 text-sm font-semibold text-foreground shadow-sm hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("stockDetail.back")}
        </Link>

        {loading ? (
          <div className="space-y-6">
            <div className="app-panel h-40 animate-pulse" />
            <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_minmax(0,0.95fr)]">
              <div className="app-panel h-[380px] animate-pulse" />
              <div className="app-panel h-[380px] animate-pulse" />
            </div>
          </div>
        ) : error ? (
          <div className="app-panel border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
            <h2 className="text-lg font-semibold">
              {t("stockDetail.unableLoadHistoryTitle")}
            </h2>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : !hasRenderableStock ? (
          <StockDetailSpinner />
        ) : (
          <>
            <section className="app-panel overflow-hidden p-5 sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="transition-transform duration-300 hover:scale-[1.03]">
                    <StockLogo
                      symbol={stockData.symbol}
                      name={stockData.name}
                      logo={stockData.logo}
                      size="xl"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
                        {stockData.name}
                      </h2>
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                        {stockData.symbol}
                      </span>
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                        {stockData.sector}
                      </span>
                    </div>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                      {t("stockDetail.heroDescription")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-end">
                  <div className="rounded-[1.6rem] bg-secondary/70 px-4 py-4 text-left ring-1 ring-border/70 sm:min-w-[200px] sm:text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {t("stockDetail.currentPrice")}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">
                      {formatCurrency(stockData.currentPrice)}
                    </p>
                    <span
                      className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold ring-1 ${
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
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition sm:w-auto ${
                      isSaved
                        ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
                        : "app-control text-foreground hover:border-primary/25 hover:bg-white"
                    }`}
                  >
                    <Star className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved
                      ? t("stockDetail.savedToWatchlist")
                      : t("stockDetail.addToWatchlist")}
                  </button>
                </div>
              </div>
            </section>

            <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_minmax(0,0.95fr)]">
              <section className="app-panel border-border/50 bg-gradient-to-br from-white/65 via-white/40 to-transparent p-5 shadow-xl sm:p-7">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground">
                        {t("stockDetail.priceHistoryTitle")}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                        {t("stockDetail.priceHistoryDescription")}
                      </p>
                    </div>

                    <div className="inline-flex w-full rounded-[1.35rem] border border-border/80 bg-secondary/80 p-1 shadow-sm sm:w-auto">
                      {ranges.map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRange(value)}
                          className={`flex-1 rounded-[1rem] px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
                            range === value
                              ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="app-control rounded-[1.25rem] px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {t("stockDetail.rangeMove")}
                      </p>
                      <p
                        className={`mt-2 text-lg font-semibold ${
                          rangePositive ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {formatPercent(rangeSnapshot.changePercent)}
                      </p>
                    </div>
                    <div className="app-control rounded-[1.25rem] px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {t("stockDetail.rangeHigh")}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {formatCurrency(rangeSnapshot.high)}
                      </p>
                    </div>
                    <div className="app-control rounded-[1.25rem] px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {t("stockDetail.rangeLow")}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {formatCurrency(rangeSnapshot.low)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 h-[300px] overflow-hidden rounded-[1.75rem] border border-border/30 bg-gradient-to-b from-slate-50/70 to-white/30 shadow-inner sm:h-[360px] xl:h-[410px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 16, right: 14, left: -18, bottom: 8 }}
                    >
                      <defs>
                        <linearGradient id="price-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColor} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={chartColor} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="4 4"
                        stroke="rgba(148, 163, 184, 0.16)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        interval={range === "1M" ? 3 : range === "1D" ? 1 : 0}
                        minTickGap={16}
                        tick={{ fill: "#7f8c85", fontSize: 11, fontWeight: 500 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        width={64}
                        tick={{ fill: "#7f8c85", fontSize: 11, fontWeight: 500 }}
                        tickFormatter={(value) => `₦${Number(value).toFixed(0)}`}
                      />
                      <Tooltip
                        cursor={{
                          stroke: chartColor,
                          strokeOpacity: 0.35,
                          strokeWidth: 2,
                        }}
                        contentStyle={{
                          borderRadius: "20px",
                          border: "1px solid rgba(148, 163, 184, 0.16)",
                          backgroundColor: "rgba(15, 23, 42, 0.94)",
                          color: "#f8fafc",
                          boxShadow: "0 24px 50px rgba(2, 6, 23, 0.38)",
                        }}
                        formatter={(value) => [
                          formatCurrency(Number(value)),
                          t("stockDetail.priceLabel"),
                        ]}
                        labelFormatter={(value) =>
                          t("stockDetail.periodLabel", { value })
                        }
                        labelStyle={{ fontWeight: 600 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={chartColor}
                        strokeWidth={3}
                        fill="url(#price-gradient)"
                        connectNulls
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="app-panel p-5 sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                      <Newspaper className="h-3.5 w-3.5" />
                      {hasLiveNews
                        ? t("stockDetail.liveNewsLabel")
                        : t("stockDetail.newsBriefingLabel")}
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-foreground">
                      {t("stockDetail.newsTitle")}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {hasLiveNews
                        ? t("stockDetail.newsDescription")
                        : t("stockDetail.newsFallbackDescription")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {newsItems.length ? (
                    newsItems.slice(0, 4).map((item) => (
                      <NewsCard key={item.id} item={item} t={t} />
                    ))
                  ) : (
                    <div className="app-panel-soft border-dashed p-6 text-center">
                      <p className="text-base font-semibold text-foreground">
                        {t("stockDetail.noNewsTitle")}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {t("stockDetail.noNewsDescription")}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <section>
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-foreground">
                  {t("stockDetail.marketStatsTitle")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("stockDetail.marketStatsDescription")}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DetailStatCard
                  label={t("stockDetail.openPrice")}
                  value={formatCurrency(stockData.openPrice)}
                  animate={!!stockData?.openPrice}
                />
                <DetailStatCard
                  label={t("stockDetail.sessionHigh")}
                  value={formatCurrency(stockData.highPrice)}
                  animate={!!stockData?.highPrice}
                />
                <DetailStatCard
                  label={t("stockDetail.sessionLow")}
                  value={formatCurrency(stockData.lowPrice)}
                  animate={!!stockData?.lowPrice}
                />
                <DetailStatCard
                  label={t("stockDetail.volume")}
                  value={formatCompactNumber(stockData.volume)}
                  animate={!!stockData?.volume}
                />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
