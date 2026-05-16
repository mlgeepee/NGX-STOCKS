import { useMemo, useState } from "react";
import { Target } from "lucide-react";
import { simulateNextDay } from "@/lib/phase2/simulatorEngine";

export default function Simulator({ stocks = [] }) {
  const [initialCapital, setInitialCapital] = useState(10000);
  const [aSymbol, setASymbol] = useState("");
  const [bSymbol, setBSymbol] = useState("");
  const [weightA, setWeightA] = useState(50);
  const [weightB, setWeightB] = useState(50);

  const allocation = useMemo(() => {
    if (!aSymbol || !bSymbol) return [];
    return [
      { symbol: aSymbol, weight: weightA },
      { symbol: bSymbol, weight: weightB },
    ];
  }, [aSymbol, bSymbol, weightA, weightB]);

  const sim = useMemo(() => {
    return simulateNextDay({ stocks, allocation, initialCapital });
  }, [stocks, allocation, initialCapital]);

  return (
    <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Simulator</p>
          <h3 className="mt-2 text-2xl font-semibold text-foreground">
            Next-day Projection
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Heuristic projection using the current changePercent snapshot.
          </p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-primary/10 text-primary">
          <Target className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Initial capital
          </label>
          <input
            className="app-input"
            type="number"
            value={initialCapital}
            onChange={(e) => setInitialCapital(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            A / B symbols
          </label>
          <div className="flex gap-2">
            <input
              className="app-input"
              value={aSymbol}
              onChange={(e) => setASymbol(e.target.value)}
              placeholder="A"
            />
            <input
              className="app-input"
              value={bSymbol}
              onChange={(e) => setBSymbol(e.target.value)}
              placeholder="B"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Weight A (%)
          </label>
          <input
            className="app-input"
            type="number"
            value={weightA}
            onChange={(e) => setWeightA(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Weight B (%)
          </label>
          <input
            className="app-input"
            type="number"
            value={weightB}
            onChange={(e) => setWeightB(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="mt-6 rounded-[1.35rem] border border-border/65 bg-white/55 p-4">
        <p className="text-sm text-muted-foreground">
          Projected next-day return
        </p>
        <div className="mt-2 text-3xl font-semibold text-foreground">
          {sim.nextDayReturnPercent.toFixed(2)}%
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Projected capital:{" "}
          {Number(sim.projectedCapital).toLocaleString("en-NG", {
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </section>
  );
}
