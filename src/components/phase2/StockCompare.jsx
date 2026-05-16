import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { compareStocks } from "@/lib/phase2/compareEngine";

export default function StockCompare({ stocks = [] }) {
  const [aSymbol, setASymbol] = useState("");
  const [bSymbol, setBSymbol] = useState("");

  const normalizedA = useMemo(
    () =>
      String(aSymbol || "")
        .trim()
        .toUpperCase(),
    [aSymbol],
  );
  const normalizedB = useMemo(
    () =>
      String(bSymbol || "")
        .trim()
        .toUpperCase(),
    [bSymbol],
  );

  const result = useMemo(() => {
    if (!normalizedA || !normalizedB) return null;
    return compareStocks(stocks, normalizedA, normalizedB);
  }, [stocks, normalizedA, normalizedB]);

  return (
    <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Compare</p>
          <h3 className="mt-2 text-2xl font-semibold text-foreground">
            Stock Compare
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Side-by-side fields from the current board snapshot.
          </p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-primary/10 text-primary">
          <ArrowLeftRight className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            A symbol
          </label>
          <input
            className="app-input"
            value={aSymbol}
            onChange={(e) => setASymbol(e.target.value)}
            placeholder="e.g. DANGCEM"
            inputMode="text"
            autoCapitalize="characters"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            B symbol
          </label>
          <input
            className="app-input"
            value={bSymbol}
            onChange={(e) => setBSymbol(e.target.value)}
            placeholder="e.g. GTCOPLC"
            inputMode="text"
            autoCapitalize="characters"
          />
        </div>
      </div>

      <div className="mt-6 rounded-[1.35rem] border border-border/65 bg-white/55 p-4">
        {!result ? (
          <p className="text-sm text-muted-foreground">
            Enter two valid symbols to compare.
          </p>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-foreground">
                {result.a.symbol}
              </div>
              <div className="text-muted-foreground">vs</div>
              <div className="font-semibold text-foreground">
                {result.b.symbol}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-[1rem] border border-border/60 bg-white/65 p-3">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Price
                </div>
                <div className="mt-1 font-semibold">
                  {result.a.price} / {result.b.price}
                </div>
              </div>

              <div className="rounded-[1rem] border border-border/60 bg-white/65 p-3">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Move %
                </div>
                <div className="mt-1 font-semibold">
                  {result.a.changePercent}% / {result.b.changePercent}%
                </div>
              </div>

              <div className="rounded-[1rem] border border-border/60 bg-white/65 p-3">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Delta %
                </div>
                <div className="mt-1 font-semibold">
                  {result.delta.changePercent}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
