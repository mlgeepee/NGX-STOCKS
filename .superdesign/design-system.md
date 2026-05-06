# NGX Stocks Design System

## Product Context

- Product: `NGX Stocks`
- Category: Nigerian equities market intelligence app
- Primary users: retail investors, analysts, finance-curious operators, and ambitious first-time market participants who want Nigerian market data to feel credible and premium rather than intimidating.
- Core promise: make NGX data feel elegant, trustworthy, and immediately actionable.

## Visual Direction

- Design theme: editorial finance meets premium control room
- Tone: calm authority, optimistic precision, modern African market confidence
- Visual keywords: luminous, layered, data-rich, premium, confident, uncluttered
- Avoid: generic SaaS gradients, purple-heavy AI styling, plain dashboard boilerplate, overly playful fintech visuals

## Brand Strategy

- Keep green as the core market brand signal, but mature it into a deeper investment palette.
- Use warm metallic accent notes sparingly for highlights, premium emphasis, and chart overlays.
- Treat dashboards like well-crafted financial instruments: dense enough to feel useful, but spaced enough to remain approachable.
- Treat auth surfaces like brand moments, not form utilities.

## Color System

### Light Theme

- `--background`: soft ivory `#F5F1E8`
- `--background-elevated`: warm white `#FCFAF5`
- `--foreground`: ink `#122126`
- `--foreground-soft`: slate `#45555C`
- `--primary`: market green `#0E5B4F`
- `--primary-strong`: deep exchange green `#083D35`
- `--accent`: amber-gold `#C89A4B`
- `--accent-soft`: pale gold wash `#E9D6B1`
- `--secondary`: mist `#E8ECE8`
- `--border`: `rgba(18, 33, 38, 0.10)`
- `--panel`: `rgba(252, 250, 245, 0.82)`
- `--panel-strong`: `rgba(255, 255, 255, 0.92)`
- `--positive`: `#0F8A5F`
- `--negative`: `#C24D57`
- `--warning`: `#C88A2F`

### Dark Theme

- `--background`: midnight green-black `#071318`
- `--background-elevated`: deep slate `#0E1A20`
- `--foreground`: `#F5F1E8`
- `--foreground-soft`: `#A4B1B5`
- `--primary`: `#29A47E`
- `--primary-strong`: `#8ED7C0`
- `--accent`: `#D7A75A`
- `--accent-soft`: `rgba(215, 167, 90, 0.16)`
- `--secondary`: `rgba(255, 255, 255, 0.05)`
- `--border`: `rgba(255, 255, 255, 0.10)`
- `--panel`: `rgba(10, 24, 29, 0.78)`
- `--panel-strong`: `rgba(14, 26, 32, 0.92)`
- `--positive`: `#4FCB8C`
- `--negative`: `#F0797E`
- `--warning`: `#E0B86A`

## Typography

- UI font: `"Geist Variable", sans-serif`
- Display font: `"Instrument Serif", "Iowan Old Style", serif`
- Use display serif selectively for large landing headlines and auth page headlines only.
- Dashboard and data screens remain primarily sans-serif for clarity and density.

### Type Scale

- Display XXL: `clamp(3.5rem, 7vw, 7rem)`, display serif, line-height `0.92`
- Display XL: `clamp(2.8rem, 5vw, 4.75rem)`, display serif, line-height `0.96`
- H1: `clamp(2.3rem, 4vw, 3.4rem)`, Geist, weight `600`
- H2: `clamp(1.6rem, 2vw, 2.2rem)`, Geist, weight `600`
- H3: `1.125rem` to `1.35rem`, Geist, weight `600`
- Body L: `1rem`, line-height `1.75`
- Body M: `0.9375rem`, line-height `1.65`
- Label / eyebrow: `0.72rem`, uppercase, tracking `0.24em`

## Spacing and Layout

- Base spacing unit: `4px`
- Primary layout rhythm: `8, 12, 16, 20, 24, 32, 40, 56, 72, 96`
- Max app content width: `1480px`
- Landing content width: `1240px`
- Dashboard content gutters:
  - mobile: `20px`
  - tablet: `28px`
  - desktop: `40px`
  - wide desktop: `56px`

## Radius

- Chips: `999px`
- Small controls: `18px`
- Inputs and buttons: `22px`
- Cards: `28px`
- Hero and major panels: `36px`
- Floating logo tiles: `24px` to `30px`

## Elevation and Materials

- Surfaces should feel layered and tactile, not flat.
- Use a combination of:
  - low-opacity borders
  - warm translucent fills
  - soft vertical shadows
  - selective backdrop blur
- Primary hero surfaces can use stronger glow behind key CTAs or stats.
- Avoid hard neon shadows.

### Shadow Tokens

