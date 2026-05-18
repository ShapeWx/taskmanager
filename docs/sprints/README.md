# Task Master — Sprint Roadmap

## Overview

This document defines the full sprint plan for Task Master from infrastructure setup through production launch. All sprints are two-week iterations. The plan runs from **May 19, 2026** to a **production launch on November 3, 2026** — twelve sprints covering six phases.

---

## Methodology

- **Framework:** Scrum with 2-week sprints
- **Ceremonies:** Sprint planning (Day 1), daily standups (async), mid-sprint review (Day 7), sprint review + retrospective (Day 14)
- **Velocity unit:** Story points (Fibonacci: 1, 2, 3, 5, 8, 13)
- **Team capacity:** 3 developers × 8 pts/day × 10 days = ~80 pts/sprint (adjust per team actuals)
- **Definition of Done (global):**
  - Feature is fully implemented per acceptance criteria
  - Unit tests written and passing (≥80% coverage on new code)
  - No TypeScript/ESLint errors
  - PR reviewed and approved by at least one other developer
  - Deployed to development environment and manually tested
  - Accessibility checked (keyboard navigable, ARIA labels present)

---

## Phases

| Phase | Sprints | Focus |
|-------|---------|-------|
| **Phase 1 — Foundation** | Sprint 0 | Infrastructure, CI/CD, Docker, tooling |
| **Phase 2 — Core** | Sprints 1–2 | Auth, database layer, task management |
| **Phase 3 — Features** | Sprints 3–7 | Kanban, Backlog, Time Tracking, Team, Analytics |
| **Phase 4 — Quality** | Sprints 8–9 | Testing, QA, performance, polish |
| **Phase 5 — Beta** | Sprint 10 | Staging deploy, beta users, feedback |
| **Phase 6 — Launch** | Sprint 11 | Final hardening, production deploy, launch |

---

## Master Timeline

| Sprint | Name | Start | End | Key Milestone |
|--------|------|-------|-----|---------------|
| **Sprint 0** | Foundation & Infrastructure | May 19 | May 30 | Monorepo + CI/CD live |
| **Sprint 1** | Auth & Database Layer | Jun 2 | Jun 13 | Login/register with IndexedDB |
| **Sprint 2** | Task Management Core | Jun 16 | Jun 27 | Full task CRUD persisted |
| **Sprint 3** | Kanban Board | Jun 30 | Jul 11 | Drag-drop kanban complete |
| **Sprint 4** | Backlog & Priority | Jul 14 | Jul 25 | Backlog + priority matrix live |
| **Sprint 5** | Time Tracking | Jul 28 | Aug 8 | Timer + reports persisted |
| **Sprint 6** | Team Management & RBAC | Aug 11 | Aug 22 | Permissions enforced end-to-end |
| **Sprint 7** | Analytics & Reporting | Aug 25 | Sep 5 | Real-data dashboards + exports |
| **Sprint 8** | Testing & QA | Sep 8 | Sep 19 | ≥80% test coverage, E2E suite |
| **Sprint 9** | Performance & Polish | Sep 22 | Oct 3 | Lighthouse ≥90, zero a11y errors |
| **Sprint 10** | Beta Launch | Oct 6 | Oct 17 | Staging live, beta users onboarded |
| **Sprint 11** | Launch Preparation | Oct 20 | Oct 31 | Production hardened, docs complete |
| **LAUNCH** | Production Launch | **Nov 3** | — | **Task Master v1.0 ships** |

---

## Tech Stack Reference

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3, Vite, Pinia, Vue Router, Tailwind CSS |
| UI Components | Headless UI, Heroicons |
| Local Database | IndexedDB (via custom wrapper in `src/db/`) |
| Testing (unit) | Vitest + @vue/test-utils |
| Testing (E2E) | Cypress |
| Monorepo | pnpm workspaces + Turborepo |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Error Tracking | Sentry |
| Hosting | TBD (Vercel / Netlify / self-hosted Nginx) |

---

## Sprint Files

| File | Sprint |
|------|--------|
| [sprint-0-foundation.md](sprint-0-foundation.md) | Sprint 0 — Foundation & Infrastructure |
| [sprint-1-auth-database.md](sprint-1-auth-database.md) | Sprint 1 — Auth & Database Layer |
| [sprint-2-task-management.md](sprint-2-task-management.md) | Sprint 2 — Task Management Core |
| [sprint-3-kanban-board.md](sprint-3-kanban-board.md) | Sprint 3 — Kanban Board |
| [sprint-4-backlog-priority.md](sprint-4-backlog-priority.md) | Sprint 4 — Backlog & Priority Management |
| [sprint-5-time-tracking.md](sprint-5-time-tracking.md) | Sprint 5 — Time Tracking |
| [sprint-6-team-rbac.md](sprint-6-team-rbac.md) | Sprint 6 — Team Management & RBAC |
| [sprint-7-analytics.md](sprint-7-analytics.md) | Sprint 7 — Analytics & Reporting |
| [sprint-8-testing-qa.md](sprint-8-testing-qa.md) | Sprint 8 — Testing & QA |
| [sprint-9-performance-polish.md](sprint-9-performance-polish.md) | Sprint 9 — Performance & Polish |
| [sprint-10-beta.md](sprint-10-beta.md) | Sprint 10 — Beta Launch |
| [sprint-11-launch.md](sprint-11-launch.md) | Sprint 11 — Launch Preparation & Launch |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| IndexedDB complexity slows Sprint 1 | Medium | High | Spike IndexedDB wrapper in Sprint 0 |
| Feature creep expands scope | High | Medium | Strict backlog grooming; defer to v1.1 |
| E2E tests are flaky | Medium | Medium | Retry logic; isolate test data |
| Team velocity lower than estimated | Medium | High | 20% buffer baked into sprint capacity |
| Third-party package incompatibility | Low | Medium | Pin versions; review changelogs early |
| Beta feedback requires major rework | Medium | High | Timebox beta fixes to 1 sprint only |
