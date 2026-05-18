# Sprint 5 — Time Tracking

**Dates:** July 28 – August 8, 2026
**Duration:** 2 weeks
**Phase:** 3 — Features
**Points budget:** 80 pts
**Depends on:** Sprint 1 (IndexedDB, types), Sprint 2 (task list for linking entries)

---

## Sprint Goal

Time tracking transitions from a UI prototype to a fully functional, persisted feature. Users can start a timer linked to any task, pause/resume/stop it, add manual entries, view daily and weekly breakdowns, and export their time logs. All data survives browser restarts.

---

## Context

`TimeTrackingView.vue` has a complete UI: a timer widget with start/pause/resume/stop controls, a statistics row (today's hours, week hours, total entries, average/day), a "Today's Entries" log, and a "Weekly Summary" bar chart. All state is currently in-memory and resets on page refresh. The IndexedDB `timeEntries` store was defined in Sprint 0 but is empty. This sprint connects the UI to real persistence.

---

## User Stories

### TIME-01 — Task-Linked Timer
**As a** user,
**I want** to start a timer against a specific task,
**so that** my time entries are automatically associated with the work I am doing.

**Acceptance criteria:**
- The timer widget in `TimeTrackingView.vue` includes a task selector (searchable dropdown of all non-done tasks)
- Starting the timer without selecting a task is allowed (entry is labelled `"General"`)
- While a timer is running, the active task name is displayed in the timer widget header
- Only one timer can be running at a time; starting a new timer stops the previous one (with a confirmation toast)
- The running timer persists across page navigations and browser refreshes (active timer state saved to IndexedDB on every tick, or on pause/stop)
- If the browser closes with a timer running, on next load a banner asks: `"You had an active timer for [Task]. Resume or discard?"`

**Story points:** 13

---

### TIME-02 — Timer Controls (Pause / Resume / Stop)
**As a** user,
**I want** precise timer controls (pause, resume, stop),
**so that** I can accurately capture time spent even across interruptions.

**Acceptance criteria:**
- **Start**: creates a new `TimeEntry` record in IndexedDB with `startedAt: now`, `taskId`, `status: "running"`
- **Pause**: records `pausedAt: now` on the active entry; elapsed time is frozen; button switches to Resume
- **Resume**: adds a new sub-interval to the entry; elapsed continues accumulating; button switches to Pause
- **Stop**: finalises the entry with `stoppedAt: now`, total `duration` (seconds), sets `status: "completed"`
- Timer display shows `HH:MM:SS` format, updating every second
- Minimum recordable duration is 1 minute; stopping before 1 minute asks: `"This entry is under 1 minute. Discard it?"`

**Story points:** 8

---

### TIME-03 — Manual Time Entry
**As a** user,
**I want** to add time entries manually for work I did without running the timer,
**so that** my total hours remain accurate even when I forget to track.

**Acceptance criteria:**
- A `"+ Add entry"` button opens a modal with fields: task (optional), date, start time, end time (or duration), notes
- End time must be after start time; invalid range shows inline error
- Duration is auto-calculated from start/end time and shown in the form
- Saved entries appear in today's (or the selected date's) entry log
- Manual entries are distinguishable from timer entries (a pencil icon vs. a clock icon)
- Manual entries can be edited or deleted; edit opens the same modal pre-filled

**Story points:** 8

---

### TIME-04 — Today's Entries Log
**As a** user,
**I want** to see all my time entries for today listed with task names and durations,
**so that** I can review how I spent my day.

**Acceptance criteria:**
- `TimeEntry` components in "Today's Entries" are populated from IndexedDB filtered to today's date
- Each entry shows: task name (or "General"), project name (if linked), start–end time, duration
- A running entry shows an animated clock icon and a real-time updating duration
- The log is sorted by start time ascending
- Each entry has a Delete button; deletion requires confirmation modal
- At the bottom of the log, a total for the day is shown: `"Total today: 4h 32m"`
- A date picker above the log lets users browse previous days' entries

**Story points:** 8

---

### TIME-05 — Weekly Summary Chart (Real Data)
**As a** user,
**I want** to see a bar chart of hours logged each day this week,
**so that** I can spot whether I am on track with my expected weekly hours.

**Acceptance criteria:**
- `WeeklyBar` components are rendered from IndexedDB time entries grouped by day of the week (Mon–Sun)
- Each bar shows total hours for that day (e.g., `"6.5h"`)
- The current day's bar is highlighted with the theme's primary colour
- A horizontal reference line shows the target hours/day (default: 8h; configurable per user)
- Total week hours shown below the chart: `"This week: 28h / 40h target"`
- Chart updates immediately when a new entry is stopped or manually added

**Story points:** 5

---

### TIME-06 — Statistics Cards (Real Data)
**As a** user,
**I want** the four stat cards (Today, This Week, Total Entries, Avg/Day) to show real numbers,
**so that** I have accurate high-level visibility of my time tracking activity.

**Acceptance criteria:**
- `StatCard` values are computed from IndexedDB time entries:
  - Today: sum of `duration` for entries with today's date (formatted as `Xh Ym`)
  - This week: sum of `duration` for entries in the current ISO week
  - Total entries: count of all completed entries
  - Avg/day: total hours ÷ number of distinct days with at least one entry (last 30 days)
