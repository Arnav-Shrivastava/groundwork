import asyncio
import uuid
from decimal import Decimal
from datetime import datetime, timezone
from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.models.region import Region
from app.models.farm import Farm
from app.models.credit_batch import CreditBatch, CreditStandard, CreditStatus, DeliveryType
from app.models.transaction import Transaction, PaymentStatus
from app.models.buffer_ledger import BufferLedger, BufferStatus
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    
    # 1. Users
    admin = User(
        email="admin@groundwork.earth",
        hashed_password=get_password_hash("Admin@123"),
        company_name="GroundWork",
        role=UserRole.admin
    )
    aggregator = User(
        email="aggregator@agrocorp.com",
        hashed_password=get_password_hash("Aggregator@123"),
        company_name="AgroCorp",
        role=UserRole.aggregator
    )
    buyer = User(
        email="buyer@megacorp.com",
        hashed_password=get_password_hash("Buyer@123"),
        company_name="MegaCorp",
        role=UserRole.buyer
    )
    
    db.add(admin)
    db.add(aggregator)
    db.add(buyer)
    db.flush()

    # 2. Region
    brazil_region = Region(
        name="Brazil (Cerrado)",
        geometry="SRID=4326;MULTIPOLYGON(((-60 -10, -60 -20, -50 -20, -50 -10, -60 -10)))"
    )
    db.add(brazil_region)
    db.flush()

    # 3. Farms
    farm1 = Farm(
        aggregator_id=aggregator.id,
        farmer_name="Joao Silva",
        polygon="SRID=4326;MULTIPOLYGON(((-55 -15, -55 -16, -54 -16, -54 -15, -55 -15)))",
        total_hectares=150.5,
        crop_type="Soybeans"
    )
    db.add(farm1)
    db.flush()

    # 4. Credit Batches
    # Issued Batch
    batch_issued = CreditBatch(
        aggregator_id=aggregator.id,
        farm_ids=[farm1.id],
        standard=CreditStandard.verra,
        delivery_type=DeliveryType.issued,
        vintage_year="2023",
        total_tco2e=Decimal("1000.000"),
        available_tco2e=Decimal("1000.000"),
        price_per_tonne=Decimal("25.00"),
        status=CreditStatus.listed,
        co_benefits=["Biodiversity", "Water Conservation"],
        scope_3_region=brazil_region.name,
        registry_serial_id="VERRA-2023-12345"
    )
    
    # Forward Batch
    batch_forward = CreditBatch(
        aggregator_id=aggregator.id,
        farm_ids=[farm1.id],
        standard=CreditStandard.gold_standard,
        delivery_type=DeliveryType.forward,
        vintage_year="2025",
        total_tco2e=Decimal("5000.000"),
        available_tco2e=Decimal("5000.000"),
        price_per_tonne=Decimal("18.50"),
        status=CreditStatus.listed,
        co_benefits=["Soil Health", "Community"],
        scope_3_region=brazil_region.name,
        registry_serial_id=None
    )
    
    db.add(batch_issued)
    db.add(batch_forward)
    db.commit()

    print("Seed data inserted successfully!")

if __name__ == "__main__":
    seed_db()
