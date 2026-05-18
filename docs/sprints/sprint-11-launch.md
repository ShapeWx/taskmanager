# Sprint 11 — Launch Preparation & Production Launch

**Dates:** October 20 – October 31, 2026
**Duration:** 2 weeks
**Phase:** 6 — Launch
**Points budget:** 80 pts
**Depends on:** Sprint 10 (staging live, beta signed off, user guide complete)

---

## Sprint Goal

Task Master v1.0 ships to production on **November 3, 2026**. This sprint completes the final regression pass, hardens the production infrastructure, configures monitoring and alerting, and executes the launch plan. The team enters launch day with confidence that every system is green.

---

## Context

Beta feedback has been triaged and all P0/P1 issues resolved (Sprint 10). The staging environment is stable. The user guide is written. This sprint is focused on production hardening, not new feature development. The feature freeze took effect at the start of Sprint 10; any new feature requests are immediately backlogged to v1.1.

**Feature freeze:** No new features. No scope expansion. Bug fixes and launch-related tasks only.

---

## Launch Checklist

The following must all be confirmed ✅ before the November 3 launch:

- [ ] Production environment live at `https://taskmaster.app` (or equivalent)
- [ ] HTTPS certificate valid and auto-renewing
- [ ] Sentry error tracking active on production
- [ ] Usage analytics active on production
- [ ] Lighthouse ≥90 on production build
- [ ] Zero P0 / P1 open bugs
- [ ] User guide published and linked from the app
- [ ] Feedback widget enabled (will remain active post-launch)
- [ ] Monitoring alerts configured (error rate, uptime)
- [ ] Rollback plan documented and tested
- [ ] Team on-call schedule for launch week defined
- [ ] Launch announcement drafted and scheduled

---

## User Stories

### LAUNCH-01 — Production Infrastructure
**As a** DevOps engineer,
**I want** the production environment fully configured and separated from staging,
**so that** production data and staging data are completely isolated and production is hardened.

**Acceptance criteria:**
- Production host is separate from staging (separate server/container)
- Production environment variables are set (separate `VITE_SENTRY_DSN`, `VITE_ANALYTICS_DOMAIN`, `NODE_ENV=production`)
- `VITE_BETA_CODE` is unset (registration is open without a code)
- `VITE_FEEDBACK_ENABLED=true` (feedback widget remains active post-launch)
- HTTPS certificate is configured via Let's Encrypt or host-managed; auto-renews
- CDN is configured in front of the Nginx server (Cloudflare free tier acceptable) for static asset caching
- Production URL is confirmed: `https://taskmaster.app` (placeholder — actual domain TBD)
- DNS records are propagated and verified

**Story points:** 13

---

### LAUNCH-02 — CI/CD: Production Deploy Pipeline
**As a** developer,
**I want** a separate CI pipeline step for production deployment,
**so that** production is only updated on an explicit, intentional trigger.

**Acceptance criteria:**
- Production deploy is triggered only by: a git tag matching `v*.*.*` (e.g., `v1.0.0`) pushed to `main`
- The pipeline step: build → test → push Docker image tagged `v1.0.0` and `latest` → deploy to production
- A GitHub Actions environment `production` is configured with required reviewers (at least one approval before deploy proceeds)
- After a successful deploy, a Slack or email notification is sent: `"Task Master v1.0.0 deployed to production"`
- Deploy step includes a smoke test: `curl https://taskmaster.app` must return HTTP 200

**Story points:** 8

---

### LAUNCH-03 — Rollback Plan
**As a** developer,
**I want** a documented and tested rollback procedure,
**so that** if a critical issue is discovered on launch day we can revert to the previous version in under 10 minutes.

**Acceptance criteria:**
- `docs/operations/rollback.md` describes: how to identify the previous Docker image tag, the command to redeploy it, how to verify the rollback succeeded
- The rollback procedure is rehearsed: deploy `v1.0.0-rc1` to production, then rollback to the previous tag — verified to complete in <10 minutes
- All previous Docker images are retained in GHCR for at least 30 days
- The on-call developer can execute the rollback without assistance (single command: `./scripts/rollback.sh v0.x.x`)
- `scripts/rollback.sh` is written, tested, and version-controlled

**Story points:** 5

---

### LAUNCH-04 — Uptime Monitoring & Alerts
**As a** developer,
**I want** external uptime monitoring and alert escalation,
**so that** the team is notified within 2 minutes if production goes down.