- Cards update reactively when entries are added, stopped, or deleted

**Story points:** 3

---

### TIME-07 — Time Report: Per-Task & Per-Project Breakdown
**As a** user,
**I want** to see how my tracked time is distributed across tasks and projects,
**so that** I can understand where my time goes at a higher level.

**Acceptance criteria:**
- A "Reports" tab in `TimeTrackingView.vue` shows two sections:
  - **By Task**: list of tasks with total time logged (sorted by hours descending)
  - **By Project**: list of projects with total time logged + percentage of total
- A date range selector (This week / This month / Last month / Custom range) filters the data
- Each task/project row shows a mini horizontal bar proportional to its share of total time
- Rows are expandable to show the individual time entry rows beneath them

**Story points:** 8

---

### TIME-08 — CSV Export of Time Entries
**As a** manager,
**I want** to export time entries to CSV for payroll or billing purposes,
**so that** I can share accurate time records with stakeholders.

**Acceptance criteria:**
- An `Export CSV` button in the time tracking toolbar (manager/admin only)
- Exported columns: Entry ID, Task Title, Project, Date, Start Time, End Time, Duration (minutes), Notes, Type (timer/manual), User Name
- The export respects the currently selected date range filter
- File name: `task-master-time-[from]-[to].csv`
- Export uses client-side `Blob` via the `src/utils/csv.ts` utility (Sprint 4 — T-28)

**Story points:** 3

---

### TIME-09 — Browser Notification Reminders
**As a** user,
**I want** the app to send a browser notification if I have not logged any time for more than 2 hours during working hours,
**so that** I am reminded to start tracking when I forget.

**Acceptance criteria:**
- On first use, the app requests `Notification` permission with a clear prompt explaining why
- If permission is granted and no timer is running and no entries have been added in the last 2 hours (between 09:00–18:00 on weekdays), a browser notification fires: `"Haven't tracked time in 2 hours. Start tracking?"`
- Clicking the notification focuses the app and opens `TimeTrackingView`
- Reminder interval is configurable in user settings (off / 1h / 2h / 4h); default: 2h
- Reminder setting is stored in the IndexedDB `settings` store per user

**Story points:** 5

---

## Technical Tasks

| ID | Task | Points |
|----|------|--------|
| T-31 | Define `TimeEntry` schema: `id`, `taskId`, `userId`, `startedAt`, `stoppedAt`, `pausedAt`, `duration`, `notes`, `type`, `status` | 2 |
| T-32 | Add `timeEntries` store operations to IndexedDB wrapper: `getEntriesByDate(date)`, `getEntriesByDateRange(from, to)` | 3 |
| T-33 | Create `src/stores/timeStore.ts` with actions: `startTimer`, `pause`, `resume`, `stop`, `addManualEntry`, `deleteEntry` | 8 |
| T-34 | Create `src/composables/useTimer.ts` — manages the `setInterval` tick, formatting `HH:MM:SS`, computing elapsed | 5 |
| T-35 | Add `targetHoursPerDay` to user settings in IndexedDB | 1 |
| T-36 | Write Vitest tests for `timeStore` actions and `useTimer` composable | 5 |

**Technical task total:** 24 pts

---

## Capacity & Allocation

| Area | Points |
|------|--------|
| Timer core (TIME-01, TIME-02) | 21 |
| Manual entries & log (TIME-03, TIME-04) | 16 |
| Charts & stats real data (TIME-05, TIME-06) | 8 |
| Reports & export (TIME-07, TIME-08) | 11 |
| Notifications (TIME-09) | 5 |
| Technical tasks | 24 |
| **Buffer** | −5 *(defer TIME-09 if tight)* |
| **Total** | **80 pts** |

---

## Dependencies

| Dependency | From |
|-----------|------|
| IndexedDB `timeEntries` store (defined in Sprint 0) | Sprint 0 — INF-05 |
| `Task` list for timer task selector | Sprint 2 — TASK-01 |
| `src/utils/csv.ts` for export | Sprint 4 — T-28 |

## Risks

| Risk | Mitigation |
|------|-----------|
| Timer tick interval drifts over long sessions | Use `Date.now()` delta instead of accumulating seconds |
| IndexedDB write on every tick is expensive | Write only on pause/stop; save `startedAt` only on start |
| Notification API not available in all browsers | Gracefully degrade; only show reminder preference if API available |

## Definition of Done

- Starting, pausing, resuming, and stopping a timer persists correctly to IndexedDB
- Closing the browser and reopening recovers the active timer state
- Manual entries can be added, edited, and deleted
- Weekly chart and stat cards show real IndexedDB data
- CSV export generates a valid file
- `timeStore` and `useTimer` are unit-tested

## Key Deliverables

1. Fully persisted timer (task-linked) with pause/resume/stop
2. Manual time entry modal with full validation
3. Today's Entries log with date picker for history browsing
4. Weekly summary chart from real IndexedDB data
5. Time Reports tab with per-task and per-project breakdowns
6. CSV export of time entries
7. `timeStore.ts` and `useTimer.ts` composable with tests
