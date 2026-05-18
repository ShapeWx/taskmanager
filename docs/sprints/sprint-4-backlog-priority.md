# Sprint 4 — Backlog & Priority Management

**Dates:** July 14 – July 25, 2026
**Duration:** 2 weeks
**Phase:** 3 — Features
**Points budget:** 80 pts
**Depends on:** Sprint 2 (task CRUD, filter/sort), Sprint 3 (kanban persistence)

---

## Sprint Goal

The Backlog is the source of truth for all planned work. By end of sprint, teams can groom the backlog effectively — scoring tasks by effort and impact, promoting tasks to active sprints, and using the Priority Matrix as a decision-making tool. All priority data is derived from real task records.

---

## Context

`BacklogView.vue` has search, filter, and add-task functionality from Sprint 2. `PriorityChart.vue` renders a 2×2 priority matrix, a distribution bar chart, and a top-priority task list — all currently using hardcoded placeholder data. This sprint wires the priority view to real data and introduces backlog grooming workflows: effort/impact scoring, sprint promotion, and sprint planning concepts.

---

## User Stories

### BACK-01 — Backlog Grooming: Effort & Impact Scoring
**As a** manager,
**I want** to score each backlog task by effort (1–5) and impact (1–5),
**so that** the priority matrix can be computed automatically from real assessments.

**Acceptance criteria:**
- The task detail panel (Sprint 2) gains two new fields: `effort` (1–5 slider) and `impact` (1–5 slider)
- Sliders are only editable by users with `manager` or `admin` role; viewers see them as read-only
- Both fields are stored on the task record in IndexedDB
- Effort and impact default to `null` when unset; unscored tasks appear in a special "Unscored" quadrant
- A `"Score tasks"` banner appears at the top of `BacklogView` when >5 tasks are unscored, with a link to the priority chart
- Scoring changes are logged in task activity history: `"Impact set to 4 by [Name]"`

**Story points:** 8

---

### BACK-02 — Priority Matrix (Real Data)
**As a** user,
**I want** the priority matrix to show my actual tasks organised by effort and impact scores,
**so that** I can make data-driven decisions about which tasks to work on next.

**Acceptance criteria:**
- `PriorityChart.vue` → `PriorityMatrix` component populates each quadrant from `taskStore` getters:
  - **Quick Wins** (low effort, high impact): `effort ≤ 2 && impact ≥ 4`
  - **Major Projects** (high effort, high impact): `effort ≥ 4 && impact ≥ 4`
  - **Fill-ins** (low effort, low impact): `effort ≤ 2 && impact ≤ 2`
  - **Thankless Tasks** (high effort, low impact): `effort ≥ 4 && impact ≤ 2`
- Each quadrant card shows the task count and lists up to 3 task titles
- Clicking a quadrant card navigates to `BacklogView` with the appropriate effort/impact filter pre-applied
- Tasks with incomplete scores appear in a fifth "Unscored" section below the matrix
- Matrix updates reactively when scores change

**Story points:** 8

---

### BACK-03 — Priority Distribution Chart (Real Data)
**As a** user,
**I want** the priority distribution bar chart to reflect my actual task priorities,
**so that** I can see the balance between high, medium, and low priority work.

**Acceptance criteria:**
- `PriorityBar` component receives counts from a `taskStore` getter: `priorityDistribution` → `{ high: N, medium: N, low: N }`
- Bars are labelled with both count and percentage (e.g., `"High — 12 tasks (40%)"`)
- Chart updates reactively
- A legend below the chart explains priority levels and their colour coding (red = high, amber = medium, green = low)
- Unset priority tasks are shown as a fourth `"None"` bar in grey

**Story points:** 3

---

### BACK-04 — Top Priority Tasks List (Real Data)
**As a** user,
**I want** the "Top Priority Tasks" section to show the tasks most urgently needing attention,
**so that** I always know what to work on next.

**Acceptance criteria:**
- `TopPriorityTask` components are generated from a `taskStore` computed getter `topPriorityTasks`:
  - Sorted by: priority (high first), then due date (soonest first), then impact score (highest first)
  - Excludes tasks with status `done`
  - Shows the top 5 tasks
- Each item shows: title, priority badge, due date (coloured red if overdue), assigned-to initials
- Clicking an item opens the task detail panel

**Story points:** 3

---

### BACK-05 — Sprint Planning: Promote Tasks to Active Sprint
**As a** manager,
**I want** to select backlog tasks and move them into the active sprint (status: `todo`),
**so that** the team has a clear set of committed work for the current iteration.

