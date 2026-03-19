from pydantic import BaseModel


class TripRequest(BaseModel):
    title: str
    destination: str
    start_date: str
    end_date: str
    num_people: int
    budget: str = ""
    trip_type: str = ""
    accommodation: str = ""
    transport: str = ""
    notes: str = ""


class DayPlan(BaseModel):
    day: str
    title: str
    details: str


class ItineraryResponse(BaseModel):
    trip_title: str
    destination: str
    itinerary: list[DayPlan]