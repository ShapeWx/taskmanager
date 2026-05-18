# Sprint 9 — Performance & Polish

**Dates:** September 22 – October 3, 2026
**Duration:** 2 weeks
**Phase:** 4 — Quality
**Points budget:** 80 pts
**Depends on:** Sprint 8 (all bugs resolved, tests green)

---

## Sprint Goal

Task Master feels fast, polished, and production-ready. Lighthouse scores reach ≥90 on Performance, Accessibility, Best Practices, and SEO. Bundle size is optimised. Every view has a proper loading state, error boundary, and empty state. The application is responsive down to 375px viewport width.

---

## Context

Feature sprints prioritised correctness over performance. The Vite bundle has not been audited, lazy loading is not configured, IndexedDB queries run naively, and several views lack loading/error/empty states. This sprint addresses all of that without adding new features.

---

## Performance Targets

| Metric | Current (est.) | Target |
|--------|----------------|--------|
| Lighthouse Performance | ~65 | ≥90 |
| Lighthouse Accessibility | ~75 | ≥95 |
| Lighthouse Best Practices | ~80 | ≥90 |
| Lighthouse SEO | ~60 | ≥90 |
| First Contentful Paint (FCP) | ~2.8s | ≤1.5s |
| Time to Interactive (TTI) | ~4.2s | ≤3.0s |
| Total JS bundle (gzipped) | ~800 KB | ≤300 KB |
| IndexedDB read (1000 tasks) | ~200ms | ≤50ms |

---

## User Stories

### PERF-01 — Code Splitting & Lazy Route Loading
**As a** user on a slow connection,
**I want** each route to load only the JavaScript it needs,
**so that** the initial app load is fast even though the application is large.

**Acceptance criteria:**
- All route components in `router/index.js` use dynamic `import()`: `component: () => import('../views/Dashboard.vue')`
- Each feature module (`kanban`, `analytics`, `team`, etc.) forms its own Vite chunk
- The initial bundle (loaded before auth check) contains only: Vue core, Vue Router, Pinia, `authStore`, `themeStore`, and the Auth layout
- `turbo build` output shows no chunk exceeding 150 KB (gzipped)
- Verified using `rollup-plugin-visualizer` report: `dist/stats.html`

**Story points:** 8

---

### PERF-02 — Component Lazy Loading & `<Suspense>`
**As a** user,
**I want** heavy components (charts, the task detail panel) to load asynchronously,
**so that** the rest of the page is interactive while complex components hydrate.

**Acceptance criteria:**
- `AnalyticsDashboard.vue` heavy chart sections use `defineAsyncComponent` with a `<Suspense>` wrapper
- The task detail panel component is lazy-loaded via `defineAsyncComponent`
- Each `<Suspense>` has a `fallback` slot showing a skeleton loader matching the component's layout
- Loading state is never a blank white area — always a skeleton or spinner

**Story points:** 5

---

### PERF-03 — IndexedDB Query Optimisation
**As a** developer,
**I want** IndexedDB reads to use indexes rather than full-table scans,
**so that** the app remains fast as the task count grows into the thousands.

**Acceptance criteria:**
- IndexedDB `tasks` store has indexes on: `status`, `assignees` (multi-entry), `projectId`, `dueDate`
- `getTasksByStatus(status)` uses the `status` index instead of `getAll()` + filter
- `getTasksByAssignee(name)` uses the `assignees` multi-entry index
- `getEntriesByDate(date)` in `timeStore` uses a `startedAt` date index
- Benchmark: retrieving all "todo" tasks from a 1,000-task database takes ≤50ms (measured via `performance.now()`)
- Indexes are added in an IndexedDB version migration (bump to version 2)

**Story points:** 8

---

### PERF-04 — Vue Component Memoisation
**As a** developer,
**I want** expensive list item components to avoid unnecessary re-renders,
**so that** the kanban board and backlog remain smooth even with 200+ tasks.

**Acceptance criteria:**
- `KanbanColumn.vue`, `BacklogItem.vue`, `TaskItem.vue`, and `TeamMemberCard.vue` are wrapped with `defineComponent` and use `v-memo` or `shallowRef` where appropriate
- Pinia store getters that return arrays use `computed` correctly to avoid re-running on unrelated state changes
- Verified with Vue DevTools performance profiler: no component re-renders more than once per user action in the kanban board
- `taskStore` getters use `storeToRefs()` in components to preserve reactivity without triggering unnecessary updates

**Story points:** 5

---

### PERF-05 — Bundle Size Audit & Tree-Shaking
**As a** developer,
**I want** unused code removed from the production bundle,
**so that** users download only what the app actually uses.

**Acceptance criteria:**
- Install `rollup-plugin-visualizer`; run `turbo build` and review `dist/stats.html`
- Identify any package contributing >50 KB that could be tree-shaken or replaced
- Heroicons: import only used icons (named imports, not the full icon set)
- Headless UI: verify only used components are bundled
- Remove `counter.js` store if not done in Sprint 1
- After optimisation, total gzipped bundle is ≤300 KB
- Results documented in `docs/performance/bundle-audit.md`

**Story points:** 5

---

### PERF-06 — Loading States & Skeleton Screens
**As a** user,
**I want** to see skeleton screens while data is loading,
**so that** I know the app is working and the layout does not jump.

**Acceptance criteria:**
- Every view that loads from IndexedDB shows a skeleton loader during the async read
- Skeletons match the layout of the real content (same width/height proportions)
- Dashboard skeleton: skeleton metric cards, skeleton task list, skeleton activity log
- Backlog skeleton: skeleton filter bar, 5 skeleton task rows
- Kanban skeleton: 4 skeleton columns with 3 skeleton cards each
- Loading state resolves in ≤300ms on a modern machine (IndexedDB is local — fast)
- No "flash of empty content": skeleton is shown before the first render, not after

