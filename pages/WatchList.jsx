import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

  return (
    <div>
      <Header
        title={t("watchlist.title")}
        subtitle={t("watchlist.subtitle")}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={
          <div className="app-chip hidden h-[58px] rounded-[1.55rem] px-4 sm:inline-flex">
            <Star className="h-4 w-4 text-accent-foreground" />
            {t("watchlist.savedCount", { count: savedStocks.length })}
          </div>
        }
      />

      {!savedStocks.length ? (
        <div className="app-panel rounded-[2.2rem] border-dashed p-10 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-accent text-accent-foreground">
            <Star className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-foreground sm:text-3xl">
            {t("watchlist.emptyTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
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
        <div className="app-panel rounded-[2.2rem] p-10 text-center sm:p-12">
          <p className="text-xl font-semibold text-foreground">
            {t("watchlist.noSearchTitle")}
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
            {t("watchlist.noSearchDescription")}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <section className="app-panel-soft rounded-[2rem] p-6 sm:p-7">
            <p className="section-kicker">{copy.watchlist.shortlistKicker}</p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-[2rem]">
              {t("watchlist.savedNamesTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {t("watchlist.savedNamesDescription")}
            </p>
          </section>

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
