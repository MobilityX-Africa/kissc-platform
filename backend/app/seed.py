"""Seed database with data mirroring the frontend localStorage fixtures."""
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import select

from app.database import async_session
from app.models.operations import OpsBike, OpsBattery, OpsSwapStation, OpsRider
from app.models.spv import (
    SpvBike, SpvBattery, SpvSwapBox, SpvVehicle, CapitalAllocator,
    spv_vehicle_bikes, spv_vehicle_batteries, spv_vehicle_swap_boxes,
)
from app.models.settlement import Transaction, SpvLedger


async def seed_all():
    async with async_session() as db:
        # Check if already seeded
        existing = await db.execute(select(OpsBike).limit(1))
        if existing.scalar_one_or_none() is not None:
            print("Database already seeded — skipping.")
            return

        print("Seeding database...")

        # ── Operations: Bikes ────────────────────────────────
        ops_bikes = [
            OpsBike(id="OPS-BK-001", registration_number="KMFX 123A", model="Spiro Gen3", status="in-use", current_rider_id="OPS-RD-001", current_battery_id="OPS-BAT-001", total_km=12450, last_service_date="2025-01-10"),
            OpsBike(id="OPS-BK-002", registration_number="KMFX 456B", model="Spiro Gen3", status="available", current_rider_id=None, current_battery_id="OPS-BAT-002", total_km=8920, last_service_date="2025-01-15"),
            OpsBike(id="OPS-BK-003", registration_number="KMFX 789C", model="Roam Air", status="maintenance", current_rider_id=None, current_battery_id=None, total_km=21300, last_service_date="2024-12-20"),
            OpsBike(id="OPS-BK-004", registration_number="KMFX 012D", model="Roam Air", status="in-use", current_rider_id="OPS-RD-004", current_battery_id="OPS-BAT-003", total_km=15780, last_service_date="2025-01-08"),
            OpsBike(id="OPS-BK-005", registration_number="KMFX 345E", model="Spiro Gen2", status="retired", current_rider_id=None, current_battery_id=None, total_km=45200, last_service_date="2024-11-30"),
            OpsBike(id="OPS-BK-006", registration_number="KMFX 678F", model="Spear EV-200", status="in-use", current_rider_id="OPS-RD-002", current_battery_id="OPS-BAT-004", total_km=9340, last_service_date="2025-02-01"),
            OpsBike(id="OPS-BK-007", registration_number="KMFX 901G", model="Spiro Gen3", status="available", current_rider_id=None, current_battery_id="OPS-BAT-005", total_km=3200, last_service_date="2025-01-28"),
            OpsBike(id="OPS-BK-008", registration_number="KMFX 234H", model="Roam Air", status="in-use", current_rider_id="OPS-RD-005", current_battery_id="OPS-BAT-006", total_km=18950, last_service_date="2025-01-20"),
        ]
        db.add_all(ops_bikes)

        # ── Operations: Batteries ────────────────────────────
        ops_batteries = [
            OpsBattery(id="OPS-BAT-001", serial_number="KSC-BAT-2024-0042", capacity_kwh=2.4, state_of_health=94, current_charge=78, status="in-use", cycle_count=245, current_location="Bike KMFX 123A"),
            OpsBattery(id="OPS-BAT-002", serial_number="KSC-BAT-2024-0087", capacity_kwh=2.4, state_of_health=88, current_charge=100, status="available", cycle_count=412, current_location="Westlands Hub"),
            OpsBattery(id="OPS-BAT-003", serial_number="KSC-BAT-2024-0103", capacity_kwh=3.0, state_of_health=97, current_charge=45, status="in-use", cycle_count=89, current_location="Bike KMFX 012D"),
            OpsBattery(id="OPS-BAT-004", serial_number="KSC-BAT-2024-0156", capacity_kwh=2.4, state_of_health=72, current_charge=62, status="charging", cycle_count=678, current_location="CBD Central"),
            OpsBattery(id="OPS-BAT-005", serial_number="KSC-BAT-2023-0201", capacity_kwh=2.0, state_of_health=45, current_charge=0, status="retired", cycle_count=1200, current_location="Warehouse"),
            OpsBattery(id="OPS-BAT-006", serial_number="KSC-BAT-2024-0278", capacity_kwh=3.0, state_of_health=91, current_charge=33, status="in-use", cycle_count=156, current_location="Bike KMFX 234H"),
            OpsBattery(id="OPS-BAT-007", serial_number="KSC-BAT-2024-0312", capacity_kwh=2.4, state_of_health=85, current_charge=100, status="available", cycle_count=502, current_location="Kilimani Point"),
            OpsBattery(id="OPS-BAT-008", serial_number="KSC-BAT-2024-0345", capacity_kwh=2.4, state_of_health=80, current_charge=15, status="charging", cycle_count=610, current_location="Westlands Hub"),
        ]
        db.add_all(ops_batteries)

        # ── Operations: Swap Stations ────────────────────────
        ops_stations = [
            OpsSwapStation(id="OPS-SS-001", name="Westlands Hub", address="Westlands Rd, Nairobi", lat=-1.2673, lng=36.8112, total_slots=20, available_batteries=12, charging_batteries=5, empty_slots=3, status="online", operating_hours="06:00 - 22:00"),
            OpsSwapStation(id="OPS-SS-002", name="CBD Central", address="Kenyatta Ave, Nairobi", lat=-1.2864, lng=36.8172, total_slots=30, available_batteries=18, charging_batteries=8, empty_slots=4, status="online", operating_hours="05:00 - 23:00"),
            OpsSwapStation(id="OPS-SS-003", name="Kilimani Point", address="Argwings Kodhek Rd, Nairobi", lat=-1.2923, lng=36.7852, total_slots=15, available_batteries=2, charging_batteries=10, empty_slots=3, status="online", operating_hours="06:00 - 21:00"),
            OpsSwapStation(id="OPS-SS-004", name="Eastleigh Depot", address="1st Avenue, Eastleigh", lat=-1.2741, lng=36.8456, total_slots=12, available_batteries=0, charging_batteries=0, empty_slots=12, status="offline", operating_hours="06:00 - 20:00"),
            OpsSwapStation(id="OPS-SS-005", name="Karen Gateway", address="Karen Rd, Nairobi", lat=-1.3197, lng=36.7112, total_slots=10, available_batteries=6, charging_batteries=2, empty_slots=2, status="online", operating_hours="07:00 - 20:00"),
            OpsSwapStation(id="OPS-SS-006", name="South B Depot", address="Mombasa Rd, South B", lat=-1.3102, lng=36.8345, total_slots=18, available_batteries=10, charging_batteries=4, empty_slots=4, status="maintenance", operating_hours="06:00 - 21:00"),
        ]
        db.add_all(ops_stations)

        # ── Operations: Riders ───────────────────────────────
        ops_riders = [
            OpsRider(id="OPS-RD-001", name="James Mwangi", phone="+254 712 345 678", email="james.mwangi@email.com", status="active", assigned_bike_id="OPS-BK-001", total_trips=342, joined_at="2024-03-15"),
            OpsRider(id="OPS-RD-002", name="Grace Wanjiku", phone="+254 723 456 789", email="grace.wanjiku@email.com", status="active", assigned_bike_id="OPS-BK-006", total_trips=287, joined_at="2024-04-02"),
            OpsRider(id="OPS-RD-003", name="Peter Ochieng", phone="+254 734 567 890", email="peter.ochieng@email.com", status="inactive", assigned_bike_id=None, total_trips=156, joined_at="2024-05-20"),
            OpsRider(id="OPS-RD-004", name="Amina Hassan", phone="+254 745 678 901", email="amina.hassan@email.com", status="active", assigned_bike_id="OPS-BK-004", total_trips=421, joined_at="2024-02-10"),
            OpsRider(id="OPS-RD-005", name="David Kamau", phone="+254 756 789 012", email="david.kamau@email.com", status="active", assigned_bike_id="OPS-BK-008", total_trips=512, joined_at="2024-01-15"),
            OpsRider(id="OPS-RD-006", name="Faith Njeri", phone="+254 767 890 123", email="faith.njeri@email.com", status="suspended", assigned_bike_id=None, total_trips=89, joined_at="2024-07-01"),
            OpsRider(id="OPS-RD-007", name="Brian Otieno", phone="+254 778 901 234", email="brian.otieno@email.com", status="active", assigned_bike_id=None, total_trips=203, joined_at="2024-06-10"),
            OpsRider(id="OPS-RD-008", name="Lucy Wambui", phone="+254 789 012 345", email="lucy.wambui@email.com", status="active", assigned_bike_id=None, total_trips=178, joined_at="2024-08-20"),
        ]
        db.add_all(ops_riders)

        # ── SPV: Bikes ───────────────────────────────────────
        spv_bikes = [
            SpvBike(id="SPV-BK-001", asset_tag="MX-EBK-2024-0001", model="Spear Bodaboda EV-200", status="active", frame_number="FR-SBE-24-00142", motor_power_w=2000, battery_capacity_ah=60, max_range_km=80, assigned_rider="James Mwangi", km_per_day=45, km_per_week=280, km_per_month=1120, km_total=8960, trips_per_day=12, trips_per_week=72, trips_per_month=288, trips_total=2304, purchase_cost_usd=1423, monthly_lease_usd=96, total_paid_usd=769, outstanding_usd=654, payments_made=8, payments_total=18, revenue_to_date_usd=1206, created_at="2024-06-15T10:00:00Z"),
            SpvBike(id="SPV-BK-002", asset_tag="MX-EBK-2024-0002", model="Spear Bodaboda EV-200", status="active", frame_number="FR-SBE-24-00287", motor_power_w=2000, battery_capacity_ah=60, max_range_km=80, assigned_rider="Grace Wanjiku", km_per_day=52, km_per_week=320, km_per_month=1280, km_total=10240, trips_per_day=15, trips_per_week=90, trips_per_month=360, trips_total=2880, purchase_cost_usd=1423, monthly_lease_usd=96, total_paid_usd=962, outstanding_usd=462, payments_made=10, payments_total=18, revenue_to_date_usd=1477, created_at="2024-04-20T10:00:00Z"),
            SpvBike(id="SPV-BK-003", asset_tag="MX-EBK-2024-0003", model="Roam Air", status="maintenance", frame_number="FR-RA-24-00089", motor_power_w=3000, battery_capacity_ah=72, max_range_km=100, assigned_rider="Peter Ochieng", km_per_day=0, km_per_week=0, km_per_month=420, km_total=6300, trips_per_day=0, trips_per_week=0, trips_per_month=112, trips_total=1680, purchase_cost_usd=1885, monthly_lease_usd=123, total_paid_usd=492, outstanding_usd=1392, payments_made=4, payments_total=18, revenue_to_date_usd=678, created_at="2024-09-01T10:00:00Z"),
        ]
        db.add_all(spv_bikes)

        # ── SPV: Batteries ───────────────────────────────────
        spv_batteries = [
            SpvBattery(id="SPV-BAT-001", serial_number="KSC-BAT-2024-1001", model="LFP-60Ah-48V", status="active", capacity_kwh=2.88, nominal_voltage=48, chemistry="LiFePO4", max_cycles=2000, current_soh=94, cycles_used=320, swaps_per_day=3, swaps_per_week=18, swaps_per_month=72, swaps_total=640, last_swap_date="2025-02-09T08:30:00Z", current_location="Westlands Hub", purchase_cost_usd=323, revenue_per_swap_usd=0.92, total_revenue_usd=591, maintenance_cost_usd=25, break_even_swaps=350, created_at="2024-05-10T10:00:00Z"),
            SpvBattery(id="SPV-BAT-002", serial_number="KSC-BAT-2024-1002", model="LFP-60Ah-48V", status="active", capacity_kwh=2.88, nominal_voltage=48, chemistry="LiFePO4", max_cycles=2000, current_soh=88, cycles_used=580, swaps_per_day=4, swaps_per_week=24, swaps_per_month=96, swaps_total=1120, last_swap_date="2025-02-09T09:15:00Z", current_location="CBD Central", purchase_cost_usd=323, revenue_per_swap_usd=0.92, total_revenue_usd=1034, maintenance_cost_usd=52, break_even_swaps=350, created_at="2024-03-15T10:00:00Z"),
            SpvBattery(id="SPV-BAT-003", serial_number="KSC-BAT-2024-1003", model="NMC-72Ah-48V", status="inactive", capacity_kwh=3.46, nominal_voltage=48, chemistry="NMC", max_cycles=1500, current_soh=72, cycles_used=1050, swaps_per_day=0, swaps_per_week=0, swaps_per_month=0, swaps_total=1890, last_swap_date="2025-01-20T14:00:00Z", current_location="Warehouse - Ruiru", purchase_cost_usd=423, revenue_per_swap_usd=0.92, total_revenue_usd=1745, maintenance_cost_usd=96, break_even_swaps=458, created_at="2023-11-01T10:00:00Z"),
        ]
        db.add_all(spv_batteries)

        # ── SPV: Swap Boxes ──────────────────────────────────
        spv_swap_boxes = [
            SpvSwapBox(id="SPV-SB-001", station_id="SS-001", name="Westlands Hub", status="active", total_slots=12, solar_capacity_w=2000, grid_connected=True, location="Westlands, Nairobi", latitude=-1.2635, longitude=36.8029, swaps_per_day=48, swaps_per_week=312, swaps_per_month=1248, swaps_total=11232, avg_slot_utilization=78, operational_days=270, install_cost_usd=6538, monthly_opex_usd=269, revenue_per_swap_usd=0.92, total_revenue_usd=10368, total_cost_usd=9192, payback_progress_pct=88, created_at="2024-02-01T10:00:00Z"),
            SpvSwapBox(id="SPV-SB-002", station_id="SS-005", name="CBD Central", status="active", total_slots=16, solar_capacity_w=3000, grid_connected=True, location="CBD, Nairobi", latitude=-1.2833, longitude=36.8172, swaps_per_day=62, swaps_per_week=400, swaps_per_month=1600, swaps_total=14400, avg_slot_utilization=84, operational_days=300, install_cost_usd=8462, monthly_opex_usd=323, revenue_per_swap_usd=0.92, total_revenue_usd=13292, total_cost_usd=11692, payback_progress_pct=95, created_at="2024-01-10T10:00:00Z"),
        ]
        db.add_all(spv_swap_boxes)

        # ── SPV: Vehicles ────────────────────────────────────
        spv_vehicles = [
            SpvVehicle(
                id="SPV-VH-001", name="Nairobi 1 EV Fleet SPV", city="Nairobi", country="KEN",
                status="active", target_amount_usd=15385, raised_amount_usd=13846,
                created_at="2024-03-01T10:00:00Z",
                # Asset types
                includes_bikes=True, includes_batteries=True, includes_swap_stations=True,
                # Unit economics
                bike_price_usd=1423, battery_price_usd=323, swap_station_price_usd=6538,
                # Insurance
                insurance_cost_per_battery_usd=2.50, insurance_cost_per_station_usd=25.00,
                # Replacement
                battery_replacement_cost_usd=120.00,
                # Waterfall split
                waterfall_finance_pct=70.0, waterfall_operator_pct=20.0, waterfall_mobilityx_pct=10.0,
                # Operator
                local_operator_name="Guardian Mobility Kenya",
                # Financing
                months_to_payback=36, interest_rate_pct=8.5, interest_coverage_ratio=1.75,
                # Dates
                inception_date="2024-03-01", maturity_date="2027-03-01",
                # Deployment
                bikes_deployed=2, batteries_deployed=2, stations_deployed=1,
                # Performance
                total_revenue_collected_usd=12165, current_icr=1.82,
                # Investors JSON
                investors_json='[{"name":"Amani Capital Partners","commitmentUSD":7692,"equityPct":55.56,"investorType":"DFI"},{"name":"Green Mobility Fund","commitmentUSD":3846,"equityPct":27.78,"investorType":"Private Equity"},{"name":"Wanjiku Angel Investor","commitmentUSD":2308,"equityPct":16.67,"investorType":"Angel"}]',
            ),
            SpvVehicle(
                id="SPV-VH-002", name="Nairobi 2 Infrastructure SPV", city="Nairobi", country="KEN",
                status="raising", target_amount_usd=23077, raised_amount_usd=9231,
                created_at="2024-08-15T10:00:00Z",
                # Asset types
                includes_bikes=True, includes_batteries=True, includes_swap_stations=True,
                # Unit economics
                bike_price_usd=1885, battery_price_usd=423, swap_station_price_usd=8462,
                # Insurance
                insurance_cost_per_battery_usd=3.00, insurance_cost_per_station_usd=30.00,
                # Replacement
                battery_replacement_cost_usd=150.00,
                # Waterfall split
                waterfall_finance_pct=65.0, waterfall_operator_pct=30.0, waterfall_mobilityx_pct=5.0,
                # Operator
                local_operator_name="EcoRide Nairobi Ltd",
                # Financing
                months_to_payback=48, interest_rate_pct=9.0, interest_coverage_ratio=1.5,
                # Dates
                inception_date="2024-08-15", maturity_date="2028-08-15",
                # Deployment
                bikes_deployed=1, batteries_deployed=1, stations_deployed=1,
                # Performance
                total_revenue_collected_usd=15715, current_icr=1.45,
                # Investors JSON
                investors_json='[{"name":"Impact Africa Ventures","commitmentUSD":6154,"equityPct":66.67,"investorType":"Corporate VC"},{"name":"Ochieng Family Office","commitmentUSD":3077,"equityPct":33.33,"investorType":"Family Office"}]',
            ),
        ]
        db.add_all(spv_vehicles)
        await db.flush()

        # Link assets to vehicles via M2M
        vehicle_links = [
            # SPV-VH-001 → 2 bikes, 2 batteries, 1 swap box
            (spv_vehicle_bikes, {"vehicle_id": "SPV-VH-001", "bike_id": "SPV-BK-001"}),
            (spv_vehicle_bikes, {"vehicle_id": "SPV-VH-001", "bike_id": "SPV-BK-002"}),
            (spv_vehicle_batteries, {"vehicle_id": "SPV-VH-001", "battery_id": "SPV-BAT-001"}),
            (spv_vehicle_batteries, {"vehicle_id": "SPV-VH-001", "battery_id": "SPV-BAT-002"}),
            (spv_vehicle_swap_boxes, {"vehicle_id": "SPV-VH-001", "swap_box_id": "SPV-SB-001"}),
            # SPV-VH-002 → 1 bike, 1 battery, 1 swap box
            (spv_vehicle_bikes, {"vehicle_id": "SPV-VH-002", "bike_id": "SPV-BK-003"}),
            (spv_vehicle_batteries, {"vehicle_id": "SPV-VH-002", "battery_id": "SPV-BAT-003"}),
            (spv_vehicle_swap_boxes, {"vehicle_id": "SPV-VH-002", "swap_box_id": "SPV-SB-002"}),
        ]
        for table, values in vehicle_links:
            await db.execute(table.insert().values(**values))

        # ── Capital Allocators ───────────────────────────────
        allocators = [
            CapitalAllocator(id="CA-001", spv_id="SPV-VH-001", name="Amani Capital Partners", email="invest@amanicapital.co.ke", invested_amount_usd=7692, ownership_pct=55.56, total_returned_usd=3231, created_at="2024-03-05T10:00:00Z"),
            CapitalAllocator(id="CA-002", spv_id="SPV-VH-001", name="Green Mobility Fund", email="admin@greenmobility.fund", invested_amount_usd=3846, ownership_pct=27.78, total_returned_usd=1615, created_at="2024-03-10T10:00:00Z"),
            CapitalAllocator(id="CA-003", spv_id="SPV-VH-001", name="Wanjiku Angel Investor", email="wanjiku@gmail.com", invested_amount_usd=2308, ownership_pct=16.67, total_returned_usd=969, created_at="2024-03-15T10:00:00Z"),
            CapitalAllocator(id="CA-004", spv_id="SPV-VH-002", name="Impact Africa Ventures", email="deals@impactafrica.vc", invested_amount_usd=6154, ownership_pct=66.67, total_returned_usd=654, created_at="2024-09-01T10:00:00Z"),
            CapitalAllocator(id="CA-005", spv_id="SPV-VH-002", name="Ochieng Family Office", email="peter.o@familyoffice.co.ke", invested_amount_usd=3077, ownership_pct=33.33, total_returned_usd=327, created_at="2024-09-05T10:00:00Z"),
        ]
        db.add_all(allocators)

        # ── Sample Transactions (10) ─────────────────────────
        sample_txns = [
            Transaction(tx_id=str(uuid.uuid4()), rider_id="OPS-RD-001", asset_id="OPS-BK-001", tx_type="lease_payment", gross_amount=96.15, local_currency="USD", local_amount=96.15, split_spv=67.31, split_operator=24.04, split_mobilityx=4.81, payment_gateway="mpesa", payment_reference="QK7F2X1ABC", settlement_status="settled", idempotency_key="seed-tx-001", timestamp=datetime(2025, 1, 15, 8, 30)),
            Transaction(tx_id=str(uuid.uuid4()), rider_id="OPS-RD-002", asset_id="OPS-BK-006", tx_type="lease_payment", gross_amount=96.15, local_currency="USD", local_amount=96.15, split_spv=67.31, split_operator=24.04, split_mobilityx=4.81, payment_gateway="mpesa", payment_reference="QK7F2X2DEF", settlement_status="settled", idempotency_key="seed-tx-002", timestamp=datetime(2025, 1, 15, 9, 15)),
            Transaction(tx_id=str(uuid.uuid4()), rider_id="OPS-RD-004", asset_id="OPS-BK-004", tx_type="lease_payment", gross_amount=123.08, local_currency="USD", local_amount=123.08, split_spv=86.15, split_operator=30.77, split_mobilityx=6.15, payment_gateway="mpesa", payment_reference="QK7F2X3GHI", settlement_status="settled", idempotency_key="seed-tx-003", timestamp=datetime(2025, 1, 16, 7, 45)),
            Transaction(tx_id=str(uuid.uuid4()), rider_id="OPS-RD-005", asset_id="OPS-BK-008", tx_type="lease_payment", gross_amount=96.15, local_currency="USD", local_amount=96.15, split_spv=67.31, split_operator=24.04, split_mobilityx=4.81, payment_gateway="mpesa", payment_reference="QK7F2X4JKL", settlement_status="settled", idempotency_key="seed-tx-004", timestamp=datetime(2025, 1, 17, 10, 0)),
            Transaction(tx_id=str(uuid.uuid4()), rider_id="OPS-RD-001", asset_id="SPV-BAT-001", tx_type="swap_fee", gross_amount=0.92, local_currency="USD", local_amount=0.92, split_spv=0.65, split_operator=0.23, split_mobilityx=0.05, payment_gateway="mpesa", payment_reference="QK7SWP001", settlement_status="settled", idempotency_key="seed-tx-005", timestamp=datetime(2025, 1, 18, 6, 30)),
            Transaction(tx_id=str(uuid.uuid4()), rider_id="OPS-RD-002", asset_id="SPV-BAT-002", tx_type="swap_fee", gross_amount=0.92, local_currency="USD", local_amount=0.92, split_spv=0.65, split_operator=0.23, split_mobilityx=0.05, payment_gateway="mpesa", payment_reference="QK7SWP002", settlement_status="settled", idempotency_key="seed-tx-006", timestamp=datetime(2025, 1, 19, 8, 0)),
            Transaction(tx_id=str(uuid.uuid4()), rider_id="OPS-RD-004", asset_id="SPV-BAT-001", tx_type="swap_fee", gross_amount=0.92, local_currency="USD", local_amount=0.92, split_spv=0.65, split_operator=0.23, split_mobilityx=0.05, payment_gateway="mpesa", payment_reference="QK7SWP003", settlement_status="settled", idempotency_key="seed-tx-007", timestamp=datetime(2025, 1, 20, 7, 15)),
            Transaction(tx_id=str(uuid.uuid4()), rider_id="OPS-RD-005", asset_id="SPV-BAT-002", tx_type="swap_fee", gross_amount=0.92, local_currency="USD", local_amount=0.92, split_spv=0.65, split_operator=0.23, split_mobilityx=0.05, payment_gateway="mpesa", payment_reference="QK7SWP004", settlement_status="settled", idempotency_key="seed-tx-008", timestamp=datetime(2025, 1, 21, 9, 30)),
            Transaction(tx_id=str(uuid.uuid4()), rider_id="OPS-RD-001", asset_id="OPS-BK-001", tx_type="deposit", gross_amount=38.46, local_currency="USD", local_amount=38.46, split_spv=26.92, split_operator=9.62, split_mobilityx=1.92, payment_gateway="mpesa", payment_reference="QK7DEP001", settlement_status="settled", idempotency_key="seed-tx-009", timestamp=datetime(2025, 1, 22, 11, 0)),
            Transaction(tx_id=str(uuid.uuid4()), rider_id="OPS-RD-006", asset_id=None, tx_type="penalty", gross_amount=15.38, local_currency="USD", local_amount=15.38, split_spv=10.77, split_operator=3.85, split_mobilityx=0.77, payment_gateway="manual", payment_reference="PEN-FAITH-001", settlement_status="settled", idempotency_key="seed-tx-010", timestamp=datetime(2025, 1, 25, 14, 0)),
        ]
        db.add_all(sample_txns)

        await db.commit()
        print(f"Seeded: {len(ops_bikes)} bikes, {len(ops_batteries)} batteries, {len(ops_stations)} stations, {len(ops_riders)} riders")
        print(f"Seeded: {len(spv_bikes)} SPV bikes, {len(spv_batteries)} SPV batteries, {len(spv_swap_boxes)} SPV swap boxes")
        print(f"Seeded: {len(spv_vehicles)} SPV vehicles, {len(allocators)} allocators, {len(sample_txns)} transactions")
