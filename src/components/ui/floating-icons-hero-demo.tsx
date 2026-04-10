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
      showNav
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
