# LisheChap

**Chakula unachotaka, karibu nawe.**

LisheChap is a Swahili-first food discovery, availability verification, ordering and delivery-support platform for Tanzania. Its core promise: before you travel to a restaurant, LisheChap tells you whether the food you want actually exists there right now. The restaurant's chef confirms live with **KIPO** (available) or **HAKIPO** (not available). If they do not answer within 3 minutes, LisheChap shows other nearby restaurants.

> **Current state:** Phase 1 (foundation) and Phase 2 (design system, light and dark themes) are complete. Discovery, availability, ordering and payment features arrive in later phases, see [PROJECT_PLAN.md](PROJECT_PLAN.md).

- [Architecture](ARCHITECTURE.md): system, database, frontend, auth, real-time, payments, maps, notifications, security, deployment
- [Project plan](PROJECT_PLAN.md): phases, status and known items

## Technology stack

| Part | Technology |
| --- | --- |
| Client | React 19, Vite 6, React Router 7, JavaScript (no TypeScript) |
| Server | Node.js 22, Express 5, JavaScript ES modules |
| Database | PostgreSQL 13+ with Prisma 6 |
| Real time | Socket.IO (Phase 6) |
| Tests | Vitest, Supertest, Testing Library |

## Folder structure

```
.
+-- client/                 React SPA (customer app, restaurant and admin dashboards)
|   +-- public/             favicon, theme-init.js, assets/brand, assets/images/*
|   +-- src/
|   |   +-- lib/            apiClient, i18n (Swahili-first), theme
|   |   +-- routes/         Route table with lazy-loaded pages
|   |   +-- layouts/        Page shells
|   |   +-- pages/          Route screens
|   |   +-- components/     ui/ primitives, food/ cards, navigation/, brand/
|   |   +-- features/       Feature modules (design-system reference, dev only)
|   |   +-- hooks/          Shared hooks
|   |   +-- services/       API calls per resource
|   |   +-- styles/         Design tokens, base, animations, utilities
|   |   +-- utils/          Display formatting (TSh, distance, rating)
|   +-- .env.example
+-- server/                 Express API
|   +-- prisma/             schema.prisma and migrations
|   +-- src/
|   |   +-- config/         Validated environment config
|   |   +-- middleware/     Security, logging, errors
|   |   +-- modules/        Feature modules (health today)
|   |   +-- routes/         /api router
|   |   +-- utils/          AppError, response helpers, logger
|   |   +-- app.js          Express app factory
|   |   +-- server.js       HTTP server and graceful shutdown
|   +-- tests/
|   +-- .env.example
+-- ARCHITECTURE.md
+-- PROJECT_PLAN.md
+-- package.json            npm workspaces and root scripts
```

## Prerequisites

- **Node.js 22.12 or newer** and npm 10
- **PostgreSQL 13 or newer** (LisheChap uses the built-in `gen_random_uuid()`)

If you do not have PostgreSQL yet, pick one option:

- **Windows / macOS installer:** download from <https://www.postgresql.org/download/>, then create a user and database:
  ```sql
  CREATE USER lishechap WITH PASSWORD 'lishechap';
  CREATE DATABASE lishechap OWNER lishechap;
  ```
  To let Prisma create its temporary shadow database during `db:migrate`, also run `ALTER USER lishechap CREATEDB;`.
- **Docker:**
  ```bash
  docker run --name lishechap-db -e POSTGRES_USER=lishechap -e POSTGRES_PASSWORD=lishechap \
    -e POSTGRES_DB=lishechap -p 5432:5432 -d postgres:17
  ```

## Getting started

```bash
# 1. Install everything (both workspaces; also generates the Prisma client)
npm install

# 2. Configure environment
cp server/.env.example server/.env      # then edit DATABASE_URL if needed
cp client/.env.example client/.env      # optional, the defaults work locally

# 3. Create the database tables
npm run db:migrate

# 4. Start the API (http://localhost:4000) and the client (http://localhost:5173)
npm run dev
```

Open <http://localhost:5173>. The home page shows a live **Hali ya mfumo** (system status) card that confirms the API and database are reachable. You can also call the API directly:

```bash
curl http://localhost:4000/api/health
```

If PostgreSQL is not running, the app still boots. The status card shows the database as *Haipatikani* and `/api/health` returns `503 degraded`.

### Design system

During development, open <http://localhost:5173/mfumo-wa-muundo> to see every design token and component (buttons, fields, badges, cards, restaurant and food cards, loading, empty and error states, modal, drawer) in light and dark mode. The page uses fictional sample data and is not included in production builds. Colors, spacing, typography and motion are all defined in `client/src/styles/tokens.css`; see [ARCHITECTURE.md](ARCHITECTURE.md#design-system-phase-2).

## Commands

All commands run from the repository root.

