import { ArrowLeft, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { NGXLogo } from "@/components/ui/ngx-logo";

const defaultHighlights = [
  {
    label: "Market pulse",
    value: "140+",
    detail: "Tracked NGX names in one polished board",
    icon: TrendingUp,
  },
  {
    label: "Signal quality",
    value: "Live",
    detail: "Price moves, watchlists, and company briefings",
    icon: Sparkles,
  },
  {
    label: "Trust layer",
    value: "Secure",
    detail: "Auth-ready access for your personal workspace",
    icon: ShieldCheck,
  },
];

const spotlightRows = [
  "Live market board with fast drill-down",
  "Curated watchlist for focused follow-up",
  "Clear charting and market context",
];

export default function AuthShell({
  backHref = "/",
  backLabel = "Back to home",
  eyebrow,
  title,
  description,
  children,
  footer = null,
  highlights = defaultHighlights,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-4%] h-[30rem] w-[30rem] rounded-full bg-accent/35 blur-3xl" />
        <div className="absolute bottom-[-12%] right-[-6%] h-[34rem] w-[34rem] rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1480px] flex-col px-5 py-5 sm:px-7 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-white/55 px-3.5 py-2.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm hover:border-primary/20 hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <span className="brand-mark h-10 w-10 rounded-[1.15rem]">
              <NGXLogo className="h-6 w-6" />
            </span>
            <span className="flex flex-col text-left">
              <span className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-accent-foreground">
                NGX Stocks
              </span>
              <span className="text-sm font-medium text-foreground/80">
                Market command center
              </span>
            </span>
          </Link>

          <Link
            to={backHref}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/45 px-4 py-2.5 text-sm font-medium text-muted-foreground backdrop-blur-sm hover:border-primary/20 hover:bg-white/75 hover:text-foreground dark:bg-white/5 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </div>

        <div className="grid flex-1 gap-8 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-12">
          <section className="app-panel surface-noise rounded-[2.5rem] p-7 sm:p-10 lg:p-12">
            <p className="section-kicker">Designed for market conviction</p>
            <h1 className="display-font mt-6 max-w-3xl text-5xl leading-[0.94] text-foreground sm:text-6xl lg:text-[5.5rem]">
              Read the exchange with calm, premium clarity.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Every screen should feel like a polished research surface, from
              account access to the final stock view.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {spotlightRows.map((item) => (
                <span key={item} className="app-chip">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.label}
                    className="app-panel-soft rounded-[1.65rem] p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        {item.label}
                      </p>
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-semibold text-foreground">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.detail}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="app-panel-soft mt-8 rounded-[1.9rem] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent-foreground">
                    What this unlocks
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    A finance product with campaign-level craft.
                  </p>
                </div>
                <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  Auth, watchlist, charts, and daily signal flow
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-[36rem] lg:mr-0">
            <div className="app-panel rounded-[2.5rem] p-2 shadow-panel">
              <div className="rounded-[2rem] border border-white/40 bg-white/35 p-7 backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.02] sm:p-9">
                <p className="section-kicker">{eyebrow}</p>
                <h2 className="mt-4 balance text-3xl font-semibold text-foreground sm:text-[2.4rem]">
                  {title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {description}
                </p>

                <div className="mt-8">{children}</div>

                {footer ? <div className="panel-divider mt-7 pt-5">{footer}</div> : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
