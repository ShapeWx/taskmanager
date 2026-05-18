# Sprint 6 — Team Management & RBAC

**Dates:** August 11 – August 22, 2026
**Duration:** 2 weeks
**Phase:** 3 — Features
**Points budget:** 80 pts
**Depends on:** Sprint 1 (auth, user IndexedDB), Sprint 2 (task assignment)

---

## Sprint Goal

Role-based access control is enforced throughout the entire application — not just in the UI but at the store level. Team management gives admins and managers the tools to invite members, manage roles, and monitor workloads. Every permission boundary is tested and provably correct.

---

## Context

`authStore.js` defines four roles (`admin`, `manager`, `user`, `viewer`) with a `roles` permissions map and getter functions (`hasPermission`, `hasRole`, `canEditTask`, `canDeleteTask`). However, these checks are only partially applied in the UI — most actions are accessible regardless of role. `TeamManagement.vue` and `AuthorizationView.vue` exist with complete UI shells. This sprint closes every permission gap and completes the team management feature.

---

## Roles & Permissions Reference

| Permission | Admin | Manager | User | Viewer |
|-----------|-------|---------|------|--------|
| View all tasks | ✓ | ✓ | ✓ | ✓ |
| Create task | ✓ | ✓ | ✓ | ✗ |
| Edit own task | ✓ | ✓ | ✓ | ✗ |
| Edit any task | ✓ | ✓ | ✗ | ✗ |
| Delete task | ✓ | ✓ | ✗ | ✗ |
| Set effort/impact | ✓ | ✓ | ✗ | ✗ |
| Manage columns | ✓ | ✓ | ✗ | ✗ |
| Set WIP limits | ✓ | ✓ | ✗ | ✗ |
| Promote backlog tasks | ✓ | ✓ | ✗ | ✗ |
| View team workload | ✓ | ✓ | ✓ | ✓ |
| Manage team roles | ✓ | ✗ | ✗ | ✗ |
| Export CSV | ✓ | ✓ | ✗ | ✗ |
| View analytics | ✓ | ✓ | ✓ | ✓ |

---

## User Stories

### TEAM-01 — RBAC Enforcement Across All Views
**As a** product owner,
**I want** every UI action gated by the user's actual role,
**so that** viewers cannot accidentally modify data and users cannot delete tasks they do not own.

**Acceptance criteria:**
- Every button/control that requires a permission calls `authStore.hasPermission('permission_name')` before rendering
- Controls that the current user cannot use are either hidden (if awareness of the feature is irrelevant) or visually disabled with a tooltip explaining why (e.g., `"Requires Manager role"`)
- Task edit actions in `TaskItem`, `BacklogItem`, `KanbanColumn`, and the task detail panel all check `authStore.canEditTask(task)` and `authStore.canDeleteTask(task)`
- `taskStore` actions also guard at the store level: calling `deleteTask()` as a viewer throws and shows an error toast
- The `AuthorizationView` route is accessible only to `admin` role; navigating there as any other role redirects to `/` with a toast: `"Admin access required"`
- All permission checks are encapsulated in `authStore` — no inline role string comparisons outside the store

**Story points:** 13

---

### TEAM-02 — Team Member Invitation (Simulated)
**As an** admin,
**I want** to invite a new team member by email,
**so that** they can be added to the workspace and assigned tasks.

**Acceptance criteria:**
- `TeamManagement.vue` has an `"Invite member"` button (admin only)
- Clicking it opens a modal: Email (required, validated format), Role (dropdown: manager / user / viewer), Display Name (required)
- On submit, a new user record is created in IndexedDB `users` store with a generated UUID, the specified role, `status: "pending"`, and a temporary password `"Welcome1!"` displayed in the success modal (simulating an invitation email)
- The new member appears immediately in the team list with a `"Pending"` badge
- A maximum of 20 team members is enforced (hobby/free tier limit); attempting to add beyond shows an error
- In production, this would send a real invitation email (feature-flagged off: `VITE_EMAIL_ENABLED=false`)

**Story points:** 8

---

### TEAM-03 — Team Member Profile & Status
**As a** team member,
**I want** to see each team member's profile, role, current task count, and availability status,
**so that** I know who to contact and whether they have capacity.

**Acceptance criteria:**
- `TeamMemberCard.vue` shows: avatar (initials-based), name, role badge, availability status (active/in-meeting/away/offline), active task count (live from `taskStore`)
- Clicking a member card opens a member detail panel: full profile, all tasks assigned to them (grouped by status), total time logged this week (from `timeStore`)
- A user can change their own availability status from the profile menu in `TopBar`
- Availability status is persisted to the IndexedDB `users` store
- Task count on each card updates reactively as tasks are assigned/completed

**Story points:** 8

---

### TEAM-04 — Workload Distribution Chart (Real Data)
**As a** manager,
**I want** to see a bar chart of active task counts per team member,
**so that** I can identify who is overloaded and who has capacity for more work.

**Acceptance criteria:**
- `WorkloadBar` components in `TeamManagement.vue` are populated from `taskStore.getTasksByAssignee()` per member
- Bars show total active (non-done, non-backlog) tasks per person
- Bars are coloured by load level: green (<5), amber (5–8), red (>8)
- Hovering a bar shows a tooltip listing the task titles
- A horizontal line marks the recommended max tasks per person (configurable, default: 8)
- Chart updates reactively

