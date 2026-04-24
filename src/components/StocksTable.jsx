import { ArrowDownRight, ArrowUpRight, Star, Trash2 } from "lucide-react";
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
        className="inline-flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-rose-200 bg-rose-50 text-rose-600 transition hover:-translate-y-0.5 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
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
      className={`inline-flex h-11 w-11 items-center justify-center rounded-[1.15rem] border transition hover:-translate-y-0.5 ${
        saved
          ? "border-amber-200 bg-amber-50 text-amber-500 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
          : "border-border/80 bg-white/80 text-muted-foreground hover:bg-secondary"
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
}) {
  const language = usePreferencesStore((state) => state.language);
  const navigate = useNavigate();

  const actionLabel = translate(
    language,
    actionType === "remove" ? "table.actionRemove" : "table.actionToggle",
  );
  const actionHeading = translate(
    language,
    actionType === "remove" ? "table.action" : "table.save",
  );

  const navigateToStock = (stockSymbol) => {
    navigate(`/dashboard/stocks/${encodeURIComponent(stockSymbol)}`);
  };

  return (
    <div className="app-panel overflow-hidden">
      <div className="space-y-4 p-4 md:hidden">
        {stocks.map((stock) => {
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
              className="app-panel-soft cursor-pointer p-4 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <StockLogo
                    symbol={stock.symbol}
                    name={stock.name}
                    logo={stock.logo}
                    size="lg"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {stock.name}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-accent px-2.5 py-1 font-medium tracking-[0.16em] text-accent-foreground">
                        {stock.symbol}
                      </span>
                      <span className="line-clamp-1">{stock.sector}</span>
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

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-[1.1rem] bg-secondary/70 px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {translate(language, "table.price")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {formatCurrency(stock.price)}
                  </p>
                </div>

                <div className="rounded-[1.1rem] bg-secondary/70 px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {translate(language, "table.change")}
                  </p>
                  <div className="mt-2">
                    <ChangeBadge value={stock.changePercent} />
                  </div>
                </div>

                <div className="rounded-[1.1rem] bg-secondary/70 px-3 py-3 col-span-2 sm:col-span-1">
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
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-secondary/80 text-left">
              <th className="px-7 py-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {translate(language, "table.company")}
              </th>
              <th className="px-7 py-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {translate(language, "table.price")}
              </th>
              <th className="px-7 py-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {translate(language, "table.change")}
              </th>
              <th className="px-7 py-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {translate(language, "table.volume")}
              </th>
              <th className="w-24 px-7 py-5 text-right text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {actionHeading}
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
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
                  className="group cursor-pointer transition hover:bg-accent/70 focus:bg-accent/70 focus:outline-none"
                >
                  <td className="border-t border-border/80 px-7 py-5">
                    <div className="flex items-center gap-4">
                      <StockLogo
                        symbol={stock.symbol}
                        name={stock.name}
                        logo={stock.logo}
                        size="lg"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
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
                  <td className="border-t border-border/80 px-7 py-5 text-sm font-semibold text-foreground">
                    {formatCurrency(stock.price)}
                  </td>
                  <td className="border-t border-border/80 px-7 py-5">
                    <ChangeBadge value={stock.changePercent} />
                  </td>
                  <td className="border-t border-border/80 px-7 py-5 text-sm text-muted-foreground">
                    {formatCompactNumber(stock.volume)}
                  </td>
                  <td className="border-t border-border/80 px-7 py-5 text-right">
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
    </div>
  );
}
