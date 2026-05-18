# Sprint 3 — Kanban Board

**Dates:** June 30 – July 11, 2026
**Duration:** 2 weeks
**Phase:** 3 — Features
**Points budget:** 80 pts
**Depends on:** Sprint 2 (task CRUD, IndexedDB tasks store)

---

## Sprint Goal

The Kanban board is the primary work surface for the application. By end of sprint, drag-and-drop task management is fully functional across both board and swimlane views, all interactions persist to IndexedDB, WIP limits are enforced, and the board is usable with a keyboard alone.

---

## Context

`KanbanBoard.vue` and `KanbanColumn.vue` exist with a working UI. Drag-and-drop is partially implemented but does not yet persist state changes to IndexedDB (tasks are still moved in-memory only). `SwimlaneBoardView.vue` renders a swimlane layout but does not support drag-and-drop. Custom column creation UI exists. This sprint makes the board production-ready.

---

## User Stories

### KAN-01 — Drag-and-Drop Card Movement (Board View)
**As a** user,
**I want** to drag task cards between columns on the kanban board,
**so that** I can update task status visually without opening a form.

**Acceptance criteria:**
- Dragging a card from one column to another calls `taskStore.updateTaskStatus(taskId, newStatus)`, persisting to IndexedDB
- During drag, the card being dragged has reduced opacity (0.5) and a drop zone is highlighted on hover
- A ghost/placeholder element shows the insertion position as the card is dragged
- Dropping outside any column returns the card to its original position
- A history entry is logged on each status change: `"Moved from [Column A] to [Column B]"`
- Works on touch devices (mobile drag support via pointer events or a touch-drag library)
- Drag-and-drop uses the HTML5 Drag and Drop API or `@vueuse/core`'s `useDraggable`; no heavy DnD library required

**Story points:** 13

---

### KAN-02 — Drag-and-Drop in Swimlane View
**As a** user,
**I want** to drag task cards between status columns within a team member's swimlane,
**so that** I can manage per-person workloads on the swimlane without switching views.

**Acceptance criteria:**
- `SwimlaneBoardView.vue` supports the same drag-and-drop as the board view
- Dropping a card into a different team member's row updates both the `status` and the `assignees` field on the task
- A confirmation toast appears: `"Task reassigned to [Name] and moved to [Status]"`
- Swimlane rows are sorted alphabetically by team member name by default
- Swimlane rows collapse/expand per member with a toggle chevron

**Story points:** 8

---

### KAN-03 — WIP Limits
**As a** manager,
**I want** to set a maximum number of tasks (WIP limit) per column,
**so that** the team does not overload any single stage of the workflow.

**Acceptance criteria:**
- Column header shows `[current] / [limit]` task count when a WIP limit is set (e.g., `3 / 5`)
- When dragging a card into a full column, a warning toast appears: `"Doing is at WIP limit (5 tasks)"` and the card is still accepted (soft limit)
- Column header turns amber when the column is at the limit and red if over the limit
- WIP limit can be set/cleared by clicking an edit icon on the column header (admin/manager only)
- WIP limit is stored on the `category` record in IndexedDB
- When no limit is set, the count simply shows the number of tasks

**Story points:** 8

---

### KAN-04 — Custom Column Management
**As a** manager,
**I want** to create, rename, reorder, and delete custom kanban columns,
**so that** the board reflects our actual workflow stages.

**Acceptance criteria:**
- "Add column" button at the right edge of the board opens an inline input for the column name
- Column name is required (≥1 character, ≤50 characters); blank submission shows inline error
- Columns can be reordered by dragging the column header (handle icon on the left of the header)
- Column reorder calls `taskStore.reorderCategories(newOrder)` and persists to IndexedDB
- Deleting a column is only allowed when the column is empty; a tooltip explains why if tasks remain
- The default columns (`todo`, `doing`, `done`, `backlog`) cannot be renamed or deleted
- Maximum 10 columns (custom + default); "Add column" button is disabled beyond this

**Story points:** 8

---

### KAN-05 — Card Quick-Edit
**As a** user,
**I want** to edit a card's title and priority directly on the kanban board,
**so that** minor updates do not require opening the full detail panel.

**Acceptance criteria:**
- Double-clicking a card title makes it editable inline (contenteditable or an input overlay)
- Pressing `Enter` or clicking outside saves the change via `taskStore.updateTask()`
- Pressing `Escape` cancels the edit and reverts to the original title
- A right-click context menu (or ⋮ menu icon on hover) on a card shows: `Edit`, `Open detail`, `Change priority`, `Delete`
- Priority quick-change shows a 3-option dropdown (Low / Medium / High) with coloured dots
- All quick-edit changes persist to IndexedDB and show a brief success toast

**Story points:** 8

---

### KAN-06 — Board Statistics Panel
**As a** user,
**I want** to see a summary of task counts by column and cycle time,
**so that** I can assess the board state at a glance.

