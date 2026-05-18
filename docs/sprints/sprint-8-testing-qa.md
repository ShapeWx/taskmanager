# Sprint 8 — Testing & QA

**Dates:** September 8 – September 19, 2026
**Duration:** 2 weeks
**Phase:** 4 — Quality
**Points budget:** 80 pts
**Depends on:** Sprints 0–7 (all features complete)

---

## Sprint Goal

Achieve ≥80% unit test coverage across all stores and composables, a complete Cypress E2E suite covering every critical user journey, and zero WCAG 2.1 AA accessibility violations on any primary view. Every defect found is triaged, prioritised, and either fixed in-sprint or logged as a backlog item.

---

## Context

Individual sprints have added targeted unit tests and one or two E2E tests each. Coverage is uneven — some stores are well-tested, others have no tests at all. This sprint is a dedicated quality sprint: writing tests for all untested code, fixing the bugs those tests reveal, running accessibility audits, and ensuring the CI pipeline enforces all quality gates.

---

## Test Coverage Targets

| Area | Current estimate | Target |
|------|-----------------|--------|
| `authStore` | ~60% | ≥80% |
| `taskStore` | ~50% | ≥80% |
| `timeStore` | ~40% | ≥80% |
| `analyticsStore` | ~70% | ≥85% |
| Composables | ~30% | ≥80% |
| Utility functions | ~20% | ≥90% |
| **Overall** | **~45%** | **≥80%** |

---

## User Stories

### QA-01 — Unit Tests: Auth Store
**As a** developer,
**I want** comprehensive unit tests for `authStore`,
**so that** authentication logic is provably correct across all role/permission combinations.

**Acceptance criteria:**
- Tests cover: `login` (valid, invalid credentials), `register` (new user, duplicate email), `logout`, `initializeAuth` (with and without session token in storage), `updateUserRole`, `changePassword`, `updateProfile`
- Permission getter tests: every permission string × every role (admin, manager, user, viewer) — 4 × N matrix
- `canEditTask` and `canDeleteTask` tested for own-task and other-user's-task scenarios
- All tests use `fake-indexeddb` to avoid browser environment dependency
- Coverage on `authStore`: ≥85% statements, branches, functions

**Story points:** 8

---

### QA-02 — Unit Tests: Task Store
**As a** developer,
**I want** comprehensive unit tests for `taskStore`,
**so that** all task mutations and computed getters behave correctly under edge cases.

**Acceptance criteria:**
- Tests cover: `addTask`, `updateTask`, `deleteTask`, `updateTaskStatus` (including history logging), `addCategory`, `deleteCategory` (empty vs. non-empty), `reorderCategories`
- Getter tests: `activeTasks`, `overdueTasks`, `completedToday`, `getTasksByStatus`, `getTasksByAssignee`, `priorityDistribution`, `topPriorityTasks`, `tasksByQuadrant`
- Edge cases: task with no due date (should not appear in overdue), task completed in a previous day (should not appear in `completedToday`)
- Coverage on `taskStore`: ≥80%

**Story points:** 8

---

### QA-03 — Unit Tests: Time Store & Composables
**As a** developer,
**I want** unit tests for `timeStore` and all composables,
**so that** timer logic and shared utilities are regression-proof.

**Acceptance criteria:**
- `timeStore` tests: `startTimer`, `pause`, `resume`, `stop`, `addManualEntry`, `deleteEntry`; active timer persistence/recovery; duration calculation accuracy
- `useTimer` tests: elapsed time calculation, `HH:MM:SS` formatting, pause/resume accumulation
- `useTaskFilter` tests: each filter type (status, priority, assignee, tag, date range), combined filters, sort options
- `useSearch` tests: case insensitivity, partial match, empty query clears results
- `usePermission` tests: returns correct `canDo` value for every role
- `useDateRange` tests: preset ranges resolve to correct `from`/`to` dates, URL sync
- Coverage across composables: ≥80%

**Story points:** 8

---

### QA-04 — Unit Tests: Analytics Store & Utilities
**As a** developer,
**I want** unit tests for `analyticsStore` and utility functions,
**so that** all calculated metrics can be verified against known data sets.

