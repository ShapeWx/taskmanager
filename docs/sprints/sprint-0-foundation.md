# Sprint 0 — Foundation & Infrastructure

**Dates:** May 19 – May 30, 2026
**Duration:** 2 weeks
**Phase:** 1 — Foundation
**Points budget:** 80 pts

---

## Sprint Goal

Establish a production-grade development foundation: containerised environment, automated CI/CD pipeline, code quality gates, and testing infrastructure. Every subsequent sprint builds on this base. No user-facing features ship in this sprint.

---

## Context

The monorepo has been migrated to pnpm workspaces + Turborepo. The app lives at `apps/web`. The `docker/`, `scripts/`, and `docs/` folders are created. The IndexedDB module exists as an empty stub at `apps/web/src/db/index-db.ts`. This sprint hardens the developer experience and defines the delivery pipeline before any feature work begins.

---

## User Stories

### INF-01 — Containerised Development Environment
**As a** developer,
**I want** a Docker Compose stack that mirrors production,
**so that** "it works on my machine" problems are eliminated.

**Acceptance criteria:**
- `docker compose up` starts the Vite dev server on port 5173
- Hot-module replacement works inside the container
- A separate production build stage produces a minimal Nginx-served image
- All environment variables are injected via `.env` files, not hardcoded
- `docker/` folder contains `Dockerfile`, `docker-compose.yml`, and `docker-compose.prod.yml`

**Story points:** 8

---

### INF-02 — GitHub Actions CI Pipeline
**As a** developer,
**I want** automated lint, type-check, and test runs on every pull request,
**so that** broken code never merges to `main`.

**Acceptance criteria:**
- `.github/workflows/ci.yml` triggers on push to any branch and on PR to `main`
- Pipeline steps in order: `pnpm install` → `turbo lint` → `turbo test:unit` → `turbo build`
- Build artefacts are cached between runs using Turborepo remote cache or GitHub Actions cache
- A failing step blocks the PR merge; status check is required
- Pipeline completes in under 5 minutes on a clean run

**Story points:** 8

---

### INF-03 — Git Hooks & Commit Standards
**As a** developer,
**I want** automated pre-commit linting and conventional commit enforcement,
**so that** the codebase stays clean and the changelog is machine-readable.

**Acceptance criteria:**
- Husky is configured with a `pre-commit` hook that runs `lint-staged`
- `lint-staged` runs ESLint + Prettier only on staged files
- A `commit-msg` hook enforces Conventional Commits format via `commitlint`
- Configuration lives in `commitlint.config.js` and `.husky/`
- Developers are blocked from committing malformed messages or unlinted code

**Story points:** 5

---

### INF-04 — Environment Variable Strategy
**As a** developer,
**I want** a clear, documented environment variable system,
**so that** secrets never land in the repository and local/staging/prod configs are distinct.

**Acceptance criteria:**
- `.env.example` at repo root lists every variable with a description and safe default
- `.env.local` is gitignored and holds developer-specific overrides
- Vite exposes only `VITE_`-prefixed variables to the client bundle
- `scripts/validate-env.js` runs at startup and exits with an error if required variables are missing
- Variables documented in `docs/environment-variables.md`

**Story points:** 3

---

### INF-05 — IndexedDB Wrapper Spike
**As a** developer,
**I want** a typed IndexedDB wrapper that hides low-level IDB boilerplate,
**so that** future sprints can interact with the local database via a clean async API.

**Acceptance criteria:**
- `apps/web/src/db/index-db.ts` is replaced with a full implementation
- Database name is `task-master`, version `1`
- Object stores defined: `tasks`, `users`, `timeEntries`, `categories`, `projects`
- Exported functions: `openDB()`, `getAll<T>(store)`, `getById<T>(store, id)`, `put<T>(store, record)`, `remove(store, id)`, `clear(store)`
- All functions return Promises; no callbacks exposed
- Typed with TypeScript generics throughout
- Unit tests written for each exported function using a fake IndexedDB (`fake-indexeddb` package)

**Story points:** 13

---

### INF-06 — Vitest & Cypress Baseline
**As a** developer,
**I want** working test runners with example tests and coverage reporting,
**so that** we have a testable baseline before writing feature code.

**Acceptance criteria:**
- `vitest.config.ts` configured with `jsdom` environment, coverage via `@vitest/coverage-v8`
- `pnpm test:unit` runs all `*.spec.ts` files and prints a coverage summary
- Cypress configured with `baseUrl: http://localhost:5173` in `cypress.config.js`
- At least one passing Vitest test (existing counter store spec)
- At least one passing Cypress E2E test (visits `/auth/login`, asserts page title)
- Coverage thresholds set: lines 70%, branches 70% (enforced in CI)

