import time
import uuid
from typing import Optional

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import (
    ItineraryResponse,
    TripRequest,
    Expense,
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseListResponse,
    BalanceEntry,
    SettlementEntry,
    SettlementResponse,
)

app = FastAPI(title="Voyago API", version="0.2.0")

# Allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Exchange-rate cache ───────────────────────────────────────────────────────
# { "USD": ({"EUR": 0.92, "JPY": 149.5, ...}, timestamp) }
_rate_cache: dict[str, tuple[dict, float]] = {}
RATE_TTL = 3600  # refresh rates at most once per hour

# ── In-memory expense store ──────────────────────────────────────────────────
# Structure: { trip_id: { expense_id: Expense } }
_expense_store: dict[str, dict[str, Expense]] = {}


def _get_trip_expenses(trip_id: str) -> dict[str, Expense]:
    return _expense_store.setdefault(trip_id, {})


# ── Health ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}


# ── Exchange rates ───────────────────────────────────────────────────────────

@app.get("/api/exchange-rates/{base_currency}")
async def get_exchange_rates(base_currency: str):
    """
    Return exchange rates relative to base_currency using open.er-api.com.
    Rates are cached for RATE_TTL seconds to avoid hammering the free API.
    Response: { "base": "USD", "rates": { "EUR": 0.92, "JPY": 149.5, ... } }
    """
    base = base_currency.upper()
    now = time.time()

    # Serve from cache if still fresh
    if base in _rate_cache:
        rates, cached_at = _rate_cache[base]
        if now - cached_at < RATE_TTL:
            return {"base": base, "rates": rates, "cached": True}

    # Fetch live rates from open.er-api.com (free, no API key required)
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            resp = await client.get(f"https://open.er-api.com/v6/latest/{base}")
            if resp.status_code == 200:
                data = resp.json()
                rates = data.get("rates", {})
                _rate_cache[base] = (rates, now)
                return {"base": base, "rates": rates, "cached": False}
    except Exception:
        pass

    # If live fetch fails, return cached rates even if stale
    if base in _rate_cache:
        rates, _ = _rate_cache[base]
        return {"base": base, "rates": rates, "cached": True, "stale": True}

    raise HTTPException(status_code=502, detail="Could not fetch exchange rates")


# ── Itinerary generation ─────────────────────────────────────────────────────

@app.post("/api/generate-itinerary", response_model=ItineraryResponse)
async def create_itinerary(trip: TripRequest):
    try:
        from agent import generate_trip_itinerary  # lazy import — requires GOOGLE_API_KEY
        result = await generate_trip_itinerary(trip)
        return result
    except ImportError as e:
        raise HTTPException(status_code=503, detail=f"AI agent unavailable: {e}")
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Expense CRUD ─────────────────────────────────────────────────────────────

@app.get("/api/trips/{trip_id}/expenses", response_model=ExpenseListResponse)
def list_expenses(
    trip_id: str,
    category: Optional[str] = None,
    settled: Optional[bool] = None,
):
    """Return all expenses for a trip, with optional filters."""
    store = _get_trip_expenses(trip_id)
    expenses = list(store.values())

    if category is not None:
        expenses = [e for e in expenses if e.category == category]
    if settled is not None:
        expenses = [e for e in expenses if e.settled == settled]

    # Sort by date descending
    expenses.sort(key=lambda e: e.date, reverse=True)

    return ExpenseListResponse(
        expenses=expenses,
        total_spent=sum(e.amount for e in expenses),
        count=len(expenses),
    )


@app.post("/api/trips/{trip_id}/expenses", response_model=Expense, status_code=201)
def create_expense(trip_id: str, body: ExpenseCreate):
    """Add a new expense to a trip."""
    if body.trip_id != trip_id:
        raise HTTPException(
            status_code=422,
            detail="trip_id in body must match the URL path parameter",
        )

    expense_id = str(uuid.uuid4())
    expense = Expense(**body.model_dump(), id=expense_id, settled=False)
    _get_trip_expenses(trip_id)[expense_id] = expense
    return expense


@app.patch("/api/trips/{trip_id}/expenses/{expense_id}", response_model=Expense)
def update_expense(trip_id: str, expense_id: str, body: ExpenseUpdate):
    """Partially update an expense (e.g. mark as settled, edit amount)."""
    store = _get_trip_expenses(trip_id)
    if expense_id not in store:
        raise HTTPException(status_code=404, detail="Expense not found")

    existing = store[expense_id]
    updates = body.model_dump(exclude_unset=True)
    updated = existing.model_copy(update=updates)
    store[expense_id] = updated
    return updated


@app.delete("/api/trips/{trip_id}/expenses/{expense_id}", status_code=204)
def delete_expense(trip_id: str, expense_id: str):
    """Delete an expense."""
    store = _get_trip_expenses(trip_id)
    if expense_id not in store:
        raise HTTPException(status_code=404, detail="Expense not found")
    del store[expense_id]


# ── Settlement calculation ───────────────────────────────────────────────────

@app.get("/api/trips/{trip_id}/settlement", response_model=SettlementResponse)
def get_settlement(trip_id: str):
    """
    Calculate who owes whom for a trip.
    Only unsettled expenses are included.
    Uses a greedy algorithm to minimise the number of transactions.
    """
    store = _get_trip_expenses(trip_id)
    unsettled = [e for e in store.values() if not e.settled]

    # ── Build balance map ─────────────────────────────────────────────────
    balances: dict[str, float] = {}

    for expense in unsettled:
        if expense.split_type == "equal":
            share = expense.amount / len(expense.split_among)
            balances[expense.paid_by] = balances.get(expense.paid_by, 0.0) + expense.amount
            for mid in expense.split_among:
                balances[mid] = balances.get(mid, 0.0) - share

        elif expense.split_type == "custom" and expense.custom_splits:
            balances[expense.paid_by] = balances.get(expense.paid_by, 0.0) + expense.amount
            for mid, amt in expense.custom_splits.items():
                balances[mid] = balances.get(mid, 0.0) - amt

        elif expense.split_type == "percentage" and expense.custom_splits:
            balances[expense.paid_by] = balances.get(expense.paid_by, 0.0) + expense.amount
            for mid, pct in expense.custom_splits.items():
                balances[mid] = balances.get(mid, 0.0) - (expense.amount * pct / 100)

    # ── Greedy settlement ─────────────────────────────────────────────────
    creditors = sorted(
        [(mid, bal) for mid, bal in balances.items() if bal > 0.01],
        key=lambda x: -x[1],
    )
    debtors = sorted(
        [(mid, bal) for mid, bal in balances.items() if bal < -0.01],
        key=lambda x: x[1],
    )

    # Convert to mutable lists
    creditors = [[mid, bal] for mid, bal in creditors]
    debtors   = [[mid, bal] for mid, bal in debtors]

    settlements: list[SettlementEntry] = []
    i, j = 0, 0
    while i < len(creditors) and j < len(debtors):
        amount = min(creditors[i][1], abs(debtors[j][1]))
        settlements.append(
            SettlementEntry(
                from_member=debtors[j][0],
                to_member=creditors[i][0],
                amount=round(amount, 2),
            )
        )
        creditors[i][1] -= amount
        debtors[j][1]   += amount
        if creditors[i][1] < 0.01:
            i += 1
        if abs(debtors[j][1]) < 0.01:
            j += 1

    balance_list = [
        BalanceEntry(member_id=mid, balance=round(bal, 2))
        for mid, bal in balances.items()
    ]

    return SettlementResponse(balances=balance_list, settlements=settlements)
