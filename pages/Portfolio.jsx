import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  Building2,
  Download,
  RefreshCw,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import Header from "../src/components/Header";
import StockLogo from "../src/components/StockLogo";
import { fetchStockList } from "../services/api";
import { buildExportFileName, downloadCsvFile } from "../src/lib/export";
import {
  buildStocksMap,
  calculatePortfolioSummary,
  evaluateAlerts,
} from "../src/lib/insights";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "../src/lib/market";
import { useAlertsStore } from "../store/useAlertsStore";
import { usePortfolioStore } from "../store/usePortfolioStore";
import { usePreferencesStore } from "../store/usePreferencesStore";
import { useWatchlistStore } from "../store/useWatchlistStore";

const PORTFOLIO_COPY = {
  en: {
    title: "Portfolio command center",
    subtitle:
      "Track every saved NGX holding, review sector weight, and export your book, alerts, and watchlist from one page.",
    searchPlaceholder: "Search holdings by company, ticker, or sector",
    refresh: "Refresh prices",
    summaryKicker: "Portfolio pulse",
    totalValue: "Market value",
    totalCost: "Invested capital",
    totalPnL: "Unrealized P/L",
    dayMove: "Day move",
    holdingsKicker: "Saved positions",
    holdingsTitle: "Every holding, cost basis, and live price in one place.",
    holdingsDescription:
      "Use this view to see what is carrying your portfolio and where current price sits against your average entry.",
    holdingsCountLabel: "Tracked holdings",
    noMatchesTitle: "No holdings matched your search",
    noMatchesDescription: "Try a company name, ticker, or sector instead.",
    emptyTitle: "No holdings saved yet",
    emptyDescription:
      "Open any stock page, save your shares and average cost, then come back here to track value, P/L, and sector weight.",
    emptyCta: "Open the market board",
    sharesLabel: "Shares",
    averageCostLabel: "Average cost",
    currentPriceLabel: "Current price",
    costValueLabel: "Cost value",
    marketValueLabel: "Market value",
    allocationTitle: "Sector allocation",
    allocationDescription:
      "See where your current book is concentrated before you add another position.",
    alertTitle: "Alert pressure",
    alertDescription:
      "These are the closest or already-triggered price levels tied to your saved portfolio flow.",
    alertEmpty: "No active alerts yet.",
    alertTarget: "Target",
    alertCurrent: "Current",
    exportTitle: "Export flows",
    exportDescription:
      "Download portfolio holdings, alert records, or your watchlist as CSV whenever you want to review or share them.",
    exportHoldings: "Export holdings CSV",
    exportAlerts: "Export alerts CSV",
    exportWatchlist: "Export watchlist CSV",
    watchlistTitle: "Watchlist nearby",
    watchlistDescription:
      "Saved names you can promote into the portfolio when conviction gets stronger.",
    watchlistEmpty: "No watchlist names saved yet.",
    errorTitle: "Portfolio prices unavailable",
    holdingsUnit: "holdings",
    alertTriggeredLabel: "Triggered",
    alertActiveLabel: "Active",
    lastUpdated: "Last updated",
  },
  pid: {
    title: "Portfolio control room",
    subtitle:
      "Track all your saved NGX holdings, check sector weight, and export your book, alerts, and watchlist from one page.",
    searchPlaceholder: "Search holding by company, ticker, or sector",
    refresh: "Refresh price",
    summaryKicker: "Portfolio pulse",
    totalValue: "Market value",
    totalCost: "Money wey you put",
    totalPnL: "Unrealized P/L",
    dayMove: "Day move",
    holdingsKicker: "Saved positions",
    holdingsTitle: "Every holding, cost basis, and live price dey one place.",
    holdingsDescription:
      "Use this page see wetin dey carry your portfolio and where current price dey versus your average entry.",
    holdingsCountLabel: "Holdings wey dey track",
    noMatchesTitle: "No holding match wetin you search",
    noMatchesDescription: "Try company name, ticker, or sector instead.",
    emptyTitle: "You never save any holding yet",
    emptyDescription:
      "Open any stock page, save your shares and average cost, then come back here make the app track value, P/L, and sector weight.",
    emptyCta: "Open market board",
    sharesLabel: "Shares",
    averageCostLabel: "Average cost",
    currentPriceLabel: "Current price",
    costValueLabel: "Cost value",
    marketValueLabel: "Market value",
    allocationTitle: "Sector allocation",
    allocationDescription:
      "See where your current book full pass before you add another position.",
    alertTitle: "Alert pressure",
    alertDescription:
      "Na the nearest or already-triggered price levels wey tie to your saved portfolio flow be this.",
    alertEmpty: "No active alert yet.",
    alertTarget: "Target",
    alertCurrent: "Current",
    exportTitle: "Export flow",
    exportDescription:
      "Download portfolio holdings, alert records, or your watchlist as CSV anytime wey you wan review or share am.",
    exportHoldings: "Export holdings CSV",
    exportAlerts: "Export alerts CSV",
    exportWatchlist: "Export watchlist CSV",
    watchlistTitle: "Watchlist dey nearby",
    watchlistDescription:
      "Saved names wey you fit move enter portfolio when conviction don strong.",
    watchlistEmpty: "No watchlist name dey yet.",
    errorTitle: "Portfolio price no show now",
    holdingsUnit: "holdings",
    alertTriggeredLabel: "Don trigger",
    alertActiveLabel: "Still active",
    lastUpdated: "Last time we refresh am",
  },
};

