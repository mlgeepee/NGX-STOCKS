import {
  Activity,
  ArrowUpRight,
  Banknote,
  Bell,
  Briefcase,
  ChartBar,
  ChartCandlestick,
  ChartLine,
  ChartPie,
  CircleDollarSign,
  Cpu,
  Database,
  Globe,
  Landmark,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  FloatingIconsHero,
  type FloatingIconsHeroProps,
} from "@/components/ui/floating-icons-hero-section";

const demoIcons: FloatingIconsHeroProps["icons"] = [
  { id: 1, icon: ChartCandlestick, className: "top-[10%] left-[10%]" },
  { id: 2, icon: ChartLine, className: "top-[20%] right-[8%]" },
  { id: 3, icon: Landmark, className: "top-[80%] left-[10%]" },
  { id: 4, icon: Briefcase, className: "bottom-[10%] right-[10%]" },
  { id: 5, icon: Globe, className: "top-[5%] left-[30%]" },
  { id: 6, icon: Database, className: "top-[5%] right-[30%]" },
  { id: 7, icon: ShieldCheck, className: "bottom-[8%] left-[25%]" },
  { id: 8, icon: Cpu, className: "top-[40%] left-[15%]" },
  { id: 9, icon: Sparkles, className: "top-[75%] right-[25%]" },
  { id: 10, icon: ArrowUpRight, className: "top-[90%] left-[70%]" },
  { id: 11, icon: CircleDollarSign, className: "top-[50%] right-[5%]" },
  { id: 12, icon: Banknote, className: "top-[55%] left-[5%]" },
  { id: 13, icon: Bell, className: "top-[5%] left-[55%]" },
  { id: 14, icon: Activity, className: "bottom-[5%] right-[45%]" },
  { id: 15, icon: ChartPie, className: "top-[25%] right-[20%]" },
  { id: 16, icon: ChartBar, className: "top-[60%] left-[30%]" },
];

export default function FloatingIconsHeroDemo() {
  return (
    <FloatingIconsHero
      className="text-black bg-white"
      title="Track the Nigerian Stock Market"
      subtitle="NGX Stocks gives you real-time prices, interactive charts, and a personal watchlist — everything you need to make smarter investment decisions on the Nigerian Exchange."
      ctaText="Start Tracking Free"
      ctaHref="/login"
      icons={demoIcons}
      titleClassName="text-black"
      subtitleClassName="text-gray-600"
      ctaClassName="bg-black text-white hover:bg-black/90"
    />
  );
}
