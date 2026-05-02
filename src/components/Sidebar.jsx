import {
  BookOpen,
  BriefcaseBusiness,
  LayoutDashboard,
  Languages,
  LogOut,
  MoonStar,
  Sparkles,
  Star,
  SunMedium,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NGXLogo } from "@/components/ui/ngx-logo";
import { getAppCopy } from "@/content/appCopy";
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
    labelKey: "sidebar.nav.portfolio.label",
    descriptionKey: "sidebar.nav.portfolio.description",
    to: "/dashboard/portfolio",
    icon: BriefcaseBusiness,
  },
  {
    labelKey: "sidebar.nav.learn.label",
    descriptionKey: "sidebar.nav.learn.description",
    to: "/dashboard/learn",
    icon: BookOpen,
  },
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
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const language = usePreferencesStore((state) => state.language);
  const theme = usePreferencesStore((state) => state.theme);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const toggleTheme = usePreferencesStore((state) => state.toggleTheme);
  const copy = getAppCopy(language);
  const languageOptions = [
    { value: "en", label: copy.common.languageEnglish },
    { value: "pid", label: copy.common.languagePidgin },
  ];
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
      className={`app-panel fixed inset-y-3 left-3 z-40 flex w-[min(21.2rem,calc(100%-1.5rem))] flex-col overflow-y-auto rounded-[1.85rem] px-3 py-3 backdrop-blur-xl transition-transform duration-300 sm:inset-y-4 sm:left-4 sm:w-[min(21.4rem,calc(100%-2rem))] lg:w-[19.4rem] lg:px-4 lg:py-4 ${
        isOpen
          ? "translate-x-0"
          : "-translate-x-[calc(100%+1.5rem)] pointer-events-none"
      } lg:translate-x-0 lg:pointer-events-auto`}
    >
      <div className="app-panel-soft mb-5 rounded-[1.55rem] p-4">
        <Link
          to="/dashboard"
          onClick={() => onClose?.()}
          className="flex items-center gap-3.5"
        >
          <span className="brand-mark">
            <NGXLogo className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent-foreground">
              {brandTitle}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {brandSubtitle}
            </p>
          </div>
        </Link>

        <div className="mt-4 rounded-[1.3rem] border border-border/70 bg-white/55 p-4 dark:bg-white/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {copy.common.workspace}
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">
                {copy.sidebar.workspaceTitle}
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 break-words text-sm leading-6 text-muted-foreground">
            {user?.email || copy.sidebar.workspaceSummary}
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <div className="text-sm font-semibold text-foreground">{copy.common.menu}</div>
        <button
          type="button"
          onClick={() => onClose?.()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[1rem] border border-border/80 bg-white/80 text-foreground shadow-sm transition hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"
          aria-label={copy.common.closeSidebar}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-3">
        {navItems.map((item) => {
          const active = isLinkActive(pathname, item.to);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => onClose?.()}
              className={`group flex items-center gap-3.5 rounded-[1.3rem] border px-3.5 py-3.5 transition ${
                active
                  ? "border-primary/15 bg-primary/10 text-foreground shadow-sm"
                  : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-white/70 hover:text-foreground dark:hover:bg-white/5"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold leading-5">
                  {translate(language, item.labelKey)}
                </span>
                <span
                  className={`mt-1 block text-xs leading-5 ${
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

      <div className="space-y-3 border-t border-border/80 pt-4">
        <label className="app-control flex items-center gap-3 rounded-[1.2rem] px-3.5 py-3.5 text-muted-foreground hover:border-primary/20 hover:bg-white/85 dark:hover:bg-white/5">
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

        <button
          type="button"
          onClick={toggleTheme}
          className="app-control flex w-full items-center gap-3.5 rounded-[1.2rem] px-3.5 py-3.5 text-left hover:border-primary/20 hover:bg-white/85 dark:hover:bg-white/5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-secondary text-muted-foreground">
            {theme === "dark" ? (
              <SunMedium className="h-4 w-4" />
            ) : (
              <MoonStar className="h-4 w-4" />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">
              {theme === "dark" ? copy.common.lightMode : copy.common.darkMode}
            </span>
            <span className="block text-xs text-muted-foreground">
              {copy.common.switchTheme}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-[1.2rem] border border-rose-200/80 bg-rose-50/90 px-3.5 py-3.5 text-rose-600 transition hover:-translate-y-0.5 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-white/80 dark:bg-rose-500/10">
            <LogOut className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold">{logoutLabel}</span>
        </button>
      </div>
    </aside>
  );
}
