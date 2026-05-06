import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { usePreferencesStore } from "../../store/usePreferencesStore";
import { getAppCopy } from "@/content/appCopy";
import PreferenceControls from "@/components/PreferenceControls";
import faviconIcon from "../assets/favicon.ico";

export default function AuthLandingShell({
  backHref = "/",
  backLabel,
  eyebrow,
  title,
  description,
  children,
}) {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const language = usePreferencesStore((state) => state.language);
  const copy = getAppCopy(language);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const getUserLastname = () => {
    const metadataName = user?.user_metadata?.name;
    if (metadataName) {
      const parts = metadataName.trim().split(" ").filter(Boolean);
      if (parts.length > 1) return parts[parts.length - 1];
      return metadataName;
    }
    return user?.email?.split("@")[0] || "Investor";
  };

  const primaryHref = useMemo(() => {
    if (isAuthLoading) return "/login";
    return user ? "/dashboard" : "/login";
  }, [isAuthLoading, user]);

  const primaryLabel = useMemo(() => {
    if (isAuthLoading) return copy.common.loadingWorkspace;
    return user ? `Go to Dashboard` : copy.common.login;
  }, [copy.common.loadingWorkspace, primaryHref, user]);

  const menuItems = (() => {
    if (!user) {
      return [
        { href: "/login", label: copy.common.login },
        { href: "/signup", label: copy.common.createAccount },
      ];
    }

    return [
      { href: "/dashboard", label: `Dashboard (${getUserLastname()})` },
      { href: "/dashboard/watchlist", label: "Watchlist" },
      { href: "/dashboard/portfolio", label: "Portfolio" },
      { href: "/dashboard/learn", label: "Learn" },
    ];
  })();

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden">
      {/* background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-5%] top-[-3%] h-[24rem] w-[24rem] rounded-full bg-accent/45 blur-3xl" />
        <div className="absolute right-[-10%] top-[12%] h-[30rem] w-[30rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[20%] h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* whole page blur when menu is open */}
      <div
        className={
          mobileMenuOpen ? "filter blur-[3px] pointer-events-none" : ""
        }
      >
        <div className="relative mx-auto max-w-[1360px] px-4 pb-16 pt-4 sm:px-6 lg:px-7">
          {/* Landing-style header (pill brand + hamburger) */}
          <header className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-border/70 bg-white/45 px-4 py-3.5 shadow-sm backdrop-blur-sm sm:px-5 dark:bg-white/5">
            <Link
              to="/"
              className="inline-flex min-w-0 items-center gap-3 rounded-full"
            >
              <span className="brand-mark h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center bg-white/40 ring-1 ring-border/70">
                <img
                  src={faviconIcon}
                  alt="NGX Stocks"
                  className="h-full w-full rounded-none object-contain"
                />
              </span>
              <span className="flex flex-col text-left">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent-foreground">
                  NGX Stocks
                </span>
                <span className="text-[13px] font-medium text-foreground/80 hidden sm:block">
                  NGX market board, watchlist, alerts, and portfolio flow
                </span>
              </span>
            </Link>

            <div className="relative ml-auto flex shrink-0 items-center">
              {/* tablet/desktop controls */}
              <div className="hidden sm:flex items-center gap-3">
                <PreferenceControls showLabels={false} />

                {/* Home button in header (before primary action) */}
                <Link
                  to="/"
                  className="app-button-secondary h-12 gap-2 px-4 inline-flex items-center"
                >
                  Home
                </Link>

                <Link
                  to={primaryHref}
                  className="app-button-primary h-12 gap-2 px-4 inline-flex items-center"
                >
                  {primaryLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* mobile hamburger */}
              <div className="sm:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="app-button-secondary inline-flex h-12 w-12 items-center justify-center rounded-[1rem]"
                  aria-label={copy.common.menu ?? "Menu"}
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* page content (centered) */}
          <div className="mt-8 grid gap-6 lg:grid-cols-1 lg:items-start justify-items-center">
            <div className="w-full lg:max-w-[520px]">
              <div className="app-panel rounded-[1.8rem] p-2 shadow-panel sm:rounded-[2rem]">
                <div className="rounded-[1.5rem] border border-white/40 bg-white/35 p-4 backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.02] sm:rounded-[1.75rem] sm:p-6 lg:p-7">
                  <p className="section-kicker">{eyebrow}</p>
                  <h2 className="mt-3 balance text-[1.65rem] font-semibold text-foreground sm:text-[2rem]">
                    {title}
                  </h2>
                  <p className="mt-3 text-[14px] leading-6 text-muted-foreground sm:text-[15px]">
                    {description}
                  </p>

                  <div className="mt-6">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile overlay + menu (top aligned) */}
      {mobileMenuOpen ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[6px]"
          />

          <div
            className="fixed top-[6.2rem] left-0 right-0 z-50 mx-auto w-[min(22rem,calc(100vw-2rem))] max-w-full overflow-hidden rounded-[1.25rem] border border-border/80 bg-background/90 shadow-[0_28px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent-foreground">
                  Menu
                </p>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="app-control inline-flex h-10 w-10 items-center justify-center rounded-full"
                  aria-label={copy.common.closeSidebar ?? "Close"}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* back button inside menu */}
              {backHref ? (
                <Link
                  to={backHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="app-button-secondary inline-flex h-11 w-full items-center justify-center mb-3"
                >
                  {backLabel}
                </Link>
              ) : null}

              <nav className="flex flex-col space-y-2.5">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex items-center justify-between rounded-[1.15rem] border border-transparent px-3 py-3 transition text-muted-foreground hover:border-border/70 hover:bg-white/70 hover:text-foreground dark:hover:bg-white/5"
                  >
                    <span className="text-[13px] font-semibold leading-5">
                      {item.label}
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
