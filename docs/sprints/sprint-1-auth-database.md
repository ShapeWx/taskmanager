# Sprint 1 — Authentication & Database Layer

**Dates:** June 2 – June 13, 2026
**Duration:** 2 weeks
**Phase:** 2 — Core
**Points budget:** 80 pts
**Depends on:** Sprint 0 (IndexedDB wrapper, CI pipeline)

---

## Sprint Goal

Replace all mock authentication and localStorage state with a real, persisted system. Users can register, log in, and stay logged in across browser refreshes. All task and user data is read from and written to IndexedDB. The app is data-layer complete even before the remaining features are built.

---

## Context

Currently, `authStore.js` simulates login by storing a fake token in localStorage alongside hardcoded demo users. `taskStore.js` reads an in-memory seed array and persists changes to localStorage. `src/db/index-db.ts` exists as a stub with no schema or operations. This sprint replaces the entire data layer and wires auth to IndexedDB-backed user records.

---

## User Stories

### AUTH-01 — User Registration
**As a** new user,
**I want** to create an account with my name, email, and password,
**so that** I can access the application with my own credentials.

**Acceptance criteria:**
- `RegisterView.vue` submits the form to `authStore.register()`
- Password and confirm-password fields must match; mismatch shows inline error
- Email must be unique; duplicate registration shows `"An account with this email already exists"` error
- Password must be ≥8 characters; rule is shown beneath the field
- On success, user record is written to IndexedDB `users` store with a hashed password (using `crypto.subtle` SHA-256 minimum, or `bcryptjs`)
- User is automatically logged in and redirected to `/`
- All form validation errors are shown inline (not alert dialogs)

**Story points:** 8

---

### AUTH-02 — User Login
**As a** returning user,
**I want** to log in with my email and password,
**so that** I can access my tasks and data.

**Acceptance criteria:**
- `LoginView.vue` submits credentials to `authStore.login()`
- Email/password are validated against the IndexedDB `users` store
- Invalid credentials show `"Incorrect email or password"` without specifying which field is wrong
- On success, a session token (UUID v4) is stored in `sessionStorage` (not `localStorage`, for security)
- `authStore.isAuthenticated` becomes `true`; user is redirected to `/`
- The demo credentials panel is replaced with a single "Use demo account" button that auto-fills the form
- Login survives a page refresh within the same browser tab (session restored from `sessionStorage`)

**Story points:** 8

---

### AUTH-03 — Persistent Session & Auth Guard
**As a** logged-in user,
**I want** my session to persist across page refreshes within the same browser tab,
**so that** I am not forced to log in repeatedly during a working session.

**Acceptance criteria:**
- `authStore.initializeAuth()` is called in `main.js` before the Vue app mounts
- It reads the session token from `sessionStorage` and re-hydrates `authStore.user` from IndexedDB
- If the token is missing or the user record cannot be found, the user is redirected to `/auth/login`
- Router navigation guard (`router/index.js`) blocks protected routes when `!authStore.isAuthenticated`
- Viewer-only routes (`/authorization`) redirect non-admin users to `/` with a toast warning
- Guard runs synchronously after `initializeAuth()` resolves

**Story points:** 5

---

### AUTH-04 — Logout
**As a** logged-in user,
**I want** to log out explicitly,
**so that** my session is cleared and the next person cannot access my account.

**Acceptance criteria:**
- Clicking "Sign out" in `TopBar.vue` profile menu calls `authStore.logout()`
- `logout()` clears `sessionStorage`, resets store state, and navigates to `/auth/login`
- After logout, pressing the browser back button does not return to a protected page
- A `ConfirmModal` appears before logout ("Are you sure you want to sign out?")

**Story points:** 3

---

### AUTH-05 — Forgot Password Flow
**As a** user who has forgotten their password,
**I want** to reset it using a two-step flow,
**so that** I can regain access to my account without admin help.

**Acceptance criteria:**
- Step 1: User enters email address; the app checks IndexedDB for the email
  - If found: a mock "reset code" (6-digit number) is shown in a success banner (simulating an email in development)
  - If not found: `"No account found with this email"` inline error
- Step 2: User enters the code + new password + confirm password
  - On correct code: password is updated in IndexedDB, user is redirected to login with a success toast
  - On wrong code: `"Invalid reset code"` error; up to 3 attempts before the code expires
- In production, step 1 would integrate with an email service (Resend / SendGrid) — this is scaffolded but feature-flagged off via `VITE_EMAIL_ENABLED=false`
- The entire flow lives in `ForgotPasswordView.vue`, which already has the two-step UI

**Story points:** 8

---

### DB-01 — Migrate Task Store to IndexedDB
**As a** developer,
**I want** `taskStore.js` to read and write through the IndexedDB wrapper,
**so that** task data persists reliably across browser restarts, not just tab refreshes.

