import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BellRing,
  BriefcaseBusiness,
  Clock3,
  Download,
  ExternalLink,
  Newspaper,
  Star,
  Trash2,
} from "lucide-react";
import Header from "../src/components/Header";
import StockLogo from "../src/components/StockLogo";
import { Alert } from "@/components/ui/alert";
import { getAppCopy } from "@/content/appCopy";
import { fetchStockHistory } from "../services/api";
import {
  buildIndicatorSeries,
  calculatePortfolioSummary,
  evaluateAlerts,
  getStockIndicators,
  getValuationSignals,
} from "../src/lib/insights";
import { buildExportFileName, downloadCsvFile } from "../src/lib/export";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "../src/lib/market";
import { useAlertsStore } from "../store/useAlertsStore";
import { usePortfolioStore } from "../store/usePortfolioStore";
import { useWatchlistStore } from "../store/useWatchlistStore";
import { usePreferencesStore } from "../store/usePreferencesStore";
import { translate } from "../src/lib/i18n";

const ranges = ["1D", "1W", "1M"];

const STOCK_DETAIL_ENHANCEMENTS = {
  en: {
    exportData: "Export chart CSV",
    indicatorKicker: "Indicator board",
    indicatorTitle: "Overlay trend lines and read momentum faster.",
    indicatorDescription:
      "Switch short and long moving averages on top of price, then use RSI and momentum to judge whether the move still has pressure behind it.",
    rsiGuide: "RSI guide: 70 overbought • 30 oversold",
    momentumLabel: "5-bar momentum",
    rsiLabel: "RSI 14",
    ma5Label: "MA 5",
    ma20Label: "MA 20",
  },
  pid: {
    exportData: "Export chart CSV",
    indicatorKicker: "Indicator board",
    indicatorTitle: "Show trend lines and read momentum faster.",
    indicatorDescription:
      "Switch short and long moving averages on top of price, then use RSI and momentum take judge whether the move still get strength behind am.",
    rsiGuide: "RSI guide: 70 overbought • 30 oversold",
    momentumLabel: "5-bar momentum",
    rsiLabel: "RSI 14",
    ma5Label: "MA 5",
    ma20Label: "MA 20",
  },
};

