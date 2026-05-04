import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "../lib/market";
import { usePreferencesStore } from "../../store/usePreferencesStore";
import { translate } from "../lib/i18n";
import StockLogo from "./StockLogo";

function ChangeBadge({ value }) {
  const positive = Number(value) >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
        positive
          ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/20"
          : "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/20"
      }`}
    >
      {positive ? (
        <ArrowUpRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5" />
      )}
      {formatPercent(value)}
    </span>
  );
}

function ActionButton({
  actionType,
  actionLabel,
  saved,
  onClick,
}) {
  if (actionType === "remove") {
    return (
      <button
        type="button"
        aria-label={actionLabel}
        onClick={onClick}
        className="inline-flex h-10 w-10 items-center justify-center rounded-[1rem] border border-rose-200 bg-rose-50/90 text-rose-600 transition hover:-translate-y-0.5 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={actionLabel}
      onClick={onClick}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-[1rem] border transition hover:-translate-y-0.5 ${
        saved
          ? "border-amber-200 bg-amber-50 text-amber-500 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
          : "border-border/80 bg-white/80 text-muted-foreground hover:border-primary/20 hover:bg-secondary dark:bg-white/5"
      }`}
    >
      <Star className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}

export default function StocksTable({
  stocks,
  watchlistSymbols = new Set(),
  actionType = "watchlist",
  onToggleWatchlist,
  onRemove,
  pageSize = 10,
}) {
  const language = usePreferencesStore((state) => state.language);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const actionLabel = translate(
    language,
    actionType === "remove" ? "table.actionRemove" : "table.actionToggle",
  );
  const actionHeading = translate(
    language,
    actionType === "remove" ? "table.action" : "table.save",
  );
  const previousLabel = translate(language, "table.previous");
  const nextLabel = translate(language, "table.next");
  const stockSignature = useMemo(
    () => stocks.map((stock) => stock.symbol).join("|"),
    [stocks],
  );
  const totalPages = Math.max(1, Math.ceil(stocks.length / pageSize));
  const visibleStocks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return stocks.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, stocks]);
  const rangeStart = stocks.length ? (currentPage - 1) * pageSize + 1 : 0;
  const rangeEnd = Math.min(currentPage * pageSize, stocks.length);
  const rangeLabel = translate(language, "table.showingRange", {
    start: rangeStart,
    end: rangeEnd,
    total: stocks.length,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [stockSignature, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const navigateToStock = (stockSymbol) => {
    navigate(`/dashboard/stocks/${encodeURIComponent(stockSymbol)}`);
  };

  return (
    <div className="app-panel overflow-hidden p-1.5 sm:p-3">
      <div className="space-y-3 p-2 md:hidden">
        {visibleStocks.map((stock) => {
          const saved = watchlistSymbols.has(stock.symbol);

          return (
            <article
              key={stock.symbol}
              tabIndex={0}
              onClick={() => navigateToStock(stock.symbol)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigateToStock(stock.symbol);
                }
              }}
            className="app-panel-soft cursor-pointer rounded-[1.15rem] p-3 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <StockLogo
                    symbol={stock.symbol}
                    name={stock.name}
                    logo={stock.logo}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold leading-6 text-foreground">
                      {stock.name}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-accent px-2.5 py-1 font-medium tracking-[0.16em] text-accent-foreground">
                        {stock.symbol}
                      </span>
                      <span className="break-words">{stock.sector}</span>
                    </div>
                  </div>
                </div>

                <ActionButton
                  actionType={actionType}
                  actionLabel={actionLabel}
                  saved={saved}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (actionType === "remove") {
                      onRemove?.(stock.symbol);
                      return;
                    }

                    onToggleWatchlist?.(stock);
                  }}
                />
              </div>

              <div className="mt-3.5 grid gap-2.5 sm:grid-cols-3">
                <div className="rounded-[0.85rem] border border-border/60 bg-white/55 px-3 py-2.5 dark:bg-white/5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {translate(language, "table.price")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {formatCurrency(stock.price)}
                  </p>
                </div>

                <div className="rounded-[0.85rem] border border-border/60 bg-white/55 px-3 py-2.5 dark:bg-white/5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {translate(language, "table.change")}
                  </p>
                  <div className="mt-2">
                    <ChangeBadge value={stock.changePercent} />
                  </div>
                </div>

                <div className="rounded-[0.85rem] border border-border/60 bg-white/55 px-3 py-2.5 dark:bg-white/5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {translate(language, "table.volume")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {formatCompactNumber(stock.volume)}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs font-medium text-muted-foreground">
                {translate(language, "table.tapForDetails")}
              </p>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-separate border-spacing-y-2.5">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {translate(language, "table.company")}
              </th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {translate(language, "table.price")}
              </th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {translate(language, "table.change")}
              </th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {translate(language, "table.volume")}
              </th>
              <th className="w-24 px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {actionHeading}
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleStocks.map((stock) => {
              const saved = watchlistSymbols.has(stock.symbol);

              return (
                <tr
                  key={stock.symbol}
                  tabIndex={0}
                  onClick={() => navigateToStock(stock.symbol)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigateToStock(stock.symbol);
                    }
                  }}
                  className="group cursor-pointer transition focus:outline-none"
                >
                  <td className="rounded-l-[1rem] border border-r-0 border-border/70 bg-white/62 px-4 py-3.5 transition group-hover:bg-white/86 group-focus:bg-white/86 dark:bg-white/[0.03] dark:group-hover:bg-white/[0.06] dark:group-focus:bg-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <StockLogo
                        symbol={stock.symbol}
                        name={stock.name}
                        logo={stock.logo}
                        size="md"
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold leading-6 text-foreground">
                          {stock.name}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full bg-accent px-2.5 py-1 font-medium tracking-[0.16em] text-accent-foreground">
                            {stock.symbol}
                          </span>
                          <span>{stock.sector}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border-y border-border/70 bg-white/62 px-4 py-3.5 text-sm font-semibold text-foreground transition group-hover:bg-white/86 group-focus:bg-white/86 dark:bg-white/[0.03] dark:group-hover:bg-white/[0.06] dark:group-focus:bg-white/[0.06]">
                    {formatCurrency(stock.price)}
                  </td>
                  <td className="border-y border-border/70 bg-white/62 px-4 py-3.5 transition group-hover:bg-white/86 group-focus:bg-white/86 dark:bg-white/[0.03] dark:group-hover:bg-white/[0.06] dark:group-focus:bg-white/[0.06]">
                    <ChangeBadge value={stock.changePercent} />
                  </td>
                  <td className="border-y border-border/70 bg-white/62 px-4 py-3.5 text-sm text-muted-foreground transition group-hover:bg-white/86 group-focus:bg-white/86 dark:bg-white/[0.03] dark:group-hover:bg-white/[0.06] dark:group-focus:bg-white/[0.06]">
                    {formatCompactNumber(stock.volume)}
                  </td>
                  <td className="rounded-r-[1rem] border border-l-0 border-border/70 bg-white/62 px-4 py-3.5 text-right transition group-hover:bg-white/86 group-focus:bg-white/86 dark:bg-white/[0.03] dark:group-hover:bg-white/[0.06] dark:group-focus:bg-white/[0.06]">
                    <ActionButton
                      actionType={actionType}
                      actionLabel={actionLabel}
                      saved={saved}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (actionType === "remove") {
                          onRemove?.(stock.symbol);
                          return;
                        }

                        onToggleWatchlist?.(stock);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {stocks.length > pageSize ? (
        <div className="flex flex-col gap-3 border-t border-border/70 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            {rangeLabel}
          </p>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="app-button-secondary h-10 gap-2 px-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              {previousLabel}
            </button>
            <span className="app-chip min-w-[4.8rem] justify-center">
              {currentPage}/{totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="app-button-secondary h-10 gap-2 px-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {nextLabel}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
