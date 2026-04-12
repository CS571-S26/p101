from __future__ import annotations
from typing import Literal, Optional
from pydantic import BaseModel


# ── Itinerary generation ──────────────────────────────────────────────────────

class TripRequest(BaseModel):
    title: str
    destination: str
    start_date: str
    end_date: str
    num_people: int
    current_location: str = ""
    budget: str = ""
    trip_type: str = ""
    accommodation: str = ""
    transport: str = ""
    interests: str = ""
    notes: str = ""


class DayPlan(BaseModel):
    day: str
    title: str
    details: str
    location: str = ""  # for Google Maps pin


class FlightOption(BaseModel):
    airline: str
    departure: str
    arrival: str
    price: str
    duration: str


class HotelOption(BaseModel):
    name: str
    rating: str
    price: str
    address: str


class CountryInfo(BaseModel):
    currency: str
    language: str
    timezone: str
    capital: str
    region: str


class ItineraryResponse(BaseModel):
    trip_title: str
    destination: str
    image_url: str = ""
    country_info: Optional[CountryInfo] = None
    flights: list[FlightOption] = []
    hotels: list[HotelOption] = []
    itinerary: list[DayPlan] = []


# ── Budget / Expense tracking ─────────────────────────────────────────────────

ExpenseCategory = Literal[
    "accommodation", "transportation", "food", "activity", "shopping", "other"
]

PaymentMethod = Literal[
    "cash", "credit-card", "debit-card", "venmo", "paypal", "other"
]

SplitType = Literal["equal", "custom", "percentage"]


class ExpenseCreate(BaseModel):
    trip_id: str
    title: str
    amount: float
    currency: str = "USD"
    category: ExpenseCategory = "other"
    paid_by: str                    # member id
    split_among: list[str]          # list of member ids
    split_type: SplitType = "equal"
    custom_splits: Optional[dict[str, float]] = None
    payment_method: PaymentMethod = "cash"
    date: str                       # ISO date string  YYYY-MM-DD
    linked_event: Optional[str] = None
    receipt_url: Optional[str] = None
    notes: str = ""


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    category: Optional[ExpenseCategory] = None
    paid_by: Optional[str] = None
    split_among: Optional[list[str]] = None
    split_type: Optional[SplitType] = None
    custom_splits: Optional[dict[str, float]] = None
    payment_method: Optional[PaymentMethod] = None
    date: Optional[str] = None
    linked_event: Optional[str] = None
    receipt_url: Optional[str] = None
    notes: Optional[str] = None
    settled: Optional[bool] = None


class Expense(ExpenseCreate):
    id: str
    settled: bool = False


class ExpenseListResponse(BaseModel):
    expenses: list[Expense]
    total_spent: float
    count: int


class BalanceEntry(BaseModel):
    member_id: str
    balance: float          # positive = owed money, negative = owes money


class SettlementEntry(BaseModel):
    from_member: str
    to_member: str
    amount: float


class SettlementResponse(BaseModel):
    balances: list[BalanceEntry]
    settlements: list[SettlementEntry]
