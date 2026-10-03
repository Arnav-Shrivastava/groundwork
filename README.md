# GroundWork: Agricultural Carbon Credit OS

GroundWork is a next-gen B2B SaaS platform that connects agricultural cooperatives (Aggregators) with Corporate Buyers for high-integrity carbon credits and Scope 3 insetting.

## Tech Stack
- **Backend:** Python, FastAPI, SQLAlchemy, Alembic
- **Database:** PostgreSQL with PostGIS (for geospatial tracking)
- **Frontend:** React, Vite, Tailwind CSS, shadcn/ui, Mapbox GL JS, Framer Motion
- **Infra:** Docker & Docker Compose

## Quick Start (Docker)

1. Clone the repository.
2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
3. Run the stack:
   ```bash
   docker-compose up --build
   ```
4. Access the platforms:
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API Docs:** [http://localhost:8000/api/openapi.json](http://localhost:8000/api/openapi.json)

## Features
- **Supplier Dashboard:** Farm mapping via Mapbox and GeoJSON, and credit batch management.
- **Buyer Marketplace:** Scope 3 geospatial matching, vintage/price filtering.
- **Escrow Forward-Financing:** Checkout flow simulating a 3-stage milestone payout (30% upfront / 40% mid-season / 30% MRV issuance) with a 15% permanence buffer pool.
