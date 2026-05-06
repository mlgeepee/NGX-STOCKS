import { Search } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { usePreferencesStore } from "../../store/usePreferencesStore";
import { translate } from "../lib/i18n";

function SearchField({
  searchValue,
  onSearchChange,
  searchSuggestions,
  onSuggestionSelect,
  placeholderText,
  labelText,
  topMatchesLabel,
  noSearchMatches,
  openActionLabel,
}) {
  const hasSearchText = Boolean(searchValue.trim());
  const visibleSuggestions = hasSearchText ? searchSuggestions.slice(0, 5) : [];

  return (
    <label className="app-control relative block w-full rounded-[1.1rem] px-0">
      <span className="sr-only">{labelText}</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={placeholderText}
        className="app-input h-[50px] border-0 bg-transparent pl-11 shadow-none sm:h-[52px]"
      />

      {hasSearchText ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-30 rounded-[1.2rem] border border-border/80 bg-white/92 p-2 shadow-[0_20px_48px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:bg-card/95">
          <div className="flex items-center justify-between gap-3 px-2.5 pb-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {topMatchesLabel}
            </p>
            <span className="text-xs font-medium text-muted-foreground">
              {searchSuggestions.length}
            </span>
          </div>

          {visibleSuggestions.length ? (
            <div className="space-y-1.5">
              {visibleSuggestions.map((stock) => (
                <button
                  key={stock.symbol}
                  type="button"
                  onClick={() => onSuggestionSelect?.(stock)}
                  className="flex w-full items-center justify-between gap-3 rounded-[1rem] border border-transparent bg-white/55 px-3 py-2.5 text-left transition hover:border-border/70 hover:bg-white dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {stock.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-accent px-2.5 py-1 font-medium tracking-[0.16em] text-accent-foreground">
                        {stock.symbol}
                      </span>
                      <span>{stock.sector}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {openActionLabel}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[1rem] border border-dashed border-border/70 px-4 py-4 text-sm leading-6 text-muted-foreground">
              {noSearchMatches}
            </div>
          )}
        </div>
      ) : null}
    </label>
  );
}

export default function Header({
  title,
  subtitle,
  searchValue = "",
  onSearchChange,
  searchSuggestions = [],
  onSuggestionSelect,
  searchEmptyMessage,
  searchPlaceholder,
  searchLabel,
  actions = null,
}) {
  const language = usePreferencesStore((state) => state.language);
  const placeholderText =
    searchPlaceholder || translate(language, "header.searchPlaceholder");
  const labelText = searchLabel || translate(language, "header.searchLabel");
  const marketIntelligence = translate(language, "header.marketIntelligence");
  const topMatchesLabel = translate(language, "header.topMatches");
  const noSearchMatches =
    searchEmptyMessage || translate(language, "header.noSearchMatches");
  const openActionLabel = translate(language, "header.openAction");
  const hasSearch = typeof onSearchChange === "function";
  const hasActions = Boolean(actions);
  const shouldRenderAside = hasSearch || hasActions;
  const todayLabel = new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="mb-5 grid gap-3 sm:mb-7 sm:gap-3.5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
      <div className="app-panel-soft rounded-[1.35rem] p-4 sm:p-5 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm border-border/50">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent-foreground">
            {marketIntelligence}
          </p>
          <span className="app-chip border-primary/10 bg-primary/10 text-primary dark:border-primary/20">
            {todayLabel}
          </span>
        </div>
        <h1 className="mt-1 text-[1.7rem] font-semibold leading-tight text-foreground sm:text-[2.2rem] xl:text-[2.45rem]">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-[14px] leading-6 text-muted-foreground sm:text-[15px]">
          {subtitle}
        </p>
      </div>

      {shouldRenderAside ? (
        <div className="grid gap-3 xl:justify-items-end">
          {hasSearch || hasActions ? (
            <div
              className={`flex w-full items-start gap-3 ${
                hasSearch ? "" : "justify-end"
              }`}
            >
              {hasSearch ? (
                <div className="min-w-0 flex-1 sm:min-w-[300px] lg:min-w-[340px]">
                  <SearchField
                    searchValue={searchValue}
                    onSearchChange={onSearchChange}
                    searchSuggestions={searchSuggestions}
                    onSuggestionSelect={onSuggestionSelect}
                    placeholderText={placeholderText}
                    labelText={labelText}
                    topMatchesLabel={topMatchesLabel}
                    noSearchMatches={noSearchMatches}
                    openActionLabel={openActionLabel}
                  />
                </div>
              ) : null}

              {hasActions ? <div className="shrink-0">{actions}</div> : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