| Command | What it does |
| --- | --- |
| `npm install` | Installs both workspaces and generates the Prisma client |
| `npm run dev` | Runs the API (auto-restarts on changes in `server/src`) and the Vite client together |
| `npm run build` | Generates the Prisma client and builds the client into `client/dist` |
| `npm run start` | Starts the API in the current `NODE_ENV` |
| `npm run test` | Runs the server and client test suites |
| `npm run lint` | Lints server and client |
| `npm run db:migrate` | Creates and applies migrations in development (`prisma migrate dev`) |
| `npm run db:deploy` | Applies committed migrations in production (`prisma migrate deploy`) |
| `npm run db:studio` | Opens Prisma Studio to browse data |

Workspace-specific commands: `npm run <script> -w server` or `npm run <script> -w client`, for example `npm run test:watch -w client`.

## Environment variables

### Server (`server/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | no | `development` (default), `test` or `production` |
| `PORT` | no | API port, default `4000` |
| `HOST` | no | Bind address, default `0.0.0.0` |
| `CLIENT_URL` | no | Allowed browser origin(s) for CORS, comma-separated. Default `http://localhost:5173` |
| `SERVER_URL` | no | Public API URL, used for payment callbacks and absolute links |
| `TRUST_PROXY` | no | Number of reverse proxies in front of the API (`0` locally) |
| `LOG_LEVEL` | no | `fatal`, `error`, `warn`, `info` (default), `debug`, `trace`, `silent` |
| `SERVE_CLIENT_BUILD` | no | `true` to serve `client/dist` from the API in production |
| `DATABASE_URL` | **yes** | PostgreSQL connection string |
| `JWT_SECRET` | production | Access-token signing secret, at least 32 characters (used from Phase 3) |
| `SESSION_SECRET` | production | Session/refresh cookie secret, at least 32 characters (used from Phase 3) |
| `RATE_LIMIT_WINDOW_MS` | no | Rate limit window, default 15 minutes |
| `RATE_LIMIT_MAX` | no | Max API requests per IP per window, default `300` |
| `REDIS_URL` | no | Optional Redis for presence, timers, socket scaling and queues (later phases) |
| `GOOGLE_MAPS_API_KEY` | no | Google Maps Platform key (Phase 9). Without it, maps fall back to external navigation links |
| `PAYMENT_PROVIDER_KEYS` | no | JSON of provider credentials (Phase 8). Only development providers run until real APIs are supplied |
| `WEB_PUSH_PUBLIC_KEY`, `WEB_PUSH_PRIVATE_KEY`, `WEB_PUSH_CONTACT_EMAIL` | no | VAPID keys for browser push notifications (Phase 9) |

Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Client (`client/.env`)

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | API base, default `/api` (Vite proxy in development, same origin in production) |
| `VITE_DEV_API_PROXY` | Where the Vite dev server forwards `/api`, default `http://localhost:4000` |

Anything prefixed `VITE_` is shipped to the browser. Never put secrets in the client environment.

## Database

- The schema lives in `server/prisma/schema.prisma`. Migrations in `server/prisma/migrations/` are committed and must not be edited after they are applied anywhere shared.
- Change the schema, then run `npm run db:migrate -- --name describe_the_change`.
- Money columns are integer Tanzanian Shillings. Primary keys are UUIDs generated by PostgreSQL.
- Development seed data arrives with the domain models (Phase 4) and stays isolated from production code paths.

## Production build

```bash
npm ci
npm run build
npm run db:deploy
NODE_ENV=production SERVE_CLIENT_BUILD=true npm run start
```

In production the server refuses to start without `JWT_SECRET` and `SESSION_SECRET` of at least 32 characters. Put it behind a TLS-terminating proxy and set `TRUST_PROXY`. Use `GET /api/health` for health checks. More details are in [ARCHITECTURE.md, section 12](ARCHITECTURE.md#12-deployment).

## Security notes

- Never commit `.env` files. Only the `.env.example` files are tracked.
- Errors returned to clients never include stack traces or database details. Full details go to the server log with a matching `X-Request-Id`.
- Logs redact authorization headers, cookies, passwords, PINs and tokens.
- The server is authoritative for prices, totals, roles, restaurant ownership, payment status and the availability timer. Client-sent values for these are never trusted.
- See [ARCHITECTURE.md, section 9](ARCHITECTURE.md#9-security) for implemented controls and the hardening roadmap.

## Integration guides

These integrations are designed in [ARCHITECTURE.md](ARCHITECTURE.md) and are built in later phases. They are not active yet.

- **Payments (Phase 8):** each provider (Airtel Money, M-Pesa, Mixx by Yas, HaloPesa, CRDB, NMB) gets an adapter implementing `initiatePayment`, `verifyPayment`, `handleCallback`, `refundPayment` and `getTransactionStatus`. Credentials go in `PAYMENT_PROVIDER_KEYS`, and callbacks are verified server-side. Place the provider logos in `client/public/assets/payments/`.
- **Maps (Phase 9):** set `GOOGLE_MAPS_API_KEY` and restrict it by HTTP referrer and API. Without a key the UI uses external navigation links and does not show embedded maps.
- **Notifications and PWA (Phase 9):** generate VAPID keys (`npx web-push generate-vapid-keys`) and set the `WEB_PUSH_*` variables. Push notifications need HTTPS (localhost is exempt) and user permission.
