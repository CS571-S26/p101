from pydantic import BaseModel


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
    country_info: CountryInfo | None = None
    flights: list[FlightOption] = []
    hotels: list[HotelOption] = []
    itinerary: list[DayPlan] = []