# Sprint 7 — Analytics & Reporting

**Dates:** August 25 – September 5, 2026
**Duration:** 2 weeks
**Phase:** 3 — Features
**Points budget:** 80 pts
**Depends on:** Sprints 1–6 (all data stores fully populated)

---

## Sprint Goal

The Analytics Dashboard evolves from static demo data to a real-time reporting engine. Every metric is derived from live IndexedDB records. Managers and admins can filter by date range, drill into team performance, monitor sprint burn-down, and export reports. This is the last feature sprint before Quality begins.

---

## Context

`AnalyticsDashboard.vue` has four metric cards, a task completion trend chart (daily %), a team member performance table, and a sprint burn-down chart. All values are currently hardcoded. The `taskStore`, `timeStore`, and `authStore` now hold real data from Sprints 1–6. This sprint replaces every hardcoded value with live computations and adds export and drill-down capabilities.

---

## User Stories

### ANA-01 — Key Metrics Cards (Real Data)
**As a** manager,
**I want** the four analytics metric cards to show accurate numbers derived from real task data,
**so that** I can trust the dashboard as a management tool.

**Acceptance criteria:**
- **Completion Rate**: `(done tasks / total non-backlog tasks) × 100`, formatted as percentage (e.g., `"68%"`)
- **On-Time Delivery**: `(tasks completed on or before due date / all completed tasks) × 100` — excludes tasks with no due date
- **Avg Completion Time**: mean number of calendar days from `createdAt` to `completedAt` across all done tasks
- **Team Velocity**: sum of `effort` scores for tasks completed in the current sprint window (last 14 days)
- Each card shows a change indicator vs. the previous equivalent period (↑ green, ↓ red, → grey)
- All four metrics update when the global date range filter changes (ANA-05)

**Story points:** 8

---

### ANA-02 — Task Completion Trend Chart (Real Data)
**As a** manager,
**I want** a daily completion percentage trend over the selected date range,
**so that** I can see whether productivity is improving, declining, or steady.

**Acceptance criteria:**
- `TrendBar` components are generated from a computed array: for each day in the selected range, `(tasks completed that day / total active tasks at start of day) × 100`
- Bars are coloured on a green gradient proportional to the daily completion rate
- Hovering a bar shows: `"[Date] — X tasks completed (Y%)"` as a tooltip
- When the range is wider than 14 days, the chart aggregates by week instead of day to avoid crowding
- A horizontal reference line shows the average completion rate across the selected period

**Story points:** 8

---

### ANA-03 — Team Member Performance (Real Data)
**As a** manager,
**I want** to see each team member's completed task count and on-time delivery rate,
**so that** I can recognise high performers and identify who needs support.

**Acceptance criteria:**
- `TeamMemberPerformance` components are generated from `taskStore` filtered by assignee:
  - Tasks completed (count of done tasks assigned to member)
  - On-time rate (tasks completed on/before due date ÷ all completed tasks with a due date)
  - Hours logged this period (from `timeStore`, filtered to date range)
- The list is sortable by: tasks completed, on-time rate, hours logged
- A team average row is shown at the top as a reference
- Clicking a member's row opens their profile panel (Sprint 6 — TEAM-03 member detail)

**Story points:** 8

---

### ANA-04 — Sprint Burn-Down Chart (Real Data)
**As a** manager,
**I want** a burn-down chart for the current sprint window showing planned vs. actual work remaining,
**so that** I can tell whether the sprint will be completed on time.

**Acceptance criteria:**
- `BurndownBar` components represent each day of the current sprint (last 14 days)
- **Ideal line**: linear decrease from total sprint story points on Day 1 to 0 on Day 14
- **Actual line**: remaining story points per day (sum of `effort` on incomplete sprint tasks)
- If actual > ideal, bars are coloured red (behind schedule); if actual < ideal, green (ahead)
- Scope changes (tasks added/removed from sprint mid-sprint) are marked with a triangle icon on that day
- Below the chart: `"X days remaining • Y pts left • Need Z pts/day to finish"`

**Story points:** 13

---

### ANA-05 — Date Range Filter
**As a** user,
**I want** to filter all analytics by a custom date range,
**so that** I can analyse any historical period, not just the current sprint.

**Acceptance criteria:**
- A date range picker in the analytics toolbar supports: This week / Last week / This month / Last month / This quarter / Custom (date picker)
- Changing the range re-computes all four metric cards, the trend chart, team performance, and burn-down
- The selected range is shown in the header: `"Aug 1 – Aug 31, 2026"`
- Range selection is preserved in URL query params (`?from=2026-08-01&to=2026-08-31`)
- Default range on page load: current sprint window (last 14 days)

