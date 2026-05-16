import { useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  ArrowRightLeft,
  Activity,
  Zap,
} from "lucide-react";
import {
  getHighestVolumeSpike,
  getMostTraded,
  getMostVolatile,
  getTopGainers,
  getTopLosers,
} from "@/lib/marketPulseEngine";

const tabDefs = [
  { id: "gainers", label: "Top Gainers", Icon: TrendingUp },
  { id: "losers", label: "Top Losers", Icon: TrendingDown },
  { id: "traded", label: "Most Traded", Icon: ArrowRightLeft },
  { id: "volatile", label: "Most Volatile", Icon: Activity },
  { id: "spike", label: "Highest Volume Spike", Icon: Zap },
];

function getLocalLogoSrc(symbol, fallbackLogo) {
  // If upstream already provided a logo URL, prefer it
  if (fallbackLogo) return fallbackLogo;

  const s = String(symbol || "").toUpperCase();

  // File names in this folder look like: ZENITHBANK.jpg, FCMB.jpg, MTNN.jpg, etc.
  // Normalize symbol into something filename-friendly (e.g. "Zenith Bank" -> "ZENITHBANK")
  const normalized = s.replace(/\s+/g, "");

  // Known ticker -> filename mismatches in the community folder
  const aliasMap = {
    MTN: "MTNN",
    GUARANTYTRUST: "GTCO", // safety alias; may vary by upstream
  };

  const fileBase = aliasMap[normalized] || normalized;

  // Use the community folder (note spaces + parentheses)
  return `/NGX LOGOS (Community)/${fileBase}.jpg`;
}

function formatMaybeCurrency(value) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "-";
  try {
    return n.toLocaleString("en-NG", { maximumFractionDigits: 2 });
  } catch {
    return String(n);
  }
}

function formatSignPercent(changePercent) {
  const n =
    typeof changePercent === "number" ? changePercent : Number(changePercent);
  if (!Number.isFinite(n)) return "";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function GlowingBadge({ tone, children }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold transition",
        tone === "up"
          ? "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-400/20 dark:text-emerald-300"
          : tone === "down"
            ? "bg-rose-500/10 text-rose-700 ring-1 ring-rose-400/20 dark:text-rose-300"
            : "bg-primary/10 text-primary ring-1 ring-primary/20",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function RankCard({ items, metric, tone }) {
  return (
    <div className="mt-4 space-y-3">
      {items.length ? (
        items.map((item, idx) => {
          const badgeTone =
            tone === "up"
              ? "up"
              : tone === "down"
                ? "down"
                : tone === "neutral"
                  ? "neutral"
                  : item.changePercent >= 0
                    ? "up"
                    : "down";

          return (
            <article
              key={item.symbol || idx}
              className="group relative overflow-hidden rounded-[1.25rem] border border-border/70 bg-white/58 p-3.5 shadow-[0_20px_48px_rgba(15,23,42,0.08)] transition hover:-translate-y-[1px]"
            >
              <div className="absolute inset-0 transition duration-300 opacity-0 group-hover:opacity-100">
                <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(210,161,74,0.18),transparent_40%),radial-gradient(circle_at_bottom,rgba(15,138,95,0.12),transparent_45%)]" />
              </div>

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center min-w-0 gap-3">
                  <div
                    className="flex items-center justify-center w-10 h-10 text-sm font-bold shrink-0 text-foreground"
                    aria-label={`Rank ${idx + 1}`}
                  >
                    {idx + 1}
                  </div>

                  <div className="flex items-center min-w-0 gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[1rem] border border-primary/10 bg-white/60">
                      <img
                        src={getLocalLogoSrc(item.symbol, item.logo)}
                        alt={item.name || item.symbol}
                        className="object-cover w-10 h-10"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-foreground">
                        {item.name || item.symbol}
                      </p>
                      <p className="mt-1 truncate text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {item.symbol}
                        {item.sector ? ` • ${item.sector}` : ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  {metric === "change" ? (
                    <GlowingBadge tone={badgeTone}>
                      {formatSignPercent(item.changePercent)}
                    </GlowingBadge>
                  ) : metric === "volume" ? (
                    <GlowingBadge tone="neutral">
                      {formatMaybeCurrency(item.volume)}
                    </GlowingBadge>
                  ) : metric === "spike" ? (
                    <GlowingBadge tone="up">
                      {Number.isFinite(item.spikePercent)
                        ? `${item.spikePercent.toFixed(1)}%`
                        : "-"}
                    </GlowingBadge>
                  ) : metric === "volatility" ? (
                    <GlowingBadge tone="neutral">
                      {formatMaybeCurrency(
                        item.volatility ?? item.changePercent,
                      )}
                    </GlowingBadge>
                  ) : (
                    <GlowingBadge tone="neutral">
                      {formatMaybeCurrency(item.price)}
                    </GlowingBadge>
                  )}
                </div>
              </div>
            </article>
          );
        })
      ) : (
        <div className="rounded-[1.25rem] border border-dashed border-border/70 bg-white/35 p-4 text-sm text-muted-foreground">
          No data available.
        </div>
      )}
    </div>
  );
}

export default function MarketPulse({ stocks = [] }) {
  const [activeTab, setActiveTab] = useState("gainers");

  const gainers = getTopGainers(stocks, 5);
  const losers = getTopLosers(stocks, 5);
  const traded = getMostTraded(stocks, 5);
  const volatile = getMostVolatile(stocks, 5);
  const spike = getHighestVolumeSpike(stocks);

  const tabs = {
    gainers: {
      title: "Top Gainers",
      subtitle: "Strongest positive momentum",
      items: gainers,
      metric: "change",
      tone: "up",
    },
    losers: {
      title: "Top Losers",
      subtitle: "Biggest negative moves",
      items: losers,
      metric: "change",
      tone: "down",
    },
    traded: {
      title: "Most Traded",
      subtitle: "Highest liquidity right now",
      items: traded,
      metric: "volume",
      tone: "neutral",
    },
    volatile: {
      title: "Most Volatile",
      subtitle: "Highest movement intensity",
      items: volatile,
      metric: "volatility",
      tone: "neutral",
    },
    spike: {
      title: "Highest Volume Spike",
      subtitle: "Liquidity burst vs average",
      items: spike ? [spike] : [],
      metric: "spike",
      tone: "up",
    },
  };

  const active = tabs[activeTab] || tabs.gainers;

  return (
    <section className="app-panel surface-noise overflow-hidden rounded-[1.95rem] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent-foreground">
            Today’s Market Pulse
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
            Insider Dashboard
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Fast rankings derived from live market data.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          {tabDefs.map((tab) => {
            const { id, label } = tab;
            const isActive = id === activeTab;
            const Icon = tab.Icon;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition",
                  isActive
                    ? "border-primary/30 bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(210,161,74,0.18)]"
                    : "border-border/70 bg-white/45 text-muted-foreground hover:text-foreground dark:bg-white/5",
                ].join(" ")}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-[1.6rem] border border-border/60 bg-white/40 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {active.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {active.subtitle}
            </p>
          </div>
          <div className="items-center hidden gap-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.65)]" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Live
            </span>
          </div>
        </div>

        <RankCard
          items={active.items}
          metric={active.metric}
          tone={active.tone}
        />
      </div>
    </section>
  );
}
