import {
  ArrowRight,
  BarChart3,
  BellRing,
  BookOpen,
  BriefcaseBusiness,
  Search,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { NGXLogo } from "@/components/ui/ngx-logo";
import PreferenceControls from "@/components/PreferenceControls";
import { getAppCopy } from "@/content/appCopy";
import { usePreferencesStore } from "../store/usePreferencesStore";
import { useAuthStore } from "../store/useAuthStore";

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

const featureIcons = [BellRing, Search, BriefcaseBusiness];
const previewIcons = [TrendingUp, BarChart3, BellRing];
const roadmapIcons = [TrendingUp, BookOpen, BriefcaseBusiness];
const researchCardTones = [
  "bg-primary/12 text-primary ring-1 ring-primary/15",
  "bg-amber-500/12 text-amber-700 ring-1 ring-amber-300/40 dark:text-amber-200 dark:ring-amber-400/20",
  "bg-sky-500/12 text-sky-700 ring-1 ring-sky-300/40 dark:text-sky-200 dark:ring-sky-400/20",
];
const featureTones = [
  "bg-primary/12 text-primary ring-1 ring-primary/15",
  "bg-amber-500/12 text-amber-700 ring-1 ring-amber-300/40 dark:text-amber-200 dark:ring-amber-400/20",
  "bg-rose-500/12 text-rose-700 ring-1 ring-rose-300/40 dark:text-rose-200 dark:ring-rose-400/20",
];
const roadmapTones = [
  "bg-primary/12 text-primary ring-1 ring-primary/15",
  "bg-sky-500/12 text-sky-700 ring-1 ring-sky-300/40 dark:text-sky-200 dark:ring-sky-400/20",
  "bg-amber-500/12 text-amber-700 ring-1 ring-amber-300/40 dark:text-amber-200 dark:ring-amber-400/20",
];

export default function Landing() {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const language = usePreferencesStore((state) => state.language);
  const copy = getAppCopy(language);

  const primaryHref = isAuthLoading ? "/login" : user ? "/dashboard" : "/signup";
  const primaryLabel = isAuthLoading
    ? copy.common.loadingWorkspace
    : user
      ? copy.common.goToDashboard
      : copy.common.createAccount;

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5%] top-[-3%] h-[24rem] w-[24rem] rounded-full bg-accent/45 blur-3xl" />
        <div className="absolute right-[-10%] top-[12%] h-[30rem] w-[30rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[20%] h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1360px] px-4 pb-16 pt-4 sm:px-6 lg:px-7">
        <header className="flex flex-col gap-3 rounded-[1.5rem] border border-border/70 bg-white/45 px-4 py-3.5 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:bg-white/5">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="brand-mark">
              <NGXLogo className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent-foreground">
                NGX Stocks
              </span>
              <span className="block text-[13px] text-muted-foreground">
                {copy.landing.brandSubtitle}
              </span>
            </span>
          </Link>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <PreferenceControls showLabels={false} />
            <Link to="/login" className="app-button-secondary h-12 w-full px-4 sm:w-auto">
              {copy.common.login}
            </Link>
            <Link
              to={primaryHref}
              className="app-button-primary h-12 w-full gap-2 px-4 sm:w-auto"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="grid gap-7 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-8 lg:py-12">
          <div className="max-w-3xl">
            <p className="section-kicker">{copy.landing.heroKicker}</p>
            <h1 className="display-font mt-4 balance text-[2.45rem] leading-[0.94] text-foreground sm:text-[4.3rem] lg:text-[5.1rem]">
              {copy.landing.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">
              {copy.landing.heroDescription}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={primaryHref}
                className="app-button-primary w-full gap-2 px-6 sm:w-auto"
              >
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="app-button-secondary w-full px-6 sm:w-auto"
              >
                {copy.landing.secondaryCta}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {copy.landing.trustStrip.map((item) => (
                <span key={item} className="app-chip">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {copy.landing.stats.map((item) => (
                <article key={item.label} className="app-panel-soft p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-3 text-[1.7rem] font-semibold text-foreground">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="app-panel surface-noise overflow-hidden rounded-[1.75rem] p-2.5 shadow-panel sm:rounded-[2rem] sm:p-4">
              <div className="relative rounded-[1.5rem] border border-white/35 bg-[linear-gradient(145deg,rgba(255,255,255,0.6),rgba(255,255,255,0.08))] p-3.5 dark:border-white/5 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] sm:rounded-[1.75rem] sm:p-5">
                <div className="absolute inset-0 rounded-[1.8rem] bg-[radial-gradient(circle_at_top_left,rgba(215,167,90,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(17,120,102,0.14),transparent_34%)] sm:rounded-[2rem]" />

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
                  <div className="flex flex-col gap-3 rounded-[1.25rem] border border-border/70 bg-white/60 px-3.5 py-3.5 backdrop-blur-sm dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent-foreground">
                        {copy.landing.preview.kicker}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground sm:text-[1.35rem]">
                        {copy.landing.preview.title}
                      </p>
                    </div>
                    <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                      {copy.landing.preview.avgMove}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                    <div className="app-panel-soft p-5">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        {copy.landing.preview.researchTitle}
                      </p>
                      <div className="mt-4 space-y-3">
                        {copy.landing.preview.researchCards.map((item, index) => {
                          const Icon = previewIcons[index];
                          const tone = researchCardTones[index];

                          return (
                            <div
                              key={item.title}
                              className="flex items-start gap-3 rounded-[1.35rem] border border-border/70 bg-white/55 p-3.5 dark:bg-white/5"
                            >
                              <span
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${tone}`}
                              >
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
                            {copy.landing.preview.boardTitle}
                          </p>
                          <p className="mt-2 text-lg font-semibold text-foreground">
                            {copy.landing.preview.boardSubtitle}
                          </p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-accent-foreground" />
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
                              {copy.landing.preview.commandKicker}
                            </p>
                            <p className="mt-2 text-sm font-medium text-foreground">
                              {copy.landing.preview.commandText}
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

        <section className="py-4">
          <div className="grid gap-5 lg:grid-cols-3">
            {copy.landing.features.map((feature, index) => {
              const Icon = featureIcons[index];
              const tone = featureTones[index];

              return (
                <article key={feature.title} className="app-panel p-6 sm:p-7">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-[1.35rem] ${tone}`}
                  >
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

        <section className="grid gap-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="app-panel rounded-[2.25rem] p-6 sm:p-8">
            <p className="section-kicker">{copy.landing.roadmap.kicker}</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-foreground sm:text-[2.4rem]">
              {copy.landing.roadmap.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              {copy.landing.roadmap.description}
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {copy.landing.roadmap.cards.map((item, index) => {
                const Icon = roadmapIcons[index];
                const tone = roadmapTones[index];

                return (
                  <article key={item.title} className="app-panel-soft p-5">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-[1.1rem] ${tone}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="mt-4 text-lg font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {item.detail}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="app-panel rounded-[2.25rem] p-6 sm:p-8">
            <p className="section-kicker">{copy.landing.final.kicker}</p>
            <h2 className="mt-4 text-3xl font-semibold text-foreground">
              {copy.landing.final.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              {copy.landing.final.description}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link to={primaryHref} className="app-button-primary w-full gap-2">
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/dashboard/learn" className="app-button-secondary w-full">
                {copy.landing.roadmap.cta}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
