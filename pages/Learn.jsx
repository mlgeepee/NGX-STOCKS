import {
  BookOpen,
  CandlestickChart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Header from "../src/components/Header";
import { translate } from "../src/lib/i18n";
import { usePreferencesStore } from "../store/usePreferencesStore";

const learningCards = [
  {
    titleKey: "learn.cards.breadth.title",
    descriptionKey: "learn.cards.breadth.description",
    icon: CandlestickChart,
    tone: "bg-primary/10 text-primary",
  },
  {
    titleKey: "learn.cards.watchlists.title",
    descriptionKey: "learn.cards.watchlists.description",
    icon: BookOpen,
    tone: "bg-accent text-accent-foreground",
  },
  {
    titleKey: "learn.cards.risk.title",
    descriptionKey: "learn.cards.risk.description",
    icon: ShieldCheck,
    tone: "bg-secondary text-secondary-foreground",
  },
];

export default function Learn() {
  const language = usePreferencesStore((state) => state.language);
  const t = (path) => translate(language, path);

  return (
    <div>
      <Header title={t("learn.title")} subtitle={t("learn.subtitle")} />

      <section className="app-panel rounded-[2.4rem] p-7 sm:p-9">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker">Learning hub</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-foreground sm:text-[2.35rem]">
              Build conviction with just enough market context.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              A lightweight education layer designed to support the dashboard,
              watchlist, and stock detail views without overwhelming the product.
            </p>
          </div>
          <div className="app-chip border-primary/10 bg-primary/10 text-primary dark:border-primary/20">
            <Sparkles className="h-4 w-4" />
            Short, practical, and tied to the live product
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {learningCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.titleKey}
                className="app-panel-soft rounded-[1.85rem] p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-[1.2rem] ${card.tone}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {t(card.titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {t(card.descriptionKey)}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="app-panel mt-7 rounded-[2.4rem] p-7 sm:p-9">
        <p className="section-kicker">Quick glossary</p>
        <h2 className="mt-4 text-3xl font-semibold text-foreground">
          {t("learn.glossaryTitle")}
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="app-panel-soft rounded-[1.7rem] p-5">
            <p className="text-sm font-semibold text-foreground">
              {t("learn.glossary.marketTrend.title")}
            </p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {t("learn.glossary.marketTrend.description")}
            </p>
          </div>
          <div className="app-panel-soft rounded-[1.7rem] p-5">
            <p className="text-sm font-semibold text-foreground">
              {t("learn.glossary.volume.title")}
            </p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {t("learn.glossary.volume.description")}
            </p>
          </div>
          <div className="app-panel-soft rounded-[1.7rem] p-5">
            <p className="text-sm font-semibold text-foreground">
              {t("learn.glossary.watchlist.title")}
            </p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {t("learn.glossary.watchlist.description")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