function getAnimatedDisplayValue(value, count) {
  if (typeof value !== "string") {
    return value;
  }

  if (value.includes("₦") && !/[KMBT]/i.test(value)) {
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
    <article className="app-panel-soft rounded-[1.35rem] p-5 sm:p-6">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold leading-tight text-foreground sm:text-[2rem]">
        {displayValue}
      </p>
    </article>
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
    <article className="app-panel-soft rounded-[1.25rem] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
          {item.category || t("stockDetail.newsBriefingLabel")}
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
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
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

function StockDetailSpinner({ label }) {
  return (
    <div className="app-panel flex min-h-[320px] items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-12 w-12 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary"
          role="status"
          aria-label={label}
        />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function StockDetail() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("1D");
  const [shares, setShares] = useState("");
  const [averageCost, setAverageCost] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [alertDirection, setAlertDirection] = useState("above");
  const [toast, setToast] = useState(null);
  const [indicatorVisibility, setIndicatorVisibility] = useState({
    ma5: true,
    ma20: true,
    rsi: true,
  });

  const language = usePreferencesStore((state) => state.language);
  const t = (path, vars) => translate(language, path, vars);
  const copy = getAppCopy(language);
  const indicatorCopy =
    STOCK_DETAIL_ENHANCEMENTS[language] || STOCK_DETAIL_ENHANCEMENTS.en;

  const watchlist = useWatchlistStore((state) =>
    Array.isArray(state.watchlist) ? state.watchlist : [],
  );
  const toggleStock = useWatchlistStore((state) => state.toggleStock);
  const positions = usePortfolioStore((state) =>
    Array.isArray(state.positions) ? state.positions : [],
  );
  const upsertPosition = usePortfolioStore((state) => state.upsertPosition);
  const removePosition = usePortfolioStore((state) => state.removePosition);
  const alerts = useAlertsStore((state) =>
    Array.isArray(state.alerts) ? state.alerts : [],
  );
  const addAlert = useAlertsStore((state) => state.addAlert);
  const removeAlert = useAlertsStore((state) => state.removeAlert);

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
        setError(translate(language, "stockDetail.fetchError", { symbol }));
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
  const chartSeries = useMemo(() => buildIndicatorSeries(chartData), [chartData]);
  const rangeSnapshot = useMemo(() => getRangeSnapshot(chartData), [chartData]);
  const newsItems = Array.isArray(stockData?.news) ? stockData.news : [];
  const currentSymbol = stockData?.symbol || String(symbol || "").toUpperCase();
  const isSaved = watchlist.some((stock) => stock.symbol === currentSymbol);
  const isPositive = Number(stockData?.changePercent) >= 0;
  const rangePositive = rangeSnapshot.changePercent >= 0;
  const chartColor = rangePositive ? "#0f8a5f" : "#c24d57";
  const hasLiveNews = newsItems.some((item) => !item.isFallback);
  const hasRenderableStock = Boolean(
    stockData &&
      (stockData.symbol || stockData.name || chartData.length || newsItems.length),
  );

  const currentPosition = useMemo(
    () => positions.find((item) => item.symbol === currentSymbol) || null,
    [positions, currentSymbol],
  );
  const holdingSummary = useMemo(() => {
    if (!currentPosition || !stockData) {
      return null;
    }

    return calculatePortfolioSummary([currentPosition], [stockData]).holdings[0] || null;
  }, [currentPosition, stockData]);
  const stockAlerts = useMemo(
    () => alerts.filter((item) => item.symbol === currentSymbol),
    [alerts, currentSymbol],
  );
  const evaluatedAlerts = useMemo(
    () => evaluateAlerts(stockAlerts, stockData ? [stockData] : []).items,
    [stockAlerts, stockData],
  );
  const indicators = useMemo(
    () => (stockData ? getStockIndicators(stockData) : {}),
    [stockData],
  );
  const latestRsiPoint = useMemo(
    () =>
      [...chartSeries].reverse().find((point) => point.rsi14 != null) || null,
    [chartSeries],
  );
  const rsiSeries = useMemo(
    () => chartSeries.filter((point) => point.rsi14 != null),
    [chartSeries],
  );
  const valuationSignals = useMemo(
    () =>
      stockData
        ? getValuationSignals({
            ...stockData,
            currentPrice: stockData.currentPrice,
          }, language)
        : [],
    [language, stockData],
  );

  useEffect(() => {
    if (currentPosition) {
      setShares(String(currentPosition.shares || ""));
      setAverageCost(String(currentPosition.averageCost || ""));
    } else {
      setShares("");
      setAverageCost("");
    }
  }, [currentPosition, currentSymbol]);

  useEffect(() => {
    setTargetPrice("");
  }, [symbol]);

  useEffect(() => {
    if (stockData?.currentPrice && !targetPrice) {
      setTargetPrice(String(Number(stockData.currentPrice).toFixed(2)));
    }
  }, [stockData?.currentPrice, targetPrice]);

  const handleSavePosition = () => {
    const normalizedShares = Number(shares);
    const normalizedAverageCost = Number(averageCost);

    if (normalizedShares <= 0 || normalizedAverageCost <= 0) {
      setToast({
        type: "warning",
        message: copy.stockDetail.invalidPosition,
      });
      return;
    }

    upsertPosition({
      symbol: currentSymbol,
      name: stockData.name,
      sector: stockData.sector,
      logo: stockData.logo,
      shares: normalizedShares,
      averageCost: normalizedAverageCost,
    });

    setToast({
      type: "success",
      message: copy.stockDetail.holdingSaved,
    });
  };

  const handleRemovePosition = () => {
    removePosition(currentSymbol);
    setShares("");
    setAverageCost("");
    setToast({
      type: "success",
      message: copy.stockDetail.holdingRemoved,
    });
  };

  const handleCreateAlert = () => {
    const normalizedTargetPrice = Number(targetPrice);

    if (normalizedTargetPrice <= 0) {
      setToast({
        type: "warning",
        message: copy.stockDetail.invalidAlert,
      });
      return;
    }

    addAlert({
      symbol: currentSymbol,
      name: stockData.name,
      sector: stockData.sector,
      direction: alertDirection,
      targetPrice: normalizedTargetPrice,
    });

    setToast({
      type: "success",
      message: copy.stockDetail.alertCreated,
    });
  };

  const yearRangeValue =
    stockData?.week52Low && stockData?.week52High
      ? `${formatCurrency(stockData.week52Low)} - ${formatCurrency(stockData.week52High)}`
      : "-";

  const handleExportChartData = () => {
    downloadCsvFile(
      buildExportFileName(
        `ngx-${String(currentSymbol || "stock").toLowerCase()}-${range.toLowerCase()}`,
      ),
      chartSeries.map((point) => ({
        range,
        label: point.label,
        price: Number(point.price || 0).toFixed(2),
        ma5: point.ma5 != null ? Number(point.ma5).toFixed(2) : "",
        ma20: point.ma20 != null ? Number(point.ma20).toFixed(2) : "",
        rsi14: point.rsi14 != null ? Number(point.rsi14).toFixed(2) : "",
      })),
    );
  };

  const toggleIndicator = (key) => {
    setIndicatorVisibility((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <>
      {toast ? (
        <Alert
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}

      <div>
        <Header
          title={stockData?.name || symbol || t("stockDetail.fallbackTitle")}
          subtitle={t("stockDetail.subtitle")}
        />

        <div className="space-y-6 sm:space-y-7">
          <Link
            to="/dashboard"
            className="app-button-secondary h-11 gap-2 px-4 sm:h-12"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("stockDetail.back")}
          </Link>

          {loading ? (
            <div className="space-y-6">
              <div className="app-panel h-48 animate-pulse" />
              <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
                <div className="app-panel h-[430px] animate-pulse" />
                <div className="app-panel h-[430px] animate-pulse" />
              </div>
            </div>
          ) : error ? (
            <div className="app-panel border-rose-200/80 bg-rose-50/80 p-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
              <h2 className="text-lg font-semibold">
                {t("stockDetail.unableLoadHistoryTitle")}
              </h2>
              <p className="mt-2 text-sm leading-6">{error}</p>
            </div>
          ) : !hasRenderableStock ? (
            <StockDetailSpinner label={t("stockDetail.loadingHistory")} />
          ) : (
            <>
              <section className="app-panel surface-noise overflow-hidden rounded-[1.85rem] p-4 sm:p-7">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <StockLogo
                      symbol={stockData.symbol}
                      name={stockData.name}
                      logo={stockData.logo}
                      size="xl"
                      className="shadow-float"
                    />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-[1.85rem] font-semibold text-foreground sm:text-3xl">
                          {stockData.name}
                        </h2>
                        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                          {stockData.symbol}
                        </span>
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                          {stockData.sector}
                        </span>
                      </div>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                        {t("stockDetail.heroDescription")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-end">
                    <div className="w-full rounded-[1.35rem] border border-primary/15 bg-primary/10 px-5 py-4 text-left sm:min-w-[220px] sm:text-right">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
                        {t("stockDetail.currentPrice")}
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-foreground">
                        {formatCurrency(stockData.currentPrice)}
                      </p>
                      <span
                        className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold ${
                          isPositive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-300"
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
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-[1.1rem] px-4 py-3 text-sm font-semibold transition sm:w-auto ${
                        isSaved
                          ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
                          : "app-button-secondary h-12"
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

              <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.48fr)_minmax(0,0.92fr)]">
                <section className="app-panel rounded-[1.8rem] p-5 shadow-panel sm:p-7">
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <p className="section-kicker">
                          {copy.stockDetail.priceActionKicker}
                        </p>
                        <h3 className="mt-3 text-2xl font-semibold text-foreground">
                          {t("stockDetail.priceHistoryTitle")}
                        </h3>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                          {t("stockDetail.priceHistoryDescription")}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 xl:items-end">
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
                          <div className="inline-flex w-full rounded-[1.2rem] border border-border/80 bg-white/55 p-1 shadow-sm sm:w-auto dark:bg-white/5">
                            {ranges.map((value) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setRange(value)}
                                className={`flex-1 rounded-[0.9rem] px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
                                  range === value
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {value}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={handleExportChartData}
                            className="app-button-secondary h-11 gap-2 rounded-[1.1rem] px-4"
                          >
                            <Download className="h-4 w-4" />
                            {indicatorCopy.exportData}
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 xl:justify-end">
                          {[
                            { key: "ma5", label: indicatorCopy.ma5Label },
                            { key: "ma20", label: indicatorCopy.ma20Label },
                            { key: "rsi", label: indicatorCopy.rsiLabel },
                          ].map((item) => (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => toggleIndicator(item.key)}
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                                indicatorVisibility[item.key]
                                  ? "border-primary/20 bg-primary/10 text-primary"
                                  : "border-border/70 bg-white/55 text-muted-foreground hover:text-foreground dark:bg-white/5"
                              }`}
                            >
                              <Activity className="h-3.5 w-3.5" />
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
                      <div className="app-control rounded-[1.05rem] px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {t("stockDetail.rangeMove")}
                        </p>
                        <p
                          className={`mt-2 text-lg font-semibold ${
                            rangePositive
                              ? "text-emerald-600 dark:text-emerald-300"
                              : "text-rose-600 dark:text-rose-300"
                          }`}
                        >
                          {formatPercent(rangeSnapshot.changePercent)}
                        </p>
                      </div>
                      <div className="app-control rounded-[1.05rem] px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {t("stockDetail.rangeHigh")}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-foreground">
                          {formatCurrency(rangeSnapshot.high)}
                        </p>
                      </div>
                      <div className="app-control rounded-[1.05rem] px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {t("stockDetail.rangeLow")}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-foreground">
                          {formatCurrency(rangeSnapshot.low)}
                        </p>
                      </div>
                      <div className="app-control rounded-[1.05rem] px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {indicatorCopy.momentumLabel}
                        </p>
                        <p
                          className={`mt-2 text-lg font-semibold ${
                            Number(indicators.momentum5) >= 0
                              ? "text-emerald-600 dark:text-emerald-300"
                              : "text-rose-600 dark:text-rose-300"
                          }`}
                        >
                          {formatPercent(indicators.momentum5)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 h-[320px] overflow-hidden rounded-[1.55rem] border border-border/60 bg-[linear-gradient(180deg,rgba(14,91,79,0.08),rgba(255,255,255,0.15))] shadow-inner sm:h-[380px] xl:h-[430px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={chartSeries}
                        margin={{ top: 16, right: 18, left: -18, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient id="price-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartColor} stopOpacity={0.34} />
                            <stop offset="100%" stopColor={chartColor} stopOpacity={0.03} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="4 4"
                          stroke="rgba(125, 138, 142, 0.18)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="label"
                          axisLine={false}
                          tickLine={false}
                          interval={range === "1M" ? 3 : range === "1D" ? 1 : 0}
                          minTickGap={16}
                          tick={{ fill: "#7a878d", fontSize: 11, fontWeight: 500 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          width={56}
                          tick={{ fill: "#7a878d", fontSize: 11, fontWeight: 500 }}
                          tickFormatter={(value) => `₦${Number(value).toFixed(0)}`}
                        />
                        <Tooltip
                          cursor={{
                            stroke: chartColor,
                            strokeOpacity: 0.35,
                            strokeWidth: 2,
                          }}
                          contentStyle={{
                            borderRadius: "16px",
                            border: "1px solid rgba(148, 163, 184, 0.16)",
                            backgroundColor: "rgba(10, 24, 29, 0.94)",
                            color: "#f8fafc",
                            boxShadow: "0 24px 50px rgba(2, 6, 23, 0.38)",
                          }}
                          formatter={(value, name) => {
                            const labelMap = {
                              price: t("stockDetail.priceLabel"),
                              ma5: indicatorCopy.ma5Label,
                              ma20: indicatorCopy.ma20Label,
                            };

                            return [
                              formatCurrency(Number(value)),
                              labelMap[name] || name,
                            ];
                          }}
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
                        {indicatorVisibility.ma5 ? (
                          <Line
                            type="monotone"
                            dataKey="ma5"
                            stroke="#d2a14a"
                            strokeWidth={2.2}
                            dot={false}
                            connectNulls
                          />
                        ) : null}
                        {indicatorVisibility.ma20 ? (
                          <Line
                            type="monotone"
                            dataKey="ma20"
                            stroke="#2f7a73"
                            strokeWidth={2.1}
                            strokeDasharray="6 6"
                            dot={false}
                            connectNulls
                          />
                        ) : null}
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  {indicatorVisibility.rsi && rsiSeries.length ? (
                    <div className="mt-5 rounded-[1.45rem] border border-border/65 bg-white/55 p-4 dark:bg-white/5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="section-kicker">{indicatorCopy.indicatorKicker}</p>
                          <h4 className="mt-2 text-lg font-semibold text-foreground">
                            {indicatorCopy.indicatorTitle}
                          </h4>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            {indicatorCopy.indicatorDescription}
                          </p>
                        </div>
                        <span className="app-chip">
                          <Activity className="h-4 w-4" />
                          {indicatorCopy.rsiGuide}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 lg:grid-cols-4">
                        <div className="rounded-[1.05rem] border border-border/60 bg-white/65 px-3 py-3 dark:bg-white/5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {indicatorCopy.ma5Label}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-foreground">
                            {indicators.movingAverage5
                              ? formatCurrency(indicators.movingAverage5)
                              : "-"}
                          </p>
                        </div>
                        <div className="rounded-[1.05rem] border border-border/60 bg-white/65 px-3 py-3 dark:bg-white/5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {indicatorCopy.ma20Label}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-foreground">
                            {indicators.movingAverage20
                              ? formatCurrency(indicators.movingAverage20)
                              : "-"}
                          </p>
                        </div>
                        <div className="rounded-[1.05rem] border border-border/60 bg-white/65 px-3 py-3 dark:bg-white/5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {indicatorCopy.rsiLabel}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-foreground">
                            {latestRsiPoint?.rsi14
                              ? latestRsiPoint.rsi14.toFixed(1)
                              : "-"}
                          </p>
                        </div>
                        <div className="rounded-[1.05rem] border border-border/60 bg-white/65 px-3 py-3 dark:bg-white/5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {indicatorCopy.momentumLabel}
                          </p>
                          <p
                            className={`mt-2 text-sm font-semibold ${
                              Number(indicators.momentum5) >= 0
                                ? "text-emerald-600 dark:text-emerald-300"
                                : "text-rose-600 dark:text-rose-300"
                            }`}
                          >
                            {formatPercent(indicators.momentum5)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 h-[170px] overflow-hidden rounded-[1.2rem] border border-border/60 bg-[linear-gradient(180deg,rgba(210,161,74,0.07),rgba(255,255,255,0.12))] px-1 pt-3 shadow-inner dark:bg-white/[0.03]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={rsiSeries}
                            margin={{ top: 6, right: 16, left: -22, bottom: 4 }}
                          >
                            <CartesianGrid
                              strokeDasharray="4 4"
                              stroke="rgba(125, 138, 142, 0.14)"
                              vertical={false}
                            />
                            <XAxis
                              dataKey="label"
                              axisLine={false}
                              tickLine={false}
                              interval={range === "1M" ? 3 : range === "1D" ? 1 : 0}
                              minTickGap={18}
                              tick={{ fill: "#7a878d", fontSize: 11, fontWeight: 500 }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              width={44}
                              domain={[0, 100]}
                              tick={{ fill: "#7a878d", fontSize: 11, fontWeight: 500 }}
                            />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "16px",
                                border: "1px solid rgba(148, 163, 184, 0.16)",
                                backgroundColor: "rgba(10, 24, 29, 0.94)",
                                color: "#f8fafc",
                                boxShadow: "0 24px 50px rgba(2, 6, 23, 0.38)",
                              }}
                              formatter={(value) => [
                                Number(value).toFixed(1),
                                indicatorCopy.rsiLabel,
                              ]}
                              labelFormatter={(value) =>
                                t("stockDetail.periodLabel", { value })
                              }
                            />
                            <ReferenceLine
                              y={70}
                              stroke="rgba(194, 77, 87, 0.55)"
                              strokeDasharray="5 5"
                            />
                            <ReferenceLine
                              y={30}
                              stroke="rgba(15, 138, 95, 0.55)"
                              strokeDasharray="5 5"
                            />
                            <Line
                              type="monotone"
                              dataKey="rsi14"
                              stroke="#d2a14a"
                              strokeWidth={2.25}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : null}
                </section>

                <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
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
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
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
                      <div className="app-panel-soft rounded-[1.35rem] border-dashed p-6 text-center">
                        <p className="text-base font-semibold text-foreground">
                          {t("stockDetail.noNewsTitle")}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {t("stockDetail.noNewsDescription")}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
                  <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-primary/10 text-primary">
                      <BriefcaseBusiness className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="section-kicker">{copy.stockDetail.positionKicker}</p>
                      <h3 className="mt-2 text-2xl font-semibold text-foreground">
                        {copy.stockDetail.positionTitle}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {copy.stockDetail.positionDescription}
                      </p>
                    </div>
                  </div>

                  {holdingSummary ? (
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <DetailStatCard
                        label={copy.stockDetail.currentValueLabel}
                        value={formatCompactCurrency(holdingSummary.marketValue)}
                        animate={false}
                      />
                      <DetailStatCard
                        label={copy.stockDetail.unrealizedPnLLabel}
                        value={formatCompactCurrency(holdingSummary.unrealizedPnL)}
                        animate={false}
                      />
                      <DetailStatCard
                        label={copy.stockDetail.averageCostLabel}
                        value={formatCurrency(holdingSummary.averageCost)}
                        animate={false}
                      />
                    </div>
                  ) : null}

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        {copy.stockDetail.sharesLabel}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={shares}
                        onChange={(event) => setShares(event.target.value)}
                        className="app-input"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        {copy.stockDetail.averageCostLabel}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={averageCost}
                        onChange={(event) => setAverageCost(event.target.value)}
                        className="app-input"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleSavePosition}
                      className="app-button-primary w-full sm:w-auto"
                    >
                      {currentPosition
                        ? copy.stockDetail.updatePosition
                        : copy.stockDetail.savePosition}
                    </button>
                    {currentPosition ? (
                      <button
                        type="button"
                        onClick={handleRemovePosition}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-[1.1rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20 sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                        {copy.stockDetail.removePosition}
                      </button>
                    ) : null}
                  </div>
                </section>

                <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
                  <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-primary/10 text-primary">
                      <BellRing className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="section-kicker">{copy.stockDetail.alertKicker}</p>
                      <h3 className="mt-2 text-2xl font-semibold text-foreground">
                        {copy.stockDetail.alertTitle}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {copy.stockDetail.alertDescription}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_0.9fr]">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        {copy.stockDetail.targetPriceLabel}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={targetPrice}
                        onChange={(event) => setTargetPrice(event.target.value)}
                        className="app-input"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        {copy.stockDetail.alertDirectionLabel}
                      </label>
                      <select
                        value={alertDirection}
                        onChange={(event) => setAlertDirection(event.target.value)}
                        className="app-input"
                      >
                        <option value="above">
                          {copy.stockDetail.alertWhenAbove}
                        </option>
                        <option value="below">
                          {copy.stockDetail.alertWhenBelow}
                        </option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateAlert}
                    className="app-button-primary mt-5 w-full sm:w-auto"
                  >
                    {copy.stockDetail.createAlert}
                  </button>

                  <div className="mt-6 space-y-3">
                    <p className="text-sm font-semibold text-foreground">
                      {copy.stockDetail.activeAlertsTitle}
                    </p>
                    {evaluatedAlerts.length ? (
                      evaluatedAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="rounded-[1.15rem] border border-border/65 bg-white/55 p-4 dark:bg-white/5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {alert.direction === "above"
                                  ? copy.stockDetail.alertWhenAbove
                                  : copy.stockDetail.alertWhenBelow}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                                <span className="text-foreground">
                                  {copy.stockDetail.targetPriceLabel}:{" "}
                                  <strong>{formatCurrency(alert.targetPrice)}</strong>
                                </span>
                                <span className="text-muted-foreground">
                                  {copy.dashboard.alertCurrentLabel}:{" "}
                                  {formatCurrency(alert.currentPrice)}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAlert(alert.id)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-[1rem] border border-border/70 bg-white/70 text-muted-foreground transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:bg-white/5 dark:hover:border-rose-500/20 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                              aria-label={copy.stockDetail.removeAlertLabel}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.15rem] border border-dashed border-border/80 bg-white/50 px-4 py-4 text-sm leading-7 text-muted-foreground dark:bg-white/5">
                        {copy.stockDetail.noAlertsTitle}
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
                <div className="mb-4">
                  <p className="section-kicker">{copy.stockDetail.valuationKicker}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-foreground sm:text-[2rem]">
                    {copy.stockDetail.valuationTitle}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    {copy.stockDetail.valuationDescription}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <DetailStatCard
                    label={copy.stockDetail.marketCapLabel}
                    value={
                      stockData.marketCap
                        ? formatCompactCurrency(stockData.marketCap)
                        : "-"
                    }
                    animate={false}
                  />
                  <DetailStatCard
                    label={copy.stockDetail.peRatioLabel}
                    value={
                      stockData.peRatio
                        ? `${Number(stockData.peRatio).toFixed(1)}x`
                        : "-"
                    }
                    animate={false}
                  />
                  <DetailStatCard
                    label={copy.stockDetail.dividendYieldLabel}
                    value={
                      stockData.dividendYield
                        ? `${Number(stockData.dividendYield).toFixed(1)}%`
                        : "-"
                    }
                    animate={false}
                  />
                  <DetailStatCard
                    label={copy.stockDetail.epsLabel}
                    value={stockData.eps ? formatCurrency(stockData.eps) : "-"}
                    animate={false}
                  />
                  <DetailStatCard
                    label={copy.stockDetail.priceToBookLabel}
                    value={
                      stockData.priceToBook
                        ? `${Number(stockData.priceToBook).toFixed(2)}x`
                        : "-"
                    }
                    animate={false}
                  />
                  <DetailStatCard
                    label={copy.stockDetail.yearRangeLabel}
                    value={yearRangeValue}
                    animate={false}
                  />
                  <DetailStatCard
                    label={copy.stockDetail.betaLabel}
                    value={stockData.beta ? Number(stockData.beta).toFixed(2) : "-"}
                    animate={false}
                  />
                  <DetailStatCard
                    label={copy.stockDetail.average20Label}
                    value={
                      indicators.movingAverage20
                        ? formatCurrency(indicators.movingAverage20)
                        : "-"
                    }
                    animate={false}
                  />
                </div>

                <div className="mt-6 rounded-[1.35rem] border border-border/65 bg-white/55 p-5 dark:bg-white/5">
                  <p className="text-sm font-semibold text-foreground">
                    {copy.stockDetail.quickReadTitle}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {copy.stockDetail.quickReadDescription}
                  </p>

                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    {valuationSignals.map((signal) => (
                      <div
                        key={signal.label}
                        className="rounded-[1.15rem] border border-border/65 bg-white/65 p-4 dark:bg-white/5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {signal.label}
                          </p>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              signal.tone === "positive"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                                : signal.tone === "warning"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-300"
                                  : "bg-accent text-accent-foreground"
                            }`}
                          >
                            {signal.value}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {signal.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-4">
                  <p className="section-kicker">{copy.stockDetail.statsKicker}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-foreground sm:text-[2rem]">
                    {t("stockDetail.marketStatsTitle")}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
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
    </>
  );
}
