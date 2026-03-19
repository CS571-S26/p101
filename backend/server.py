

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from agent import generate_trip_itinerary
from models import ItineraryResponse, TripRequest

app = FastAPI(title="Voyago API", version="0.1.0")

# Allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/generate-itinerary", response_model=ItineraryResponse)
async def create_itinerary(trip: TripRequest):
    try:
        result = await generate_trip_itinerary(trip)
        return result
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))