import { Search } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

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
  searchPlaceholder = "Search by company or ticker",
  searchLabel = "Search stocks",
  actions = null,
}) {
  const user = useAuthStore((state) => state.user);
  const userEmail = user?.email || "analyst@ngxstocks.app";
  const initials = getInitials(userEmail);

  return (
    <header className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-foreground">
          Market Intelligence
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl xl:text-[2.85rem]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
        {onSearchChange ? (
          <label className="relative block w-full sm:w-[340px] lg:w-[390px]">
            <span className="sr-only">{searchLabel}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="app-input pl-11"
            />
          </label>
        ) : null}

        {actions}

        <div className="app-control flex items-center gap-3 rounded-[1.6rem] px-3.5 py-2.5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1.15rem] bg-accent text-sm font-semibold text-accent-foreground ring-1 ring-primary/15">
            {initials}
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="text-sm font-semibold text-foreground">
              Market Analyst
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
