import { useMemo } from "react";
import { Flame } from "lucide-react";
import { detectWhaleCandidates } from "@/lib/phase2/whaleDetectorEngine";

export default function WhaleDetector({ stocks = [] }) {
  const candidates = useMemo(
    () => detectWhaleCandidates(stocks, { minMultiplier: 1.5 }),
    [stocks],
  );

  return (
    <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Whale Detector</p>
          <h3 className="mt-2 text-2xl font-semibold text-foreground">
            Volume Spike Watch
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Symbols trading with unusually high volume vs average.
          </p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-primary/10 text-primary">
          <Flame className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {!candidates.length ? (
          <div className="rounded-[1.35rem] border border-dashed border-border/70 bg-white/50 p-4 text-sm text-muted-foreground">
            No whale candidates right now.
          </div>
        ) : (
          candidates.slice(0, 6).map((c) => (
            <div
              key={c.symbol}
              className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-border/65 bg-white/55 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">
                  {c.symbol} • {c.name || "—"}
                </p>
                <p className="text-xs text-muted-foreground">{c.sector}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  {c.volumeMultiplier.toFixed(2)}x
                </p>
                <p className="text-xs text-muted-foreground">vol multiplier</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
