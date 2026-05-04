import { Search } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { usePreferencesStore } from "../../store/usePreferencesStore";
import { translate } from "../lib/i18n";

function getInitials(value) {
  const normalized = String(value || "NGX")
    .split("@")[0]
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return normalized || "NG";
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
  const analystTitle = translate(language, "header.analystTitle");
  const topMatchesLabel = translate(language, "header.topMatches");
  const noSearchMatches =
    searchEmptyMessage || translate(language, "header.noSearchMatches");
  const openActionLabel = translate(language, "header.openAction");
  const user = useAuthStore((state) => state.user);
  const userEmail = user?.email || "analyst@ngxstocks.app";
  const initials = getInitials(userEmail);
  const hasSearchText = Boolean(searchValue.trim());
  const visibleSuggestions = hasSearchText ? searchSuggestions.slice(0, 5) : [];
  const todayLabel = new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="mb-5 grid gap-3 sm:mb-7 sm:gap-3.5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
      <div className="app-panel-soft rounded-[1.35rem] p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent-foreground">
            {marketIntelligence}
          </p>
          <span className="app-chip border-primary/10 bg-primary/10 text-primary dark:border-primary/20">
            {todayLabel}
          </span>
        </div>
        <h1 className="mt-3 text-[1.7rem] font-semibold leading-tight text-foreground sm:text-[2.2rem] xl:text-[2.45rem]">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-[14px] leading-6 text-muted-foreground sm:text-[15px]">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:flex-nowrap">
        {onSearchChange ? (
          <label className="app-control relative block w-full rounded-[1.1rem] px-0 sm:w-[300px] lg:w-[340px]">
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
        ) : null}

        {actions ? <div className="flex w-full sm:w-auto">{actions}</div> : null}

        <div className="app-control flex w-full min-w-0 items-center gap-3 rounded-[1.15rem] px-3 py-3 shadow-sm sm:w-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] bg-accent text-sm font-semibold text-accent-foreground ring-1 ring-primary/15">
            {initials}
          </div>
          <div className="min-w-0 max-w-[11rem] sm:max-w-[13rem]">
            <p className="text-[13px] font-semibold text-foreground">
              {analystTitle}
            </p>
            <p className="break-all text-[11px] leading-5 text-muted-foreground sm:text-xs">
              {userEmail}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
