import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Building2,
  CandlestickChart,
  RefreshCw,
  Star,
  TrendingUp,
} from "lucide-react";
import Header from "../src/components/Header";
import StocksTable from "../src/components/StocksTable";
import { fetchStockList } from "../services/api";
import { formatPercent, getMarketTrend } from "../src/lib/market";
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

function LeadBoardCard({ title, description, marketTrend, averageMove, topGainer, mostActive, watchlistCount }) {
  return (
    <section className="app-panel surface-noise rounded-[2.4rem] p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Market breadth</p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold text-foreground sm:text-[2.4rem]">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
        <div className="rounded-[1.65rem] border border-primary/15 bg-primary/10 px-5 py-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
            Trend
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {marketTrend}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{averageMove}</p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        <article className="app-panel-soft p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Top gainer
          </p>
          <p className="mt-3 text-xl font-semibold text-foreground">
            {topGainer?.symbol || "N/A"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {topGainer?.name || "Waiting for a live move"}
          </p>
          <p className="mt-4 inline-flex rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
            {topGainer ? formatPercent(topGainer.changePercent) : "+0.00%"}
          </p>
        </article>

        <article className="app-panel-soft p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Most active
          </p>
          <p className="mt-3 text-xl font-semibold text-foreground">
            {mostActive?.symbol || "N/A"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {mostActive?.name || "Volume signal loading"}
          </p>
          <p className="mt-4 text-sm font-semibold text-foreground">
            {mostActive ? `${mostActive.volume.toLocaleString("en-NG")} shares` : "No volume yet"}
          </p>
        </article>

        <article className="app-panel-soft p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Watchlist focus
          </p>
          <p className="mt-3 text-xl font-semibold text-foreground">
            {watchlistCount}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Saved names ready for quicker follow-up.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground">
            <Star className="h-4 w-4" />
            Watchlist ready
          </div>
        </article>
      </div>
    </section>
  );
}

function SupportCard({ icon: Icon, label, value, detail, tone }) {
  return (
    <article className="app-panel-soft rounded-[1.8rem] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-4 text-[2.2rem] font-semibold leading-none text-foreground">
            {value}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
        </div>
        <span className={`flex h-12 w-12 items-center justify-center rounded-[1.2rem] ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </article>
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
      <div className="app-panel h-[420px] animate-pulse" />
    </div>
  );
}

function EmptyBoardState({ title, description }) {
  return (
    <div className="app-panel flex min-h-[340px] flex-col items-center justify-center p-8 text-center">
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

  const language = usePreferencesStore((state) => state.language);
  const t = useCallback(
    (path, vars) => translate(language, path, vars),
    [language],
  );

  const watchlist = useWatchlistStore((state) =>
    Array.isArray(state.watchlist) ? state.watchlist : [],
  );
  const toggleStock = useWatchlistStore((state) => state.toggleStock);

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
        label: "Saved names",
        value: watchlist.length,
        detail: "Stocks already pinned to your personal watchlist.",
        icon: Star,
        tone: "bg-accent text-accent-foreground",
      },
    ];
  }, [stocks, t, watchlist.length]);

  const watchlistSymbols = useMemo(
    () => new Set(watchlist.map((stock) => stock.symbol)),
    [watchlist],
  );

  return (
    <div>
      <Header
        title={t("dashboard.title")}
        subtitle={t("dashboard.subtitle")}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={
          <button
            type="button"
            onClick={() => loadStocks()}
            className="app-button-secondary h-[58px] gap-2 px-4"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{t("common.refresh")}</span>
          </button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <div className="app-panel rounded-[2rem] border-rose-200/80 bg-rose-50/80 p-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
          <h2 className="text-lg font-semibold">{t("dashboard.errorTitle")}</h2>
          <p className="mt-2 text-sm leading-6">{error}</p>
        </div>
      ) : (
        <div className="space-y-7">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)]">
            <LeadBoardCard
              title="Read today's NGX movement from one calm command surface."
              description="A premium overview of breadth, leadership, and watchlist readiness before you dive into the full market board."
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

          {isBoardPreparing ? (
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
                  <p className="section-kicker">Market board</p>
                  <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-[2.1rem]">
                    {t("dashboard.marketBoardTitle")}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    {t("dashboard.marketBoardDescription")}
                  </p>
                </div>
                <p className="app-chip border-primary/10 bg-primary/10 text-primary dark:border-primary/20">
                  <TrendingUp className="h-4 w-4" />
                  {t("dashboard.marketSummary", {
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
          )}
        </div>
      )}
    </div>
  );
}
