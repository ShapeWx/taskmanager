# Sprint 2 — Task Management Core

**Dates:** June 16 – June 27, 2026
**Duration:** 2 weeks
**Phase:** 2 — Core
**Points budget:** 80 pts
**Depends on:** Sprint 1 (IndexedDB data layer, auth system)

---

## Sprint Goal

Complete the task management system end-to-end: every task action (create, read, update, delete, assign, tag, comment) is fully functional, persisted, and validated. The Dashboard and Backlog views are wired to real data. Users can manage their full workload from a single pane.

---

## Context

The UI for tasks is largely built across `BacklogView`, `Dashboard`, `TaskItem`, `BacklogItem`, and the modal in `MainLayout`. The Pinia `taskStore` now writes to IndexedDB (Sprint 1). This sprint focuses on completeness and correctness: filling in any gaps in the CRUD cycle, adding task detail editing, wiring search, and ensuring the Dashboard reflects real persisted state rather than seeded demo values.

---

## User Stories

### TASK-01 — Create Task (Full Form)
**As a** user,
**I want** to create a task with all available fields filled in,
**so that** tasks are complete and actionable from the moment they are added.

**Acceptance criteria:**
- The floating task creation modal (in `MainLayout.vue`) includes: title (required), description, status, priority, due date, project, assignees (multi-select from team members), and tags (free-text with enter-to-add)
- Submitting with an empty title shows an inline `"Title is required"` error; modal does not close
- On success, the new task appears immediately in the relevant view (Backlog or Dashboard "My Tasks") without a page reload
- Task `id` is a UUID; `createdAt` is set to the current ISO timestamp
- Task is written to IndexedDB `tasks` store via `taskStore.addTask()`
- A success toast appears: `"Task created"`

**Story points:** 8

---

### TASK-02 — Task Detail Panel / Edit Modal
**As a** user,
**I want** to click on any task and open a detail panel where I can edit every field,
**so that** I can update tasks without navigating away from my current view.

**Acceptance criteria:**
- Clicking a task in any view (`TaskItem`, `BacklogItem`, `KanbanColumn`) opens a slide-in right panel or centred modal
- The panel displays: title, description, status, priority, due date, project, assignees, tags, created date, and activity history for that task
- Every field is editable inline; changes auto-save (debounced 500ms) or via an explicit "Save" button
- Closing the panel without saving prompts a `ConfirmModal` only if there are unsaved changes
- Delete button inside the panel triggers `ConfirmModal` and then calls `taskStore.deleteTask()`
- Panel is accessible via keyboard (focus trapped while open, `Escape` closes it)

**Story points:** 13

---

### TASK-03 — Inline Task Status Change
**As a** user,
**I want** to change a task's status directly from any list view,
**so that** I do not need to open the detail panel for quick status updates.

**Acceptance criteria:**
- `TaskItem` and `BacklogItem` components each have a status dropdown (or segmented control) visible on hover
- Selecting a new status calls `taskStore.updateTaskStatus(taskId, newStatus)` and a history entry is logged
- The change is reflected immediately in the UI without a full store reload
- Status options: `Todo`, `Doing`, `Done`, `Backlog`
- Changing status to `Done` sets `task.completedAt` to the current ISO timestamp

**Story points:** 5

---

### TASK-04 — Task Search
**As a** user,
**I want** to search for tasks by title or description from the top bar,
**so that** I can find a specific task in a large backlog quickly.

**Acceptance criteria:**
- The search input in `TopBar.vue` uses the `useSearch` composable (`searchQuery` ref)
- Typing in the search bar filters the task list in the currently active view in real-time (no submit button needed)
- Search is case-insensitive and matches partial strings in both `title` and `description`
- The search result count is shown: `"3 tasks found"`
- Clearing the search input restores the full list
- Search state does not persist across route changes (clears on navigation)

**Story points:** 5

---

### TASK-05 — Advanced Task Filtering & Sorting
**As a** user,
**I want** to filter and sort the task list by multiple criteria simultaneously,
**so that** I can focus on the subset of tasks most relevant to me right now.

**Acceptance criteria:**
- `BacklogView.vue` filter panel exposes: Status (multi-select checkboxes), Priority (multi-select), Assignee (multi-select), Project (multi-select), Due Date (before / after / range)
- Sorting options: Due Date (asc/desc), Priority (high→low / low→high), Created Date (newest/oldest), Title (A–Z / Z–A)
- Active filters are shown as dismissible chips above the list
- A "Clear filters" button resets all filters at once
- Filter/sort state is preserved on route change (stored in URL query params: `?status=todo&priority=high&sort=dueDate`)
- Filtered + sorted list is derived from a computed getter on `taskStore`

**Story points:** 8

---

### TASK-06 — Bulk Task Operations
**As a** manager,
**I want** to select multiple tasks and perform bulk actions,
**so that** I can manage a large backlog efficiently.

**Acceptance criteria:**
- `BacklogView.vue` shows a checkbox on each `BacklogItem` (visible on hover or when selection mode is active)
- A "Select all" checkbox in the header selects/deselects all visible tasks
- With ≥1 tasks selected, a bulk action bar appears at the bottom: `Assign to`, `Set status`, `Set priority`, `Delete selected`
- `Delete selected` shows a `ConfirmModal` listing the number of tasks to be deleted
- All bulk operations call the appropriate `taskStore` actions and update IndexedDB
- Deselect all / exit selection mode with an `×` button on the bulk action bar

