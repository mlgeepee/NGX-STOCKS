## Shared Layout Components

### `src/layouts/Layout.jsx`

Description: Main authenticated app shell with mobile sidebar toggle, background wash, and `Outlet` for dashboard-family pages.

```jsx
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at top right, oklch(var(--primary) / 0.22), transparent 34%), radial-gradient(circle at bottom left, oklch(var(--primary) / 0.12), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.36), rgba(248,251,248,0.82))",
        }}
      />
      <button
        type="button"
        aria-label="Close sidebar"
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${
          isSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="lg:pl-[21rem]">
        <main className="relative min-h-screen px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
          <div className="flex items-center justify-between px-5 py-4 lg:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((value) => !value)}
              className="inline-flex items-center justify-center rounded-2xl border border-border/80 bg-white/90 px-3.5 py-3 text-foreground shadow-sm transition hover:bg-white"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="mx-auto w-full max-w-[1480px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
```

### `src/components/Sidebar.jsx`

Description: Persistent dashboard navigation with brand block, nav items, language switcher, and logout button.

```jsx
import {
  BookOpen,
  LayoutDashboard,
  Languages,
  LogOut,
  Star,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useAuthStore } from "../../store/useAuthStore";
import { usePreferencesStore } from "../../store/usePreferencesStore";
import { translate } from "../lib/i18n";

const navItems = [
  {
    labelKey: "sidebar.nav.dashboard.label",
    descriptionKey: "sidebar.nav.dashboard.description",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    labelKey: "sidebar.nav.watchlist.label",
    descriptionKey: "sidebar.nav.watchlist.description",
    to: "/dashboard/watchlist",
    icon: Star,
  },
  {
    labelKey: "sidebar.nav.learn.label",
    descriptionKey: "sidebar.nav.learn.description",
    to: "/dashboard/learn",
    icon: BookOpen,
  },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "pid", label: "Pidgin" },
];

function isLinkActive(pathname, linkPath) {
  if (linkPath === "/dashboard") {
    return (
      pathname === "/dashboard" || pathname.startsWith("/dashboard/stocks/")
    );
  }

  return pathname === linkPath || pathname.startsWith(`${linkPath}/`);
}

export default function Sidebar({ isOpen = true, onClose }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const brandTitle = translate(language, "sidebar.brandTitle");
  const brandSubtitle = translate(language, "sidebar.brandSubtitle");
  const languageLabel = translate(language, "sidebar.languageLabel");
  const logoutLabel = translate(language, "sidebar.logout");

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    clearUser();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`app-panel fixed inset-y-4 left-4 z-40 flex w-[min(20rem,calc(100%-2rem))] flex-col overflow-y-auto px-3 py-3 backdrop-blur-xl transition-transform duration-300 lg:w-[17.75rem] lg:px-4 lg:py-4 ${
        isOpen
          ? "translate-x-0"
          : "-translate-x-[calc(100%+1.5rem)] pointer-events-none"
      } lg:translate-x-0 lg:pointer-events-auto`}
    >
      <Link
        to="/dashboard"
        onClick={() => onClose?.()}
        className="mb-6 flex items-center gap-3 rounded-[1.75rem] border border-border/80 bg-white/70 px-3 py-3.5 shadow-sm transition hover:border-primary/30 hover:bg-white dark:bg-card/60 lg:px-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-base font-bold text-white shadow-sm ring-1 ring-black/5">
          NG
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] ">
            {brandTitle}
          </p>
          <p className="mt-1 text-sm font-medium ">{brandSubtitle}</p>
        </div>
      </Link>

      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <div className="text-sm font-semibold text-foreground">Menu</div>
        <button
          type="button"
          onClick={() => onClose?.()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border/80 bg-white/80 text-foreground shadow-sm transition hover:bg-white"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const active = isLinkActive(pathname, item.to);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => onClose?.()}
              className={`group flex items-center gap-3 rounded-[1.5rem] px-2.5 py-2.5 transition ${
                active
                  ? "bg-accent text-accent-foreground ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-white/75 hover:text-foreground dark:hover:bg-white/5 dark:hover:text-foreground"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-[1.15rem] ${
                  active
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">
                  {translate(language, item.labelKey)}
                </span>
                <span
                  className={`mt-0.5 block text-xs ${
                    active
                      ? "text-accent-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {translate(language, item.descriptionKey)}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2.5 border-t border-border/80 pt-4">
        <label className="app-control flex items-center gap-2 rounded-[1.35rem] px-3 py-3 text-muted-foreground hover:border-primary/20 hover:bg-white/85 dark:hover:bg-white/5">
          <Languages className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {languageLabel}
          </span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-right text-xs font-semibold uppercase tracking-[0.18em] text-foreground outline-none lg:text-sm"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="hidden" />

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-[1.35rem] border border-rose-200 bg-rose-50 px-3 py-3 text-rose-600 transition hover:-translate-y-0.5 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 dark:bg-rose-500/10">
            <LogOut className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold">{logoutLabel}</span>
        </button>
      </div>
    </aside>
  );
}
```

### `src/components/Header.jsx`

Description: Shared page header used across dashboard, watchlist, learn, and stock detail pages.

```jsx
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
```

### `src/components/ProtectedRoute.jsx`

Description: Auth gate around the dashboard shell.

```jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        Checking session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```