**Story points:** 5

---

### PERF-07 — Error Boundaries
**As a** user,
**I want** feature-level error boundaries so that a crash in one section does not break the whole app,
**so that** other parts of the app remain usable even if one view errors.

**Acceptance criteria:**
- A `ErrorBoundary.vue` component is created using Vue 3's `onErrorCaptured` lifecycle hook
- Each major view is wrapped in `<ErrorBoundary>` in the router or parent layout
- When an error is caught, the boundary shows: `"Something went wrong in [Feature Name]"` + a `"Try again"` button that resets the component
- Errors are logged to the console (and to Sentry in production, Sprint 10)
- The sidebar, top bar, and navigation are not affected by a feature-level error

**Story points:** 5

---

### PERF-08 — Mobile Responsiveness
**As a** user on a mobile device,
**I want** the application to be fully usable on screens as small as 375px wide,
**so that** I can check and update my tasks on my phone.

**Acceptance criteria:**
- All primary views render correctly at 375px (iPhone SE), 390px (iPhone 14), and 768px (iPad) viewport widths
- `SideBar.vue` collapses to a full-screen slide-over drawer on mobile (triggered by a hamburger button in `TopBar`)
- Kanban board on mobile: horizontal scroll between columns; each column is 85vw wide
- Task detail panel on mobile: full-screen overlay instead of side panel
- All tap targets are ≥44×44px (WCAG)
- No horizontal overflow on any view at 375px (verified with Chrome DevTools device toolbar)
- Mobile breakpoints use Tailwind's `sm:`, `md:`, `lg:` prefixes consistently

**Story points:** 13

---

### PERF-09 — Animation & Micro-Interaction Polish
**As a** user,
**I want** smooth, purposeful animations throughout the app,
**so that** the application feels premium and responsive to my actions.

**Acceptance criteria:**
- Sidebar collapse/expand uses a CSS transition (200ms ease)
- Task cards in kanban columns use `v-move` transitions when reordering
- Toast notifications slide in from the bottom-right and fade out
- Modal/panel open uses `transform: translateX` slide-in (300ms ease-out); close is reverse
- Priority badge colour changes use a 150ms transition
- All transitions respect `prefers-reduced-motion` media query — disabled for users who prefer it
- No janky layout shifts: all animated elements have fixed or `min-height` dimensions

**Story points:** 5

---

### PERF-10 — SEO & Meta Tags
**As a** developer,
**I want** proper `<meta>` tags and a web app manifest,
**so that** the app is shareable, installable, and correctly described to search engines.

**Acceptance criteria:**
- `index.html` contains: `<meta charset>`, `<meta name="viewport">`, `<meta name="description" content="Task Master — team task management">`, `<title>Task Master</title>`
- `public/site.webmanifest` defines: name, short_name, icons (192px + 512px), start_url, display: standalone, theme_color
- `public/favicon.ico` is updated; add `favicon-32x32.png` and `apple-touch-icon.png`
- The application can be installed as a PWA from Chrome's address bar (basic installability — no service worker required for v1.0)
- Lighthouse SEO score ≥90

**Story points:** 3

---

## Technical Tasks

| ID | Task | Points |
|----|------|--------|
| T-52 | Install `rollup-plugin-visualizer`; add to `vite.config.js` for build analysis | 1 |
| T-53 | Bump IndexedDB schema to version 2; add index migration logic | 3 |
| T-54 | Create `src/components/shared/SkeletonBlock.vue` — reusable skeleton line/block primitive | 2 |
| T-55 | Create `src/components/shared/ErrorBoundary.vue` | 2 |
| T-56 | Add `prefers-reduced-motion` check to all transitions | 1 |
| T-57 | Run Lighthouse CI (`lhci`) in GitHub Actions; fail if any score drops below 85 | 3 |

**Technical task total:** 12 pts

---

## Capacity & Allocation

| Area | Points |
|------|--------|
| Code splitting & lazy loading (PERF-01, PERF-02) | 13 |
| IndexedDB & Vue optimisation (PERF-03, PERF-04) | 13 |
| Bundle & loading states (PERF-05, PERF-06) | 10 |
| Error boundaries & mobile (PERF-07, PERF-08) | 18 |
| Polish & SEO (PERF-09, PERF-10) | 8 |
| Technical tasks | 12 |
| **Buffer** | 6 |
| **Total** | **80 pts** |

---

## Dependencies

| Dependency | From |
|-----------|------|
| All features complete and tested | Sprints 0–8 |
| All P0/P1 bugs resolved | Sprint 8 — QA-10 |

## Risks

| Risk | Mitigation |
|------|-----------|
| Mobile layout requires significant refactoring | Allocate 50% of sprint to PERF-08; treat it as highest priority |
| IndexedDB index migration fails for existing DBs | Test migration on existing seeded data; add rollback plan |
| Lighthouse CI blocks PR merges unexpectedly | Set threshold at 85 initially; raise to 90 post-sprint |

## Definition of Done

- Lighthouse Performance ≥90 on a production build in Chrome
- Total gzipped JS bundle ≤300 KB
- All views render correctly at 375px
- Zero layout shift or blank flashes during page transitions
- `prefers-reduced-motion` respected for all animations
- Lighthouse CI integrated into GitHub Actions

## Key Deliverables

1. Route-level code splitting with Vite chunks per feature
2. IndexedDB indexes (version 2 migration) with benchmark results
3. Skeleton loaders for all async views
4. `ErrorBoundary.vue` wrapping all primary routes
5. Full mobile-responsive layout (375px+)
6. Animations respecting `prefers-reduced-motion`
7. PWA manifest + updated favicon set
8. Lighthouse CI in GitHub Actions
