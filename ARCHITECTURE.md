# LisheChap Architecture

LisheChap is a Swahili-first food discovery and real-time availability verification platform. A customer chooses the food they want, LisheChap finds nearby restaurants that are open and have an active chef, and the restaurant confirms the dish live with **KIPO** (available) or **HAKIPO** (not available) within a 3-minute, server-enforced window. If nobody answers in time, the customer gets nearby alternatives.

This document describes the target architecture. Each section says what exists today and what later phases add. See [PROJECT_PLAN.md](PROJECT_PLAN.md) for phase status.

---

## 1. System overview

```
 Browser / installed PWA                          Node.js server (single process today)
 +---------------------------+   HTTPS (REST)    +-------------------------------------+
 | React + Vite client       | ----------------> | Express app (/api)                  |
 |  - customer app           |                   |  middleware: logging, helmet, CORS, |
 |  - restaurant dashboard   |   WebSocket       |  rate limit, body limits, errors    |
 |  - admin dashboard        | <---------------> | Socket.IO (Phase 6)                 |
 +---------------------------+                   |  modules: auth, restaurants, menu,  |
                                                 |  availability, orders, payments ... |
                                                 +------------------+------------------+
                                                                    |
                                     +------------------------------+--------------------+
                                     |                              |                    |
                              PostgreSQL (Prisma)          Redis (optional, later)   Integrations
                              source of truth              presence, timers,         payments, maps,
                                                           socket scaling, queues    web push
```

- **Monorepo** with npm workspaces: `server/` (API) and `client/` (React SPA). One `npm install` and one `npm run dev` at the root.
- **Server is authoritative** for money, timing, roles, restaurant ownership and order state. The client only displays.
- In production the API can also serve the built client (`SERVE_CLIENT_BUILD=true`), so one process and one origin are enough for a first deployment.

## 2. Technology stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Client | React 19, Vite 6, React Router 7, JavaScript only | Code-split routes. No TypeScript. |
| Client state | Local state and hooks today. TanStack Query and Zustand are added only when a phase needs them. | Rule C: no dependency without a need. |
| Server | Node.js 22, Express 5, JavaScript ES modules | Express 5 forwards async errors to the error handler. |
| Validation | Zod | Environment config today, every request body and query from Phase 3. |
| Database | PostgreSQL 13+ (tested on 18) via Prisma 6 | UUID keys from `gen_random_uuid()`. |
| Logging | pino and pino-http | JSON in production, pretty in development, secrets redacted. |
| Security | helmet, cors, express-rate-limit, cookie-parser | See section 9. |
| Real time | Socket.IO (Phase 6) | Same HTTP server, authenticated handshake. |
| Tests | Vitest, Supertest, Testing Library, jsdom | `npm run test` at the root. |

## 3. Server architecture

```
server/
  prisma/
    schema.prisma          Data model (grows phase by phase)
    migrations/            Versioned SQL migrations (committed)
  src/
    app.js                 Builds the Express app (no listen, used by tests)
    server.js              Starts HTTP server, graceful shutdown
    config/                Environment validation (zod), frozen config object
    lib/prisma.js          Shared Prisma client
    middleware/            errorHandler, notFound, requestLogger, security
    routes/index.js        Mounts every module router under /api
    utils/                 AppError, apiResponse, logger
    modules/<feature>/     Feature code: *.routes.js, *.controller.js, *.service.js,
                           *.repository.js, *.validators.js, *.test.js as needed
    sockets/               Socket.IO namespaces and handlers (Phase 6)
    jobs/                  Timers and scheduled work, for example availability expiry (Phase 6)
    integrations/
      payments/            PaymentProvider adapters (Phase 8)
      maps/                Map provider abstraction (Phase 9)
      notifications/       Web Push and in-app delivery (Phase 9)
```

Folders are created when the first real file needs them, so there are no empty placeholders.

**Request flow:** `requestLogger -> helmet -> CORS -> compression -> body parsers (100 kb limit) -> cookies -> prototype-pollution guard -> /api rate limiter -> module router -> controller -> service -> repository (Prisma) -> response`. Errors from any step go to `errorHandler`.