**Story points:** 5

---

### ANA-06 — Per-Project Analytics
**As a** manager,
**I want** to filter all analytics by a specific project,
**so that** I can track the health of individual projects separately.

**Acceptance criteria:**
- A project filter dropdown appears alongside the date range picker
- `"All projects"` is the default; selecting a project filters all metrics to tasks in that project
- Project filter and date range can be combined
- A project summary card is shown when a project is selected: total tasks, completion %, total hours logged, projected end date (extrapolated from current velocity)

**Story points:** 5

---

### ANA-07 — Analytics Report Export (CSV & PDF)
**As a** manager,
**I want** to export the analytics dashboard data as a CSV or PDF report,
**so that** I can share it with stakeholders who do not have app access.

**Acceptance criteria:**
- An `Export` button (manager/admin only) offers two options: `Download CSV` and `Download PDF`
- **CSV**: contains raw metric values, daily completion data, and per-member performance rows
- **PDF**: uses the browser `window.print()` with a print-specific stylesheet that formats the analytics view cleanly (no sidebar, no header, includes logo and date range in the page header)
- PDF print stylesheet hides all action buttons, nav elements, and interactive controls
- File names: `task-master-analytics-[from]-[to].csv` / `...pdf`

**Story points:** 8

---

### ANA-08 — Velocity Trend (Multi-Sprint)
**As a** manager,
**I want** to see team velocity across the last several sprints,
**so that** I can identify whether the team is improving its throughput over time.

**Acceptance criteria:**
- A "Velocity Trend" section shows a bar per sprint (each 14-day window going back 8 sprints / 16 weeks)
- Each bar represents the sum of `effort` points completed in that sprint window
- Bars are labelled with the sprint number and date range
- A trend line (average) is overlaid across the bars
- Hovering a bar shows: `"Sprint [N] — [Date Range] — [X] pts completed"`
- Only visible when there are ≥2 sprints of data; otherwise shows: `"Not enough data yet. Come back after your first sprint."`

**Story points:** 5

---

## Technical Tasks

| ID | Task | Points |
|----|------|--------|
| T-42 | Create `src/stores/analyticsStore.ts` with computed getters for all metrics; reads from `taskStore` and `timeStore` | 8 |
| T-43 | Add `analyticsStore` getters: `completionRate`, `onTimeDeliveryRate`, `avgCompletionDays`, `teamVelocity`, `completionTrend(from, to)`, `teamPerformance(from, to)`, `burndownData` | 5 |
| T-44 | Create `src/composables/useDateRange.ts` — manages date range state and URL sync | 3 |
| T-45 | Add print stylesheet `src/assets/print.css` imported in `AnalyticsDashboard.vue` | 2 |
| T-46 | Write Vitest tests for all `analyticsStore` getters with seeded task fixtures | 8 |

**Technical task total:** 26 pts

---

## Capacity & Allocation

| Area | Points |
|------|--------|
| Metric cards & trend (ANA-01, ANA-02) | 16 |
| Team & burn-down (ANA-03, ANA-04) | 21 |
| Filters (ANA-05, ANA-06) | 10 |
| Export & velocity (ANA-07, ANA-08) | 13 |
| Technical tasks | 26 |
| **Buffer** | −6 *(defer ANA-08 or reduce T-46 scope)* |
| **Total** | **80 pts** |

---

## Dependencies

| Dependency | From |
|-----------|------|
| Task data with `completedAt`, `effort`, `impact` | Sprints 1–4 |
| Time entries per user per day | Sprint 5 |
| Team member list with assignment data | Sprint 6 — TEAM-03 |
| `src/utils/csv.ts` | Sprint 4 — T-28 |

## Risks

| Risk | Mitigation |
|------|-----------|
| Burn-down chart requires accurate daily snapshots | Derive from `taskHistory` timestamps; approximate if data is sparse |
| Analytics store becomes very large | Lazy-compute metrics only when the view is mounted; don't recompute on every keystroke |
| PDF export looks broken | Budget half a day specifically for print CSS tuning |

## Definition of Done

- All four metric cards show real computed values, not hardcoded strings
- Trend, burn-down, and team performance charts use live IndexedDB data
- Date range and project filters work across all analytics sections
- CSV and PDF export produce readable output
- `analyticsStore` getters are covered by Vitest tests with fixture data

## Key Deliverables

1. Live analytics metric cards (completion rate, on-time delivery, avg time, velocity)
2. Real-data task completion trend chart with tooltips
3. Team member performance table with sorting
4. Sprint burn-down chart with ideal vs. actual lines
5. Date range + project filter with URL sync
6. CSV and PDF report export
7. `analyticsStore.ts` with full Vitest test suite
