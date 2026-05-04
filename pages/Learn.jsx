import {
  ArrowUpRight,
  BellRing,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CandlestickChart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Header from "../src/components/Header";
import { getLearnCenterContent } from "@/content/learnCenter";
import { usePreferencesStore } from "../store/usePreferencesStore";
import cowrywiseImage from "../src/assets/cowrywise.png";

const quickStartIcons = [TrendingUp, BookOpen, ShieldCheck];
const toolIcons = [CandlestickChart, BookOpen, Building2, BellRing];

function SectionHeader({ kicker, title, description }) {
  return (
    <div>
      <p className="section-kicker">{kicker}</p>
      <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-[2.1rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function Learn() {
  const language = usePreferencesStore((state) => state.language);
  const content = getLearnCenterContent(language);

  return (
    <div>
      <Header title={content.heroTitle} subtitle={content.heroDescription} />

      <section className="app-panel rounded-[1.85rem] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            kicker={content.heroKicker}
            title={content.heroTitle}
            description={content.heroDescription}
          />
          <div className="app-chip border-primary/10 bg-primary/10 text-primary dark:border-primary/20">
            <Sparkles className="h-4 w-4" />
            {content.heroBadge}
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {content.quickStartCards.map((card, index) => {
            const Icon = quickStartIcons[index];

            return (
              <article
                key={card.title}
                className="app-panel-soft rounded-[1.45rem] p-5 sm:p-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {card.description}
                </p>
                <div className="mt-5 space-y-2.5">
                  {card.bullets.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.2rem] border border-border/65 bg-white/55 px-3.5 py-3 text-sm leading-6 text-muted-foreground dark:bg-white/5"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="app-panel rounded-[1.85rem] p-6 sm:p-8">
          <SectionHeader
            kicker={content.termsTitle}
            title={content.termsTitle}
            description={content.termsDescription}
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {content.terms.map((item) => (
              <article
                key={item.term}
                className="rounded-[1.2rem] border border-border/65 bg-white/55 p-4 dark:bg-white/5"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-foreground">
                  {item.term}
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground">
                  {item.meaning}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.watchFor}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="app-panel rounded-[1.85rem] p-6 sm:p-8">
            <SectionHeader
              kicker={content.appToolsTitle}
              title={content.appToolsTitle}
              description={content.appToolsDescription}
            />

            <div className="mt-6 space-y-3">
              {content.appTools.map((item, index) => {
                const Icon = toolIcons[index];

                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-[1.15rem] border border-border/65 bg-white/55 p-4 sm:p-5 dark:bg-white/5"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.05rem] bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="app-panel rounded-[1.85rem] p-6 sm:p-8">
            <SectionHeader
              kicker={content.checklistTitle}
              title={content.checklistTitle}
            />
            <div className="mt-6 space-y-3">
              {content.checklist.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.1rem] border border-border/65 bg-white/55 px-4 py-3 text-sm leading-7 text-muted-foreground dark:bg-white/5"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7 grid gap-6 lg:grid-cols-2">
        <div className="app-panel rounded-[1.85rem] p-6 sm:p-8">
          <SectionHeader
            kicker={content.whatToStudyTitle}
            title={content.whatToStudyTitle}
            description={content.whatToStudyDescription}
          />

          <div className="mt-6 space-y-4">
            {content.whatToStudyCards.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.2rem] border border-border/65 bg-white/55 p-4 dark:bg-white/5"
              >
                <p className="text-base font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.detail}
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground">
                  {item.notes}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="app-panel rounded-[1.85rem] p-6 sm:p-8">
            <SectionHeader
              kicker={content.riskTitle}
              title={content.riskTitle}
              description={content.riskDescription}
            />

            <div className="mt-6 space-y-3">
              {content.risks.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.1rem] border border-border/65 bg-white/55 px-4 py-3 text-sm leading-7 text-muted-foreground dark:bg-white/5"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="app-panel-soft rounded-[1.55rem] p-6 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-primary/10 text-primary">
                <BriefcaseBusiness className="h-5 w-5" />
              </span>
              <div>
                <p className="section-kicker">{content.disclaimerLabel}</p>
                <p className="mt-3 text-base leading-7 text-foreground sm:text-lg">
                  {content.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <div className="app-panel overflow-hidden rounded-[1.85rem] p-5 sm:p-7">
          <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr] xl:items-center">
            <div>
              <SectionHeader
                kicker={content.investKicker}
                title={content.investTitle}
                description={content.investDescription}
              />
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {content.investNote}
              </p>
              <a
                href="https://cowrywise.com/stocks"
                target="_blank"
                rel="noreferrer"
                className="app-button-primary mt-6 gap-2 px-5"
              >
                {content.investCta}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <a
              href="https://cowrywise.com/stocks"
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-[1.3rem] border border-border/70 bg-white/55 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/20 dark:bg-white/5"
            >
              <img
                src={cowrywiseImage}
                alt="Cowrywise stocks investment banner"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
