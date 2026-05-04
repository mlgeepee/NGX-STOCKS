import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import Header from "../src/components/Header";
import StocksTable from "../src/components/StocksTable";
import { getAppCopy } from "@/content/appCopy";
import { enrichStock } from "../services/api";
import { useWatchlistStore } from "../store/useWatchlistStore";
import { usePreferencesStore } from "../store/usePreferencesStore";
import { translate } from "../src/lib/i18n";

export default function Watchlist() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const watchlist = useWatchlistStore((state) => state.watchlist);
  const removeStock = useWatchlistStore((state) => state.removeStock);
  const language = usePreferencesStore((state) => state.language);
  const t = (path, vars) => translate(language, path, vars);
  const copy = getAppCopy(language);

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
  const hasActiveSearch = Boolean(searchQuery.trim());
  const searchSuggestions = useMemo(
    () => filteredWatchlist.slice(0, 5),
    [filteredWatchlist],
  );

  return (
    <div>
      <Header
        title={t("watchlist.title")}
        subtitle={t("watchlist.subtitle")}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchSuggestions={searchSuggestions}
        onSuggestionSelect={(stock) =>
          navigate(`/dashboard/stocks/${encodeURIComponent(stock.symbol)}`)
        }
        actions={
          <div className="app-chip hidden h-11 rounded-[1.1rem] px-4 sm:inline-flex">
            <Star className="h-4 w-4 text-accent-foreground" />
            {t("watchlist.savedCount", { count: savedStocks.length })}
          </div>
        }
      />

      {!savedStocks.length ? (
        <div className="app-panel rounded-[1.7rem] border-dashed p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-accent text-accent-foreground">
            <Star className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-[1.55rem] font-semibold text-foreground sm:text-[1.9rem]">
            {t("watchlist.emptyTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-6 text-muted-foreground sm:text-[15px]">
            {t("watchlist.emptyDescription")}
          </p>
          <Link
            to="/dashboard"
            className="app-button-primary mt-7 gap-2 px-5"
          >
            {t("watchlist.browseDashboard")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : !filteredWatchlist.length ? (
        <div className="app-panel rounded-[1.7rem] p-8 text-center sm:p-10">
          <p className="text-lg font-semibold text-foreground">
            {t("watchlist.noSearchTitle")}
          </p>
          <p className="mt-3 text-[14px] leading-6 text-muted-foreground sm:text-[15px]">
            {t("watchlist.noSearchDescription")}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <StocksTable
            stocks={filteredWatchlist}
            watchlistSymbols={new Set(savedStocks.map((stock) => stock.symbol))}
            actionType="remove"
            onRemove={removeStock}
          />

          {!hasActiveSearch ? (
            <section className="app-panel-soft rounded-[1.45rem] p-5 sm:p-6">
              <p className="section-kicker">{copy.watchlist.shortlistKicker}</p>
              <h2 className="mt-3 text-[1.55rem] font-semibold text-foreground sm:text-[1.85rem]">
                {t("watchlist.savedNamesTitle")}
              </h2>
              <p className="mt-3 max-w-2xl text-[14px] leading-6 text-muted-foreground sm:text-[15px]">
                {t("watchlist.savedNamesDescription")}
              </p>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