**Story points:** 8

---

### TASK-07 — Task Tags Management
**As a** user,
**I want** to create, assign, and remove tags on tasks,
**so that** I can organise tasks by custom labels beyond status and priority.

**Acceptance criteria:**
- Tags are free-text strings; there is no predefined list
- In the task detail panel and create modal, pressing `Enter` or `,` after typing adds a tag chip
- Tags are rendered as coloured pills (colour derived from tag name hash, consistent across the app)
- Clicking a tag anywhere in the app filters the active view to show only tasks with that tag
- The sidebar `Tags` collapsible section lists all distinct tags in use, with click-to-filter behaviour
- Tags are stored as an array of strings on the task record in IndexedDB

**Story points:** 5

---

### TASK-08 — Task Activity History
**As a** user,
**I want** to see a chronological log of all changes made to a task,
**so that** I can understand what happened and who changed what.

**Acceptance criteria:**
- The task detail panel includes an "Activity" section listing all `taskHistory` entries for that task
- Each entry shows: action description (e.g., `"Status changed from Todo → Doing"`), actor name, and relative timestamp (e.g., `"2 hours ago"`)
- History is populated by `taskStore.updateTaskStatus()` and by field changes in the detail panel
- History entries are written to the IndexedDB `taskHistory` store
- The history list is sorted newest-first
- Empty state: `"No activity yet"` with a subtle icon

**Story points:** 5

---

### DASH-01 — Dashboard Real Data Wiring
**As a** user,
**I want** the dashboard to show accurate metrics from my actual task data,
**so that** the numbers I see are meaningful and not demo placeholders.

**Acceptance criteria:**
- `MetricCard` values are computed from live store getters:
  - Active tasks → `taskStore.activeTasks.length`
  - Overdue tasks → `taskStore.overdueTasks.length`
  - Completed today → `taskStore.completedToday.length`
  - Team members → `taskStore.teamMembers.length`
- "My Tasks" section shows the 5 tasks assigned to `authStore.currentUser.name`, sorted by due date
- "Upcoming Deadlines" shows tasks due within the next 7 days, sorted by due date ascending
- "Project Progress" shows each project with a real completion percentage (done tasks / total tasks per project)
- "Recent Activity" reads from `taskStore.getTaskHistory()` — last 10 entries
- All metrics update reactively when tasks are added, edited, or deleted

**Story points:** 8

---

### DASH-02 — Overdue Task Notifications
**As a** user,
**I want** to be notified of overdue tasks in the top bar,
**so that** nothing slips through the cracks.

**Acceptance criteria:**
- `TopBar.vue` notification bell shows a red badge with the count of `taskStore.overdueTasks`
- Clicking the bell opens a dropdown listing up to 5 overdue task titles with their due dates
- Each item in the dropdown links to the task detail panel
- Badge disappears when there are 0 overdue tasks
- Notification count updates reactively as tasks are completed or deadlines change

**Story points:** 3

---

## Technical Tasks

| ID | Task | Points |
|----|------|--------|
| T-14 | Create `src/composables/useTaskFilter.ts` — encapsulates filter/sort/search logic | 5 |
| T-15 | Create `src/composables/useTaskDetail.ts` — manages detail panel open/close state | 2 |
| T-16 | Add URL query param sync for filters using Vue Router `useRoute` + `useRouter` | 3 |
| T-17 | Write Vitest tests for `useTaskFilter` composable | 3 |
| T-18 | Write Cypress E2E test: create task → verify it appears in backlog | 3 |

**Technical task total:** 16 pts

---

## Capacity & Allocation

| Area | Points |
|------|--------|
| Task CRUD (TASK-01 – TASK-03) | 26 |
| Search, filter, sort (TASK-04 – TASK-05) | 13 |
| Bulk operations (TASK-06) | 8 |
| Tags & history (TASK-07 – TASK-08) | 10 |
| Dashboard (DASH-01 – DASH-02) | 11 |
| Technical tasks | 16 |
| **Buffer** | 0 |
| **Total** | **84 pts** *(trim T-18 if over capacity)* |

---

## Dependencies

| Dependency | From |
|-----------|------|
| IndexedDB `tasks` store with put/remove | Sprint 1 — DB-01 |
| `taskStore` actions write to IndexedDB | Sprint 1 — DB-01 |
| Auth session and `authStore.currentUser` | Sprint 1 — AUTH-01, AUTH-02 |

## Risks

| Risk | Mitigation |
|------|-----------|
| Task detail panel scope expands | Lock to listed fields; defer comments to v1.1 |
| URL filter sync adds complexity | Feature-flag; fall back to component-local state |
| Bulk delete with 100+ tasks is slow | Batch IndexedDB deletes in a transaction |

## Definition of Done

- Full task lifecycle (create → edit → status change → delete) works end-to-end with IndexedDB persistence
- Dashboard metrics are real and reactive
- Search and multi-criteria filtering work in the Backlog
- All new composables have unit tests
- Cypress E2E test for task creation passes in CI

## Key Deliverables

1. Task detail panel (slide-in) with inline editing and activity history
2. Advanced filter/sort bar with URL query param sync
3. Bulk operations bar in Backlog
4. Dashboard wired to live `taskStore` getters
5. Overdue task notification badge in TopBar
6. `useTaskFilter` composable with tests