**Acceptance criteria:**
- The statistics panel (already in `KanbanBoard.vue`) shows real data from `taskStore`:
  - Task count per column
  - Total tasks on the board
  - Average days a task spends in "Doing" (derived from `taskHistory`)
  - Number of tasks completed this week
- The panel can be toggled open/closed with a button in the board toolbar
- Statistics update reactively as tasks move

**Story points:** 5

---

### KAN-07 — Column-Level Filtering
**As a** user,
**I want** to filter all cards on the board by assignee or priority,
**so that** I can view only the cards relevant to a specific person or urgency level.

**Acceptance criteria:**
- A filter toolbar above the board (collapsed by default) shows: Assignee avatar chips and Priority pills
- Selecting a filter dims all non-matching cards (opacity 0.3) without hiding them — non-destructive
- Multiple filters combine with AND logic (shows tasks that match all selected filters)
- Active filters are indicated by a coloured dot on the filter toggle button
- "Clear filters" button resets all filters
- Filter state does not persist across page reloads

**Story points:** 5

---

### KAN-08 — Keyboard Navigation
**As a** user,
**I want** to navigate and move cards on the kanban board using keyboard shortcuts,
**so that** power users can operate the board without a mouse.

**Acceptance criteria:**
- `Tab` / `Shift+Tab` moves focus between cards within a column; `↑` / `↓` moves within the column
- `→` / `←` moves focus to the same-row card in the next/previous column
- `Space` selects a focused card for keyboard-based moving
- While a card is selected, `→` / `←` moves it to the next/previous column and persists the change
- `Enter` opens the task detail panel for the focused card
- `Escape` deselects the card
- Keyboard shortcuts are documented in a tooltip on a `?` button in the board toolbar

**Story points:** 5

---

### KAN-09 — Change History Log
**As a** manager,
**I want** to see a log of all recent card movements on the board,
**so that** I can review what changed during the day.

**Acceptance criteria:**
- The "Change History" panel in `KanbanBoard.vue` reads from `taskStore.getTaskHistory()`, showing the 20 most recent entries
- Each entry shows: task title, change description, actor name, and relative timestamp
- Clicking an entry navigates to the task detail panel for that task
- History panel is togglable independently of the statistics panel
- Empty state: `"No changes yet today"`

**Story points:** 3

---

## Technical Tasks

| ID | Task | Points |
|----|------|--------|
| T-19 | Research and select drag-and-drop strategy (HTML5 DnD API vs. `@vueuse/core`); document decision | 2 |
| T-20 | Create `src/composables/useDragDrop.ts` — encapsulates drag state and drop handlers | 5 |
| T-21 | Add `wip_limit` field to `Category` type and IndexedDB `categories` store | 1 |
| T-22 | Add `order` field to ensure column ordering persists correctly in IndexedDB | 1 |
| T-23 | Write Vitest tests for `useDragDrop` composable | 3 |
| T-24 | Write Cypress E2E test: drag card from "Todo" to "Doing", assert status change in store | 5 |

**Technical task total:** 17 pts

---

## Capacity & Allocation

| Area | Points |
|------|--------|
| Drag-and-drop (KAN-01, KAN-02) | 21 |
| Column management (KAN-03, KAN-04) | 16 |
| Card interactions (KAN-05, KAN-07, KAN-08) | 18 |
| Statistics & history (KAN-06, KAN-09) | 8 |
| Technical tasks | 17 |
| **Buffer** | 0 |
| **Total** | **80 pts** |

---

## Dependencies

| Dependency | From |
|-----------|------|
| `taskStore.updateTaskStatus()` persisting to IndexedDB | Sprint 1 — DB-01 |
| Task detail panel (opened from board card) | Sprint 2 — TASK-02 |
| `taskStore.reorderCategories()` | Sprint 1 — DB-03 |

## Risks

| Risk | Mitigation |
|------|-----------|
| Touch drag-and-drop is complex on mobile | Defer touch support to Sprint 9 if needed |
| Column reorder DnD conflicts with card DnD | Use different drag handles (column header handle vs. card body) |
| Cypress E2E for drag-and-drop is brittle | Use `cypress-drag-drop` plugin; add retry logic |

## Definition of Done

- Cards can be dragged between columns in both board and swimlane views, persisting to IndexedDB
- WIP limits are enforced with visual warnings
- Custom columns can be created, renamed, reordered, and deleted
- Keyboard navigation works fully on the board
- `useDragDrop` composable is unit-tested
- Cypress drag-and-drop E2E test passes in CI

## Key Deliverables

1. Fully functional drag-and-drop in board and swimlane views
2. WIP limit enforcement per column
3. Custom column CRUD with persistence
4. Card quick-edit (inline title + context menu)
5. Column-level assignee/priority filter
6. Keyboard navigation for accessibility
7. `useDragDrop` composable
