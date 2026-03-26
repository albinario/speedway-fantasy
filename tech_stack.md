# Speedway Fantasy — Tech Stack Analysis

> Generated: 2026-03-21. All "installed" versions reflect what `bun pm ls` reports from node_modules; "latest" reflects the npm registry as of the same date.

---

## 1. Stack Overview

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, RSC) |
| Language | TypeScript 5 (strict mode) |
| Runtime | Node.js 24 (Current) / Bun 1.x (package manager + dev runner) |
| Database | Neon serverless Postgres |
| ORM / Query builder | Kysely 0.28 + kysely-neon dialect |
| Auth | Auth0 via @auth0/nextjs-auth0 v4 |
| UI primitives | Radix UI (via radix-ui meta-package) + shadcn/ui |
| Styling | Tailwind CSS v4 + tailwind-merge + class-variance-authority |
| Icons | Lucide React |
| Email | Resend |
| Observability | @vercel/analytics + @vercel/speed-insights |
| Deployment | Vercel |
| Linting | ESLint 10 (flat config) |
| Formatting | Prettier 3 + prettier-plugin-tailwindcss + @trivago/prettier-plugin-sort-imports |
| DB types codegen | kysely-codegen |

---

## 2. Dependency Version Audit

### 2a. Production Dependencies

| Package | Installed | Latest | Status |
|---|---|---|---|
| next | **16.1.6** (lockfile) / 16.2.0 (package.json) | **16.2.1** | OUTDATED — see note |
| react | 19.2.4 | 19.2.4 | Up to date |
| react-dom | 19.2.4 | 19.2.4 | Up to date |
| @auth0/nextjs-auth0 | 4.16.0 | 4.16.0 | Up to date |
| @neondatabase/serverless | 1.0.2 | 1.0.2 | Up to date |
| kysely | 0.28.14 | 0.28.14 | Up to date |
| kysely-neon | 2.0.2 | 2.0.2 | Up to date |
| radix-ui | 1.4.3 | 1.4.3 | Up to date |
| shadcn | **4.0.5** | 4.1.0 | Outdated (minor) |
| lucide-react | 0.577.0 | 0.577.0 | Up to date |
| tailwind-merge | 3.5.0 | 3.5.0 | Up to date |
| class-variance-authority | 0.7.1 | 0.7.1 | Up to date |
| clsx | 2.1.1 | 2.1.1 | Up to date |
| tw-animate-css | 1.4.0 | 1.4.0 | Up to date |
| country-flag-icons | 1.6.15 | 1.6.15 | Up to date |
| resend | **6.9.3** | 6.9.4 | Outdated (patch) |
| @vercel/analytics | 2.0.1 | 2.0.1 | Up to date |
| @vercel/speed-insights | 2.0.0 | 2.0.0 | Up to date |

### 2b. Dev Dependencies

| Package | Installed | Latest | Status |
|---|---|---|---|
| typescript | 5.9.3 | 5.9.3 | Up to date |
| eslint | **10.0.2** | 10.1.0 | Outdated (patch) |
| eslint-config-next | **16.1.6** (lockfile) / 16.2.0 (package.json) | 16.2.1 | OUTDATED — see note |
| tailwindcss | 4.2.1 | 4.2.2 | Outdated (patch) |
| @tailwindcss/postcss | 4.2.1 | 4.2.2 | Outdated (patch) |
| postcss | 8.5.8 | 8.5.8 | Up to date |
| prettier | 3.8.1 | 3.8.1 | Up to date |
| prettier-plugin-tailwindcss | 0.7.2 | 0.7.2 | Up to date |
| @trivago/prettier-plugin-sort-imports | 6.0.2 | 6.0.2 | Up to date |
| kysely-codegen | 0.20.0 | 0.20.0 | Up to date |
| pg | **8.19.0** | 8.20.0 | Outdated (patch) |
| dotenv-cli | 11.0.0 | 11.0.0 | Up to date |
| @types/node | 25.3.0 | 25.3.0 | Up to date |
| @types/react | 19.2.10 | 19.2.10 | Up to date |
| @types/react-dom | 19.2.3 | 19.2.3 | Up to date |