**Layering rules:**
- Controllers parse input and shape responses. No business rules.
- Services hold business rules (fees, state transitions, ranking) and are unit-testable without HTTP.
- Repositories are the only layer that talks to Prisma.
- Business constants (3-minute window, fee step, heartbeat timeout) live in one constants module, never as magic numbers.

**API conventions:**
- Every route is under `/api`. Resources are plural nouns, for example `/api/restaurants/:id/menu`.
- Success: `{ "success": true, "data": ..., "meta"?: { pagination } }`
- Failure: `{ "success": false, "error": { "code", "message", "details"? } }`
- Every response has an `X-Request-Id` header that matches the server log line.
- Lists use server-side filtering and pagination. The client never downloads whole tables.

**Implemented in Phase 1:** `GET /api/health` returns API and database status (200 `ok`, or 503 `degraded` when PostgreSQL is unreachable). Failure reasons are never exposed.

## 4. Database architecture

PostgreSQL is the source of truth. Prisma provides the schema, migrations and parameterized queries.

**Conventions:** PascalCase models mapped to snake_case tables, UUID primary keys generated by PostgreSQL, `created_at`/`updated_at` on every table, `deleted_at` soft deletion where history matters (restaurants, menu items, users), and money stored as **integer Tanzanian Shillings** (`Int`), never floats.

**Implemented in Phase 1:** `SystemSetting` (`system_settings`), a key/value table for configurable platform values.

**Planned domain model** (added in the phase that needs it):

| Area | Models | Phase |
| --- | --- | --- |
| Identity | User, Role, CustomerProfile, Session/RefreshToken, PasswordResetToken | 3 |
| Restaurants | Restaurant, RestaurantStaff, RestaurantImage, RestaurantDocument, RestaurantOperatingHour, Address, Location | 4 |
| Menu | FoodCategory, FoodItem, FoodItemImage, RestaurantFoodItem | 4 |
| Availability | AvailabilityRequest (PENDING, KIPO, HAKIPO, EXPIRED, CANCELLED), presence records | 6 |
| Orders | Order, OrderItem, Delivery | 7 |
| Money | PaymentProvider, Payment, Wallet (restaurant and platform), WalletTransaction (ledger), Settlement | 8 |
| Engagement | Notification, PushSubscription, Review | 9, 10 |
| Governance | AuditLog (append-only) | 3 onward |

**Integrity rules:**
- Payment success atomically updates payment, order, ledger entries and wallet balances in one database transaction.
- Idempotency keys and unique provider references prevent duplicate payments.
- Wallet balances are derived from or reconciled against the ledger. They are never edited directly.
- `AvailabilityRequest.expiresAt` is set by the server (`createdAt + 3 minutes`).

## 5. Frontend architecture

```
client/src/
  main.jsx, App.jsx        Entry point, providers, router
  routes/routes.jsx        Route table (lazy-loaded pages)
  layouts/                 Shells: public site, restaurant dashboard, admin
  pages/                   Route-level screens
  components/              Reusable UI (design system from Phase 2)
  features/<feature>/      Feature components, hooks and services (discovery, availability, ...)
  hooks/                   Shared hooks
  services/                API calls per resource (use lib/apiClient)
  lib/apiClient.js         fetch wrapper: cookies, JSON, ApiError normalization
  lib/i18n/                Translator, provider, locale dictionaries
  styles/                  Global styles, design tokens (Phase 2)
  test/                    Test setup
```

- **Language:** Kiswahili is the default and fallback locale. Components never hard-code UI text. They call `t('key.path')` from `useTranslation()`. Adding English means adding `locales/en.js` and registering it in `locales/index.js`.
- **Data access:** components never call `fetch` directly. They use a service function built on `apiClient`, which sends cookies and turns server errors into `ApiError { status, code, message }`.
- **Every workflow has loading, success, empty, error and timeout states.** The Phase 1 system status card already follows this.
- **Routing:** pages are lazy-loaded per route. Restaurant and admin dashboards are separate route trees with their own layouts and role guards (Phase 3 and 4).
- **Styling:** global design tokens plus CSS modules per component (see the design system below).

### Design system (Phase 2)

