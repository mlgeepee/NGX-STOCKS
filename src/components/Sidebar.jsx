import {
  BookOpen,
  LayoutDashboard,
  Languages,
  LogOut,
  MoonStar,
  Star,
  SunMedium,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useAuthStore } from "../../store/useAuthStore";
import { usePreferencesStore } from "../../store/usePreferencesStore";

const navItems = [
  {
    label: "Dashboard",
    description: "Market pulse",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Watchlist",
    description: "Saved names",
    to: "/dashboard/watchlist",
    icon: Star,
  },
  {
    label: "Learn",
    description: "Guides & signals",
    to: "/dashboard/learn",
    icon: BookOpen,
  },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "fr", label: "Francais" },
  { value: "ha", label: "Hausa" },
];

function isLinkActive(pathname, linkPath) {
  if (linkPath === "/dashboard") {
    return (
      pathname === "/dashboard" || pathname.startsWith("/dashboard/stocks/")
    );
  }

  return pathname === linkPath || pathname.startsWith(`${linkPath}/`);
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const theme = usePreferencesStore((state) => state.theme);
  const toggleTheme = usePreferencesStore((state) => state.toggleTheme);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    clearUser();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="app-panel fixed inset-y-4 left-4 z-40 flex w-20 flex-col px-3 py-3 backdrop-blur-xl lg:w-[17.75rem] lg:px-4 lg:py-4">
      <Link
        to="/dashboard"
        className="mb-6 flex items-center gap-3 rounded-[1.75rem] border border-border/80 bg-white/70 px-3 py-3.5 shadow-sm transition hover:border-primary/30 hover:bg-white dark:bg-card/60 lg:px-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-sm ring-1 ring-black/5">
          NG
        </div>
        <div className="hidden min-w-0 lg:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
            NGX Stocks
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            Analytics cockpit
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const active = isLinkActive(pathname, item.to);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 rounded-[1.5rem] px-2.5 py-2.5 transition ${
                active
                  ? "bg-accent text-accent-foreground ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-white/75 hover:text-foreground dark:hover:bg-white/5 dark:hover:text-foreground"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-[1.15rem] ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="hidden min-w-0 lg:block">
                <span className="block text-sm font-semibold">{item.label}</span>
                <span
                  className={`mt-0.5 block text-xs ${
                    active
                      ? "text-accent-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2.5 border-t border-border/80 pt-4">
        <label className="app-control flex items-center gap-2 rounded-[1.35rem] px-3 py-3 text-muted-foreground hover:border-primary/20 hover:bg-white/85 dark:hover:bg-white/5">
          <Languages className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="hidden text-sm font-medium lg:block">Language</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-right text-xs font-semibold uppercase tracking-[0.18em] outline-none lg:text-sm"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={toggleTheme}
          className="app-control flex w-full items-center gap-2 rounded-[1.35rem] px-3 py-3 text-foreground hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white/85 dark:hover:bg-white/5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[1.15rem] bg-secondary text-muted-foreground">
            {theme === "dark" ? (
              <SunMedium className="h-4 w-4" />
            ) : (
              <MoonStar className="h-4 w-4" />
            )}
          </span>
          <span className="hidden flex-1 text-left lg:block">
            <span className="block text-sm font-semibold">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Switch surface contrast
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-[1.35rem] border border-rose-200 bg-rose-50 px-3 py-3 text-rose-600 transition hover:-translate-y-0.5 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 dark:bg-rose-500/10">
            <LogOut className="h-4 w-4" />
          </span>
          <span className="hidden text-sm font-semibold lg:block">Logout</span>
        </button>
      </div>
    </aside>
  );
}
