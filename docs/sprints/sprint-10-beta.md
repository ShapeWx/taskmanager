# Sprint 10 — Beta Launch

**Dates:** October 6 – October 17, 2026
**Duration:** 2 weeks
**Phase:** 5 — Beta
**Points budget:** 80 pts
**Depends on:** Sprint 9 (Lighthouse ≥90, mobile responsive, all P0/P1 bugs resolved)

---

## Sprint Goal

Task Master is deployed to a publicly accessible staging environment and made available to 10–20 selected beta users. Feedback is systematically collected, critical issues are triaged and fixed within the sprint, and monitoring infrastructure (error tracking, analytics) is in place before production launch.

---

## Context

The application is feature-complete and quality-gated after Sprints 8–9. This sprint focuses on the operational layer: staging deployment via Docker, Sentry error tracking, user feedback mechanisms, and the user onboarding experience that will greet new users on day one.

---

## User Stories

### BETA-01 — Staging Environment Deployment
**As a** developer,
**I want** the application running on a stable staging URL,
**so that** beta users can access it from any device without running it locally.

**Acceptance criteria:**
- The production Docker image (`docker/Dockerfile`) is deployed to a staging host (VPS, Fly.io, Railway, or Vercel)
- Staging URL follows the pattern: `https://staging.taskmaster.app` (or equivalent)
- HTTPS is configured with a valid TLS certificate (Let's Encrypt or host-provided)
- Deployment is automated: merging to `main` triggers the CI pipeline → builds Docker image → pushes to registry → deploys to staging
- Deployment completes in under 5 minutes from merge to live
- Staging environment uses `NODE_ENV=staging` with its own `.env.staging` variables

**Story points:** 13

---

### BETA-02 — User Onboarding Flow
**As a** new user arriving for the first time,
**I want** a guided onboarding experience,
**so that** I understand the app's key features quickly and can get started without reading documentation.

**Acceptance criteria:**
- After a new user registers and lands on the dashboard, a welcome modal appears: `"Welcome to Task Master! Let's set up your workspace in 3 steps."`
- Step 1: Create your first task (opens the task creation modal pre-populated with placeholder text)
- Step 2: Move a task on the Kanban board (highlights the kanban board link in the sidebar with a pulsing ring)
- Step 3: Invite a team member (links to Team Management)
- A progress indicator shows `1/3`, `2/3`, `3/3` as steps are completed
- Users can skip the onboarding at any step; `"Skip setup"` link in the top-right of the modal
- Onboarding completion state is stored in IndexedDB `settings` per user
- After completing all 3 steps, a `"You're all set! 🎉"` toast appears and the modal closes permanently

**Story points:** 8

---

### BETA-03 — Sentry Error Tracking Integration
**As a** developer,
**I want** runtime errors in staging and production reported to Sentry,
**so that** bugs experienced by beta users are captured automatically even when users do not report them.

**Acceptance criteria:**
- `@sentry/vue` is installed and initialised in `main.js` when `VITE_SENTRY_DSN` is set
- Sentry is disabled when `VITE_SENTRY_DSN` is not set (local development)
- Unhandled errors and promise rejections are automatically captured
- `ErrorBoundary.vue` (Sprint 9 — PERF-07) calls `Sentry.captureException(error)` in addition to logging to console
- User context (non-PII: user ID, role) is attached to all Sentry events via `Sentry.setUser`
- Source maps are uploaded to Sentry during the CI build process so stack traces show original code
- A Sentry alert rule is configured: notify via email if error rate exceeds 5 errors/minute

**Story points:** 5

---

### BETA-04 — In-App Feedback Widget
**As a** beta user,
**I want** to submit feedback directly from within the app,
**so that** reporting issues or suggestions requires minimal friction.

**Acceptance criteria:**
- A floating `"Feedback"` button appears at the bottom-right of every page (above the toast area)
- Clicking it opens a small panel with: feedback type (Bug / Suggestion / Praise), text area (max 500 characters), current page URL (auto-filled, editable), optional email field
- Submitting the form calls a lightweight endpoint or sends to a webhook (Formspree, Netlify Forms, or a custom `scripts/feedback-webhook.js` handler)
- A thank-you toast appears on submit: `"Thanks for your feedback! We review every submission."`
- The feedback button is disabled (hidden) when `VITE_FEEDBACK_ENABLED=false` (for production, once beta ends)
- All submissions are logged to a `feedback` spreadsheet or Notion database (manual review during beta)

**Story points:** 5

---

### BETA-05 — Feature Flags System
**As a** developer,
**I want** a simple feature flag system,
**so that** I can toggle beta features on/off without a code deployment.

**Acceptance criteria:**
- A `src/config/features.ts` file exports a `flags` object: `{ emailInvitations: boolean, feedbackWidget: boolean, pdfExport: boolean }`
- Flag values are read from `VITE_` environment variables with sensible defaults
- Components read flags via `import { flags } from '@/config/features'` and conditionally render features
- Flags are documented in `docs/environment-variables.md`
- Changing a flag requires only an environment variable update and a redeploy (no code change)
- In beta: `emailInvitations: false`, `feedbackWidget: true`, `pdfExport: true`

**Story points:** 3

---

### BETA-06 — Beta User Onboarding & Access Control
**As a** product owner,
**I want** to control who can access the staging app during the beta,
**so that** unintended users do not access pre-release software.

**Acceptance criteria:**
- A beta access code is required on the registration page during beta (`VITE_BETA_CODE=TASKMASTER2026`)
- The registration form includes a "Beta access code" field; submitting with a wrong code shows `"Invalid beta code"`
- When `VITE_BETA_CODE` is unset, the field is hidden (used in production)
- A curated list of 10–20 beta users receives the code and a welcome email with setup instructions
- Beta user accounts are pre-created in IndexedDB seed (no sign-up required for primary beta participants)

**Story points:** 3

---

### BETA-07 — Basic Usage Analytics
**As a** product owner,
**I want** to understand which features beta users use most,
**so that** I can prioritise post-launch improvements.

**Acceptance criteria:**
- A lightweight analytics integration is added (Plausible Analytics or Umami — both are privacy-first and GDPR-compliant)
- Tracked events: page views (auto), task created, task completed, timer started, kanban card moved, CSV exported, analytics viewed
- Events are tracked client-side using the analytics script's API: `plausible('task_created')`
- No PII is collected; user IDs are not sent to the analytics service
- A `VITE_ANALYTICS_DOMAIN` environment variable controls the tracking domain; unset = disabled
- Data is viewable in the Plausible/Umami dashboard by the product owner

**Story points:** 3

---

### BETA-08 — Beta Feedback Triage & Critical Fixes
**As a** product owner,
**I want** all critical bugs reported during beta triaged and fixed within the sprint,
**so that** the production launch is not blocked by known user-impacting issues.

**Acceptance criteria:**
- All beta feedback is reviewed within 48 hours of submission
- Bugs are classified: P0 (app unusable), P1 (significant feature broken), P2 (minor), P3 (cosmetic)
- All P0 and P1 bugs reported during beta are fixed and deployed to staging before sprint end
- A `docs/beta/feedback-log.md` document is maintained listing all feedback received, its triage, and resolution
- A `docs/beta/known-issues.md` document lists all P2/P3 issues deferred to post-launch
- The product owner signs off that the app is launch-ready at sprint end

**Story points:** 13

---

### BETA-09 — Documentation: User Guide
**As a** new user,
**I want** a user guide I can reference when I am unsure how to do something,
**so that** I am not blocked by lack of knowledge.

**Acceptance criteria:**
- `docs/user-guide/` contains one file per primary feature:
  - `getting-started.md` — registration, login, workspace overview
  - `tasks.md` — creating, editing, assigning, tagging tasks
  - `kanban.md` — using the board, swimlane view, drag-and-drop, columns
  - `backlog-priority.md` — grooming the backlog, the priority matrix, sprint planning
  - `time-tracking.md` — using the timer, manual entries, reading reports
  - `team-management.md` — inviting members, roles, permissions
  - `analytics.md` — reading the dashboard, exporting reports
- Each file includes numbered steps, with screenshots or ASCII diagrams where helpful
- A `docs/user-guide/README.md` serves as the table of contents with links

**Story points:** 13

---

## Technical Tasks

| ID | Task | Points |
|----|------|--------|
| T-58 | Install `@sentry/vue`; add DSN env var to `.env.example` | 1 |
| T-59 | Configure CI to build and push Docker image to GitHub Container Registry (GHCR) | 3 |
| T-60 | Add deployment step to CI: SSH into staging server and pull new image | 3 |
| T-61 | Create `src/config/features.ts` with type-safe flag definitions | 1 |
| T-62 | Write beta onboarding test: new user completes all 3 steps, verify completion state | 3 |

**Technical task total:** 11 pts

---

## Capacity & Allocation

| Area | Points |
|------|--------|
| Staging deployment (BETA-01) | 13 |
| Onboarding flow (BETA-02) | 8 |
| Monitoring & tracking (BETA-03, BETA-07) | 8 |
| Feedback & flags (BETA-04, BETA-05, BETA-06) | 11 |
| Beta management (BETA-08) | 13 |
| Documentation (BETA-09) | 13 |
| Technical tasks | 11 |
| **Buffer** | 3 |
| **Total** | **80 pts** |

---

## Dependencies

| Dependency | From |
|-----------|------|
| Docker production image | Sprint 0 — INF-08 |
| CI pipeline (build + push steps) | Sprint 0 — INF-02 |
| `ErrorBoundary.vue` | Sprint 9 — PERF-07 |
| Lighthouse ≥90 | Sprint 9 |

## Risks

| Risk | Mitigation |
|------|-----------|
| Beta user count is insufficient for meaningful feedback | Recruit 20 users minimum; include 5 internal team members |
| Staging deployment fails due to host configuration | Choose a managed platform (Fly.io, Railway) to reduce ops complexity |
| Beta feedback uncovers a fundamental UX issue | Reserve Sprint 11 buffer for major UX rework if needed |
| User documentation takes more time than estimated | Assign one developer specifically to docs; parallelize with bug fixes |

## Definition of Done

- Staging environment is live and accessible via HTTPS
- 10+ beta users are actively using the app
- Sentry is capturing errors from staging
- All P0 and P1 bugs from beta feedback are resolved
- User guide is complete for all 7 primary features
- Product owner has signed off on launch readiness

## Key Deliverables

1. Staging deployment (Docker → GHCR → auto-deploy on merge)
2. User onboarding flow (3-step wizard)
3. Sentry error tracking with source maps
4. In-app feedback widget
5. Feature flag system (`src/config/features.ts`)
6. Beta access code gate on registration
7. Privacy-first usage analytics (Plausible/Umami)
8. Full user guide (`docs/user-guide/`)
9. Beta feedback log and known-issues tracker