**Acceptance criteria:**
- `BacklogView.vue` shows tasks with status `backlog` by default (with an option to show all)
- Each backlog item has a "Promote to sprint" button (rocket icon); manager/admin only
- Clicking it changes the task status from `backlog` to `todo` and shows a toast: `"Task added to sprint"`
- A "Sprint backlog" section at the top of `BacklogView` lists tasks with status `todo`, separated from the backlog pool
- Dragging a task from "Sprint backlog" back to "Backlog pool" sets status back to `backlog`
- A sprint capacity indicator shows: `[sprint points] / [team capacity]` — computed as sum of effort scores of `todo` tasks vs. configurable team capacity (default: 40 pts)
- Sprint capacity is configurable via a settings field in the sidebar

**Story points:** 13

---

### BACK-06 — Backlog Item Priority Quick-Change
**As a** user,
**I want** to change a task's priority directly from the backlog list,
**so that** I can triage quickly without opening the detail panel.

**Acceptance criteria:**
- `BacklogItem.vue` priority badge is clickable and cycles through `low → medium → high → low` on each click
- Alternatively, a 3-option dropdown appears on hover
- Change is persisted via `taskStore.updateTask()` and shown immediately
- A brief pulse animation highlights the badge after the change
- The change is logged in task activity history

**Story points:** 3

---

### BACK-07 — Backlog Empty & Zero-State
**As a** user,
**I want** descriptive empty states when the backlog or a filter has no results,
**so that** I understand why the list is empty and what to do next.

**Acceptance criteria:**
- Empty backlog (no tasks at all): illustration + `"Your backlog is empty"` + `"Add your first task"` button
- Backlog with active filters but no results: `"No tasks match your filters"` + `"Clear filters"` button
- Priority chart with no scored tasks: `"Score your tasks to see the priority matrix"` + link to backlog
- All empty states include a relevant Heroicon illustration

**Story points:** 2

---

### BACK-08 — Backlog Export
**As a** manager,
**I want** to export the current backlog view to CSV,
**so that** I can share it with stakeholders who do not use the app.

**Acceptance criteria:**
- A `Download CSV` button appears in the backlog toolbar (manager/admin only)
- The exported CSV contains columns: ID, Title, Description, Status, Priority, Effort, Impact, Due Date, Assignees, Tags, Project, Created At
- Only the currently visible (filtered/searched) tasks are exported
- File name format: `task-master-backlog-YYYY-MM-DD.csv`
- Export uses a client-side `Blob` + `URL.createObjectURL`; no server required

**Story points:** 5

---

## Technical Tasks

| ID | Task | Points |
|----|------|--------|
| T-25 | Add `effort` and `impact` (nullable integers 1–5) to `Task` type and IndexedDB schema | 2 |
| T-26 | Add `taskStore` getters: `priorityDistribution`, `topPriorityTasks`, `tasksByQuadrant` | 5 |
| T-27 | Add `sprintCapacity` setting to IndexedDB `settings` store (new store); default 40 | 2 |
| T-28 | Create `src/utils/csv.ts` — generic array-to-CSV serialiser | 2 |
| T-29 | Write Vitest tests for `tasksByQuadrant` and `topPriorityTasks` getters | 3 |
| T-30 | Write Cypress E2E test: score a task, verify it appears in correct quadrant | 3 |

**Technical task total:** 17 pts

---

## Capacity & Allocation

| Area | Points |
|------|--------|
| Effort/impact scoring (BACK-01) | 8 |
| Priority matrix real data (BACK-02 – BACK-04) | 14 |
| Sprint planning (BACK-05) | 13 |
| Backlog UX (BACK-06 – BACK-08) | 10 |
| Technical tasks | 17 |
| **Buffer** | 18 |
| **Total** | **80 pts** |

---

## Dependencies

| Dependency | From |
|-----------|------|
| Task detail panel for effort/impact fields | Sprint 2 — TASK-02 |
| `taskStore.updateTask()` wired to IndexedDB | Sprint 1 — DB-01 |
| Task filter/sort in BacklogView | Sprint 2 — TASK-05 |

## Risks

| Risk | Mitigation |
|------|-----------|
| Sprint capacity UI adds too much scope | Simplify to static capacity input; defer full sprint management to v1.1 |
| Effort/impact scoring UX is subjective | Provide tooltips explaining each score level (1=trivial, 5=major) |

## Definition of Done

- Every task in `BacklogView` can be scored for effort and impact
- Priority Matrix shows real tasks in correct quadrants
- Top Priority Tasks list is computed from live data
- Sprint promotion workflow (backlog → todo) works and persists
- CSV export generates a valid, correctly formatted file
- `tasksByQuadrant` getter is unit-tested

## Key Deliverables

1. Effort/impact scoring on tasks (task detail panel + IndexedDB)
2. Live-data Priority Matrix (4 quadrants + unscored section)
3. Priority distribution bar chart from real data
4. Sprint promotion workflow with capacity indicator
5. Backlog CSV export
6. Empty/zero states for all backlog scenarios
