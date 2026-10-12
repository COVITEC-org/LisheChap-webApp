# LisheChap Project Plan

The platform is built in controlled phases. After every phase the application must install, boot, lint, test and build, and the documentation must be updated. A feature is marked done only when it is implemented and tested.

**Core loop to protect in every phase:**
Find food, find nearby active restaurants, request confirmation, KIPO / HAKIPO, alternatives on timeout, confirmed food, pay or go to the restaurant, pickup or delivery, complete, rate.

## Status

| Phase | Scope | Status |
| --- | --- | --- |
| 0 | Repository audit and architecture | Done |
| 1 | Foundation: client, server, PostgreSQL, Prisma, security middleware, health | Done |
| 2 | Design system: tokens, light/dark themes, components, logo | Done |
| 3 | Authentication and RBAC | Not started |
| 4 | Database and admin: restaurant registration wizard, menu, staff, activation | Not started |
| 5 | Customer food discovery: homepage, search, nearby restaurants, restaurant page | Not started |
| 6 | Real-time availability: Socket.IO, presence, KIPO/HAKIPO, 3-minute timeout, alternatives | Not started |
| 7 | Orders and delivery: state machine, pickup, delivery, order tracking | Not started |
| 8 | Payments and wallets: fee calculation, provider abstraction, ledger, settlements | Not started |
| 9 | Maps and notifications: map provider, navigation, push, PWA | Not started |
| 10 | Reviews and analytics | Not started |
| 11 | Security hardening review | Not started |
| 12 | Performance | Not started |
| 13 | Final polish | Not started |

## Phase 0: audit findings

- The repository was empty: no existing code, packages, assets or environment files, so nothing had to be preserved or migrated.
- Machine: Node.js 22.13, npm 10.9, Git. No local PostgreSQL, `psql` or Docker. You need a PostgreSQL server to run the app (see README).
- Payment provider logos (`airtel-money-logo.png`, `halopesa-logo.png`, `m-pesa-logo.png`, `Mixx_by_Yas-logo.jpg`) were supplied later in `client/src/assets/mobile-payments-logo/` and are imported from there (bundled with hashed file names). No logos were supplied for CRDB and NMB.
- The UI visual reference image was supplied later as `client/src/assets/ui-layout.jpg`. It is a design reference only (not imported by the app, so it is never bundled), and Phase 2 was reworked against it (see "Phase 2 rework" below).

## Phase 1: delivered

- npm workspaces monorepo (`server/`, `client/`) with root scripts `dev`, `build`, `start`, `test`, `lint`, `db:migrate`, `db:deploy` and `db:studio`.
- **Server:** Express 5 (ES modules), environment validation with zod, pino logging with redaction and request IDs, helmet with a CSP, a CORS allowlist, rate limiting, body size limits, a prototype-pollution guard, a central error handler with a consistent response envelope, `GET /api/health` with a database check, graceful shutdown, and optional serving of the client build in production.
- **Database:** Prisma 6 with PostgreSQL, schema conventions documented, initial migration `init` (`system_settings`). Applied successfully against PostgreSQL 18.
- **Client:** React 19 and Vite 6, React Router 7 with lazy-loaded routes, a fetch-based API client, a Swahili-first i18n layer (no hard-coded UI strings), a foundation home page with a live system status card (loading, success, degraded and error states), and a 404 page. The Vite dev proxy forwards `/api` to the server.
- **Tests:** 21 server tests (environment validation, health ok/degraded, 404 envelope, malformed and oversized JSON, security headers, request IDs, CORS allow/deny, prototype pollution, rate limit headers, error handler leakage) and 12 client tests (translator, API client, app rendering in healthy/degraded/unreachable states, 404).
- **Verified:** `npm install`, `npm run dev` (both apps, health `ok` through the Vite proxy), `npm run lint`, `npm run test`, `npm run build`, `npm run start` with the built client and SPA fallback, and the production refusal to boot without strong secrets.

## Phase 2: delivered

