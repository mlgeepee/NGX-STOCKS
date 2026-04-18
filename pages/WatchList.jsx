import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import Header from "../src/components/Header";
import StocksTable from "../src/components/StocksTable";
import { enrichStock } from "../services/api";
import { useWatchlistStore } from "../store/useWatchlistStore";
import { usePreferencesStore } from "../store/usePreferencesStore";
import { translate } from "../src/lib/i18n";

export default function Watchlist() {
  const [searchQuery, setSearchQuery] = useState("");
  const watchlist = useWatchlistStore((state) => state.watchlist);
  const removeStock = useWatchlistStore((state) => state.removeStock);
  const language = usePreferencesStore((state) => state.language);
  const t = (path, vars) => translate(language, path, vars);

  const savedStocks = useMemo(
    () => watchlist.map((stock) => enrichStock(stock)),
    [watchlist],
  );

  const filteredWatchlist = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return savedStocks;

    return savedStocks.filter((stock) => {
      return (
        stock.symbol.toLowerCase().includes(normalizedQuery) ||
        stock.name.toLowerCase().includes(normalizedQuery) ||
        stock.sector.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [savedStocks, searchQuery]);

  return (
    <div>
      <Header
        title={t("watchlist.title")}
        subtitle={t("watchlist.subtitle")}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={
          <div className="app-control hidden rounded-[1.35rem] px-4 py-3 text-sm font-semibold text-muted-foreground shadow-sm sm:block">
            {t("watchlist.savedCount", { count: savedStocks.length })}
          </div>
        }
      />

      {!savedStocks.length ? (
        <div className="app-panel border-dashed p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-amber-500/10 text-amber-500 dark:text-amber-300">
            <Star className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-foreground">
            {t("watchlist.emptyTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            {t("watchlist.emptyDescription")}
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            {t("watchlist.browseDashboard")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : !filteredWatchlist.length ? (
        <div className="app-panel p-12 text-center">
          <p className="text-lg font-semibold text-foreground">
            {t("watchlist.noSearchTitle")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("watchlist.noSearchDescription")}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {t("watchlist.savedNamesTitle")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("watchlist.savedNamesDescription")}
            </p>
          </div>

          <StocksTable
            stocks={filteredWatchlist}
            watchlistSymbols={new Set(savedStocks.map((stock) => stock.symbol))}
            actionType="remove"
            onRemove={removeStock}
          />
        </div>
      )}
    </div>
  );
}
