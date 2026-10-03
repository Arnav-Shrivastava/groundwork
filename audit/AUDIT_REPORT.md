1. EXECUTIVE SUMMARY
GroundWork OS was built as an impressive visual prototype and a well-structured backend scaffold, but it is **not a functional end-to-end product**. The frontend UI is 100% mocked with hardcoded data and makes zero network calls to the backend API. The backend API is fatally broken out of the box due to a SQLAlchemy database driver mismatch (`psycopg2-binary` installed, but `psycopg` v3 required by connection string). Furthermore, no database migrations (Alembic) were initialized, meaning the database tables do not exist. While the core logic (PostGIS polygon parsing, escrow math) is written, you cannot register, login, or checkout today without significant code intervention. Estimated complete vs spec: 40% functional, 80% visual.

2. PROJECT TREE AND TECH STACK ACTUALLY USED
```text
./
    .env.example
    docker-compose.yml
    backend/
        requirements.txt
        app/
            main.py
            api/routes/ (auth.py, credits.py, farms.py, marketplace.py, transactions.py)
            core/config.py
            db/ (base.py, session.py)
            models/ (credit_batch.py, farm.py, transaction.py, user.py)
            services/ (escrow.py, geo.py)
    frontend/
        package.json
        vite.config.ts
        src/
            App.tsx
            components/ (credits/, farms/, map/, marketplace/, ui/)
            pages/ (AggregatorDashboard.tsx, BuyerMarketplace.tsx)
```
- **Backend Stack:** Python 3.11, FastAPI 0.142.2, SQLAlchemy 2.1.3, GeoAlchemy2 0.20.0, Uvicorn 0.54.0.
- **Frontend Stack:** React 18.3, Vite 6.0.5, TailwindCSS 3.4.4 (downgraded from v4 for shadcn), shadcn/ui.
- **Database:** PostGIS 16-3.4 (Docker).

3. HOW TO RUN IT
- `cp .env.example .env`
- `docker compose up --build`
**Known Blockers:**
- The `groundwork-backend-1` container exits immediately with code 1. `ModuleNotFoundError: No module named 'psycopg'`. The backend connection string requires `psycopg` (v3) but `requirements.txt` installed `psycopg2-binary`.
- Database schema does not exist because `alembic init` was never run.

4. SPEC COMPLIANCE MATRIX

| Requirement | Status | Evidence | Notes |
| :--- | :--- | :--- | :--- |
| Step 1: Init / Models | PARTIAL | `backend/app/models/` | Models exist, but Alembic migrations are completely missing. |
| Step 2: Auth / FastAPI | PARTIAL | `backend/app/api/deps.py` | JWT logic exists, but cannot run. Password hashing unverified. |
| Step 3: Aggregator OS API | PARTIAL | `backend/app/api/routes/farms.py` | Geospatial WKT logic written, but cannot be tested. |
| Step 4: Marketplace API | PARTIAL | `backend/app/api/routes/transactions.py` | Escrow math exists (85/15 split). |
| Step 5: React Foundation | DONE | `frontend/package.json` | Vite, Tailwind v3, Shadcn installed and configured. |
| Step 6: Dashboard UI | STUB | `frontend/src/components/farms/FarmsTable.tsx` | Visuals only. Uses hardcoded `const farms = []`. No API integration. |
| Step 7: Marketplace UI | STUB | `frontend/src/pages/BuyerMarketplace.tsx` | Visuals only. Uses hardcoded `mockBatches`. No checkout API call. |
| Step 8: Final Polish / Docker | BROKEN | `audit/run_log.md` | Docker compose brings up DB and Frontend, but Backend crashes. |
| Step 9: Explanation Document | DONE | `GROUNDWORK_EXPLANATION.md` | Present in root and correctly gitignored. |

5. WORKING FEATURES
- **Frontend UI Framework:** The React application compiles cleanly (0 errors, 1.86s). The Tailwind design system and shadcn components render beautifully.
- **Docker Orchestration (Partial):** The frontend and database containers start and network correctly.

