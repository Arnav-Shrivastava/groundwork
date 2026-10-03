# GroundWork: Reconciliation (initial state, before the corrective run)

Status key: DONE = verified working. PARTIAL = some of it works. MISSING = does not exist. BROKEN = exists but fails.
"DONE" requires an evidence file. Nothing in this initial table qualifies as DONE without one.

Evidence files used here:
- [reconcile_git.txt](evidence/reconcile_git.txt): git status, fetch, rev-parse, log, tracked and untracked files
- [reconcile_code_facts.txt](evidence/reconcile_code_facts.txt): docker state, grep results, live OpenAPI path list, frontend routes, installed shadcn components, missing dependencies

## Git log vs origin/main

- `git rev-parse HEAD origin/main`: both `0c292bc...`. No commit existed that never reached the remote.
- But the working tree was **dirty**. Work was never committed:
  - `audit/PROGRESS.md` (modified, includes the Step 9 and 10 entries)
  - `backend/app/db/base.py` (modified, model imports for Alembic)
  - `frontend/src/pages/BuyerMarketplace.tsx` (modified)
  - `backend/verify_step9.py` (untracked)
- `verify_step2.py` sits at the repo root, tracked, and is a throwaway script, not a test.
- `.env.example` is tracked and contains a token-shaped string (`pk.eyJ...mock-token`). It is a placeholder but it trips the `eyJ` secret grep. It will be replaced with an empty value.
- `.gitignore` lacks: build output (`dist/` is present, but not `frontend/dist`-specific entries beyond that), database dumps, `*.sql`, `playwright-report/`, `test-results/`, `.env.*`, `*.log`, `.mypy_cache`, `.ruff_cache`, `.pytest_cache`. To fix.
- The git history contains **two** Step 1-8 sequences. The first (672f885..bd27e46) is the original build. The second (d1b3fc8..0c292bc) is the renumbered revamp. Only the original numbering counts from here.

## Frontend routes (from `frontend/src/App.tsx`)

| Route | Real or missing |
|---|---|
| `/login` | Real (single page, no `?next=`) |
| `/aggregator` | Real but thin (one page: map + list) |
| `/marketplace` | Real but thin; calls the API, no URL-synced filters |
| `/` | Redirect to `/login`. **No landing page** |
| `/register` | MISSING |
| `/pricing`, `/about` | MISSING |
| `/docs/*` (12 pages) | MISSING |
| `/marketplace/:id` | MISSING |
| `/app/*` aggregator sub-pages (farms, batches, payouts) | MISSING |
| Buyer portfolio, order detail, certificate | MISSING |
| `/admin/*` | MISSING |
| 404 and error pages | MISSING |

## shadcn / frontend foundation

- `frontend/components.json` exists (new-york, zinc, cssVariables).
- Only **11** components exist in `src/components/ui`: avatar, badge, button, card, dialog, dropdown-menu, input, label, separator, sheet, sonner. The "full shadcn set" does not exist. Step 4 deleted `src/` and it was never rebuilt.
- Absent from `package.json`: react-hook-form, zod, recharts, @tanstack/react-table, cmdk, @playwright/test, lighthouse, any Geist font package.
- Tailwind is v3.4 with a stray `@tailwindcss/postcss` v4 dependency.

## Requirements table

