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
  const user = useAuthStore((state) => state.user);
  const userEmail = user?.email || "analyst@ngxstocks.app";
  const initials = getInitials(userEmail);
  const todayLabel = new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="mb-6 grid gap-3.5 sm:mb-8 sm:gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
      <div className="app-panel-soft rounded-[1.55rem] p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent-foreground">
            {marketIntelligence}
          </p>
          <span className="app-chip border-primary/10 bg-primary/10 text-primary dark:border-primary/20">
            {todayLabel}
          </span>
        </div>
        <h1 className="mt-4 text-[1.95rem] font-semibold leading-tight text-foreground sm:text-4xl xl:text-[2.85rem]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center xl:flex-nowrap">
        {onSearchChange ? (
          <label className="app-control relative block w-full rounded-[1.25rem] px-0 sm:w-[340px] lg:w-[390px]">
            <span className="sr-only">{labelText}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={placeholderText}
              className="app-input h-[54px] border-0 bg-transparent pl-11 shadow-none sm:h-[58px]"
            />
          </label>
        ) : null}

        {actions ? <div className="flex w-full sm:w-auto">{actions}</div> : null}

        <div className="app-control flex w-full min-w-0 items-center gap-3.5 rounded-[1.35rem] px-3.5 py-3.5 shadow-sm sm:w-auto">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-accent text-sm font-semibold text-accent-foreground ring-1 ring-primary/15">
            {initials}
          </div>
          <div className="min-w-0 max-w-[13rem] sm:max-w-[15rem]">
            <p className="text-sm font-semibold text-foreground">
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
