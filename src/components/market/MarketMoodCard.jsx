import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { getMarketMood } from "@/lib/marketMoodEngine";

export default function MarketMoodCard({ stocks = [] }) {
  const moodData = useMemo(() => getMarketMood(stocks), [stocks]);

  return (
    <section className="app-panel rounded-[1.75rem] border border-border/70 bg-white/70 p-5 shadow-lg backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-[1.05rem] bg-primary/10 text-primary shadow-sm">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <p className="section-kicker">Market Mood</p>
          <h3 className="mt-2 text-2xl font-semibold text-foreground capitalize">
            {moodData.mood}
          </h3>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.35rem] border border-border/70 bg-white/60 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Confidence
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {moodData.confidence}%
          </p>
        </div>
        <div className="rounded-[1.35rem] border border-border/70 bg-white/60 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Strongest sector
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {moodData.strongestSector || "—"}
          </p>
        </div>
        <div className="rounded-[1.35rem] border border-border/70 bg-white/60 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Weakest sector
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {moodData.weakestSector || "—"}
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-muted-foreground">
        {moodData.summary}
      </p>
    </section>
  );
}
