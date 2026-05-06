## Shared UI Primitives

### `src/components/ui/button.tsx`

Component: `Button`

Description: Variant-based button primitive used by the landing page hero.

```tsx
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm shadow-black/5 hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm shadow-black/5 hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm shadow-black/5 hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm shadow-black/5 hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link:
          "text-accent-foreground underline-offset-4 hover:text-foreground hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### `src/components/ui/alert.tsx`

Component: `Alert`, `useAlert`

Description: Floating alert/toast used across authentication pages.

```tsx
import * as React from "react";
import { X } from "lucide-react";

interface AlertProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose?: () => void;
  duration?: number;
}

export function Alert({
  message,
  type = "info",
  onClose,
  duration = 5000,
}: AlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.819-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-accent-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-accent/95 border-primary/20 text-accent-foreground";
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed z-50 duration-300 top-4 right-4 animate-in slide-in-from-right-full">
      <div
        className={`relative rounded-lg border p-4 shadow-lg ${getBackgroundColor()}`}
      >
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 inline-flex rounded-md p-1.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function useAlert() {
  const [alerts, setAlerts] = React.useState<
    Array<{ id: string; message: string; type: any; duration: number }>
  >([]);

  const showAlert = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
    duration = 5000,
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const AlertContainer = () => (
    <div className="fixed z-50 space-y-2 top-4 right-4">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          message={alert.message}
          type={alert.type}
          duration={alert.duration}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );

  return { showAlert, AlertContainer };
}
```

### `src/components/ui/background-gradient-snippet.tsx`

Component: `Component`

Description: Background wash used behind auth pages.

```tsx
export default function Component() {
  return (
    <div className="fixed inset-0 -z-10 bg-background">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle 560px at 50% 200px, oklch(var(--primary) / 0.3), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[size:18px_18px]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(var(--primary) / 0.1) 1px, transparent 1px), linear-gradient(to bottom, oklch(var(--primary) / 0.1) 1px, transparent 1px)",
        }}
      />
    </div>
  );
}
```

### `src/components/ui/luma-spin.tsx`

Component: `Component`

Description: Route-level loading spinner.

```tsx
export const Component = () => {
  return (
    <div className="relative w-[65px] aspect-square">
      <span className="absolute rounded-[50px] animate-loaderAnim shadow-[inset_0_0_0_3px] shadow-gray-800 dark:shadow-gray-100" />
      <span className="absolute rounded-[50px] animate-loaderAnim animation-delay shadow-[inset_0_0_0_3px] shadow-gray-800 dark:shadow-gray-100" />
      <style>{`
        @keyframes loaderAnim {
          0% {
            inset: 0 35px 35px 0;
          }
          12.5% {
            inset: 0 35px 0 0;
          }
          25% {
            inset: 35px 35px 0 0;
          }
          37.5% {
            inset: 35px 0 0 0;
          }
          50% {
            inset: 35px 0 0 35px;
          }
          62.5% {
            inset: 0 0 0 35px;
          }
          75% {
            inset: 0 0 35px 35px;
          }
          87.5% {
            inset: 0 0 35px 0;
          }
          100% {
            inset: 0 35px 35px 0;
          }
        }
        .animate-loaderAnim {
          animation: loaderAnim 2.5s infinite;
        }
        .animation-delay {
          animation-delay: -1.25s;
        }
      `}</style>
    </div>
  );
};
```

### `src/components/ui/ngx-logo.tsx`

Component: `NGXLogo`, `SimpleNGXLogo`

Description: Branded inline SVG logos.

```tsx
import * as React from "react";

export const NGXLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" fill="oklch(var(--primary))" />
    <path
      d="M12 6v12M8 10l4 2 4-2"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fill="#ffffff"
      fontSize="6"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
    >
      NGX
    </text>
  </svg>
);

export const SimpleNGXLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="6" width="16" height="12" rx="3" fill="oklch(var(--primary))" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fill="#ffffff"
      fontSize="8"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
    >
      NGX
    </text>
  </svg>
);
```

### `src/components/ui/floating-icons-hero-section.tsx`

Component: `FloatingIconsHero`

Description: Marketing hero with brand navigation, motion-driven floating stock logos, and CTA.

```tsx
import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "./button";

interface IconProps {
  id: number;
  src: string;
  alt?: string;
  className: string;
}

export interface FloatingIconsHeroProps {
  title: string | React.ReactNode;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  icons: IconProps[];
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  ctaClassName?: string;
  showNav?: boolean;
  logo?: React.ReactNode;
  navLoginHref?: string;
  navSignupHref?: string;
}