**Acceptance criteria:**
- `analyticsStore` tests use a fixed set of seeded tasks (a test fixture file at `src/test/fixtures/tasks.ts`) so metric expectations are deterministic
- Tests cover: `completionRate` (with 0 tasks, with all done, with mixed), `onTimeDeliveryRate` (tasks missing due date excluded), `avgCompletionDays`, `teamVelocity`, `completionTrend` (day aggregation and week aggregation), `burndownData`
- `src/utils/csv.ts` tests: serialises arrays correctly, handles commas and quotes in values, produces correct headers
- `src/utils/hash.ts` tests: `hashPassword` returns different hash each time (with salt), `verifyPassword` returns true for matching input
- Coverage on `analyticsStore` and utilities: ≥85%

**Story points:** 8

---

### QA-05 — Cypress E2E: Authentication Journey
**As a** QA engineer,
**I want** E2E tests covering the full authentication flow,
**so that** auth regressions are caught before they reach users.

**Acceptance criteria:**
- Tests (all using fresh IndexedDB state via `cy.task('clearDB')` before each test):
  1. Register a new user → verify redirected to dashboard → verify user in DB
  2. Login with valid credentials → verify session → navigate to protected route
  3. Login with wrong password → verify error message → verify not redirected
  4. Logout → verify redirected to login → verify back button does not bypass auth
  5. Admin logs in → navigates to `/authorization` → verifies user table visible
  6. Viewer logs in → attempts to navigate to `/authorization` → verify redirect to `/`
- All tests pass in CI with no flakiness over 3 consecutive runs

**Story points:** 8

---

### QA-06 — Cypress E2E: Task Management Journey
**As a** QA engineer,
**I want** E2E tests covering core task CRUD and kanban operations,
**so that** regressions in the most-used workflows are detected automatically.

**Acceptance criteria:**
- Tests:
  1. Create task with all fields → verify in backlog → verify in IndexedDB
  2. Open task detail panel → edit title → close → verify change persisted
  3. Change task status via inline dropdown → verify history entry logged
  4. Drag card from "Todo" to "Doing" on kanban board → verify status change
  5. Bulk-select 3 tasks → bulk delete → verify removed from backlog
  6. Filter backlog by priority "High" → verify only high-priority tasks shown
  7. Search for task by title → verify result → clear search → verify all tasks restored
- Tests run in under 3 minutes total

**Story points:** 8

---

### QA-07 — Cypress E2E: Time Tracking & Analytics
**As a** QA engineer,
**I want** E2E tests for time tracking and analytics,
**so that** the most complex data-flow paths are validated end-to-end.

**Acceptance criteria:**
- Tests:
  1. Start timer on a task → pause → resume → stop → verify entry appears in "Today's Entries"
  2. Add manual time entry → verify in log → edit it → verify change
  3. Close browser with timer running → reopen → verify recovery banner appears
  4. Navigate to analytics → verify metric cards show non-zero values → change date range → verify cards update
  5. Export backlog CSV → verify file downloads and contains expected columns
- Tests isolated: each test seeds its own IndexedDB state via `cy.task('seedDB', fixtures)`

**Story points:** 8

---

### QA-08 — Accessibility Audit
**As a** user with disabilities,
**I want** the application to meet WCAG 2.1 Level AA,
**so that** it is usable with a screen reader, keyboard only, and at high zoom levels.

**Acceptance criteria:**
- `axe-core` integrated into Cypress tests via `cypress-axe`; `cy.checkA11y()` called on every primary view
- Zero `critical` or `serious` axe violations on: Login, Dashboard, Kanban Board, Backlog, Time Tracking, Analytics, Team Management
- All form inputs have associated `<label>` elements or `aria-label`
- All icon-only buttons have `aria-label` or visible tooltip text
- Colour contrast ratios meet 4.5:1 for normal text, 3:1 for large text (verified for all 4 themes)
- Modal dialogs trap focus correctly (verified manually and with axe)
- Skip-to-content link present on all pages
- All images and decorative icons have appropriate `aria-hidden="true"` or `alt` text

**Story points:** 8

---