- **Design tokens** (`client/src/styles/tokens.css`): brand, surface, text, border, status, glass, imagery, gradient, shadow, typography, spacing, radius, layout, motion and z-index tokens. Light theme on `:root`, an intentionally designed dark theme on `[data-theme='dark']` (warm near-black surfaces, brighter orange accents, retuned status colors and shadows). Text and button color pairs were contrast-checked against WCAG AA.
- **Theme system:** `ThemeProvider` with system, light and dark preferences, persisted in `localStorage`, following live OS changes, and applied before first paint by `public/theme-init.js` (no flash, CSP compatible). Header toggle and a three-way switcher in the mobile menu.
- **Typography:** self-hosted variable font (Plus Jakarta Sans) via Fontsource, so there are no third-party font requests and it works offline for the PWA.
- **Brand:** LisheChap logo mark (a bowl with a confirmation check, "food, confirmed"), horizontal logo, compact mobile mark, `favicon.svg`, and static SVGs in `public/assets/brand/`.
- **Components** (`client/src/components/`): Button, IconButton, TextField, TextAreaField, SelectField, SegmentedControl, Card (including a glass variant), Badge (with live pulse), Rating, SmartImage (reserved aspect ratio, lazy loading, fade-in, branded fallback), Skeleton, Spinner, PageLoader, EmptyState, ErrorState, Modal (bottom sheet on phones), Drawer, SectionHeader, AppHeader (glass on scroll), MobileTabBar (floating glass), AppFooter, Logo, plus the food components RestaurantCard, FoodCard, CategoryChip and CategoryRail, AvailabilityBadge, and card skeletons.
- **Business honesty in components:** action buttons render only when a real handler is passed; RestaurantCard never shows KIPO unless it receives an actual confirmation status; FoodCard labels menu status ("Kwenye menyu") separately from live confirmation.
- **Accessibility:** semantic landmarks, skip link, visible focus rings, labelled icon buttons, linked field hints and errors, accessible dialogs (focus moved inside, Tab trapped, Escape closes, focus returned, scroll locked), `aria-pressed` category chips, and `prefers-reduced-motion` support.
- **Motion:** shared keyframes (fade, rise, scale, slide, shimmer, spin, live pulse) using transform and opacity only; card lift and image zoom on hover; page entrance on route change.
- **Pages:** Phase 1 home restyled with the design system (content unchanged in scope), a 404 page, and a router error boundary that also covers failed chunk downloads. A development-only design system reference at `/mfumo-wa-muundo` with fictional sample data; it is excluded from production builds (verified).
- **Image structure:** `client/public/assets/images/{foods,restaurants,categories,promotions}` with sizing guidelines. Real photography only needs a `src`.
- **Visual inspection:** screenshots at 320, 375, 390, 768 and 1280 px in light and dark themes, plus the open drawer and the scrolled glass header. No horizontal overflow at any width. Issues found and fixed: clipped button descenders, a hard edge on the hero glow, uneven food card footers, truncated category labels, stray background under the footer on mobile, and CSS modules silently renaming shared animation names (which would have disabled most animations).
- **Tests:** 46 client tests (12 from Phase 1 plus theme persistence and system following, Button, accessible fields, Modal focus management, SmartImage fallback, ErrorState retry, RestaurantCard and FoodCard business rules, CategoryChip, formatting, and design guards that fail on unscoped keyframes, raw hex colors in component styles, or em dashes in source).

## Phase 2 rework against the supplied reference

Once `ui-layout.jpg` and the payment logos arrived, the design system was re-aligned with the reference (brand, wording, photography and logo were not copied):

- **Palette:** reference orange `#f05c14` as `--primary-bright` (icon-only buttons, selected tiles, step numbers, active indicators, large headings); `--primary` stays a deeper orange wherever white text sits on orange, so labels keep WCAG AA. Neutral near-white page background, white cards with soft neutral shadows, dark bold prices, gold rating stars (`--rating`), dark footer and dark hero banner tokens. Dark theme retuned to match.
- **Typography:** Plus Jakarta Sans only (ExtraBold headings), closer to the reference's geometric sans; Bricolage Grotesque removed (one less font download).
- **Header:** solid white bar, plain text links with an orange underline on the active page (glass only after scrolling).
- **Mobile tab bar:** solid full-width bottom bar with orange active icon and indicator.
- **Footer:** dark, with a quick links column (real routes only).
- **Category tiles:** rounded icon tiles with the label underneath; selected tile filled orange.
- **Filter chips:** new `FilterChips` pill row ("Zote", "Wazi sasa", "Ukadiriaji wa juu").
- **Restaurant card:** compact reference layout: logo avatar overlapping the image (initials fallback), name, rating with prep time, cuisines line, green "Wazi, Inafunga saa 22:00" line, distance chip on the image, optional favorite heart (only when a handler is passed). LisheChap's chef presence, delivery and live confirmation badges remain.
- **Food card:** dark prices and a new `layout="row"` list variant (square image, name, description, price, rating, orange "+" button), as in the reference's popular dishes and menu lists.
- **Section headers:** `SeeAllLink` ("Ona zote" with arrow).
- **Payment methods:** `PaymentMethodPicker` with the supplied M-Pesa, Airtel Money, Mixx by Yas and HaloPesa logos (always on a white tile, never cropped), CRDB and NMB as neutral name tiles. Selection UI only: no payment is started from the client.
- **Home (foundation scope):** reference top-section composition: dark rounded hero with a two-tone heading and a glass "Majibu ndani ya dakika 3" chip, beside a "how it works" column with orange numbered steps.
- **Verified:** screenshots at 320, 390, 768 and 1280 px in light and dark; no horizontal overflow. A logo-cropping bug (percentage height inside a grid tile) was found and fixed. 55 client tests pass.

## Known items carried forward

- `npm audit` reports one high-severity advisory in `deepmerge-ts` (GHSA-ggr8-5vv4-36mx, stack exhaustion on recursive objects). It enters only through the Prisma CLI's config loader (`prisma` -> `@prisma/config`), which runs at build and migrate time and never handles request data. No Prisma release includes the fix yet (all versions through 8.1 dev are affected). Re-check on every Prisma upgrade.
- Critical and moderate advisories in Vitest 3 were removed by upgrading to Vitest 5.
- No real food or restaurant photography exists yet. Cards use the branded SmartImage placeholder until images are supplied or uploaded (Phase 4 onward).

## Next phase entry criteria (Phase 3)

- Phase 1 and Phase 2 checks still pass.
