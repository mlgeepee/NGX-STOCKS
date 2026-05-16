import { useMemo, useState } from "react";
import { Target } from "lucide-react";
import { simulateNextDay } from "@/lib/phase2/simulatorEngine";

export default function Simulator({ stocks = [] }) {
  const [initialCapital, setInitialCapital] = useState(10000);
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
  const [weightA, setWeightA] = useState(50);
  const [weightB, setWeightB] = useState(50);

  const resolveInputToSymbol = (input) => {
    const normalizeLooseSym = (v) =>
      String(v || "")
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");

    const normalizeLooseName = (v) =>
      String(v || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    const keySymLoose = normalizeLooseSym(input);
    const keyNameLoose = normalizeLooseName(input);

    if (!keySymLoose && !keyNameLoose) return null;

    const found = (Array.isArray(stocks) ? stocks : []).find((s) => {
      const symLoose = normalizeLooseSym(s?.symbol);
      const nameLoose = normalizeLooseName(s?.name);
      return (
        (keySymLoose && symLoose === keySymLoose) ||
        (keyNameLoose && nameLoose === keyNameLoose)
      );
    });

    return found?.symbol ? String(found.symbol).toUpperCase() : null;
  };

  const allocation = useMemo(() => {
    if (!normalizedA || !normalizedB) return [];

    const resolvedA = resolveInputToSymbol(aSymbol);
    const resolvedB = resolveInputToSymbol(bSymbol);

    return [
      { symbol: resolvedA || normalizedA, weight: weightA },
      { symbol: resolvedB || normalizedB, weight: weightB },
    ];
  }, [
    aSymbol,
    bSymbol,
    normalizedA,
    normalizedB,
    resolveInputToSymbol,
    weightA,
    weightB,
  ]);

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
              inputMode="text"
              autoCapitalize="characters"
            />
            <input
              className="app-input"
              value={bSymbol}
              onChange={(e) => setBSymbol(e.target.value)}
              placeholder="B"
              inputMode="text"
              autoCapitalize="characters"
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

        <div className="mt-4">
          {!allocation.length ? (
            <p className="text-sm text-muted-foreground">
              Enter valid A and B symbols to see next-day projection.
            </p>
          ) : !sim.contributions.length ? (
            <p className="text-sm text-muted-foreground">
              No contributions found (check symbol match and weights).
            </p>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Contribution breakdown
              </p>
              <div className="mt-3 space-y-2">
                {sim.contributions.map((c) => (
                  <div
                    key={c.symbol}
                    className="flex items-center justify-between gap-3 rounded-[1rem] border border-border/60 bg-white/65 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-foreground">
                        {c.symbol}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Weight: {Math.round(c.weight * 100)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        {c.expectedMovePercent.toFixed(2)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Contrib: {c.contributionPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