**Acceptance criteria:**
- Uptime Robot (or BetterUptime) is configured to ping `https://taskmaster.app` every 1 minute
- An alert fires if the site is unreachable for >2 minutes; notification goes to: email + a dedicated Slack `#alerts` channel
- A status page is configured at `https://status.taskmaster.app` (or equivalent) showing current and historical uptime
- Sentry alert rules are configured: notify if error count exceeds 10/minute or if a new issue occurs that affects >1% of sessions
- A weekly uptime report is emailed to the product owner automatically

**Story points:** 3

---

### LAUNCH-05 — Final Regression Testing
**As a** QA engineer,
**I want** a final full regression pass on the production build,
**so that** no regressions from the last round of changes slip through to launch day.

**Acceptance criteria:**
- The full Cypress E2E suite runs against the production build (built with `turbo build`, not dev server)
- All tests pass with zero failures and zero flakiness across 3 consecutive CI runs
- Manual regression checklist completed by a developer who did not write the feature:
  - Authentication (register, login, logout, forgot password)
  - Task CRUD (create, edit, filter, search, bulk delete)
  - Kanban (drag-drop, WIP limits, custom columns)
  - Time tracking (timer, manual entry, weekly chart)
  - Analytics (metrics, date range, export)
  - Team management (invite, role change, permissions)
  - Mobile responsiveness (375px on Chrome DevTools)
  - All 4 themes render correctly
- Zero P0 or P1 bugs found during regression

**Story points:** 8

---

### LAUNCH-06 — Security Hardening
**As a** product owner,
**I want** the production deployment to pass a basic security checklist,
**so that** we are not launching with obvious security vulnerabilities.

**Acceptance criteria:**
- Nginx config includes security headers: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
- No sensitive data (passwords, tokens, PII) is logged to the browser console in production
- `sessionStorage` tokens are cleared on tab close (SessionStorage behaviour is correct; documented)
- Password hashing uses a strong algorithm (`bcryptjs` with cost factor ≥12)
- The `VITE_` prefixed env vars do not expose any secrets (all secrets are server-side only — verified)
- `docker/nginx.conf` reviewed and confirmed: directory listing disabled, server tokens hidden
- Security review documented in `docs/security/security-checklist.md`

**Story points:** 5

---

### LAUNCH-07 — Performance Validation on Production
**As a** developer,
**I want** to verify Lighthouse scores on the actual production URL,
**so that** performance regressions introduced during Docker/CDN configuration are caught before launch.

**Acceptance criteria:**
- Lighthouse CI runs against `https://taskmaster.app` (not localhost) as part of the production deploy pipeline
- Results: Performance ≥90, Accessibility ≥95, Best Practices ≥90, SEO ≥90
- Core Web Vitals in the green: LCP ≤2.5s, FID ≤100ms, CLS ≤0.1
- Results are archived in `docs/performance/lighthouse-production-v1.0.md`
- If any score is below threshold, the release is blocked until resolved

**Story points:** 3

---

### LAUNCH-08 — Launch Communications
**As a** product owner,
**I want** launch day communications prepared and scheduled,
**so that** the right people know about Task Master v1.0 on launch day.

**Acceptance criteria:**
- Launch announcement email drafted for beta users: `"Task Master is now live! Here's what's new..."`
- Social media post drafted (LinkedIn/Twitter) announcing v1.0 launch
- `README.md` at repo root updated: reflects v1.0 status, links to user guide and live app, includes a screenshot
- In-app banner prepared for launch day: `"Welcome to Task Master v1.0! 🎉 See what's new"` linking to a changelog page
- `docs/changelog/v1.0.0.md` written: lists all features shipped from Sprint 0–11
- All communications reviewed by product owner and approved before scheduling

**Story points:** 5

---

### LAUNCH-09 — Post-Launch Support Plan
**As a** team lead,
**I want** a defined on-call and support process for launch week,
**so that** user-reported issues are handled quickly and the launch experience is excellent.

**Acceptance criteria:**
- On-call rotation defined for November 3–14 (first two weeks post-launch): 2 developers rotating daily
- Support email address configured and monitored (or a Crisp/Intercom widget added to the app)
- Triage SLA defined: P0 — acknowledge in 1h, fix in 4h; P1 — acknowledge in 4h, fix in 24h; P2+ — next sprint
- `docs/operations/support-runbook.md` written: common issues, how to diagnose, how to escalate
- Hotfix branch strategy documented: hotfixes branch from the release tag, merge back to `main` after
- A `#launch-war-room` Slack channel is created for launch week coordination

**Story points:** 5

---

### LAUNCH-10 — v1.1 Backlog Grooming
**As a** product owner,
**I want** the post-launch backlog groomed and prioritised,
**so that** the team can start Sprint 12 (v1.1) immediately after launch without a planning gap.

