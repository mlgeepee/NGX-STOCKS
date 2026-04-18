import { BookOpen, CandlestickChart, ShieldCheck } from "lucide-react";
import Header from "../src/components/Header";
import { translate } from "../src/lib/i18n";
import { usePreferencesStore } from "../store/usePreferencesStore";

const learningCards = [
  {
    titleKey: "learn.cards.breadth.title",
    descriptionKey: "learn.cards.breadth.description",
    icon: CandlestickChart,
    accent: "from-primary/35 to-accent text-accent-foreground",
  },
  {
    titleKey: "learn.cards.watchlists.title",
    descriptionKey: "learn.cards.watchlists.description",
    icon: BookOpen,
    accent: "from-accent to-white text-accent-foreground",
  },
  {
    titleKey: "learn.cards.risk.title",
    descriptionKey: "learn.cards.risk.description",
    icon: ShieldCheck,
    accent: "from-secondary to-accent text-accent-foreground",
  },
];

export default function Learn() {
  const language = usePreferencesStore((state) => state.language);
  const t = (path) => translate(language, path);
  return (
    <div>
      <Header title={t("learn.title")} subtitle={t("learn.subtitle")} />

      <div className="grid gap-5 lg:grid-cols-3">
        {learningCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="app-panel p-7 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-[1.15rem] bg-gradient-to-br ${card.accent}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-foreground">
                {t(card.titleKey)}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {t(card.descriptionKey)}
              </p>
            </article>
          );
        })}
      </div>

      <div className="app-panel mt-7 p-7">
        <h2 className="text-2xl font-semibold text-foreground">
          {t("learn.glossaryTitle")}
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[1.5rem] bg-secondary p-5">
            <p className="text-sm font-semibold text-foreground">
              {t("learn.glossary.marketTrend.title")}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("learn.glossary.marketTrend.description")}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-secondary p-5">
            <p className="text-sm font-semibold text-foreground">
              {t("learn.glossary.volume.title")}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("learn.glossary.volume.description")}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-secondary p-5">
            <p className="text-sm font-semibold text-foreground">
              {t("learn.glossary.watchlist.title")}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("learn.glossary.watchlist.description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