| Layer | Location | Notes |
| --- | --- | --- |
| Tokens | `styles/tokens.css` | Every color, size, radius, shadow, motion and z-index value. Light on `:root`, dark on `[data-theme='dark']`. Components never use raw colors (a test enforces this for CSS modules). |
| Base and utilities | `styles/base.css`, `styles/utilities.css` | Reset, typography, focus ring, reduced motion, `container`, `card-grid`, `visually-hidden`, skip link. |
| Motion | `styles/animations.css` | Shared keyframes. CSS modules must reference them as `animation: global(fade-in) ...`, otherwise CSS modules rename them and the animation silently does nothing (a test enforces this). |
| Theme | `lib/theme/`, `public/theme-init.js` | Preference `system`, `light` or `dark`, persisted under `lishechap.theme`. The init script sets `data-theme` before first paint. |
| Primitives | `components/ui/` | Button, IconButton, fields, SegmentedControl, Card, Badge, Rating, SmartImage, Skeleton, Spinner, Empty/Error states, Modal, Drawer, SectionHeader. |
| Domain components | `components/food/` | RestaurantCard, FoodCard, CategoryChip/Rail, AvailabilityBadge, card skeletons. |
| Navigation | `components/navigation/` | AppHeader, MobileTabBar, AppFooter, theme controls, `navItems.js` (only real routes are listed). |
| Brand | `components/brand/Logo.jsx`, `public/favicon.svg`, `public/assets/brand/` | Mark, horizontal logo, compact mark. |

Rules: icons come from Lucide only (no Unicode symbols as icons); glass is reserved for the header, floating panels, promos and dashboard widgets, with a solid fallback where `backdrop-filter` is unsupported; actions render only when wired to a real handler; animation uses transform and opacity and respects `prefers-reduced-motion`. A development-only reference page at `/mfumo-wa-muundo` shows every token and component in both themes; it is stripped from production builds.

## 6. Authentication and authorization (Phase 3)

- **Sessions:** short-lived access token plus rotating refresh token, both in `HttpOnly`, `Secure`, `SameSite` cookies. Tokens are never stored in `localStorage`.
- **Passwords:** Argon2id hashing, login throttling per account and per IP, temporary lockout after repeated failures, password reset with single-use hashed tokens, forced password change for admin-generated staff credentials.
- **Roles:** `SUPER_ADMIN`, `ADMIN`, `RESTAURANT_OWNER`, `RESTAURANT_MANAGER`, `CHEF_OPERATOR`, `CUSTOMER`. Permissions are checked server-side by middleware (`requireAuth`, `requireRole`, `requireRestaurantAccess`).
- **Tenant isolation:** restaurant staff can only reach restaurants linked to them through `RestaurantStaff`. The restaurant ID always comes from the server-side membership check, never trusted from the request.
- **CSRF:** cookie auth uses SameSite cookies plus a CSRF token (double-submit) on state-changing requests.
- **Separate entry points** for customers, restaurant staff and admins, with admin login extra protected.

## 7. Real-time architecture (Phase 6)

- Socket.IO on the same HTTP server, authenticated during the handshake from the session cookie. Unauthenticated sockets are rejected.
- Rooms: `user:<id>`, `restaurant:<id>` (staff of that restaurant only), `admin`.
- Events: `availability:request`, `availability:received`, `availability:kipo`, `availability:hakipo`, `availability:expired`, `order:created`, `order:updated`, `payment:updated`, `notification:new`, `restaurant:presence`, `chef:presence`.
- Payloads from clients are validated and authorized like REST input. A KIPO/HAKIPO response is accepted only from staff of the target restaurant, only while the request is `PENDING` and not expired, and it becomes immutable once recorded.
- **Server-authoritative timeout:** `expiresAt = createdAt + 3 minutes` is stored in the database. A scheduler expires overdue requests and emits `availability:expired`, and every response handler re-checks `expiresAt` inside a transaction, so a browser cannot extend or skip the window.
- **Presence:** chef/operator heartbeats update `lastSeenAt`. A restaurant counts as actively responding only when it is ACTIVE, open now, and has an operator whose heartbeat is newer than the configurable timeout. A stored "online" flag is never trusted on its own.
- **Redis (optional):** the presence store, timers and Socket.IO adapter sit behind interfaces with in-memory implementations, so Redis can be added for multi-instance scaling without changing callers.

## 8. Payments (Phase 8)

