## Sidebar
- Source: `src/components/Sidebar.jsx`
- Category: `layout`
- Description: Primary dashboard navigation with brand, active state, language chooser, and logout CTA.
- Extractable props: `isOpen` (boolean, default: `true`)
- Hardcoded: brand text, navigation labels, Lucide icon choices, language option labels, logout styling

## Header
- Source: `src/components/Header.jsx`
- Category: `layout`
- Description: Reusable section header with optional search and right-side actions.
- Extractable props: `title` (string, default: `"Market overview"`), `subtitle` (string, default: `"Track price movement and discover market signals."`), `searchValue` (string, default: `""`)
- Hardcoded: search icon, analyst badge structure, avatar shell styling

## FloatingIconsHero
- Source: `src/components/ui/floating-icons-hero-section.tsx`
- Category: `layout`
- Description: Landing-page hero with floating stock logos, CTA, and optional nav.
- Extractable props: `ctaHref` (string, default: `"#"`), `navLoginHref` (string, default: `"/login"`), `navSignupHref` (string, default: `"/signup"`)
- Hardcoded: logo orbit behavior, hero layout, nav button treatment, arrow icon, motion styling

## StocksTable
- Source: `src/components/StocksTable.jsx`
- Category: `basic`
- Description: Shared market board and watchlist table with responsive card mode on mobile.
- Extractable props: `actionType` (string, default: `"watchlist"`)
- Hardcoded: column order, badge styles, action iconography, mobile card structure

## StockLogo
- Source: `src/components/StockLogo.jsx`
- Category: `basic`
- Description: Shared stock brand tile used in the table and stock detail hero.
- Extractable props: `size` (string, default: `"md"`)
- Hardcoded: fallback image handling, border treatment, padding rules

## AlertToast
- Source: `src/components/ui/alert.tsx`
- Category: `basic`
- Description: Dismissible top-right alert/toast for auth flows.
- Extractable props: `type` (string, default: `"info"`)
- Hardcoded: icon variants, container position, animation direction, border/background pairings