const Icon = ({
  mouseX,
  mouseY,
  iconData,
  index,
}: {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  iconData: IconProps;
  index: number;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  React.useEffect(() => {
    const handleMouseMove = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(mouseX.current - (rect.left + rect.width / 2), 2) +
          Math.pow(mouseY.current - (rect.top + rect.height / 2), 2),
      );

      if (distance < 150) {
        const angle = Math.atan2(
          mouseY.current - (rect.top + rect.height / 2),
          mouseX.current - (rect.left + rect.width / 2),
        );
        const force = (1 - distance / 150) * 50;
        x.set(-Math.cos(angle) * force);
        y.set(-Math.sin(angle) * force);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("absolute", iconData.className)}
    >
      <motion.div
        className="flex items-center justify-center w-16 h-16 p-3 border shadow-xl rounded-3xl border-border/10 bg-card/80 backdrop-blur-md md:h-20 md:w-20"
        animate={{
          y: [0, -8, 0, 8, 0],
          x: [0, 6, 0, -6, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 5 + Math.random() * 5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <img
          src={iconData.src}
          alt={iconData.alt ?? "Company logo"}
          className="object-contain w-8 h-8 md:h-10 md:w-10"
          loading="lazy"
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
};

const FloatingIconsHero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FloatingIconsHeroProps
>(
  (
    {
      className,
      title,
      subtitle,
      ctaText,
      ctaHref,
      icons,
      titleClassName,
      subtitleClassName,
      ctaClassName,
      showNav = false,
      logo,
      navLoginHref = "/login",
      navSignupHref = "/signup",
      ...props
    },
    ref,
  ) => {
    const mouseX = React.useRef(0);
    const mouseY = React.useRef(0);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      mouseX.current = event.clientX;
      mouseY.current = event.clientY;
    };

    return (
      <section
        ref={ref}
        onMouseMove={handleMouseMove}
        className={cn(
          "relative flex h-screen min-h-[700px] w-full items-center justify-center overflow-hidden bg-background",
          className,
        )}
        {...props}
      >
        <div className="absolute inset-0 w-full h-full">
          {icons.map((iconData, index) => (
            <Icon
              key={iconData.id}
              mouseX={mouseX}
              mouseY={mouseY}
              iconData={iconData}
              index={index}
            />
          ))}
        </div>

        {showNav && (
          <div className="absolute top-0 left-0 right-0 z-20 px-4 py-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between mx-auto max-w-7xl">
              <a href="/" className="flex items-center gap-2">
                {logo || (
                  <span className="text-xl font-bold text-foreground">
                    NGX Stocks
                  </span>
                )}
              </a>
              <div className="flex items-center gap-4">
                <a href={navLoginHref}>
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </a>
                <a href={navSignupHref}>
                  <Button
                    size="sm"
                    className="bg-foreground text-background hover:bg-foreground/90"
                  >
                    Get Started
                  </Button>
                </a>
              </div>
            </nav>
          </div>
        )}

        <div className="relative z-10 px-4 text-center">
          <h1
            className={cn(
              "text-5xl font-bold tracking-tight md:text-7xl",
              typeof title === "string"
                ? "bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
                : "",
              titleClassName,
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              "mx-auto mt-6 max-w-xl text-lg text-muted-foreground",
              subtitleClassName,
            )}
          >
            {subtitle}
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className={cn(
                "px-8 py-6 text-base font-semibold group",
                ctaClassName,
              )}
            >
              <a href={ctaHref} className="flex items-center gap-2">
                {ctaText}
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </a>
            </Button>
          </div>
        </div>
      </section>
    );
  },
);

FloatingIconsHero.displayName = "FloatingIconsHero";

export { FloatingIconsHero };
```

### `src/components/ui/floating-icons-hero-demo.tsx`

Component: `FloatingIconsHeroDemo`

Description: Concrete landing-page instance of the floating hero using real stock logos and auth-aware CTA text.

```tsx
import {
  FloatingIconsHero,
  type FloatingIconsHeroProps,
} from "./floating-icons-hero-section";
const demoIcons: FloatingIconsHeroProps["icons"] = [
  {
    id: 1,
    src: "/logos/Dangote-cement.png",
    alt: "Dangote Cement",
    className: "top-[10%] left-[10%]",
  },
  {
    id: 2,
    src: "/logos/Conoil.svg",
    alt: "Conoil",
    className: "bottom-[5%] right-[45%]",
  },
  {
    id: 3,
    src: "/logos/Airtel.png",
    alt: "Airtel",
    className: "top-[80%] left-[10%]",
  },
  {
    id: 4,
    src: "/logos/Bua-foods.png",
    alt: "BUA Foods",
    className: "bottom-[10%] right-[10%]",
  },
  {
    id: 5,
    src: "/logos/Zenith.png",
    alt: "Zenith Bank",
    className: "top-[5%] left-[30%]",
  },
  {
    id: 6,
    src: "/logos/GTCO.png",
    alt: "GTCO",
    className: "top-[5%] right-[30%]",
  },
  {
    id: 7,
    src: "/logos/UBA.png",
    alt: "UBA",
    className: "bottom-[8%] left-[25%]",
  },
  {
    id: 8,
    src: "/logos/FCMB.png",
    alt: "FCMB",
    className: "top-[40%] left-[15%]",
  },
  {
    id: 9,
    src: "/logos/Transcorp.svg",
    alt: "Transcorp",
    className: "top-[75%] right-[25%]",
  },
  {
    id: 10,
    src: "/logos/Seplat-energy.svg",
    alt: "Seplat Energy",
    className: "top-[90%] left-[70%]",
  },
  {
    id: 11,
    src: "/logos/Access.png",
    alt: "Access Bank",
    className: "top-[50%] right-[5%]",
  },
  {
    id: 12,
    src: "/logos/Guinness.svg",
    alt: "Guinness Nigeria",
    className: "top-[55%] left-[5%]",
  },
  {
    id: 13,
    src: "/logos/Oando.png",
    alt: "Oando",
    className: "top-[5%] left-[55%]",
  },
  {
    id: 14,
    src: "/logos/MTN.png",
    alt: "MTN",
    className: "top-[20%] right-[8%]",
  },
  {
    id: 15,
    src: "/logos/Aradel-holdings.png",
    alt: "Aradel Holdings",
    className: "top-[25%] right-[20%]",
  },
  {
    id: 16,
    src: "/logos/Nestle.png",
    alt: "Nestle Nigeria",
    className: "top-[60%] left-[30%]",
  },
];

import { useAuthStore } from "../../../store/useAuthStore";

export default function FloatingIconsHeroDemo() {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const ctaText = isAuthLoading
    ? "Loading..."
    : user
      ? "Go to Dashboard"
      : "Get Started";
  const ctaHref = isAuthLoading ? "#" : user ? "/dashboard" : "/signup";

  return (
    <FloatingIconsHero
      className="bg-background"
      title={
        <span className="text-foreground bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
          Track the{" "}
          <span className="text-accent-foreground font-bold">
            Nigerian Stock Market
          </span>
        </span>
      }
      subtitle="NGX Stocks gives you real-time prices, interactive charts, and a personal watchlist - everything you need to make smarter investment decisions on the Nigerian Exchange."
      ctaText={ctaText}
      ctaHref={ctaHref}
      icons={demoIcons}
      titleClassName=""
      subtitleClassName="text-muted-foreground"
      ctaClassName="bg-[#3F5F48] text-white shadow-glow hover:bg-[#3F5F48]/90"
      showNav
      logo={
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">NGX Stocks</span>
        </div>
      }
      navLoginHref="/login"
      navSignupHref="/signup"
    />
  );
}
```

### `src/components/StockLogo.jsx`

Component: `StockLogo`

Description: Reusable stock logo tile with fallback handling.

```jsx
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
```

### `src/components/StocksTable.jsx`

Component: `StocksTable`

Description: Responsive market board used in dashboard and watchlist.

```jsx
import { ArrowDownRight, ArrowUpRight, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "../lib/market";
import { usePreferencesStore } from "../../store/usePreferencesStore";
import { translate } from "../lib/i18n";
import StockLogo from "./StockLogo";

function ChangeBadge({ value }) {
  const positive = Number(value) >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
        positive
          ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/20"
          : "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/20"
      }`}
    >
      {positive ? (
        <ArrowUpRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5" />
      )}
      {formatPercent(value)}
    </span>
  );
}

function ActionButton({ actionType, actionLabel, saved, onClick }) {
  if (actionType === "remove") {
    return (
      <button
        type="button"
        aria-label={actionLabel}
        onClick={onClick}
        className="inline-flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-rose-200 bg-rose-50 text-rose-600 transition hover:-translate-y-0.5 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={actionLabel}
      onClick={onClick}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-[1.15rem] border transition hover:-translate-y-0.5 ${
        saved
          ? "border-amber-200 bg-amber-50 text-amber-500 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
          : "border-border/80 bg-white/80 text-muted-foreground hover:bg-secondary"
      }`}
    >
      <Star className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}

export default function StocksTable({
  stocks,
  watchlistSymbols = new Set(),
  actionType = "watchlist",
  onToggleWatchlist,
  onRemove,
}) {
  const language = usePreferencesStore((state) => state.language);
  const navigate = useNavigate();

  const actionLabel = translate(
    language,
    actionType === "remove" ? "table.actionRemove" : "table.actionToggle",
  );
  const actionHeading = translate(
    language,
    actionType === "remove" ? "table.action" : "table.save",
  );

  const navigateToStock = (stockSymbol) => {
    navigate(`/dashboard/stocks/${encodeURIComponent(stockSymbol)}`);
  };

  return (
    <div className="app-panel overflow-hidden">
      <div className="space-y-4 p-4 md:hidden">
        {stocks.map((stock) => {
          const saved = watchlistSymbols.has(stock.symbol);

          return (
            <article
              key={stock.symbol}
              tabIndex={0}
              onClick={() => navigateToStock(stock.symbol)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigateToStock(stock.symbol);
                }
              }}
              className="app-panel-soft cursor-pointer p-4 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <StockLogo
                    symbol={stock.symbol}
                    name={stock.name}
                    logo={stock.logo}
                    size="lg"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {stock.name}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-accent px-2.5 py-1 font-medium tracking-[0.16em] text-accent-foreground">
                        {stock.symbol}
                      </span>
                      <span className="line-clamp-1">{stock.sector}</span>
                    </div>
                  </div>
                </div>

                <ActionButton
                  actionType={actionType}
                  actionLabel={actionLabel}
                  saved={saved}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (actionType === "remove") {
                      onRemove?.(stock.symbol);
                      return;
                    }

                    onToggleWatchlist?.(stock);
                  }}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-[1.1rem] bg-secondary/70 px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {translate(language, "table.price")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {formatCurrency(stock.price)}
                  </p>
                </div>

                <div className="rounded-[1.1rem] bg-secondary/70 px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {translate(language, "table.change")}
                  </p>
                  <div className="mt-2">
                    <ChangeBadge value={stock.changePercent} />
                  </div>
                </div>

                <div className="rounded-[1.1rem] bg-secondary/70 px-3 py-3 col-span-2 sm:col-span-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {translate(language, "table.volume")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {formatCompactNumber(stock.volume)}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs font-medium text-muted-foreground">
                {translate(language, "table.tapForDetails")}
              </p>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-secondary/80 text-left">
              <th className="px-7 py-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {translate(language, "table.company")}
              </th>
              <th className="px-7 py-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {translate(language, "table.price")}
              </th>
              <th className="px-7 py-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {translate(language, "table.change")}
              </th>
              <th className="px-7 py-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {translate(language, "table.volume")}
              </th>
              <th className="w-24 px-7 py-5 text-right text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {actionHeading}
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const saved = watchlistSymbols.has(stock.symbol);

              return (
                <tr
                  key={stock.symbol}
                  tabIndex={0}
                  onClick={() => navigateToStock(stock.symbol)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigateToStock(stock.symbol);
                    }
                  }}
                  className="group cursor-pointer transition hover:bg-accent/70 focus:bg-accent/70 focus:outline-none"
                >
                  <td className="border-t border-border/80 px-7 py-5">
                    <div className="flex items-center gap-4">
                      <StockLogo
                        symbol={stock.symbol}
                        name={stock.name}
                        logo={stock.logo}
                        size="lg"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {stock.name}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full bg-accent px-2.5 py-1 font-medium tracking-[0.16em] text-accent-foreground">
                            {stock.symbol}
                          </span>
                          <span>{stock.sector}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border-t border-border/80 px-7 py-5 text-sm font-semibold text-foreground">
                    {formatCurrency(stock.price)}
                  </td>
                  <td className="border-t border-border/80 px-7 py-5">
                    <ChangeBadge value={stock.changePercent} />
                  </td>
                  <td className="border-t border-border/80 px-7 py-5 text-sm text-muted-foreground">
                    {formatCompactNumber(stock.volume)}
                  </td>
                  <td className="border-t border-border/80 px-7 py-5 text-right">
                    <ActionButton
                      actionType={actionType}
                      actionLabel={actionLabel}
                      saved={saved}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (actionType === "remove") {
                          onRemove?.(stock.symbol);
                          return;
                        }

                        onToggleWatchlist?.(stock);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```