### 2c. Runtime / Toolchain

| Tool | Version in use | Latest stable | Notes |
|---|---|---|---|
| Node.js | 24.14.0 | ~24.x | v24 enters LTS in October 2025 — already past that date, it IS LTS |
| Bun | 1.1.42 | 1.2.x | Bun 1.2 (Jan 2025) is the latest stable — significant upgrade |

---

## 3. Critical Issues — Lockfile / Installation Skew

**This is the most immediately actionable problem in the repo.**

`package.json` declares `next@16.2.0` and `eslint-config-next@16.2.0`, but `node_modules` contains `next@16.1.6` and `eslint-config-next@16.1.6`. The lockfile (`bun.lockb`) was not updated after the package.json was bumped (likely in the Dependabot commits `65ccb3b` and `9b7ff40`).

This means:
- The app **builds and runs against 16.1.6** despite `package.json` claiming 16.2.0.
- The two Dependabot bumps are effectively dead until `bun install` is re-run.
- `next@16.2.1` (the true current latest) is not installed at all.

**Fix:** Run `bun install` to align the lockfile, then bump Next.js to 16.2.1.

---

## 4. Security Concerns

### HIGH — CVE-2025-55184 / CVE-2025-55183 in Next.js (via @auth0/nextjs-auth0 advisory)
- **Affected version:** Next.js 16.1.6 (currently installed).
- **Fixed in:** Next.js 16.2.1 (16.2.0 partially; 16.2.1 contains full backport).
- **Source:** @auth0/nextjs-auth0 v4.14.1 release notes explicitly reference these CVEs as the reason for updating the Next.js peer dependency.
- **Action:** Upgrade Next.js to 16.2.1 immediately. Run `bun install` first to fix the lockfile skew, then bump and reinstall.

### ~~MEDIUM — Kysely SQL injection patches (MySQL context)~~ RESOLVED
- **Affected versions:** kysely < 0.28.12 (injection via arrow operator references) and < 0.28.14 (string literal injection on MySQL with backslash escapes).
- **Installed version:** 0.28.14 (upgraded 2026-03-21). Build verified clean.
- **No action required.**

### LOW — Vendored lodash CVE in Next.js canary
- **CVE-2025-13465** was patched in the Next.js canary line via a lodash vendor update. This fix is **not yet confirmed in the 16.2.1 stable release**. Monitor the 16.2.x patch line; if a 16.2.2 addressing this ships, upgrade promptly.

### ~~LOW — @auth0/nextjs-auth0 at 4.14.1 vs 4.16.0~~ RESOLVED
- Upgraded to 4.16.0 on 2026-03-21. Build verified clean. No action required.

---

## 5. Recommended Upgrades (Prioritized)

### Priority: HIGH (do now)

| Action | Command | Reason |
|---|---|---|
| Fix lockfile skew | `bun install` | node_modules is behind package.json for next and eslint-config-next |
| Upgrade Next.js to 16.2.1 | Bump in `package.json`, then `bun install` | CVE-2025-55184 / CVE-2025-55183 security fix |
| Upgrade eslint-config-next to 16.2.1 | Keep in sync with Next.js version | Must always match Next.js version |
| ~~Upgrade kysely to 0.28.14~~ | Done — 0.28.14 installed 2026-03-21 | Injection vulnerability fix in v0.28.12 |

### Priority: MEDIUM (this sprint)

| Action | Command | Reason |
|---|---|---|
| ~~Upgrade @auth0/nextjs-auth0 to 4.16.0~~ | Done — 4.16.0 installed 2026-03-21 | MFA support, token refresh buffer, dynamic APP_BASE_URL — no breaking changes |
| Upgrade Bun from 1.1.42 to 1.2.x | `bun upgrade` or install latest | Bun 1.2 introduced a new text-based lockfile (`bun.lock`), built-in Postgres client, 3x Express perf; significant improvements to Node.js compatibility |
| Upgrade tailwindcss + @tailwindcss/postcss to 4.2.2 | `bun add -D tailwindcss@4.2.2 @tailwindcss/postcss@4.2.2` | Patch release — low risk, keep in sync |
| Upgrade shadcn to 4.1.0 | `bun add shadcn@4.1.0` | Minor release, ensures latest component generation templates |