6. BROKEN OR FAKE FEATURES
- **[CRITICAL] Backend Crash:** `ModuleNotFoundError: No module named 'psycopg'`. Cause: SQLAlchemy 2.0 `postgresql://` connection string expects `psycopg` v3, but `psycopg2-binary` was installed. 
- **[CRITICAL] Missing Database Migrations:** No `alembic` setup exists. Tables cannot be created gracefully.
- **[CRITICAL] No Frontend API Integration:** `FarmsTable.tsx`, `BatchesTable.tsx`, and `BuyerMarketplace.tsx` are 100% mocked. Clicking "Checkout" triggers a frontend state change but no network request.
- **[HIGH] Login / Register Routes:** `App.tsx` routes `/login` to `<div>Login Page</div>`. Authentication is impossible.
- **[MEDIUM] Scope 3 Matching:** The marketplace endpoint uses `CreditBatch.scope_3_region.ilike(f"%{scope_3_region}%")`. This is a basic string compare, NOT true geospatial PostGIS matching (`ST_Contains` or `ST_DWithin`).

7. MISSING FEATURES
- Registry data ingestion (Verra/Gold Standard): **Missing**. No CSV upload or API sync.
- True Scope 3 Geospatial Matcher: **Missing**.
- Escrow Trigger/Release: **Missing**. Milestones are hardcoded to "pending" with no endpoint to move funds.
- Permanence Buffer Ledger: **Missing**. The 15% is calculated per-transaction, but there is no global ledger tracking the pool.
- Credit Retirement API / PDF Certificates: **Missing**.
- Tests (Pytest / Jest): **Missing**.

8. UI/UX CRITIQUE
The UI is visually striking, using dark themes (`bg-background text-foreground dark`) and Framer Motion for micro-interactions (e.g., hovering over a credit card scales it slightly). It feels premium but falls short on UX flows.
- **Problem 1:** No global navigation bar. You must type URLs manually to switch between Dashboard and Marketplace.
- **Problem 2:** Missing authentication pages (Login/Register are just text divs).
- **Problem 3:** Mapbox canvas requires a real token; without it, the Mapbox UI fails silently or shows a grey screen (depending on Vite env cache).
- **Problem 4:** The "Checkout" dialog is beautiful and shows the 30/40/30 milestone breakdown cleanly, but lacks error states (e.g., what if I try to buy more than available?).

9. SECURITY AND QUALITY FINDINGS
- **Quality:** Code structure is clean and modular. Routers, models, and schemas are well-separated. However, the lack of a single test is concerning.
- **Security:** `SECRET_KEY` in `.env.example` is hardcoded. Passwords (if auth were working) would need standard bcrypt validation. No rate limiting or strict CORS origins are visible in the excerpts. No IDOR checks are present to stop an aggregator from reading another aggregator's farms in `farms.py` (wait, `get_farms` restricts by `current_user.id`, so IDOR is protected there).

10. DATA MODEL
No tables actually exist in the DB, but based on the SQLAlchemy models:
- **users:** id (UUID), email, hashed_password, role, created_at
- **farms:** id (UUID), aggregator_id, farmer_name, polygon (Geometry(MULTIPOLYGON, 4326)), total_hectares, crop_type
- **credit_batches:** id (UUID), aggregator_id, farm_ids (JSONB), vintage_year, available_tco2e, price_per_tonne, standard, co_benefits, scope_3_region
- **transactions:** id (UUID), buyer_id, batch_id, tonnes_purchased (Numeric), buffer_tonnes (Numeric), net_tonnes (Numeric), total_price, payment_status, milestones (JSONB).
*Deviation from spec:* Buffer allocation is stored on the transaction, but no global `buffer_pool` table exists.

11. KEY CODE EXCERPTS

