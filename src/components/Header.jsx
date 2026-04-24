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

  return (
    <header className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-foreground">
          {marketIntelligence}
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl xl:text-[2.85rem]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center xl:flex-nowrap">
        {onSearchChange ? (
          <label className="relative block w-full sm:w-[340px] lg:w-[390px]">
            <span className="sr-only">{labelText}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={placeholderText}
              className="app-input pl-11"
            />
          </label>
        ) : null}

        {actions}

        <div className="app-control flex min-w-0 items-center gap-3 rounded-[1.6rem] px-3.5 py-2.5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1.15rem] bg-accent text-sm font-semibold text-accent-foreground ring-1 ring-primary/15">
            {initials}
          </div>
          <div className="min-w-0 max-w-[11.5rem] sm:max-w-[14rem]">
            <p className="text-sm font-semibold text-foreground">
              {analystTitle}
            </p>
            <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
              {userEmail}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