**Story points:** 5

---

### TEAM-05 — Role Assignment (Admin)
**As an** admin,
**I want** to change any team member's role,
**so that** permissions evolve as the team's structure changes.

**Acceptance criteria:**
- `AuthorizationView.vue` table lists all users with their current role
- Admin can change any non-admin user's role via a dropdown in the table
- Changing a role calls `authStore.updateUserRole(userId, newRole)` and persists to IndexedDB
- Admin cannot change their own role (row is read-only)
- There must always be at least one `admin` user; demoting the last admin is blocked with an error toast
- Role change is reflected immediately in the user's session if they are currently logged in (store reactivity)
- An audit entry is written to the IndexedDB `auditLog` store: `{ actor, action: "role_changed", target, from, to, at }`

**Story points:** 8

---

### TEAM-06 — Remove Team Member (Admin)
**As an** admin,
**I want** to remove a team member from the workspace,
**so that** inactive or departed users no longer have access.

**Acceptance criteria:**
- Admin can click a `"Remove"` button on a user row in `AuthorizationView`
- A `ConfirmModal` explains: `"[Name] will be removed. Their tasks will remain but become unassigned."`
- On confirm: the user record is soft-deleted (set `status: "removed"`) in IndexedDB; not hard-deleted
- The removed user is immediately logged out if they are in an active session (simulated: their `sessionStorage` token is invalidated)
- Tasks previously assigned to them are updated to have the assignee removed (not deleted)
- Removed users appear in a collapsed "Former members" section at the bottom of `AuthorizationView`

**Story points:** 5

---

### TEAM-07 — Activity Audit Log
**As an** admin,
**I want** to view a log of significant actions taken by any team member,
**so that** I can audit changes to sensitive data.

**Acceptance criteria:**
- A new "Audit Log" tab in `AuthorizationView` lists entries from the IndexedDB `auditLog` store
- Logged events: login, logout, role change, task deletion, user removal, permission change
- Each entry: timestamp, actor name + role, action description, affected resource
- Log is read-only; admin cannot edit or delete entries
- Log is filterable by actor and event type
- Log is paginated (20 entries per page); oldest entries are not deleted

**Story points:** 8

---

### TEAM-08 — Permissions Table (Read-only)
**As a** team member,
**I want** to see what actions my role permits me to take,
**so that** I understand my access level without having to trial-and-error.

**Acceptance criteria:**
- `AuthorizationView.vue` permissions table is populated from `authStore.roles` (already defined)
- All four roles are shown as columns; all permissions as rows
- The current user's column is highlighted
- The table is visible to all authenticated users (not just admin)
- Hovering a cell shows the permission name as a tooltip

**Story points:** 2

---

## Technical Tasks

| ID | Task | Points |
|----|------|--------|
| T-37 | Create `auditLog` object store in IndexedDB; add `logAuditEvent(event)` helper | 3 |
| T-38 | Create `src/composables/usePermission.ts` — `canDo(permission)` and `canEdit(task)` reactively derived from `authStore` | 3 |
| T-39 | Apply `usePermission` guards to all action buttons in `TaskItem`, `BacklogItem`, `KanbanColumn`, task detail panel | 5 |
| T-40 | Write Vitest tests for `authStore` permission getters across all 4 roles | 5 |
| T-41 | Write Cypress E2E: login as `viewer`, assert task edit button is hidden | 3 |

**Technical task total:** 19 pts

---

## Capacity & Allocation

| Area | Points |
|------|--------|
| RBAC enforcement (TEAM-01) | 13 |
| Team management (TEAM-02 – TEAM-04) | 21 |
| Role & user admin (TEAM-05 – TEAM-06) | 13 |
| Audit log & permissions table (TEAM-07 – TEAM-08) | 10 |
| Technical tasks | 19 |
| **Buffer** | 4 |
| **Total** | **80 pts** |

---

## Dependencies

| Dependency | From |
|-----------|------|
| User records in IndexedDB with roles | Sprint 1 — DB-02, AUTH-02 |
| `authStore.hasPermission`, `canEditTask` | Sprint 1 — AUTH-03 |
| Task assignment data | Sprint 2 — TASK-01 |
| Time entries per user | Sprint 5 — TIME-01 |

## Risks

| Risk | Mitigation |
|------|-----------|
| Permission checks missed in some components | Use `usePermission` composable consistently; audit with a grep for direct role comparisons |
| Audit log grows unbounded | Limit to 1,000 entries (oldest auto-deleted beyond this) |
| Removing last admin is possible if checks fail | Double-check in both UI and `authStore.updateUserRole()` store action |

## Definition of Done

- Every permission-gated action is guarded at both UI and store levels
- Role changes persist to IndexedDB and are reflected in real-time
- Audit log records login, logout, role changes, and task deletions
- `usePermission` composable is unit-tested across all four roles
- Cypress E2E test for viewer restriction passes in CI

## Key Deliverables

1. RBAC enforced across all 40+ action buttons in the app
2. Team member invitation flow (simulated with temp password)
3. Member detail panel with task list and time logged
4. Workload distribution chart with real data
5. Role assignment UI in AuthorizationView with audit trail
6. Activity audit log tab
7. `usePermission` composable with full test suite
