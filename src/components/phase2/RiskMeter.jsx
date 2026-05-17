import { useMemo } from "react";
import { Shield } from "lucide-react";
import { computeRiskScore } from "@/lib/phase2/riskEngine";
import { usePreferencesStore } from "../../../store/usePreferencesStore";
import { translate } from "@/lib/i18n";

export default function RiskMeter({ stocks = [], portfolioSymbols = [] }) {
  const language = usePreferencesStore((state) => state.language);
  const t = (path) => translate(language, path);
  const risk = useMemo(
    () => computeRiskScore(stocks, { portfolioSymbols }),
    [stocks, portfolioSymbols],
  );

  const colorClass =
    risk.band === "high"
      ? "bg-rose-500/10 text-rose-700 dark:text-rose-300"
      : risk.band === "medium"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";

  return (
    <section className="app-panel rounded-[1.75rem] p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker">
            {t("phase2.riskMeter.sectionKicker")}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-foreground">
            {t("phase2.riskMeter.title")}
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {t("phase2.riskMeter.description")}
          </p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-primary/10 text-primary">
          <Shield className="h-5 w-5" />
        </span>
      </div>

      <div
        className={`mt-6 rounded-[1.35rem] border border-border/65 bg-white/55 p-4 ${colorClass}`}
      >
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.18em] opacity-90">
            {t("phase2.riskMeter.riskLabel")}
          </p>
          <div className="text-4xl font-semibold">{risk.score}</div>
        </div>
        <p className="mt-2 text-sm font-semibold">
          {t(`phase2.riskMeter.riskStatus.${risk.band}`)}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] opacity-90">
              {t("phase2.riskMeter.volatilityComponentLabel")}
            </p>
            <p className="font-semibold">{risk.volatilityComponent}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] opacity-90">
              {t("phase2.riskMeter.movementComponentLabel")}
            </p>
            <p className="font-semibold">{risk.movementComponent}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