**Acceptance criteria:**
- All deferred P2/P3 bugs from `docs/beta/known-issues.md` are added to the GitHub Issues backlog
- All feature requests from beta feedback that were deferred are reviewed and either added to the backlog or explicitly rejected
- The top 10 v1.1 features/fixes are ranked by impact + effort (using the priority matrix)
- Sprint 12 scope is drafted (not committed) with a target start date of November 17, 2026
- `docs/sprints/sprint-12-v1.1-draft.md` is created with the preliminary plan

**Story points:** 5

---

## Technical Tasks

| ID | Task | Points |
|----|------|--------|
| T-63 | Write `scripts/rollback.sh` with parameterised Docker image tag | 2 |
| T-64 | Configure GitHub Actions `production` environment with required reviewers | 1 |
| T-65 | Add `v*.*.*` tag trigger to CI pipeline for production deploy step | 2 |
| T-66 | Configure Nginx security headers in `docker/nginx.conf` | 2 |
| T-67 | Write `docs/changelog/v1.0.0.md` | 2 |
| T-68 | Create `docs/operations/rollback.md` and `docs/operations/support-runbook.md` | 2 |

**Technical task total:** 11 pts

---

## Launch Day Timeline — November 3, 2026

| Time (UTC) | Action | Owner |
|-----------|--------|-------|
| 07:00 | Final E2E suite run against staging | Dev |
| 07:30 | Tag `v1.0.0` on `main`; trigger production deploy | Tech Lead |
| 08:00 | Verify production deploy smoke test passes | Dev |
| 08:15 | Run Lighthouse CI on production URL | Dev |
| 08:30 | Manually smoke-test critical paths on production | QA |
| 09:00 | Send launch announcement email to beta users | Product |
| 09:15 | Publish social media launch posts | Product |
| 09:30 | Update `README.md` with production URL and screenshot | Dev |
| 10:00 | **Task Master v1.0 is LIVE** 🚀 | All |
| 10:00–18:00 | Monitor Sentry and uptime alerts continuously | On-call Dev |
| 18:00 | End-of-day launch review call (15 min) | All |

---

## Capacity & Allocation

| Area | Points |
|------|--------|
| Production infra & deploy (LAUNCH-01, LAUNCH-02) | 21 |
| Rollback & monitoring (LAUNCH-03, LAUNCH-04) | 8 |
| Testing & security (LAUNCH-05, LAUNCH-06, LAUNCH-07) | 16 |
| Communications & support (LAUNCH-08, LAUNCH-09) | 10 |
| v1.1 planning (LAUNCH-10) | 5 |
| Technical tasks | 11 |
| **Buffer** | 9 |
| **Total** | **80 pts** |

---

## Dependencies

| Dependency | From |
|-----------|------|
| Staging deploy pipeline | Sprint 10 — BETA-01 |
| Beta sign-off (product owner) | Sprint 10 — BETA-08 |
| User guide complete | Sprint 10 — BETA-09 |
| All P0/P1 bugs resolved | Sprint 10 — BETA-08 |
| Docker image in GHCR | Sprint 10 — T-59 |

## Risks

| Risk | Mitigation |
|------|-----------|
| Production environment setup blocked by DNS propagation | Begin DNS changes 48h before launch target |
| P0 bug found during final regression | Hold launch; fix and re-test; use buffer days Oct 29–30 |
| CDN misconfiguration breaks the app | Test CDN cache-busting with versioned asset filenames (Vite hashes by default) |
| On-call developer unavailable on launch day | Ensure 2 developers confirmed available Nov 3 |

## Definition of Done

- `https://taskmaster.app` is live and returning HTTP 200
- Lighthouse ≥90 confirmed on production
- Sentry is active and reporting (test error sent and received)
- Uptime monitor is active and alert channel confirmed
- All launch communications sent
- Rollback procedure tested and documented
- v1.1 backlog groomed and Sprint 12 draft created
- **Task Master v1.0 is in production — November 3, 2026** 🚀

## Key Deliverables

1. Production environment (separate from staging, CDN, HTTPS)
2. Automated production deploy pipeline triggered by git tags
3. Tested rollback script (`scripts/rollback.sh`)
4. Uptime monitoring and Sentry alerting on production
5. Security headers in Nginx config
6. Final regression pass (zero P0/P1 bugs)
7. Launch communications (email, social, in-app banner)
8. `docs/changelog/v1.0.0.md`
9. Support runbook and on-call schedule
10. v1.1 backlog draft (`docs/sprints/sprint-12-v1.1-draft.md`)
