import { getFallbackLogoUrl, getLogoUrl } from "../../services/api";

const sizeClasses = {
  sm: "h-10 w-10 rounded-2xl",
  md: "h-12 w-12 rounded-2xl",
  lg: "h-14 w-14 rounded-[1.25rem]",
  xl: "h-16 w-16 rounded-[1.5rem]",
};

export default function StockLogo({
  symbol,
  name,
  logo,
  size = "md",
  className = "",
}) {
  const resolvedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`flex items-center justify-center overflow-hidden border border-primary/15 bg-accent/80 shadow-sm ${resolvedSize} ${className}`.trim()}
    >
      <img
        src={logo || getLogoUrl(symbol)}
        alt={`${name || symbol} logo`}
        className="h-full w-full object-contain p-2"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = getFallbackLogoUrl(symbol);
        }}
      />
    </div>
  );
}