### Priority: LOW (backlog)

| Action | Command | Reason |
|---|---|---|
| Upgrade resend to 6.9.4 | `bun add resend@6.9.4` | Minor patch, adds `last_used_at` field to API key responses |
| Upgrade pg to 8.20.0 | `bun add -D pg@8.20.0` | Dev-only (kysely-codegen); patch with minor bug fixes |
| Upgrade eslint to 10.1.0 | `bun add -D eslint@10.1.0` | Patch release |
| Verify Node.js LTS status | N/A | Node 24 entered LTS in October 2025. Ensure Vercel deployment environment targets Node 24 LTS |

### Not Required Now

- **React 19.2.4** — already at latest; no action needed.
- **TypeScript 5.9.3** — already at latest.
- All `@vercel/*`, `postcss`, `prettier`, `clsx`, `tailwind-merge`, `lucide-react`, `radix-ui`, `country-flag-icons` — all current.

---

## 6. Architecture & Configuration Notes

### Turbopack disabled
`next.config.ts` has `turbopack: {}` commented out; dev and build use `--webpack` flag explicitly. Turbopack in Next.js 16 has reached stability for many use cases — consider enabling for faster local development, but test thoroughly given the Kysely server-only import pattern.

### TypeScript target: ES2017
`tsconfig.json` targets `ES2017`. With Node.js 24 (V8 13.x) on the runtime and modern browsers assumed, this could safely be bumped to `ES2022` or `ES2023` to unlock optional chaining assignment, `Object.hasOwn`, `at()`, etc. at the type-check level. Low risk, minor ergonomics win.

### No test suite
Confirmed in `CLAUDE.md`. For a fantasy sports app with scoring logic, standings aggregation, and user picks, this is a notable risk surface. Consider adding Vitest for unit tests on the data layer helpers (e.g., `src/lib/dates.ts`, `src/lib/year.ts`) as a low-friction starting point.

### Bun lockfile format
`bun.lockb` is the legacy binary lockfile. Bun 1.2 introduced a new human-readable `bun.lock` (text-based). After upgrading Bun to 1.2.x, run `bun install` once to migrate to the new format — this improves diff readability in PRs and resolves the lockfile skew issue permanently in a more transparent format.

### `eslint-config-next` version must always match `next` version
This is a hard constraint enforced by the Next.js team. When upgrading Next.js, always bump both in the same commit.

---

## 7. Overall Stack Health Assessment

**Rating: Good — with one critical action required immediately.**

The stack is modern and well-chosen. React 19, Next.js 16 App Router, Tailwind v4, Kysely with full TypeScript codegen, Auth0 v4, Neon serverless Postgres — all are current-generation choices. TypeScript is strict, the folder structure is clean, and the data layer pattern (`dataFetch()` + per-feature `data.ts` + React `cache()`) is solid.

The one issue that needs immediate attention is the **lockfile skew combined with the unpatched CVEs in the installed Next.js version**. The installed runtime is 16.1.6, which has known CVEs that Auth0's own SDK release notes flag explicitly. `bun install` + bump to 16.2.1 is a five-minute fix.

Secondary concern is **no test coverage**. With scoring and standings logic that affects user experience, a regression in a data query has no automated safety net.

Everything else is routine patch maintenance — nothing alarming, nothing deprecated.

---

## 8. Suggested Upgrade Order (Quick Reference)

```bash
# Step 1 — fix lockfile skew and patch CVEs (do today)
bun install                              # sync lockfile to package.json first
bun add next@16.2.1 eslint-config-next@16.2.1
bun install

# Step 2 — medium priority (this sprint)
# bun add @auth0/nextjs-auth0@4.16.0  # DONE 2026-03-21
bun add -D tailwindcss@4.2.2 @tailwindcss/postcss@4.2.2
bun add shadcn@4.1.0
bun upgrade   # upgrade Bun itself to 1.2.x

# Step 3 — low priority (next sprint)
bun add resend@6.9.4
bun add -D pg@8.20.0 eslint@10.1.0
```