- **Fee rule, backend only:** `serviceFee = 50 * Math.ceil(foodPrice / 2000)` for `foodPrice > 0`. `calculateOrderTotal(foodPrice, deliveryFee)` returns `{ foodPrice, deliveryFee, serviceFee, total }`. Delivery is currently TSh 0. All amounts are integers.
- **Split:** the restaurant is allocated the food price and the platform is allocated the service fee, recorded as double-entry `WalletTransaction` ledger rows in the same transaction as the payment status change.
- **Provider abstraction:** `PaymentProvider` interface with `initiatePayment`, `verifyPayment`, `handleCallback`, `refundPayment` and `getTransactionStatus`, plus one adapter each for Airtel Money, M-Pesa, Mixx by Yas, HaloPesa, CRDB and NMB. Until the real APIs are provided, only a clearly labelled development provider is enabled, and it is refused in production.
- **Callback safety:** signature verification, amount and currency checks, idempotency keys, unique provider references and replay protection. PINs and payment credentials are never requested, stored or logged.
- "Pay at restaurant" records the order without forcing an online payment.

## 9. Security

**Implemented in Phase 1:**
- `helmet` secure headers, including a Content Security Policy, and `X-Powered-By` disabled.
- CORS allowlist from `CLIENT_URL` with credentials. Unknown origins get a 403.
- Global `/api` rate limiter (configurable).
- JSON and urlencoded body limits (100 kb) with safe 400/413 responses.
- Global guard that rejects `__proto__`, `constructor` and `prototype` keys in request bodies.
- Central error handler: stack traces and internal messages are logged, never returned, in every environment.
- Structured logs with redaction of authorization headers, cookies, passwords, PINs, tokens and secrets.
- Environment validation: the server refuses to start with invalid configuration, and in production requires `JWT_SECRET` and `SESSION_SECRET` of at least 32 characters. Validation errors never print values.

**Added in later phases:** schema validation on every endpoint (zod, unknown keys stripped to stop mass assignment), RBAC and tenant checks against IDOR, CSRF tokens, auth throttling and lockout, upload type, size and content checks, audit logs, socket authentication, and payment callback verification. Phase 11 is a dedicated security review.

**Never trusted from the client:** `userId`, `restaurantId`, price, total, role, wallet amount, payment status.

## 10. Maps (Phase 9)

- `MapProvider` abstraction with a Google Maps Platform implementation (`GOOGLE_MAPS_API_KEY`).
- Distance for discovery is computed server-side (Haversine on stored coordinates, with PostGIS as a future option).
- Restaurant pages show a map preview, a full map view and "Elekea Mgahawani" directions.
- Without an API key, the UI does not pretend: it offers a safe external navigation link (a standard maps URL with the destination coordinates) and hides embedded maps.
- **Privacy:** location is requested only when needed, with an explanation. Manual location selection is offered if permission is denied. Discovery uses approximate coordinates, precise customer location is not stored by default, and it is shared with a restaurant only for an actual delivery order.

## 11. Notifications and PWA (Phase 9)

- In-app: Socket.IO `notification:new` with persisted `Notification` rows and unread badge counts.
- Outside the app: Web Push (VAPID keys) through a service worker, with sound and vibration where the platform allows. Delivery is best effort and depends on the user granting permission.
- PWA: manifest, icons, service worker with an offline shell. Payment and order actions always require the network and never queue silently offline.

## 12. Deployment

- **Build:** `npm run build` (Prisma client generation and Vite production build).
- **Database:** `npm run db:deploy` applies committed migrations (`prisma migrate deploy`). Never run `migrate dev` or `migrate reset` against production.
- **Run:** `NODE_ENV=production npm run start`. Set `SERVE_CLIENT_BUILD=true` to serve the SPA from the same origin, or host `client/dist` on a CDN and set `CLIENT_URL` and `VITE_API_BASE_URL` accordingly.
- **Behind a proxy:** set `TRUST_PROXY` to the number of proxies so rate limits and audit logs see real client IPs. Terminate TLS at the proxy.
- **Health:** `GET /api/health` for load balancer and uptime checks (503 when the database is unreachable).
- **Shutdown:** SIGINT/SIGTERM close the HTTP server and the database pool gracefully (10 s timeout).
- **Scaling:** one instance today. For several instances, enable Redis (Socket.IO adapter, presence, timers, rate-limit store).
