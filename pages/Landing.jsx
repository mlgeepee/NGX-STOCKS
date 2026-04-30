import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { NGXLogo } from "@/components/ui/ngx-logo";
import { useAuthStore } from "../store/useAuthStore";

const features = [
  {
    title: "Market board with real hierarchy",
    description:
      "Scan movers, volume, and sector cues from a surface that feels built for decision-making instead of raw data dumping.",
    icon: BarChart3,
  },
  {
    title: "Watchlists that stay useful",
    description:
      "Save the companies that matter, return fast, and keep your shortlist close when the market starts moving.",
    icon: Star,
  },
  {
    title: "Stock detail that reads like research",
    description:
      "Move from market breadth to a single company view with cleaner charts, stats, and company-specific context.",
    icon: Search,
  },
];

const marketPreview = [
  {
    symbol: "DANGCEM",
    name: "Dangote Cement",
    price: "₦781.40",
    move: "+1.82%",
    logo: "/logos/Dangote-cement.png",
  },
  {
    symbol: "GTCO",
    name: "GTCO",
    price: "₦68.15",
    move: "+0.94%",
    logo: "/logos/GTCO.png",
  },
  {
    symbol: "AIRTELAFRI",
    name: "Airtel Africa",
    price: "₦2,183.00",
    move: "-0.37%",
    logo: "/logos/Airtel.png",
  },
];

const floatingLogos = [
  {
    src: "/logos/MTN.png",
    alt: "MTN",
    className: "left-[8%] top-[12%] animate-float-soft",
  },
  {
    src: "/logos/Zenith.png",
    alt: "Zenith",
    className: "right-[10%] top-[16%] animate-float-slower",
  },
  {
    src: "/logos/UBA.png",
    alt: "UBA",
    className: "left-[14%] bottom-[20%] animate-float-slower",
  },
  {
    src: "/logos/Conoil.svg",
    alt: "Conoil",
    className: "right-[16%] bottom-[12%] animate-float-soft",
  },
];

const trustStrip = [
  "Built around NGX workflows",
  "Polished auth and dashboard journey",
  "Readable charts, watchlists, and briefings",
];