**Checkout / Escrow Logic (app/api/routes/transactions.py:35-55)**
```python
    # Calculate semantics: buyer pays for T, receives 0.85T, 0.15T to buffer
    buffer_amount = round(requested_dec * Decimal("0.15"), 3)
    net_delivered = requested_dec - buffer_amount
    total_price = round(requested_dec * batch.price_per_tonne, 2)
    
    # Decrement inventory
    batch.available_tco2e -= requested_dec
    if batch.available_tco2e <= 0:
        batch.status = CreditStatus.sold_out
        
    transaction = Transaction(
        buyer_id=current_user.id,
        batch_id=batch.id,
        tonnes_purchased=requested_dec,
        buffer_tonnes=buffer_amount,
        net_tonnes=net_delivered,
        total_price=total_price,
        payment_status=PaymentStatus.partially_paid, # 30% upfront
        milestones=calculate_milestones(),
        buffer_pool_allocation=buffer_amount
    )
```

**Marketplace Filter (app/api/routes/marketplace.py:26-31)**
```python
    if co_benefits:
        benefits_list = [b.strip() for b in co_benefits.split(",")]
        # JSONB contains check using @>
        query = query.filter(CreditBatch.co_benefits.contains(benefits_list))
    if scope_3_region:
        query = query.filter(CreditBatch.scope_3_region.ilike(f"%{scope_3_region}%"))
```

**RBAC Dependency (app/api/deps.py:42-50)**
```python
def require_role(roles: List[str]):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role.value not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return current_user
    return role_checker
```

12. API REFERENCE
| Method | Path | Auth | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| POST | /api/farms | Aggregator | `{"geojson": {}, "farmer_name": "...", "total_hectares": 10, "crop_type": "..."}` | `FarmResponse` |
| GET | /api/farms | Aggregator | None | `List[FarmResponse]` |
| GET | /api/marketplace | None | Query params (vintage, standard, etc) | `List[CreditBatchResponse]` |
| POST | /api/transactions/checkout | Buyer | `{"batch_id": "uuid", "tonnes_requested": 100}` | `TransactionResponse` |

*(Note: Auth endpoints for /login and /register exist in `auth.py` but were not inspected deeply due to backend crash).*

13. TOP 15 PRIORITY FIXES
1. **Fix SQLAlchemy Driver (S):** Change DB URI to `postgresql+psycopg2://` or install `psycopg` v3.
2. **Init Alembic & Run Migrations (S):** Run `alembic init` and auto-generate schema from models.
3. **Wire Frontend to Backend (L):** Replace hardcoded `mockBatches` with `axios` or `fetch` calls to the API.
4. **Implement Global Navigation (S):** Build a top navbar routing between `/`, `/marketplace`, and `/aggregator`.
5. **Build Login/Register UI (M):** Replace placeholder divs with real Shadcn forms that save JWT to context.
6. **Implement Real Mapbox Token Handling (S):** Ensure map doesn't crash if token is missing.
7. **Fix Scope 3 Matcher (M):** Rewrite the string filter to use `ST_Contains` or `ST_DWithin` via PostGIS.
8. **Add Global Buffer Ledger (M):** Create a table to aggregate platform-wide buffer holdings.
9. **Build Admin / Milestone Trigger API (M):** Allow admins to release the 40% and 30% milestones.
10. **Write Pytest Suite (L):** Add unit tests for the complex escrow calculations.
11. **Implement Farm ID Verification (S):** Ensure an aggregator can only mint batches for farms they actually own.
12. **Add Transaction Ledger UI (M):** Let buyers see their past purchases and certificates.
13. **Handle Checkout Race Conditions (M):** Improve `with_for_update()` transaction handling to gracefully reject simultaneous buys.
14. **CORS / Security Polish (S):** Lock down Origins and add basic rate limiting.
15. **Add Error States to UI (M):** Show toast notifications when checkout fails.

14. OPEN QUESTIONS
- **Mapbox Token:** The `.env.example` has a fake Mapbox token. How do you want to handle the map fallback if a token is not provided?
- **Buffer Pool Ownership:** Does the platform own the 15% buffer pool, or is it legally held in trust? This dictates how the ledger should be architected.
