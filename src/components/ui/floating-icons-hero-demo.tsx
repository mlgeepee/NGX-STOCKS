import {
  FloatingIconsHero,
  type FloatingIconsHeroProps,
} from "@/components/ui/floating-icons-hero-section";

import { SimpleNGXLogo } from "@/components/ui/ngx-logo";

import {
  IconDangoteCement,
  IconMTN,
  IconAirtel,
  IconBUAFoods,
  IconZenithBank,
  IconGTB,
  IconAccessBank,
  IconFBNHoldings,
  IconNestle,
  IconLafarge,
  IconSeplat,
  IconJuliusBerger,
  IconNigerianBreweries,
  IconUnityBank,
  IconWAPCO,
  IconPresco,
} from "@/components/ui/ngx-stocks-icons";

const demoIcons: FloatingIconsHeroProps["icons"] = [
  { id: 1, icon: IconDangoteCement, className: "top-[10%] left-[10%]" },
  { id: 2, icon: IconMTN, className: "top-[20%] right-[8%]" },
  { id: 3, icon: IconAirtel, className: "top-[80%] left-[10%]" },
  { id: 4, icon: IconBUAFoods, className: "bottom-[10%] right-[10%]" },
  { id: 5, icon: IconZenithBank, className: "top-[5%] left-[30%]" },
  { id: 6, icon: IconGTB, className: "top-[5%] right-[30%]" },
  { id: 7, icon: IconAccessBank, className: "bottom-[8%] left-[25%]" },
  { id: 8, icon: IconFBNHoldings, className: "top-[40%] left-[15%]" },
  { id: 9, icon: IconNestle, className: "top-[75%] right-[25%]" },
  { id: 10, icon: IconLafarge, className: "top-[90%] left-[70%]" },
  { id: 11, icon: IconSeplat, className: "top-[50%] right-[5%]" },
  { id: 12, icon: IconJuliusBerger, className: "top-[55%] left-[5%]" },
  { id: 13, icon: IconNigerianBreweries, className: "top-[5%] left-[55%]" },
  { id: 14, icon: IconUnityBank, className: "bottom-[5%] right-[45%]" },
  { id: 15, icon: IconWAPCO, className: "top-[25%] right-[20%]" },
  { id: 16, icon: IconPresco, className: "top-[60%] left-[30%]" },
];

export default function FloatingIconsHeroDemo() {
  return (
    <FloatingIconsHero
      className="bg-background"
      title={
        <span className="text-black bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
          Track the{" "}
          <span className="text-[oklch(0.6255_0.1741_149.0136)] font-bold">
            Nigerian Stock Market
          </span>
        </span>
      }
      subtitle="NGX Stocks gives you real-time prices, interactive charts, and a personal watchlist — everything you need to make smarter investment decisions on the Nigerian Exchange."
      ctaText="Start Tracking Free"
      ctaHref="/login"
      icons={demoIcons}
      titleClassName=""
      subtitleClassName="text-muted-foreground"
      ctaClassName="bg-[oklch(0.6255_0.1741_149.0136)] text-white hover:bg-[oklch(0.6255_0.1741_149.0136)]/90"
      showNav={true}
      logo={
        <div className="flex items-center gap-2">
          {/* <SimpleNGXLogo className="w-8 h-8" /> */}
          <span className="text-xl font-bold text-foreground">NGX Stocks</span>
        </div>
      }
      navLoginHref="/login"
      navSignupHref="/signup"
    />
  );
}
