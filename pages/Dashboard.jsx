import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  Building2,
  RefreshCw,
} from "lucide-react";
import Header from "../src/components/Header";
import StocksTable from "../src/components/StocksTable";
import { fetchStockList } from "../services/api";
import { formatPercent, getMarketTrend } from "../src/lib/market";
import { useWatchlistStore } from "../store/useWatchlistStore";

const overviewCardStyles = [
  {
    label: "Total stocks",
    accent:
      "from-primary/30 to-accent text-accent-foreground",
    ring: "ring-primary/20",
    icon: Building2,
  },
  {
    label: "Gainers",
    accent:
      "from-emerald-500/15 to-emerald-400/10 text-emerald-600 dark:text-emerald-300",
    ring: "ring-emerald-500/20",
    icon: ArrowUpCircle,
  },
  {
    label: "Losers",
    accent:
      "from-rose-500/15 to-rose-400/10 text-rose-600 dark:text-rose-300",
    ring: "ring-rose-500/20",
    icon: ArrowDownCircle,
  },
  {
    label: "Market trend",
    accent:
      "from-primary/30 to-accent text-accent-foreground",
    ring: "ring-primary/20",
    icon: Activity,
  },
];

function OverviewCard({ icon: Icon, label, value, detail, accent, ring }) {
  return (
    <div className="app-panel-soft p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-[1.15rem] bg-gradient-to-br ${accent} ring-1 ${ring}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-[2rem] font-semibold leading-none text-foreground">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="app-panel-soft h-40 animate-pulse"
          />
        ))}
      </div>
      <div className="app-panel h-[420px] animate-pulse" />
    </div>
  );
}

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const watchlist = useWatchlistStore((state) => state.watchlist);
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

  const overviewMetrics = useMemo(() => {
    const gainers = stocks.filter((stock) => stock.changePercent > 0).length;
    const losers = stocks.filter((stock) => stock.changePercent < 0).length;

    return [
      {
        ...overviewCardStyles[0],
        value: stocks.length || "0",
        detail: "Tracked NGX equities in this view",
      },
      {
        ...overviewCardStyles[1],
        value: gainers,
        detail: "Names closing in positive territory",
      },
      {
        ...overviewCardStyles[2],
        value: losers,
        detail: "Names under pressure today",
      },
      {
        ...overviewCardStyles[3],
        value: marketTrend.label,
        detail: marketTrend.description,
      },
    ];
  }, [marketTrend.description, marketTrend.label, stocks]);

  const watchlistSymbols = useMemo(
    () => new Set(watchlist.map((stock) => stock.symbol)),
    [watchlist],
  );

  return (
    <div>
      <Header
        title="Financial Analytics Dashboard"
        subtitle="Track live NGX movers, scan sector momentum, and jump straight into price details from a single market workspace."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={
          <button
            type="button"
            onClick={() => loadStocks()}
            className="app-control inline-flex h-[52px] items-center gap-2 rounded-[1.35rem] px-4 py-3 text-sm font-semibold text-foreground shadow-sm hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white/85 dark:hover:bg-white/5"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
          <h2 className="text-lg font-semibold">Unable to load stocks</h2>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {overviewMetrics.map((metric) => (
              <OverviewCard key={metric.label} {...metric} />
            ))}
          </div>

          {!filteredStocks.length ? (
            <div className="app-panel p-12 text-center">
              <p className="text-lg font-semibold text-foreground">
                No stocks matched your search
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Try a company name, ticker, or sector instead.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    Market board
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Live pricing in Nigerian naira with watchlist shortcuts and
                    quick drill-down access.
                  </p>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {filteredStocks.length} symbols • {formatPercent(marketTrend.averageChange)} average move
                </p>
              </div>

              <StocksTable
                stocks={filteredStocks}
                watchlistSymbols={watchlistSymbols}
                onToggleWatchlist={toggleStock}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
