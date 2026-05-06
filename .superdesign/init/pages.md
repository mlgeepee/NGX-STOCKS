## `/` - Landing
Entry: `pages/Landing.jsx`

Dependencies:
- `pages/Landing.jsx`
  - `src/components/ui/floating-icons-hero-demo.tsx`
    - `src/components/ui/floating-icons-hero-section.tsx`
      - `src/lib/utils.ts`
      - `src/components/ui/button.tsx`
    - `store/useAuthStore.js`

## `/login` - Login
Entry: `pages/Login.jsx`

Dependencies:
- `pages/Login.jsx`
  - `services/supabase.js`
  - `src/components/ui/alert.tsx`
  - `store/useAuthStore.js`
  - `src/components/ui/background-gradient-snippet.tsx`

## `/signup` - Sign Up
Entry: `pages/SignUp.jsx`

Dependencies:
- `pages/SignUp.jsx`
  - `services/supabase.js`
  - `src/components/ui/alert.tsx`
  - `src/components/ui/background-gradient-snippet.tsx`

## `/reset-password` - Reset Password
Entry: `pages/ResetPassword.jsx`

Dependencies:
- `pages/ResetPassword.jsx`
  - `services/supabase.js`
  - `src/components/ui/alert.tsx`
  - `src/components/ui/background-gradient-snippet.tsx`

## `/dashboard` - Dashboard
Entry: `pages/Dashboard.jsx`

Dependencies:
- `pages/Dashboard.jsx`
  - `src/components/Header.jsx`
    - `store/useAuthStore.js`
    - `store/usePreferencesStore.js`
    - `src/lib/i18n.js`
  - `src/components/StocksTable.jsx`
    - `src/lib/market.js`
    - `store/usePreferencesStore.js`
    - `src/lib/i18n.js`
    - `src/components/StockLogo.jsx`
      - `services/api.js`
  - `services/api.js`
  - `store/useWatchlistStore.js`
  - `store/usePreferencesStore.js`
  - `src/lib/i18n.js`
  - `src/lib/market.js`

## `/dashboard/watchlist` - Watchlist
Entry: `pages/WatchList.jsx`

Dependencies:
- `pages/WatchList.jsx`
  - `src/components/Header.jsx`
    - `store/useAuthStore.js`
    - `store/usePreferencesStore.js`
    - `src/lib/i18n.js`
  - `src/components/StocksTable.jsx`
    - `src/lib/market.js`
    - `store/usePreferencesStore.js`
    - `src/lib/i18n.js`
    - `src/components/StockLogo.jsx`
      - `services/api.js`
  - `services/api.js`
  - `store/useWatchlistStore.js`
  - `store/usePreferencesStore.js`
  - `src/lib/i18n.js`

## `/dashboard/learn` - Learn
Entry: `pages/Learn.jsx`

Dependencies:
- `pages/Learn.jsx`
  - `src/components/Header.jsx`
    - `store/useAuthStore.js`
    - `store/usePreferencesStore.js`
    - `src/lib/i18n.js`
  - `store/usePreferencesStore.js`
  - `src/lib/i18n.js`

## `/dashboard/stocks/:symbol` - Stock Detail
Entry: `pages/StockDetail.jsx`

Dependencies:
- `pages/StockDetail.jsx`
  - `src/components/Header.jsx`
    - `store/useAuthStore.js`
    - `store/usePreferencesStore.js`
    - `src/lib/i18n.js`
  - `src/components/StockLogo.jsx`
    - `services/api.js`
  - `services/api.js`
  - `src/lib/market.js`
  - `store/useWatchlistStore.js`
  - `store/usePreferencesStore.js`
  - `src/lib/i18n.js`

## Shared Protected Shell
Entry: `src/App.jsx`

Dependencies:
- `src/App.jsx`
  - `services/supabase.js`
  - `store/useAuthStore.js`
  - `store/usePreferencesStore.js`
  - `src/components/ui/luma-spin.tsx`
  - `src/layouts/Layout.jsx`
    - `src/components/Sidebar.jsx`
      - `services/supabase.js`
      - `store/useAuthStore.js`
      - `store/usePreferencesStore.js`
      - `src/lib/i18n.js`
  - `src/components/ProtectedRoute.jsx`
    - `store/useAuthStore.js`

## Notes

- `src/index.css` and `tailwind.config.js` must be passed for any design draft.
- `src/layouts/Layout.jsx`, `src/components/Sidebar.jsx`, and `src/components/Header.jsx` are mandatory context for dashboard-family pages.
- Landing drafts should also include the real logo files in `public/logos/` only when needed for brand fidelity; the hero currently uses the real exchange/company logos as floating assets.