**Acceptance criteria:**
- `taskStore.js` imports from `src/db/index-db.ts` instead of using `localStorage`
- On store initialisation (`initializeTasks()` action), tasks are loaded from IndexedDB `tasks` store
- `addTask`, `updateTask`, `deleteTask` all call `put` or `remove` on IndexedDB and `await` the result
- Demo seed data is written to IndexedDB on first run only (checked via a `seeded` flag in IndexedDB metadata)
- `taskHistory` is persisted to its own IndexedDB store (`taskHistory`)
- Removing `localStorage` calls from the store does not break any existing UI

**Story points:** 13

---

### DB-02 — Migrate User Store to IndexedDB
**As a** developer,
**I want** user records stored in IndexedDB rather than hardcoded in `authStore.js`,
**so that** users created via registration persist and the codebase has a real user database.

**Acceptance criteria:**
- Demo users (`admin@taskmaster.com`, `manager@taskmaster.com`, `user@taskmaster.com`) are seeded into IndexedDB `users` store on first run
- `authStore.users` array is removed; all user lookups go through `getAll('users')` or `getById('users', id)`
- `authStore.updateUserRole()` calls `put('users', updatedUser)` and the change persists after refresh
- `AuthorizationView.vue` loads users from IndexedDB and renders them correctly
- User passwords in IndexedDB are hashed (not plaintext)

**Story points:** 8

---

### DB-03 — Category & Project Persistence
**As a** developer,
**I want** kanban categories and projects persisted in IndexedDB,
**so that** custom columns and project data survive page refreshes.

**Acceptance criteria:**
- `taskStore.categories` are seeded into and read from the IndexedDB `categories` store
- `taskStore.projects` are seeded into and read from the IndexedDB `projects` store
- `addCategory`, `deleteCategory`, `reorderCategories` all write through to IndexedDB
- The order field on categories is preserved correctly after reordering

**Story points:** 5

---

### AUTH-06 — Profile Edit
**As a** logged-in user,
**I want** to update my display name and email from my profile page,
**so that** my account details stay current.

**Acceptance criteria:**
- `ProfileView.vue` edit form calls a new `authStore.updateProfile({ name, email })` action
- Changes are written to IndexedDB `users` store and reflected in `authStore.user` immediately
- If the new email is already taken by another user, an inline error is shown
- Change password form calls `authStore.changePassword({ currentPassword, newPassword })`
- Wrong current password shows `"Current password is incorrect"` inline error
- Success shows a toast notification via `useToast`

**Story points:** 5

---

## Technical Tasks

| ID | Task | Points |
|----|------|--------|
| T-07 | Install `bcryptjs` (or use `crypto.subtle`) for password hashing | 2 |
| T-08 | Install `uuid` for generating session tokens and entity IDs | 1 |
| T-09 | Create TypeScript types: `User`, `Task`, `Category`, `Project`, `TimeEntry` in `src/types/index.ts` | 3 |
| T-10 | Remove `counter.js` store (unused demo store) | 1 |
| T-11 | Add `src/utils/hash.ts` with `hashPassword(password)` and `verifyPassword(password, hash)` helpers | 2 |
| T-12 | Write Vitest unit tests for `authStore` login, register, logout actions | 5 |
| T-13 | Write Vitest unit tests for `taskStore` CRUD actions against fake IndexedDB | 5 |

**Technical task total:** 19 pts

---

## Capacity & Allocation

| Area | Points |
|------|--------|
| Auth flows (AUTH-01 – AUTH-06) | 37 |
| Database migration (DB-01 – DB-03) | 26 |
| Technical tasks | 19 |
| **Buffer** | 0 |
| **Total** | **82 pts** *(trim T-12 or T-13 to fit if needed)* |

---

## Dependencies

| Dependency | From |
|-----------|------|
| IndexedDB wrapper (`openDB`, `getAll`, `put`, etc.) | Sprint 0 — INF-05 |
| Vitest baseline configured | Sprint 0 — INF-06 |

## Risks

| Risk | Mitigation |
|------|-----------|
| `crypto.subtle` unavailable in jsdom test environment | Mock `hashPassword` in tests; use real impl in browser |
| IndexedDB migration logic complex | Keep schema at version 1; no migrations needed yet |
| Session restoration race condition on app load | Use `await initializeAuth()` before `app.mount()` |

## Definition of Done

- Registration, login, logout, forgot-password, and profile-edit all work end-to-end
- All task, category, and project data persists in IndexedDB and survives a hard browser refresh
- No `localStorage` calls remain in `authStore.js` or `taskStore.js`
- Unit tests for stores pass in CI
- Auth guards block unauthenticated access to all protected routes

## Key Deliverables

1. Real user registration and login backed by IndexedDB
2. Session persistence within browser tab via `sessionStorage`
3. Password hashing (`bcryptjs` or `crypto.subtle`)
4. Full task + category + project persistence in IndexedDB
5. TypeScript types file (`src/types/index.ts`)
6. Store unit tests
