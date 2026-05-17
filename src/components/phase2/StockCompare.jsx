import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { compareStocks } from "@/lib/phase2/compareEngine";
import { usePreferencesStore } from "../../../store/usePreferencesStore";
import { translate } from "@/lib/i18n";

export default function StockCompare({ stocks = [] }) {
  const language = usePreferencesStore((state) => state.language);
  const t = (path) => translate(language, path);
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
          <p className="section-kicker">
            {t("phase2.stockCompare.sectionKicker")}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-foreground">
            {t("phase2.stockCompare.title")}
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {t("phase2.stockCompare.description")}
          </p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-primary/10 text-primary">
          <ArrowLeftRight className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("phase2.stockCompare.aSymbolLabel")}
          </label>
          <input
            className="app-input"
            value={aSymbol}
            onChange={(e) => setASymbol(e.target.value)}
            placeholder={t("phase2.stockCompare.placeholderA")}
            inputMode="text"
            autoCapitalize="characters"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("phase2.stockCompare.bSymbolLabel")}
          </label>
          <input
            className="app-input"
            value={bSymbol}
            onChange={(e) => setBSymbol(e.target.value)}
            placeholder={t("phase2.stockCompare.placeholderB")}
            inputMode="text"
            autoCapitalize="characters"
          />
        </div>
      </div>

      <div className="mt-6 surface-card p-4">
        {!result ? (
          <p className="text-sm text-muted-foreground">
            {t("phase2.stockCompare.hint")}
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
              <div className="surface-card-soft p-3">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {t("phase2.stockCompare.priceLabel")}
                </div>
                <div className="mt-1 font-semibold">
                  {result.a.price} / {result.b.price}
                </div>
              </div>

              <div className="surface-card-soft p-3">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {t("phase2.stockCompare.movePercentLabel")}
                </div>
                <div className="mt-1 font-semibold">
                  {result.a.changePercent}% / {result.b.changePercent}%
                </div>
              </div>

              <div className="surface-card-soft p-3">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {t("phase2.stockCompare.deltaLabel")}
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
