import { BookOpen, CandlestickChart, ShieldCheck } from "lucide-react";
import Header from "../src/components/Header";

const learningCards = [
  {
    title: "Reading Market Breadth",
    description:
      "Learn how gainers, losers, and average market change combine into a fast view of sentiment.",
    icon: CandlestickChart,
    accent: "from-primary/35 to-accent text-accent-foreground",
  },
  {
    title: "Building Better Watchlists",
    description:
      "Use sector balance, liquidity, and volatility to create watchlists that stay useful under pressure.",
    icon: BookOpen,
    accent: "from-accent to-white text-accent-foreground",
  },
  {
    title: "Risk Management Basics",
    description:
      "Review position sizing, stop discipline, and the signals that matter before acting on a move.",
    icon: ShieldCheck,
    accent: "from-secondary to-accent text-accent-foreground",
  },
];

export default function Learn() {
  return (
    <div>
      <Header
        title="Learn"
        subtitle="A lightweight learning hub for market concepts that pair with the analytics views across the dashboard."
      />

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
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {card.description}
              </p>
            </article>
          );
        })}
      </div>

      <div className="app-panel mt-7 p-7">
        <h2 className="text-2xl font-semibold text-foreground">
          Quick glossary
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[1.5rem] bg-secondary p-5">
            <p className="text-sm font-semibold text-foreground">
              Market trend
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              A snapshot of the average percentage move across tracked stocks.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-secondary p-5">
            <p className="text-sm font-semibold text-foreground">
              Volume
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The number of shares traded over the selected market session.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-secondary p-5">
            <p className="text-sm font-semibold text-foreground">
              Watchlist
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              A saved shortlist for quicker monitoring and faster follow-up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