export default function Landing() {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const primaryHref = isAuthLoading ? "/login" : user ? "/dashboard" : "/signup";
  const primaryLabel = isAuthLoading
    ? "Loading workspace"
    : user
      ? "Go to dashboard"
      : "Create account";

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5%] top-[-3%] h-[24rem] w-[24rem] rounded-full bg-accent/45 blur-3xl" />
        <div className="absolute right-[-10%] top-[12%] h-[30rem] w-[30rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[20%] h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1480px] px-5 pb-20 pt-5 sm:px-7 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-border/70 bg-white/45 px-4 py-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:bg-white/5">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="brand-mark">
              <NGXLogo className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent-foreground">
                NGX Stocks
              </span>
              <span className="block text-sm text-muted-foreground">
                Designer-grade market intelligence
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/login" className="app-button-secondary h-12 px-4">
              Log in
            </Link>
            <Link to={primaryHref} className="app-button-primary h-12 gap-2 px-4">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="grid gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-16">
          <div className="max-w-3xl">
            <p className="section-kicker">Editorial finance, tuned for the Nigerian market</p>
            <h1 className="display-font mt-6 balance text-6xl leading-[0.9] text-foreground sm:text-7xl lg:text-[6.3rem]">
              Watch the exchange move from a board that feels worth trusting.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              NGX Stocks turns live market monitoring into a premium, clear, and
              modern workflow, from first login to detailed stock analysis.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={primaryHref} className="app-button-primary gap-2 px-6">
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="app-button-secondary px-6">
                Explore the sign-in flow
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {trustStrip.map((item) => (
                <span key={item} className="app-chip">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <article className="app-panel-soft p-5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Tracked names
                </p>
                <p className="mt-4 text-3xl font-semibold text-foreground">140+</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Market rows organized for speed, clarity, and repeated daily use.
                </p>
              </article>
              <article className="app-panel-soft p-5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Core views
                </p>
                <p className="mt-4 text-3xl font-semibold text-foreground">6</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Landing, auth, dashboard, watchlist, learn, and stock detail.
                </p>
              </article>
              <article className="app-panel-soft p-5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Reading style
                </p>
                <p className="mt-4 text-3xl font-semibold text-foreground">Calm</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Premium surfaces, readable numbers, and focused motion cues.
                </p>
              </article>
            </div>
          </div>

          <div className="relative">
            <div className="app-panel surface-noise overflow-hidden rounded-[2.75rem] p-4 shadow-panel sm:p-5">
              <div className="relative rounded-[2.1rem] border border-white/35 bg-[linear-gradient(145deg,rgba(255,255,255,0.6),rgba(255,255,255,0.08))] p-5 dark:border-white/5 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] sm:p-7">
                <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(215,167,90,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(17,120,102,0.14),transparent_34%)]" />

                {floatingLogos.map((item) => (
                  <div
                    key={item.alt}
                    className={`absolute z-10 hidden h-16 w-16 items-center justify-center rounded-[1.5rem] border border-white/60 bg-white/78 p-3 shadow-float backdrop-blur-sm sm:flex dark:border-white/10 dark:bg-white/5 ${item.className}`}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}

                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.6rem] border border-border/70 bg-white/60 px-4 py-4 backdrop-blur-sm dark:bg-white/5">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent-foreground">
                        Market pulse
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        Financial Analytics Dashboard
                      </p>
                    </div>
                    <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                      +0.84% average move
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="app-panel-soft p-5">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        Research stack
                      </p>
                      <div className="mt-4 space-y-3">
                        {[
                          {
                            title: "Dashboard",
                            detail: "Breadth, search, and table flow",
                            icon: TrendingUp,
                          },
                          {
                            title: "Stock detail",
                            detail: "Chart, stats, and company briefings",
                            icon: Building2,
                          },
                          {
                            title: "Learn",
                            detail: "Lightweight market concept primers",
                            icon: BookOpen,
                          },
                        ].map((item) => {
                          const Icon = item.icon;

                          return (
                            <div
                              key={item.title}
                              className="flex items-start gap-3 rounded-[1.35rem] border border-border/70 bg-white/55 p-3.5 dark:bg-white/5"
                            >
                              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Icon className="h-4 w-4" />
                              </span>
                              <div>
                                <p className="font-semibold text-foreground">
                                  {item.title}
                                </p>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                  {item.detail}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="app-panel-soft p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                            Live board preview
                          </p>
                          <p className="mt-2 text-lg font-semibold text-foreground">
                            Market names in one glance
                          </p>
                        </div>
                        <Sparkles className="h-5 w-5 text-accent-foreground" />
                      </div>

                      <div className="mt-4 space-y-3">
                        {marketPreview.map((item) => (
                          <div
                            key={item.symbol}
                            className="flex items-center gap-3 rounded-[1.35rem] border border-border/70 bg-white/58 p-3.5 dark:bg-white/5"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-primary/10 bg-accent/60 p-2">
                              <img
                                src={item.logo}
                                alt={item.name}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-semibold text-foreground">
                                  {item.name}
                                </p>
                                <span className="rounded-full bg-accent px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-accent-foreground">
                                  {item.symbol}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {item.price}
                              </p>
                            </div>
                            <div
                              className={`rounded-full px-3 py-2 text-sm font-semibold ${
                                item.move.startsWith("-")
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              {item.move}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 rounded-[1.45rem] border border-border/70 bg-[linear-gradient(90deg,rgba(15,138,95,0.16),rgba(200,154,75,0.18),rgba(15,138,95,0.16))] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                              Command bar
                            </p>
                            <p className="mt-2 text-sm font-medium text-foreground">
                              Search a company, sort the board, and jump into detail.
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="grid gap-5 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article key={feature.title} className="app-panel p-6 sm:p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-[1.35rem] bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-6 text-2xl font-semibold text-foreground">
                    {feature.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 py-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="app-panel rounded-[2.4rem] p-7 sm:p-9">
            <p className="section-kicker">Why the redesign matters</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
              Serious market software should not look like a generic template.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              The new direction gives NGX Stocks a stronger brand voice, clearer
              interface rhythm, and better separation between market overview,
              company detail, and educational context.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="app-panel-soft p-5">
                <TrendingUp className="h-5 w-5 text-primary" />
                <p className="mt-4 text-lg font-semibold text-foreground">
                  Faster scanning
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Stronger typography, clearer surfaces, and a more intentional
                  hierarchy reduce effort on every visit.
                </p>
              </div>
              <div className="app-panel-soft p-5">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="mt-4 text-lg font-semibold text-foreground">
                  More trust
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Premium materials and calmer density make the product feel more
                  credible for financial decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="app-panel rounded-[2.4rem] p-7 sm:p-9">
            <p className="section-kicker">Ready to step in?</p>
            <h2 className="mt-4 text-3xl font-semibold text-foreground">
              Start with the polished flow and follow the market from there.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Create an account, save the names you care about, and move from the
              dashboard to detailed stock analysis without losing context.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link to={primaryHref} className="app-button-primary w-full gap-2">
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="app-button-secondary w-full">
                Log in to continue
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
