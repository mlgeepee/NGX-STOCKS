import { useEffect, useRef, useState } from "react";
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
  const visibleSuggestions = hasSearchText ? searchSuggestions : [];
  const fieldRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPlacement, setDropdownPlacement] = useState("above");
  const [suggestionsMaxHeight, setSuggestionsMaxHeight] = useState(244);

  useEffect(() => {
    if (!hasSearchText) {
      return;
    }

    const updateDropdownPosition = () => {
      const fieldNode = fieldRef.current;
      const dropdownNode = dropdownRef.current;

      if (!fieldNode || !dropdownNode) {
        return;
      }

      const viewportPadding = 16;
      const preferredListHeight = 244;
      const dropdownHeaderHeight = 56;
      const fieldRect = fieldNode.getBoundingClientRect();
      const dropdownHeight = dropdownNode.offsetHeight || 0;
      const preferredPanelHeight =
        Math.max(dropdownHeight, preferredListHeight + dropdownHeaderHeight);
      const spaceAbove = fieldRect.top - viewportPadding;
      const spaceBelow = window.innerHeight - fieldRect.bottom - viewportPadding;
      const shouldRenderBelow =
        spaceAbove < preferredPanelHeight && spaceBelow > spaceAbove;
      const nextPlacement = shouldRenderBelow ? "below" : "above";
      const availableSpace = shouldRenderBelow ? spaceBelow : spaceAbove;
      const nextListMaxHeight = Math.max(
        132,
        Math.min(preferredListHeight, availableSpace - dropdownHeaderHeight),
      );

      setDropdownPlacement(nextPlacement);
      setSuggestionsMaxHeight(nextListMaxHeight);
    };

    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [hasSearchText, visibleSuggestions.length]);

  const shouldScrollSuggestions =
    visibleSuggestions.length > 3 || suggestionsMaxHeight < 244;
  const dropdownPositionClass =
    dropdownPlacement === "below"
      ? "top-[calc(100%+0.35rem)]"
      : "bottom-[calc(100%-0.15rem)]";

  return (
    <label
      ref={fieldRef}
      className="app-control relative block w-full overflow-visible rounded-[1.1rem] px-0"
    >
      <span className="sr-only">{labelText}</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={placeholderText}
        className="app-input h-[50px] border-0 bg-card pl-11 shadow-none sm:h-[52px]"
      />

      {hasSearchText ? (
        <div
          ref={dropdownRef}
          className={`absolute left-0 right-0 z-40 rounded-[1.2rem] border border-border bg-card p-2 shadow-[0_20px_48px_rgba(15,23,42,0.18)] ${dropdownPositionClass}`}
        >
          <div className="flex items-center justify-between gap-3 px-2.5 pb-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {topMatchesLabel}
            </p>
            <span className="text-xs font-medium text-muted-foreground">
              {searchSuggestions.length}
            </span>
          </div>

          {visibleSuggestions.length ? (
            <div
              className={`space-y-1.5 ${
                shouldScrollSuggestions ? "max-h-[15.25rem] overflow-y-auto pr-1" : ""
              }`}
              style={
                shouldScrollSuggestions
                  ? { maxHeight: `${suggestionsMaxHeight}px` }
                  : undefined
              }
            >
              {visibleSuggestions.map((stock) => (
                <button
                  key={stock.symbol}
                  type="button"
                  onClick={() => onSuggestionSelect?.(stock)}
                  className="flex w-full items-center justify-between gap-3 rounded-[1rem] border border-transparent bg-background px-3 py-2.5 text-left transition hover:border-border/70 hover:bg-accent/35 dark:hover:bg-accent/20"
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
            <div className="rounded-[1rem] border border-dashed border-border/70 bg-background px-4 py-4 text-sm leading-6 text-muted-foreground">
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