- `shadow-soft`: `0 18px 60px rgba(15, 26, 28, 0.08)`
- `shadow-panel`: `0 28px 90px rgba(10, 24, 29, 0.12)`
- `shadow-float`: `0 14px 40px rgba(10, 24, 29, 0.14)`
- `shadow-glow-green`: `0 24px 80px rgba(14, 91, 79, 0.22)`
- `shadow-glow-gold`: `0 20px 70px rgba(200, 154, 75, 0.18)`

## Motion

- Use motion to reinforce quality and spatial hierarchy.
- Duration guidelines:
  - hover and focus: `160ms` to `220ms`
  - enter transitions: `320ms` to `480ms`
  - hero reveals: `500ms` to `800ms`
- Easing: cubic-bezier `(0.22, 1, 0.36, 1)` for polished movement
- Preferred patterns:
  - staggered fade-up of hero content
  - slow orbital or parallax background movement
  - subtle card lift on hover
  - animated chart and stat transitions

## Iconography

- Icon set: `lucide-react`
- Use 16px, 18px, 20px, and 24px sizes consistently.
- Pair icons with shape-backed containers on premium surfaces.
- Avoid icon-only clusters without labels unless the action is obvious.

## Core Page Architecture

### Landing

- Goal: communicate trust, premium quality, and immediate value in under 5 seconds.
- Layout:
  - elevated nav
  - cinematic hero with asymmetric split
  - live market snapshot strip
  - feature narrative section
  - product mock/dashboard preview
  - testimonial or trust proof
  - clear final CTA
- Hero should feel like an editorial campaign for the Nigerian market, not a generic startup splash.

### Login / Sign Up / Reset Password

- Goal: turn utility forms into high-trust branded entry points.
- Layout:
  - two-column desktop composition
  - left side: market pulse / value story / compact stats
  - right side: polished form card
  - mobile collapses to stacked layout with preserved brand presence
- Forms should include strong focus states, supportive helper text, and a visible hierarchy between primary and secondary actions.

### Dashboard

- Goal: make the market board feel powerful and premium while staying legible.
- Layout:
  - refined sidebar with strong brand identity
  - command header with search and profile cluster
  - summary cards that feel like signal modules, not generic KPI tiles
  - dominant market table with stronger visual grouping and hover affordance
- Table should feel intentional and tactile on both desktop and mobile.

### Stock Detail

- Goal: make a single stock feel like a mini research terminal.
- Layout:
  - strong hero summary block
  - chart as centerpiece
  - side intelligence rail for news and stats
  - concise action row for watchlist and navigation
- Use more contrast and compositional drama than the dashboard, but stay within the same brand system.

## Component Language

### Buttons

- Primary button: deep green fill, warm highlight sheen, ivory text
- Secondary button: translucent panel with stronger border and hover lift
- Tertiary button: text-first or ghost style with strong focus ring
- Destructive button: muted rose treatment, still premium and soft

### Inputs

- Large rounded controls with warm translucent fills
- Strong focus ring using green at accessible contrast
- Placeholder text should remain readable but subdued
- Search should read as a command field, not a plain form box

### Cards and Panels

- Prefer layered cards with inner border and subtle texture
- Separate "display cards" from "utility cards":
  - display cards may use gradients and large type
  - utility cards stay calmer and more neutral

### Tables

- Use clearer row grouping, hover states, and hierarchy between company identity and numeric values
- Desktop rows should feel touchable
- Mobile rows should transform into compact but premium mini-briefs

### Badges

- Use pill badges with restrained fills
- Positive and negative performance should remain clear in both themes

## Responsive Breakpoints

- Mobile: `0-639px`
- Tablet: `640-1023px`
- Desktop: `1024-1439px`
- Wide: `1440px+`

## Accessibility

- WCAG target: AA minimum everywhere, AAA where practical on body text
- Focus states must be visible on every interactive element
- Never rely on color alone for gain/loss; pair with icons or labels
- Keyboard navigation required for:
  - sidebar links
  - stock table rows
  - auth form controls
  - CTA buttons
- Minimum target size: `44px`

## Content and Tone

- Use confident but plain language
- Avoid hype words like "revolutionary" or "unmatched"
- Prefer phrases like:
  - "Track market breadth"
  - "Read the day clearly"
  - "Watch the exchange move"
  - "Build your market conviction"

## Implementation Guidance

- Preserve React Router structure and current auth/store logic.
- Implement the new system mostly through:
  - updated CSS variables in `src/index.css`
  - improved shared surface classes
  - page-specific layout rewrites
  - stronger reuse of shared auth and shell patterns
- Reuse real stock logos and existing chart/data primitives.

## Guardrails For Design Iteration

- Use only the fonts, colors, spacing, elevation, and motion styles defined in this file.
- Keep the product premium and finance-first.
- Do not introduce purple, neon blue, playful bubble layouts, or cartoonish illustration styles.
- Any redesign must still feel unmistakably like a Nigerian market intelligence product.
