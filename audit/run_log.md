# Run Log

## docker compose up --build
Started successfully.
PostGIS container started.
Frontend container started.
Backend container exited immediately with code 1.

## Backend Logs (`docker logs groundwork-backend-1`)
```
Traceback (most recent call last):
  ...
  File "/usr/local/lib/python3.11/site-packages/sqlalchemy/dialects/postgresql/psycopg.py", line 497, in import_dbapi
    import psycopg
ModuleNotFoundError: No module named 'psycopg'
```
**Blocker**: The `psycopg2-binary` package was installed, but the connection string `postgresql://...` in SQLAlchemy 2.0 defaults to `psycopg` (v3). Since `psycopg` is missing, the API crashes on startup. 

## Alembic Migrations
**Blocker**: Alembic was never initialized (`alembic init`). There is no `alembic.ini` and no migration scripts exist. Thus, the schema cannot be created in the database. 

## Backend Tests
Ran `pytest` in backend:
`collected 0 items`
**Result**: No tests exist.

## Frontend Build
Ran `npm run build`.
**Result**: Successfully built in 1.86s. No errors. Tailwind downgrade to v3 was successful.

## Frontend E2E Flows
Since there is no navigation bar, routes must be accessed directly via URL.
The backend API is dead, so we cannot test actual data fetching.
However, the components use hardcoded `mockBatches` and `farms` variables, so they do render the design mockups.