function SummaryCard({ label, value, detail, tone = "default", icon: Icon }) {
  const toneClass =
    tone === "positive"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
      : tone === "negative"
        ? "bg-rose-500/10 text-rose-600 dark:text-rose-300"
        : "bg-primary/10 text-primary";

  return (
    <article className="app-panel-soft rounded-[1.45rem] p-5 sm:min-h-[12rem] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-4 break-words text-[1.95rem] font-semibold leading-tight text-foreground sm:text-[2.15rem]">
            {value}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
        </div>
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] ${toneClass}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </article>
  );
}

function SectionHeading({ kicker, title, description }) {
  return (
    <div>
      <p className="section-kicker">{kicker}</p>
      <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-[2.05rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function Portfolio() {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const language = usePreferencesStore((state) => state.language);
  const copy = PORTFOLIO_COPY[language] || PORTFOLIO_COPY.en;
  const positions = usePortfolioStore((state) =>
    Array.isArray(state.positions) ? state.positions : [],
  );
  const alerts = useAlertsStore((state) =>
    Array.isArray(state.alerts) ? state.alerts : [],
  );
  const watchlist = useWatchlistStore((state) =>
    Array.isArray(state.watchlist) ? state.watchlist : [],
  );

  const loadStocks = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const nextStocks = await fetchStockList(signal);
      setStocks(nextStocks);
      setLastUpdated(new Date());
    } catch (fetchError) {
      if (fetchError?.name === "AbortError") {
        return;
      }

      setError(fetchError?.message || "Unable to load portfolio prices.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadStocks(controller.signal);
    return () => controller.abort();
  }, [loadStocks]);

  const stocksMap = useMemo(() => buildStocksMap(stocks), [stocks]);
  const portfolioSummary = useMemo(
    () => calculatePortfolioSummary(positions, stocksMap),
    [positions, stocksMap],
  );
  const alertSummary = useMemo(
    () => evaluateAlerts(alerts, stocksMap),
    [alerts, stocksMap],
  );
  const watchlistSnapshot = useMemo(
    () =>
      watchlist.map((item) => {
        const liveStock = stocksMap.get(item.symbol) || {};
        return {
          ...item,
          ...liveStock,
          currentPrice: liveStock.currentPrice ?? liveStock.price ?? item.price ?? 0,
          changePercent:
            liveStock.changePercent ?? item.changePercent ?? 0,
          volume: liveStock.volume ?? item.volume ?? 0,
        };
      }),
    [watchlist, stocksMap],
  );

  const filteredHoldings = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return portfolioSummary.holdings;
    }

    return portfolioSummary.holdings.filter((holding) =>
      [holding.name, holding.symbol, holding.sector]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [portfolioSummary.holdings, searchQuery]);

  const handleExportHoldings = () => {
    downloadCsvFile(
      buildExportFileName("ngx-portfolio-holdings"),
      portfolioSummary.holdings.map((holding) => ({
        symbol: holding.symbol,
        company: holding.name,
        sector: holding.sector,
        shares: holding.shares,
        averageCost: holding.averageCost.toFixed(2),
        currentPrice: Number(holding.currentPrice || 0).toFixed(2),
        costValue: holding.costValue.toFixed(2),
        marketValue: holding.marketValue.toFixed(2),
        unrealizedPnL: holding.unrealizedPnL.toFixed(2),
        unrealizedPnLPercent: holding.unrealizedPnLPercent.toFixed(2),
      })),
    );
  };

  const handleExportAlerts = () => {
    downloadCsvFile(
      buildExportFileName("ngx-alerts"),
      alertSummary.items.map((alert) => ({
        symbol: alert.symbol,
        company: alert.name,
        direction: alert.direction,
        targetPrice: Number(alert.targetPrice || 0).toFixed(2),
        currentPrice: Number(alert.currentPrice || 0).toFixed(2),
        triggered: alert.triggered ? "Yes" : "No",
        createdAt: alert.createdAt || "",
      })),
    );
  };

  const handleExportWatchlist = () => {
    downloadCsvFile(
      buildExportFileName("ngx-watchlist"),
      watchlistSnapshot.map((stock) => ({
        symbol: stock.symbol,
        company: stock.name,
        sector: stock.sector,
        currentPrice: Number(stock.currentPrice || 0).toFixed(2),
        changePercent: Number(stock.changePercent || 0).toFixed(2),
        volume: Number(stock.volume || 0),
      })),
    );
  };

  const lastUpdatedLabel = lastUpdated
    ? new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(lastUpdated)
    : "--";

  return (
    <div>
      <Header
        title={copy.title}
        subtitle={copy.subtitle}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={copy.searchPlaceholder}
        actions={
          <button
            type="button"
            onClick={() => loadStocks()}
            className="app-button-secondary h-12 w-full gap-2 px-4 sm:h-[58px] sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{copy.refresh}</span>
          </button>
        }
      />

      {loading ? (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="app-panel-soft h-36 animate-pulse" />
            ))}
          </div>
          <div className="grid gap-5 2xl:grid-cols-[1.2fr_0.8fr]">
            <div className="app-panel h-[36rem] animate-pulse" />
            <div className="space-y-5">
              <div className="app-panel h-[15rem] animate-pulse" />
              <div className="app-panel h-[15rem] animate-pulse" />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="app-panel rounded-[1.6rem] border-rose-200/80 bg-rose-50/80 p-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
          <h2 className="text-lg font-semibold">{copy.errorTitle}</h2>
          <p className="mt-2 text-sm leading-6">{error}</p>
        </div>
      ) : (
        <div className="space-y-7">
          <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                kicker={copy.summaryKicker}
                title={copy.title}
                description={copy.subtitle}
              />
              <div className="app-chip border-primary/10 bg-primary/10 text-primary dark:border-primary/20">
                <ShieldCheck className="h-4 w-4" />
                {copy.lastUpdated}: {lastUpdatedLabel}
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <SummaryCard
                label={copy.totalValue}
                value={formatCompactCurrency(portfolioSummary.totalValue)}
                detail={formatCurrency(portfolioSummary.totalValue)}
                icon={BriefcaseBusiness}
              />
              <SummaryCard
                label={copy.totalCost}
                value={formatCompactCurrency(portfolioSummary.totalCost)}
                detail={formatCurrency(portfolioSummary.totalCost)}
                icon={Building2}
              />
              <SummaryCard
                label={copy.totalPnL}
                value={formatCompactCurrency(portfolioSummary.totalPnL)}
                detail={formatPercent(portfolioSummary.totalPnLPercent)}
                tone={
                  portfolioSummary.totalPnL >= 0 ? "positive" : "negative"
                }
                icon={TrendingUp}
              />
              <SummaryCard
                label={copy.dayMove}
                value={formatCompactCurrency(portfolioSummary.dayMoveValue)}
                detail={formatCurrency(portfolioSummary.dayMoveValue)}
                tone={
                  portfolioSummary.dayMoveValue >= 0 ? "positive" : "negative"
                }
                icon={BellRing}
              />
            </div>
          </section>

          <div className="grid gap-5 2xl:grid-cols-[1.15fr_0.85fr]">
            <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeading
                  kicker={copy.holdingsKicker}
                  title={copy.holdingsTitle}
                  description={copy.holdingsDescription}
                />
                <span className="app-chip">
                  <BriefcaseBusiness className="h-4 w-4" />
                  {copy.holdingsCountLabel}: {portfolioSummary.positionsCount}
                </span>
              </div>

              {!portfolioSummary.holdings.length ? (
                <div className="mt-6 rounded-[1.35rem] border border-dashed border-border/80 bg-white/50 p-6 text-center dark:bg-white/5">
                  <h3 className="text-xl font-semibold text-foreground">
                    {copy.emptyTitle}
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                    {copy.emptyDescription}
                  </p>
                  <Link
                    to="/dashboard"
                    className="app-button-primary mt-6 gap-2 px-5"
                  >
                    {copy.emptyCta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : !filteredHoldings.length ? (
                <div className="mt-6 rounded-[1.35rem] border border-border/70 bg-white/55 p-6 text-center dark:bg-white/5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {copy.noMatchesTitle}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {copy.noMatchesDescription}
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {filteredHoldings.map((holding) => (
                    <Link
                      key={holding.symbol}
                      to={`/dashboard/stocks/${encodeURIComponent(holding.symbol)}`}
                      className="block rounded-[1.35rem] border border-border/70 bg-white/58 p-4 sm:p-5 transition hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white/78 dark:bg-white/5 dark:hover:bg-white/[0.07]"
                    >
                      <div className="flex flex-col gap-5">
                        <div className="flex min-w-0 items-start gap-4">
                          <StockLogo
                            symbol={holding.symbol}
                            name={holding.name}
                            logo={holding.logo}
                            size="xl"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-base font-semibold leading-7 text-foreground sm:text-lg">
                                {holding.name}
                              </p>
                              <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-foreground">
                                {holding.symbol}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {holding.sector}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                          <div className="rounded-[1.05rem] border border-border/60 bg-white/60 px-3 py-3 dark:bg-white/5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              {copy.sharesLabel}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                              {holding.shares}
                            </p>
                          </div>
                          <div className="rounded-[1.05rem] border border-border/60 bg-white/60 px-3 py-3 dark:bg-white/5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              {copy.averageCostLabel}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                              {formatCurrency(holding.averageCost)}
                            </p>
                          </div>
                          <div className="rounded-[1.05rem] border border-border/60 bg-white/60 px-3 py-3 dark:bg-white/5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              {copy.currentPriceLabel}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                              {formatCurrency(holding.currentPrice)}
                            </p>
                          </div>
                          <div className="rounded-[1.05rem] border border-border/60 bg-white/60 px-3 py-3 dark:bg-white/5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              {copy.costValueLabel}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                              {formatCurrency(holding.costValue)}
                            </p>
                          </div>
                          <div className="rounded-[1.05rem] border border-border/60 bg-white/60 px-3 py-3 dark:bg-white/5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              {copy.marketValueLabel}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                              {formatCurrency(holding.marketValue)}
                            </p>
                          </div>
                          <div className="rounded-[1.05rem] border border-border/60 bg-white/60 px-3 py-3 dark:bg-white/5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              {copy.totalPnL}
                            </p>
                            <p
                              className={`mt-2 text-sm font-semibold ${
                                holding.unrealizedPnL >= 0
                                  ? "text-emerald-600 dark:text-emerald-300"
                                  : "text-rose-600 dark:text-rose-300"
                              }`}
                            >
                              {formatCurrency(holding.unrealizedPnL)}
                            </p>
                            <p
                              className={`mt-1 text-xs font-semibold ${
                                holding.unrealizedPnL >= 0
                                  ? "text-emerald-600/80 dark:text-emerald-300/80"
                                  : "text-rose-600/80 dark:text-rose-300/80"
                              }`}
                            >
                              {formatPercent(holding.unrealizedPnLPercent)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <div className="space-y-5">
              <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
                <SectionHeading
                  kicker={copy.allocationTitle}
                  title={copy.allocationTitle}
                  description={copy.allocationDescription}
                />

                <div className="mt-6 space-y-3.5">
                  {portfolioSummary.sectorAllocation.length ? (
                    portfolioSummary.sectorAllocation.map((item) => (
                      <div
                        key={item.sector}
                        className="rounded-[1.2rem] border border-border/65 bg-white/55 p-4 dark:bg-white/5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-foreground">
                            {item.sector}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.weight.toFixed(0)}%
                          </p>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-secondary">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${Math.max(item.weight, 8)}%` }}
                          />
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {formatCurrency(item.marketValue)} • {item.count}{" "}
                          {copy.holdingsUnit}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.2rem] border border-dashed border-border/80 bg-white/50 px-4 py-4 text-sm leading-7 text-muted-foreground dark:bg-white/5">
                      {copy.emptyDescription}
                    </div>
                  )}
                </div>
              </section>

              <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
                <SectionHeading
                  kicker={copy.alertTitle}
                  title={copy.alertTitle}
                  description={copy.alertDescription}
                />

                <div className="mt-6 space-y-3.5">
                  {alertSummary.items.length ? (
                    alertSummary.items.slice(0, 4).map((alert) => (
                      <div
                        key={alert.id}
                        className="rounded-[1.2rem] border border-border/65 bg-white/55 p-4 dark:bg-white/5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-foreground">
                              {alert.symbol}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                              {alert.direction === "above"
                                ? language === "pid"
                                  ? "When price pass above"
                                  : "When price is above"
                                : language === "pid"
                                  ? "When price drop below"
                                  : "When price is below"}
                            </p>
                          </div>
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
                        <div className="mt-3 flex flex-wrap gap-3 text-sm">
                          <span className="text-foreground">
                            {copy.alertTarget}:{" "}
                            <strong>{formatCurrency(alert.targetPrice)}</strong>
                          </span>
                          <span className="text-muted-foreground">
                            {copy.alertCurrent}: {formatCurrency(alert.currentPrice)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.2rem] border border-dashed border-border/80 bg-white/50 px-4 py-4 text-sm leading-7 text-muted-foreground dark:bg-white/5">
                      {copy.alertEmpty}
                    </div>
                  )}
                </div>
              </section>

              <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
                <SectionHeading
                  kicker={copy.exportTitle}
                  title={copy.exportTitle}
                  description={copy.exportDescription}
                />

                <div className="mt-6 grid gap-3">
                  <button
                    type="button"
                    onClick={handleExportHoldings}
                    disabled={!portfolioSummary.holdings.length}
                    className="app-button-secondary h-12 justify-between gap-3 rounded-[1.1rem] px-4 disabled:translate-y-0 disabled:opacity-55"
                  >
                    <span>{copy.exportHoldings}</span>
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleExportAlerts}
                    disabled={!alertSummary.items.length}
                    className="app-button-secondary h-12 justify-between gap-3 rounded-[1.1rem] px-4 disabled:translate-y-0 disabled:opacity-55"
                  >
                    <span>{copy.exportAlerts}</span>
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleExportWatchlist}
                    disabled={!watchlistSnapshot.length}
                    className="app-button-secondary h-12 justify-between gap-3 rounded-[1.1rem] px-4 disabled:translate-y-0 disabled:opacity-55"
                  >
                    <span>{copy.exportWatchlist}</span>
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </section>

              <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
                <SectionHeading
                  kicker={copy.watchlistTitle}
                  title={copy.watchlistTitle}
                  description={copy.watchlistDescription}
                />

                <div className="mt-6 space-y-3.5">
                  {watchlistSnapshot.length ? (
                    watchlistSnapshot.slice(0, 4).map((stock) => (
                      <Link
                        key={stock.symbol}
                        to={`/dashboard/stocks/${encodeURIComponent(stock.symbol)}`}
                        className="flex items-center gap-3 rounded-[1.2rem] border border-border/65 bg-white/55 p-4 transition hover:border-primary/20 hover:bg-white/78 dark:bg-white/5 dark:hover:bg-white/[0.07]"
                      >
                        <StockLogo
                          symbol={stock.symbol}
                          name={stock.name}
                          logo={stock.logo}
                          size="md"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              {stock.symbol}
                            </p>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                Number(stock.changePercent) >= 0
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-300"
                              }`}
                            >
                              {formatPercent(stock.changePercent)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {stock.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">
                            {formatCurrency(stock.currentPrice)}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatCompactNumber(stock.volume)}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="rounded-[1.2rem] border border-dashed border-border/80 bg-white/50 px-4 py-4 text-sm leading-7 text-muted-foreground dark:bg-white/5">
                      {copy.watchlistEmpty}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
