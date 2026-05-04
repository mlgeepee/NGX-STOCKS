import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CandlestickChart,
  RefreshCw,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import Header from "../src/components/Header";
import StocksTable from "../src/components/StocksTable";
import { getAppCopy } from "@/content/appCopy";
import { fetchStockList } from "../services/api";
import {
  calculatePortfolioSummary,
  evaluateAlerts,
  getDividendCalendar,
  getSectorSnapshots,
} from "../src/lib/insights";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
  getMarketTrend,
} from "../src/lib/market";
import { useAlertsStore } from "../store/useAlertsStore";
import { usePortfolioStore } from "../store/usePortfolioStore";
import { usePreferencesStore } from "../store/usePreferencesStore";
import { translate } from "../src/lib/i18n";
import { useWatchlistStore } from "../store/useWatchlistStore";

const supportCardStyles = [
  {
    labelKey: "dashboard.totalStocksLabel",
    detailKey: "dashboard.totalStocksDetail",
    icon: Building2,
    tone: "bg-primary/10 text-primary",
  },
  {
    labelKey: "dashboard.gainersLabel",
    detailKey: "dashboard.gainersDetail",
    icon: ArrowUpCircle,
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  },
  {
    labelKey: "dashboard.losersLabel",
    detailKey: "dashboard.losersDetail",
    icon: ArrowDownCircle,
    tone: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  },
];

const dividendDateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
});

function LeadBoardCard({
  copy,
  title,
  description,
  marketTrend,
  averageMove,
  topGainer,
  mostActive,
  watchlistCount,
}) {
  return (
    <section className="app-panel surface-noise rounded-[1.55rem] p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="section-kicker">{copy.leadKicker}</p>
          <h2 className="mt-3 max-w-xl text-[1.65rem] font-semibold text-foreground sm:text-[2rem]">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-[14px] leading-6 text-muted-foreground sm:text-[15px]">
            {description}
          </p>
        </div>
        <div className="w-full rounded-[1.05rem] border border-primary/15 bg-primary/10 px-4 py-3.5 sm:w-auto">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
            {copy.trendLabel}
          </p>
          <p className="mt-2 text-[1.65rem] font-semibold text-foreground">
            {marketTrend}
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">{averageMove}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <article className="app-panel-soft p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.topGainerLabel}
          </p>
          <p className="mt-2.5 text-lg font-semibold text-foreground">
            {topGainer?.symbol || "-"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {topGainer?.name || copy.topGainerEmpty}
          </p>
          <p className="mt-4 inline-flex rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
            {topGainer ? formatPercent(topGainer.changePercent) : "+0.00%"}
          </p>
        </article>

        <article className="app-panel-soft p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.mostActiveLabel}
          </p>
          <p className="mt-2.5 text-lg font-semibold text-foreground">
            {mostActive?.symbol || "-"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {mostActive?.name || copy.mostActiveEmpty}
          </p>
          <p className="mt-4 text-sm font-semibold text-foreground">
            {mostActive
              ? `${Number(mostActive.volume || 0).toLocaleString("en-NG")} ${copy.sharesSuffix}`
              : copy.mostActiveEmpty}
          </p>
        </article>

        <article className="app-panel-soft p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {copy.watchlistFocusLabel}
          </p>
          <p className="mt-2.5 text-lg font-semibold text-foreground">
            {watchlistCount}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {copy.watchlistFocusDetail}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground">
            <Star className="h-4 w-4" />
            {copy.watchlistReady}
          </div>
        </article>
      </div>
    </section>
  );
}

function SupportCard({ icon: Icon, label, value, detail, tone }) {
  return (
    <article className="app-panel-soft rounded-[1.25rem] p-4 sm:min-h-[10rem] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-3 break-words text-[1.6rem] font-semibold leading-tight text-foreground sm:text-[1.9rem]">
            {value}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
        </div>
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.05rem] ${tone}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </article>
  );
}