**Story points:** 5

---

### INF-07 — Turborepo Pipeline Optimisation
**As a** developer,
**I want** Turborepo task pipelines correctly defined with caching,
**so that** unchanged packages are never rebuilt and dev iteration is fast.

**Acceptance criteria:**
- `turbo.json` defines tasks: `build`, `dev`, `lint`, `test:unit`, `test:e2e`, `preview`
- `build` outputs are cached by Turborepo; a second run of `turbo build` with no changes completes in under 3 seconds
- `dev` and `test:e2e` are marked `"cache": false` and `"persistent": true` as appropriate
- `turbo lint` runs ESLint across all workspace packages
- Remote caching configuration documented (optional: Vercel Remote Cache token)

**Story points:** 5

---

### INF-08 — Docker Production Image
**As a** DevOps engineer,
**I want** a multi-stage Dockerfile that produces a lean production image,
**so that** deployment to any container platform is straightforward.

**Acceptance criteria:**
- `docker/Dockerfile` uses a multi-stage build: `node:20-alpine` builder → `nginx:alpine` server
- Production image size is under 50 MB
- Nginx config serves the Vue SPA with HTML5 history mode fallback (`try_files $uri /index.html`)
- `docker build -f docker/Dockerfile .` succeeds from the monorepo root
- `docker/nginx.conf` is version-controlled alongside the Dockerfile

**Story points:** 8

---

### INF-09 — Scripts Folder Utilities
**As a** developer,
**I want** common developer scripts in the `scripts/` folder,
**so that** setup, seeding, and maintenance tasks are repeatable and documented.

**Acceptance criteria:**
- `scripts/setup.js` — installs dependencies, copies `.env.example` to `.env.local` if missing, prints next steps
- `scripts/validate-env.js` — checks all required env vars are set
- `scripts/seed-db.js` — populates IndexedDB with the existing demo data (migrated from store initialisation)
- Each script is executable with `node scripts/<name>.js`
- Scripts are documented in `scripts/README.md`

**Story points:** 5

---

## Technical Tasks (non-story work)

| ID | Task | Points |
|----|------|--------|
| T-01 | Add `fake-indexeddb` to workspace devDependencies via catalog | 1 |
| T-02 | Add `husky`, `lint-staged`, `commitlint` to root devDependencies | 1 |
| T-03 | Update `.gitignore`: add `.env.local`, `.turbo/`, `cypress/videos/`, `cypress/screenshots/` | 1 |
| T-04 | Add `@vitest/coverage-v8` to catalog | 1 |
| T-05 | Configure `tsconfig.json` for `apps/web` (strict mode) | 2 |
| T-06 | Add `engines` field to root `package.json`: `"node": ">=20"`, `"pnpm": ">=10"` | 1 |

**Technical task total:** 7 pts

---

## Capacity & Allocation

| Area | Points |
|------|--------|
| Docker & infra (INF-01, INF-08) | 16 |
| CI/CD & git hooks (INF-02, INF-03) | 13 |
| Database spike (INF-05) | 13 |
| Testing baseline (INF-06, INF-07) | 10 |
| Environment & scripts (INF-04, INF-09) | 8 |
| Technical tasks | 7 |
| **Buffer (unplanned work)** | 13 |
| **Total** | **80** |

---

## Dependencies

- None. This sprint has no upstream dependencies.

## Risks

| Risk | Mitigation |
|------|-----------|
| IndexedDB wrapper takes longer than 13 pts | Reduce scope to `tasks` store only; expand in Sprint 1 |
| CI runner minutes quota exceeded | Use GitHub Actions free tier wisely; cache aggressively |

## Definition of Done

- All 9 user stories pass their acceptance criteria
- CI pipeline is green on `main`
- `docker compose up` starts the app with no manual steps
- `pnpm test:unit` produces a coverage report
- `docs/environment-variables.md` is written and accurate
- Sprint retrospective held; action items logged

## Key Deliverables

1. Working Docker Compose dev stack
2. GitHub Actions CI pipeline (lint + test + build)
3. Git hooks enforcing conventional commits
4. Fully typed IndexedDB wrapper with unit tests
5. Vitest + Cypress configured with baseline tests
6. Developer scripts: `setup`, `validate-env`, `seed-db`