| Requirement | Status | Evidence file | Notes |
|---|---|---|---|
| **Phase A: API** | | | |
| `GET /api/marketplace` list with filters | PARTIAL | reconcile_code_facts.txt | Route exists at `/api/marketplace`. Returns a bare list, no `{items,total,page}`, no sort, no pagination. Filter on region uses `ilike` (forbidden). |
| `GET /api/marketplace/{id}` | MISSING | reconcile_code_facts.txt | Not in the OpenAPI path list. |
| `/marketplace/listings` removed or redirected | PARTIAL | step2_api_transcript.md (old) | The route never existed, so the frontend and old PROGRESS.md call a 404. Frontend `BuyerMarketplace.tsx` still points at `/api/marketplace/listings`. |
| Hectares computed server-side via `ST_Area(geography)` | MISSING | reconcile_code_facts.txt | `farms.py` stores the client-sent `total_hectares`. No `ST_Area` anywhere in `backend/app`. |
| Credit creation rejects farm_ids not owned by caller | PARTIAL | none | Code exists in `credits.py` (loop with ownership filter). Never tested. No negative-case evidence. |
| `regions` table + Scope 3 filter via `ST_Intersects` | PARTIAL | reconcile_code_facts.txt | `Region` model exists and is seeded with 1 region. Filter uses `ilike` on a string, not `ST_Intersects`. |
| `near=lat,lng&radius_km` via `ST_DWithin` | MISSING | reconcile_code_facts.txt | No `ST_DWithin` in backend. |
| Stats endpoints (public / aggregator / buyer) | MISSING | reconcile_code_facts.txt | None in OpenAPI paths. |
| Admin endpoints (users, listings, transactions, buffer-summary, milestone release) | MISSING | reconcile_code_facts.txt | None. `GET /transactions` returns all rows for admin but there is no milestone release. |
| `GET /api/transactions/mine` for buyers | MISSING | reconcile_code_facts.txt | Only `GET /api/transactions`. |
| `buffer_ledger` | PARTIAL | none | Model + migration + a row written at checkout. No endpoint reads it. |
| CORS driven by `FRONTEND_ORIGIN` env | MISSING | reconcile_code_facts.txt | `main.py` hardcodes 4 localhost origins. |
| JWT lifetime 60 minutes | MISSING | reconcile_code_facts.txt | `config.py`: 7 days. `.env.example`: 10080. |
| Seed: 3 aggregators, 25 farms, ~8 countries | MISSING | none | `seed.py` creates 1 aggregator, 1 farm, 1 region. |
| Seed: 14 distinct batches | MISSING | none | 2 batches. |
| Seed: 4 buyers, 6 transactions, admin | MISSING | none | 1 buyer, 0 transactions, 1 admin. |
| Seed idempotent, `is_demo` flag | BROKEN | none | Re-running `seed.py` re-inserts users and crashes on the unique email. No `is_demo` column exists. |
| mypy clean | BROKEN | none | PROGRESS.md Step 3: "1 error due to module shadowing", deferred. |
| ruff clean | UNVERIFIED | none | Never saved as evidence. |
| API transcript covers every endpoint incl. negative cases | BROKEN | audit/step2_api_transcript.md | 4 calls, one is a 404, no negative cases. |
| pytest >= 25 tests | BROKEN | none | One test (`test_health_check`). |
| `docker compose up --build` healthy | BROKEN | reconcile_code_facts.txt | Backend container shows `unhealthy`: its healthcheck curls `/api/stats/public`, which does not exist. Frontend stays in `Created`. |
| Delivery type issued / forward + milestones | PARTIAL | none | Implemented in `transactions.py` and `escrow.py`, never tested. Milestone rounding uses Decimal `round()`, not integer cents, and there is no check that milestones sum to the total. |
| Concurrency safety on checkout | PARTIAL | none | Uses `with_for_update()`. Never tested. |
| Rate limiting | PARTIAL | none | `slowapi` on register and login. Never triggered in evidence. |
| **Step 3: tokens, themes, shells, auth** | | | |
| Design tokens + light and dark themes | PARTIAL | none | `index.css` has a dark theme only; `App.tsx` hardcodes `className="dark"`. No Geist. |
| Full shadcn component set | MISSING | reconcile_code_facts.txt | 11 components. |
| MarketingLayout, DocsLayout, AppLayout | MISSING | none | No layout components exist. |
| AuthProvider, role guards, `?next=` | PARTIAL | none | Zustand store and an inline `ProtectedRoute`. No `?next=`. |
| Designed 404 / error pages | MISSING | none | |
| **Step 4: landing page** | MISSING | none | `/` redirects to `/login`. |
| **Step 5: docs site** | MISSING | none | |
| **Step 6: login / register / pricing / about** | PARTIAL | none | `/login` exists. `/register`, `/pricing`, `/about` do not. No react-hook-form or zod. |
| **Step 7: aggregator app** | PARTIAL | none | One page with a terra-draw map. No overview stats, farms table, batch wizard, payouts. Hectares are client-sent. |
| **Step 8: buyer app** | PARTIAL | none | One marketplace page calling a 404 URL. No detail page, no checkout timeline, no portfolio, no certificate. |
| **Step 9: admin console** | MISSING | none | |
| **Step 10: command palette** | MISSING | none | |
| Step 10: reveal / count-up motion, reduced-motion | MISSING | none | |
| Step 10: SEO meta, favicon, OG image | PARTIAL | none | Default Vite favicon only. |
| Step 10: code splitting, lazy maps | MISSING | none | |
| Step 10: Playwright E2E (5 flows) | MISSING | none | Playwright not installed. |
| Step 10: screenshots in `/audit/after/` | MISSING | none | Directory is empty. |
| Step 10: real Lighthouse scores | MISSING | none | |
| Step 10: README followed literally on a clean clone | MISSING | none | |
| Step 10: GROUNDWORK_EXPLANATION.md updated (gitignored) | PARTIAL | none | File exists, stale. |
| Step 10: dead code and unused deps removed | MISSING | none | |
| REVAMP_REPORT.md | MISSING | none | |
