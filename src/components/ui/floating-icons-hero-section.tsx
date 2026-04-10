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

        {/* Navigation Bar */}
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