function PanelHeading({ kicker, title, description, icon: Icon }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.05rem] bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="section-kicker">{kicker}</p>
        <h3 className="mt-2 text-[1.45rem] font-semibold text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-[14px] leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function PortfolioPanel({ copy, summary, primarySymbol }) {
  return (
    <section className="app-panel rounded-[1.45rem] p-4 sm:p-5">
      <PanelHeading
        kicker={copy.portfolioKicker}
        title={copy.portfolioTitle}
        description={copy.portfolioDescription}
        icon={BriefcaseBusiness}
      />

      {!summary.holdings.length ? (
        <div className="mt-6 rounded-[1.35rem] border border-dashed border-border/80 bg-white/50 p-5 dark:bg-white/5">
          <p className="text-lg font-semibold text-foreground">
            {copy.portfolioEmptyTitle}
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {copy.portfolioEmptyDescription}
          </p>
          {primarySymbol ? (
            <Link
              to={`/dashboard/stocks/${encodeURIComponent(primarySymbol)}`}
              className="app-button-secondary mt-5 h-11 gap-2 px-4"
            >
              {copy.portfolioStartCta}
            </Link>
          ) : null}
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <SupportCard
              icon={BriefcaseBusiness}
              label={copy.portfolioValueLabel}
              value={formatCompactCurrency(summary.totalValue)}
              detail={formatCurrency(summary.totalValue)}
              tone="bg-primary/10 text-primary"
            />
            <SupportCard
              icon={TrendingUp}
              label={copy.portfolioPnLLabel}
              value={formatCompactCurrency(summary.totalPnL)}
              detail={formatPercent(summary.totalPnLPercent)}
              tone={
                summary.totalPnL >= 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-300"
              }
            />
            <SupportCard
              icon={CalendarDays}
              label={copy.portfolioDayMoveLabel}
              value={formatCompactCurrency(summary.dayMoveValue)}
              detail={formatCurrency(summary.dayMoveValue)}
              tone={
                summary.dayMoveValue >= 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-300"
              }
            />
            <SupportCard
              icon={Star}
              label={copy.portfolioHoldingsLabel}
              value={summary.positionsCount}
              detail={
                summary.topHolding
                  ? `${copy.portfolioTopHoldingLabel}: ${summary.topHolding.symbol}`
                  : copy.portfolioHoldingsLabel
              }
              tone="bg-accent text-accent-foreground"
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[1.35rem] border border-border/65 bg-white/55 p-4 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">
                  {copy.portfolioTopHoldingLabel}
                </p>
                {summary.topHolding ? (
                  <Link
                    to={`/dashboard/stocks/${encodeURIComponent(summary.topHolding.symbol)}`}
                    className="text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    {summary.topHolding.symbol}
                  </Link>
                ) : null}
              </div>
              <div className="mt-4 space-y-3">
                {summary.holdings.slice(0, 3).map((holding) => (
                  <div
                    key={holding.symbol}
                    className="rounded-[1rem] border border-border/65 bg-white/65 px-3.5 py-3 dark:bg-white/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {holding.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {holding.symbol} • {holding.shares} {copy.sharesSuffix}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(holding.marketValue)}
                        </p>
                        <p
                          className={`mt-1 text-xs font-medium ${
                            holding.unrealizedPnL >= 0
                              ? "text-emerald-600 dark:text-emerald-300"
                              : "text-rose-600 dark:text-rose-300"
                          }`}
                        >
                          {formatPercent(holding.unrealizedPnLPercent)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-border/65 bg-white/55 p-4 dark:bg-white/5">
              <p className="text-sm font-semibold text-foreground">
                {copy.sectorKicker}
              </p>
              <div className="mt-4 space-y-3">
                {summary.sectorAllocation.slice(0, 4).map((item) => (
                  <div key={item.sector}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <p className="font-medium text-foreground">{item.sector}</p>
                      <p className="text-muted-foreground">
                        {item.weight.toFixed(0)}%
                      </p>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${Math.max(item.weight, 6)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function AlertsPanel({ copy, stockCopy, summary, onRemoveAlert, fallbackSymbol }) {
  return (
    <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
      <PanelHeading
        kicker={copy.alertKicker}
        title={copy.alertTitle}
        description={copy.alertDescription}
        icon={BellRing}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <span className="app-chip border-primary/10 bg-primary/10 text-primary dark:border-primary/20">
          {copy.alertActiveLabel}: {summary.activeCount}
        </span>
        <span className="app-chip">
          {copy.alertTriggeredLabel}: {summary.triggeredCount}
        </span>
        {summary.nearestAlert ? (
          <span className="app-chip">
            {copy.alertNearestLabel}: {summary.nearestAlert.symbol}
          </span>
        ) : null}
      </div>

      {!summary.items.length ? (
        <div className="mt-6 rounded-[1.35rem] border border-dashed border-border/80 bg-white/50 p-5 dark:bg-white/5">
          <p className="text-lg font-semibold text-foreground">
            {copy.alertEmptyTitle}
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {copy.alertEmptyDescription}
          </p>
          {fallbackSymbol ? (
            <Link
              to={`/dashboard/stocks/${encodeURIComponent(fallbackSymbol)}`}
              className="app-button-secondary mt-5 h-11 gap-2 px-4"
            >
              {stockCopy.createAlert}
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {summary.items.slice(0, 4).map((alert) => (
            <div
              key={alert.id}
              className="rounded-[1.2rem] border border-border/65 bg-white/55 p-4 dark:bg-white/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dashboard/stocks/${encodeURIComponent(alert.symbol)}`}
                      className="font-semibold text-foreground hover:text-primary"
                    >
                      {alert.symbol}
                    </Link>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                        alert.triggered
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                          : "bg-accent text-accent-foreground"
                      }`}
                    >
                      {alert.triggered
                        ? copy.alertTriggeredLabel
                        : copy.alertActiveLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {alert.direction === "above"
                      ? stockCopy.alertWhenAbove
                      : stockCopy.alertWhenBelow}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    <span className="text-foreground">
                      {copy.alertTargetLabel}:{" "}
                      <strong>{formatCurrency(alert.targetPrice)}</strong>
                    </span>
                    <span className="text-muted-foreground">
                      {copy.alertCurrentLabel}: {formatCurrency(alert.currentPrice)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveAlert(alert.id)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[1rem] border border-border/70 bg-white/70 text-muted-foreground transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:bg-white/5 dark:hover:border-rose-500/20 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                  aria-label={stockCopy.removeAlertLabel}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function SectorPanel({ copy, sectors }) {
  return (
    <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
      <PanelHeading
        kicker={copy.sectorKicker}
        title={copy.sectorTitle}
        description={copy.sectorDescription}
        icon={Building2}
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {sectors.slice(0, 4).map((sector) => (
          <article
            key={sector.sector}
            className="rounded-[1.25rem] border border-border/65 bg-white/55 p-4 dark:bg-white/5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-foreground">
                {sector.sector}
              </p>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  sector.averageChange >= 0
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-300"
                }`}
              >
                {formatPercent(sector.averageChange)}
              </span>
            </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span>
                  {copy.sectorBreadthLabel}: {sector.count}
                </span>
                <span>
                  {copy.sectorLeaderLabel}: {sector.leader?.symbol || "-"}
                </span>
                <span>
                  {copy.sectorVolumeLabel}: {formatCompactNumber(sector.totalVolume)}
                </span>
              </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {sector.leader?.name || sector.sector}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DividendPanel({ copy, dividends }) {
  return (
    <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
      <PanelHeading
        kicker={copy.dividendKicker}
        title={copy.dividendTitle}
        description={copy.dividendDescription}
        icon={CalendarDays}
      />

      {!dividends.length ? (
        <div className="mt-6 rounded-[1.35rem] border border-dashed border-border/80 bg-white/50 p-5 dark:bg-white/5">
          <p className="text-lg font-semibold text-foreground">
            {copy.dividendEmptyTitle}
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {copy.dividendEmptyDescription}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {dividends.slice(0, 4).map((item) => (
            <div
              key={`${item.symbol}-${item.exDividendDate || item.paymentDate}`}
              className="rounded-[1.2rem] border border-border/65 bg-white/55 p-4 dark:bg-white/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    to={`/dashboard/stocks/${encodeURIComponent(item.symbol)}`}
                    className="font-semibold text-foreground hover:text-primary"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.symbol} • {item.sector}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  ₦{Number(item.dividendAmount || 0).toFixed(2)}
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[0.95rem] border border-border/60 bg-white/60 px-3 py-3 text-sm dark:bg-white/5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {copy.dividendExDateLabel}
                  </p>
                  <p className="mt-2 font-semibold text-foreground">
                    {item.exDate
                      ? dividendDateFormatter.format(item.exDate)
                      : "N/A"}
                  </p>
                </div>
                <div className="rounded-[0.95rem] border border-border/60 bg-white/60 px-3 py-3 text-sm dark:bg-white/5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {copy.dividendPayDateLabel}
                  </p>
                  <p className="mt-2 font-semibold text-foreground">
                    {item.paymentDate
                      ? dividendDateFormatter.format(item.paymentDate)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)]">
        <div className="app-panel h-[21rem] animate-pulse" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="app-panel-soft h-40 animate-pulse" />
          ))}
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="app-panel h-[24rem] animate-pulse" />
        <div className="app-panel h-[24rem] animate-pulse" />
      </div>
      <div className="app-panel h-[420px] animate-pulse" />
    </div>
  );
}

function EmptyBoardState({ title, description }) {
  return (
    <div className="app-panel flex min-h-[280px] flex-col items-center justify-center p-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-primary/10 text-primary">
        <CandlestickChart className="h-6 w-6" />
      </span>
      <p className="mt-5 text-xl font-semibold text-foreground">{title}</p>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBoardPreparing, setIsBoardPreparing] = useState(true);
  const navigate = useNavigate();

  const language = usePreferencesStore((state) => state.language);
  const t = useCallback(
    (path, vars) => translate(language, path, vars),
    [language],
  );
  const copy = getAppCopy(language);

  const watchlist = useWatchlistStore((state) =>
    Array.isArray(state.watchlist) ? state.watchlist : [],
  );
  const toggleStock = useWatchlistStore((state) => state.toggleStock);
  const positions = usePortfolioStore((state) =>
    Array.isArray(state.positions) ? state.positions : [],
  );
  const alerts = useAlertsStore((state) =>
    Array.isArray(state.alerts) ? state.alerts : [],
  );
  const removeAlert = useAlertsStore((state) => state.removeAlert);

  const loadStocks = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const list = await fetchStockList(signal);
      setStocks(list);
    } catch (fetchError) {
      if (fetchError.name === "AbortError") {
        return;
      }
      setError(fetchError.message || "Unable to load stock data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadStocks(controller.signal);
    return () => controller.abort();
  }, [loadStocks]);

  useEffect(() => {
    if (loading) {
      setIsBoardPreparing(true);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsBoardPreparing(false);
    }, 180);

    return () => clearTimeout(timeoutId);
  }, [loading, searchQuery, stocks]);

  const filteredStocks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return stocks;

    return stocks.filter((stock) => {
      return (
        stock.symbol.toLowerCase().includes(normalizedQuery) ||
        stock.name.toLowerCase().includes(normalizedQuery) ||
        stock.sector.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [searchQuery, stocks]);
  const hasActiveSearch = Boolean(searchQuery.trim());
  const searchSuggestions = useMemo(
    () => filteredStocks.slice(0, 5),
    [filteredStocks],
  );

  const marketTrend = useMemo(() => getMarketTrend(stocks), [stocks]);

  const topGainer = useMemo(() => {
    return [...stocks].sort(
      (left, right) => Number(right.changePercent) - Number(left.changePercent),
    )[0];
  }, [stocks]);

  const mostActive = useMemo(() => {
    return [...stocks].sort(
      (left, right) => Number(right.volume) - Number(left.volume),
    )[0];
  }, [stocks]);

  const supportCards = useMemo(() => {
    const gainers = stocks.filter((stock) => stock.changePercent > 0).length;
    const losers = stocks.filter((stock) => stock.changePercent < 0).length;

    return [
      {
        ...supportCardStyles[0],
        value: stocks.length || "0",
        label: t("dashboard.totalStocksLabel"),
        detail: t("dashboard.totalStocksDetail"),
      },
      {
        ...supportCardStyles[1],
        value: gainers,
        label: t("dashboard.gainersLabel"),
        detail: t("dashboard.gainersDetail"),
      },
      {
        ...supportCardStyles[2],
        value: losers,
        label: t("dashboard.losersLabel"),
        detail: t("dashboard.losersDetail"),
      },
      {
        label: copy.dashboard.savedNamesLabel,
        value: watchlist.length,
        detail: copy.dashboard.savedNamesDetail,
        icon: Star,
        tone: "bg-accent text-accent-foreground",
      },
    ];
  }, [copy.dashboard.savedNamesDetail, copy.dashboard.savedNamesLabel, stocks, t, watchlist.length]);

  const watchlistSymbols = useMemo(
    () => new Set(watchlist.map((stock) => stock.symbol)),
    [watchlist],
  );

  const portfolioSummary = useMemo(
    () => calculatePortfolioSummary(positions, stocks),
    [positions, stocks],
  );
  const alertSummary = useMemo(
    () => evaluateAlerts(alerts, stocks),
    [alerts, stocks],
  );
  const sectorSnapshots = useMemo(() => getSectorSnapshots(stocks), [stocks]);
  const dividendCalendar = useMemo(() => getDividendCalendar(stocks), [stocks]);
  const openStockFromSearch = useCallback(
    (stock) => {
      navigate(`/dashboard/stocks/${encodeURIComponent(stock.symbol)}`);
    },
    [navigate],
  );

  const marketBoardSection = isBoardPreparing ? (
    <EmptyBoardState
      title={t("dashboard.boardLoadingTitle")}
      description={t("dashboard.boardLoadingDescription")}
    />
  ) : !filteredStocks.length ? (
    <EmptyBoardState
      title={t("dashboard.noStocksTitle")}
      description={t("dashboard.noStocksDescription")}
    />
  ) : (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">
            {hasActiveSearch
              ? t("dashboard.searchResultsKicker")
              : copy.dashboard.boardKicker}
          </p>
          <h2 className="mt-3 text-[1.55rem] font-semibold text-foreground sm:text-[1.85rem]">
            {hasActiveSearch
              ? t("dashboard.searchResultsTitle")
              : t("dashboard.marketBoardTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {hasActiveSearch
              ? t("dashboard.searchResultsDescription")
              : t("dashboard.marketBoardDescription")}
          </p>
        </div>
        <p className="app-chip border-primary/10 bg-primary/10 text-primary dark:border-primary/20">
          <TrendingUp className="h-4 w-4" />
          {hasActiveSearch
            ? t("dashboard.searchResultsSummary", {
                count: filteredStocks.length,
                query: searchQuery.trim(),
              })
            : t("dashboard.marketSummary", {
                count: filteredStocks.length,
                average: formatPercent(marketTrend.averageChange),
              })}
        </p>
      </div>

      <StocksTable
        stocks={filteredStocks}
        watchlistSymbols={watchlistSymbols}
        onToggleWatchlist={toggleStock}
      />
    </section>
  );

  return (
    <div>
      <Header
        title={t("dashboard.title")}
        subtitle={t("dashboard.subtitle")}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchSuggestions={searchSuggestions}
        onSuggestionSelect={openStockFromSearch}
        actions={
          <button
            type="button"
            onClick={() => loadStocks()}
            className="app-button-secondary h-11 w-full gap-2 px-4 sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{t("common.refresh")}</span>
          </button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <div className="app-panel rounded-[1.55rem] border-rose-200/80 bg-rose-50/80 p-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
          <h2 className="text-base font-semibold">{t("dashboard.errorTitle")}</h2>
          <p className="mt-2 text-sm leading-6">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {marketBoardSection}

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)]">
            <LeadBoardCard
              copy={copy.dashboard}
              title={copy.dashboard.leadTitle}
              description={copy.dashboard.leadDescription}
              marketTrend={marketTrend.label}
              averageMove={marketTrend.description}
              topGainer={topGainer}
              mostActive={mostActive}
              watchlistCount={watchlist.length}
            />

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
              {supportCards.map((card) => (
                <SupportCard key={card.label} {...card} />
              ))}
            </div>
          </div>

          <div className="grid gap-5 2xl:grid-cols-[1.1fr_0.9fr]">
            <PortfolioPanel
              copy={copy.dashboard}
              summary={portfolioSummary}
              primarySymbol={topGainer?.symbol || mostActive?.symbol}
            />
            <AlertsPanel
              copy={copy.dashboard}
              stockCopy={copy.stockDetail}
              summary={alertSummary}
              onRemoveAlert={removeAlert}
              fallbackSymbol={mostActive?.symbol || topGainer?.symbol}
            />
          </div>

          <div className="grid gap-5 2xl:grid-cols-[1.05fr_0.95fr]">
            <SectorPanel copy={copy.dashboard} sectors={sectorSnapshots} />
            <DividendPanel copy={copy.dashboard} dividends={dividendCalendar} />
          </div>
        </div>
      )}
    </div>
  );
}
