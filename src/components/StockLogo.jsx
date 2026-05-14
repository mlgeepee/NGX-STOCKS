import { useEffect, useMemo, useState } from "react";
import { getFallbackLogoUrl, getLogoCandidates } from "../../services/api";

const sizeClasses = {
  sm: "h-10 w-10 rounded-[1rem]",
  md: "h-12 w-12 rounded-[1rem]",
  lg: "h-14 w-14 rounded-[1.1rem]",
  xl: "h-16 w-16 rounded-[1.2rem]",
};

const fallbackTones = [
  {
    bg: "bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-200",
    ring: "ring-emerald-400/20",
  },
  {
    bg: "bg-sky-500/15",
    text: "text-sky-700 dark:text-sky-200",
    ring: "ring-sky-400/20",
  },
  {
    bg: "bg-amber-500/18",
    text: "text-amber-700 dark:text-amber-200",
    ring: "ring-amber-400/25",
  },
  {
    bg: "bg-rose-500/14",
    text: "text-rose-700 dark:text-rose-200",
    ring: "ring-rose-400/20",
  },
  {
    bg: "bg-violet-500/14",
    text: "text-violet-700 dark:text-violet-200",
    ring: "ring-violet-400/20",
  },
  {
    bg: "bg-cyan-500/14",
    text: "text-cyan-700 dark:text-cyan-200",
    ring: "ring-cyan-400/20",
  },
];

function getCompanyInitials(name, symbol) {
  const tokens = String(name || symbol || "NGX")
    .trim()
    .split(/[\s&/,-]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .filter(
      (part) =>
        !["and", "for", "of", "the", "plc", "group", "holdings"].includes(
          part.toLowerCase(),
        ),
    );

  if (tokens.length >= 2) {
    return tokens
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }

  return String(tokens[0] || symbol || "NG")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 2)
    .toUpperCase();
}

function getToneSeed(value) {
  return String(value || "NGX")
    .split("")
    .reduce((sum, character) => sum + character.charCodeAt(0), 0);
}

export default function StockLogo({
  symbol,
  name,
  logo,
  size = "md",
  className = "",
}) {
  const resolvedSize = sizeClasses[size] || sizeClasses.md;
  const fallbackLogo = useMemo(() => getFallbackLogoUrl(symbol), [symbol]);
  const logoCandidates = useMemo(
    () => getLogoCandidates({ symbol, name, logo }),
    [logo, name, symbol],
  );
  const logoCandidatesKey = logoCandidates.join("|");
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [logoCandidatesKey]);

  const resolvedLogo = logoCandidates[candidateIndex] || "";
  const resolvedLogoKey = resolvedLogo
    ? `logo:${candidateIndex}:${resolvedLogo}`
    : "logo:none";
  const showInitialsFallback = !resolvedLogo || resolvedLogo === fallbackLogo;
  const initials = getCompanyInitials(name, symbol);
  const tone =
    fallbackTones[getToneSeed(name || symbol) % fallbackTones.length];

  return (
    <div
      className={`flex items-center justify-center overflow-hidden border border-border/70 bg-white/70 shadow-sm backdrop-blur-sm ${resolvedSize} ${className}`.trim()}
    >
      {showInitialsFallback ? (
        <div
          className={`flex h-full w-full items-center justify-center text-sm font-semibold tracking-[0.18em] ring-1 ${tone.bg} ${tone.text} ${tone.ring}`}
          aria-label={`${name || symbol} initials logo`}
        >
          {initials}
        </div>
      ) : (
        <img
          key={resolvedLogoKey}
          src={resolvedLogo}
          alt={`${name || symbol} logo`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => {
            setCandidateIndex((currentIndex) => currentIndex + 1);
          }}
        />
      )}
    </div>
  );
}