### QA-09 — Cross-Browser Testing
**As a** developer,
**I want** the application tested in all major browsers,
**so that** we do not ship visual or functional regressions for large user segments.

**Acceptance criteria:**
- Manual testing matrix completed on: Chrome 125+, Firefox 127+, Safari 17+, Edge 125+
- All critical user journeys (auth, task CRUD, kanban drag-drop, timer) verified in each browser
- No console errors in any browser on any primary view
- IndexedDB operations work correctly in Safari (known quirks documented and tested)
- Drag-and-drop verified in Chrome and Firefox (Safari mouse events may differ)
- Results documented in `docs/qa/cross-browser-results.md`

**Story points:** 5

---

### QA-10 — Bug Triage & Fix
**As a** product owner,
**I want** all bugs discovered during this sprint triaged and either fixed or deferred,
**so that** we enter the performance sprint with a clean issue list.

**Acceptance criteria:**
- All bugs found during QA-05 through QA-09 are logged in the project issue tracker (GitHub Issues)
- Each bug is assigned a severity: P0 (blocks usage), P1 (significant impact), P2 (minor), P3 (cosmetic)
- All P0 and P1 bugs are fixed within this sprint
- P2 and P3 bugs are documented and assigned to Sprint 9 or the v1.1 backlog
- Zero known P0 or P1 bugs at sprint end
- A QA summary report is written: `docs/qa/sprint-8-qa-report.md`

**Story points:** 8

---

## Technical Tasks

| ID | Task | Points |
|----|------|--------|
| T-47 | Create `src/test/fixtures/tasks.ts`, `users.ts`, `timeEntries.ts` — deterministic test data | 3 |
| T-48 | Configure `cypress-axe` and add `cy.checkA11y()` calls to all E2E tests | 2 |
| T-49 | Add `cy.task('clearDB')` and `cy.task('seedDB')` Cypress tasks in `cypress.config.js` via `fake-indexeddb` | 3 |
| T-50 | Enforce coverage thresholds in CI: fail build if any store falls below 80% | 2 |
| T-51 | Add Vitest `describe.each` for permission matrix tests (role × permission) | 2 |

**Technical task total:** 12 pts

---

## Capacity & Allocation

| Area | Points |
|------|--------|
| Unit tests: stores (QA-01 – QA-04) | 32 |
| E2E tests (QA-05 – QA-07) | 24 |
| Accessibility (QA-08) | 8 |
| Cross-browser (QA-09) | 5 |
| Bug triage & fix (QA-10) | 8 |
| Technical tasks | 12 |
| **Buffer** | −9 *(deprioritise QA-09 cross-browser to manual only; reduce QA-10 allocation)* |
| **Total** | **80 pts** |

---

## Dependencies

| Dependency | From |
|-----------|------|
| All feature stores and composables | Sprints 1–7 |
| `fake-indexeddb` installed | Sprint 0 — T-01 |
| Vitest and Cypress baseline | Sprint 0 — INF-06 |

## Risks

| Risk | Mitigation |
|------|-----------|
| Writing tests reveals significant bugs requiring large fixes | Budget QA-10 at 8 pts; escalate P0s immediately |
| Cypress E2E is flaky in CI | Use `cy.intercept` to control timing; add `--retry 2` flag |
| IndexedDB behaves differently in Safari | Test early in sprint; document workarounds in `docs/qa/` |
| 80% coverage target is too ambitious for 2 weeks | Prioritise stores over utility files; reduce target to 70% if blocked |

## Definition of Done

- `pnpm test:unit` reports ≥80% overall coverage
- All Cypress E2E tests pass in CI with `--retry 2` and zero flakiness
- Zero axe `critical` or `serious` violations on all primary views
- Zero P0 / P1 bugs open at sprint end
- `docs/qa/sprint-8-qa-report.md` written and reviewed

## Key Deliverables

1. Full unit test suite for all stores and composables
2. Cypress E2E suite: auth, task CRUD, kanban, time tracking, analytics
3. `cypress-axe` integration with zero critical violations
4. Cross-browser test results documented
5. Bug triage report with all P0/P1 bugs resolved
6. Test fixture files for deterministic testing
