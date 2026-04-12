"""
LangGraph agent that generates a trip itinerary using Gemini,
enriched with Amadeus flights/hotels, REST Countries info, and Unsplash images.

Graph structure:
  [fetch_country_info]  ─┐
  [fetch_unsplash_image] ─┤  (parallel)
  [fetch_amadeus_data]   ─┘
              ↓
     [gather_context]
              ↓
     [generate_itinerary]
              ↓
        [parse_output]
              ↓
             END
"""

import json
import os
from typing import TypedDict

import httpx
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, StateGraph

from models import CountryInfo, DayPlan, FlightOption, HotelOption, TripRequest

load_dotenv()

# ── LLM setup ──────────────────────────────────────────────────────────────
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.7,
)


# ── Graph state ────────────────────────────────────────────────────────────
class AgentState(TypedDict):
    trip_request: dict
    prompt: str
    raw_response: str
    itinerary: list[dict]
    flights: list[dict]
    hotels: list[dict]
    country_info: dict | None
    image_url: str
    error: str


# ── Node 1: REST Countries ───────────────────────────────────────────────
def fetch_country_info(state: AgentState) -> AgentState:
    req = state["trip_request"]
    destination = req.get("destination", "")

    # Extract country name (take last part after comma, e.g. "Paris, France" -> "France")
    country_query = destination.split(",")[-1].strip() if "," in destination else destination

    try:
        resp = httpx.get(
            f"https://restcountries.com/v3.1/name/{country_query}",
            params={"fields": "name,currencies,languages,timezones,capital,region"},
            timeout=10,
        )
        if resp.status_code == 200:
            data = resp.json()[0]

            currencies = data.get("currencies", {})
            currency_str = ""
            for code, info in currencies.items():
                currency_str = f"{info.get('name', '')} ({code})"
                break

            languages = data.get("languages", {})
            language_str = ", ".join(languages.values()) if languages else ""

            timezones = data.get("timezones", [])
            timezone_str = timezones[0] if timezones else ""

            capitals = data.get("capital", [])
            capital_str = capitals[0] if capitals else ""

            country = CountryInfo(
                currency=currency_str,
                language=language_str,
                timezone=timezone_str,
                capital=capital_str,
                region=data.get("region", ""),
            ).model_dump()

            return {**state, "country_info": country}
    except Exception:
        pass

    return {**state, "country_info": None}


# ── Node 2: Unsplash image ──────────────────────────────────────────────
def fetch_unsplash_image(state: AgentState) -> AgentState:
    req = state["trip_request"]
    destination = req.get("destination", "")
    access_key = os.getenv("UNSPLASH_ACCESS_KEY", "")

    if not access_key:
        return {**state, "image_url": ""}

    try:
        resp = httpx.get(
            "https://api.unsplash.com/search/photos",
            params={"query": destination, "per_page": 1, "orientation": "landscape"},
            headers={"Authorization": f"Client-ID {access_key}"},
            timeout=10,
        )
        if resp.status_code == 200:
            results = resp.json().get("results", [])
            if results:
                image_url = results[0]["urls"]["regular"]
                return {**state, "image_url": image_url}
    except Exception:
        pass

    return {**state, "image_url": ""}


# ── Node 3: Mock flights & hotels (placeholder data) ────────────────────
def fetch_flights_and_hotels(state: AgentState) -> AgentState:
    req = state["trip_request"]
    destination = req.get("destination", "Unknown")
    num = req.get("num_people", 1)

    flights = [
        FlightOption(
            airline="Airline A",
            departure=req.get("start_date", "TBD"),
            arrival=req.get("start_date", "TBD"),
            price=f"~$500/person",
            duration="Est. 8-12 hrs",
        ).model_dump(),
        FlightOption(
            airline="Airline B",
            departure=req.get("start_date", "TBD"),
            arrival=req.get("start_date", "TBD"),
            price=f"~$650/person",
            duration="Est. 10-14 hrs",
        ).model_dump(),
        FlightOption(
            airline="Airline C",
            departure=req.get("start_date", "TBD"),
            arrival=req.get("start_date", "TBD"),
            price=f"~$800/person",
            duration="Est. 6-9 hrs (direct)",
        ).model_dump(),
    ]

    hotels = [
        HotelOption(
            name=f"Budget Stay - {destination}",
            rating="3.5",
            price="~$80/night",
            address=f"Central {destination}",
        ).model_dump(),
        HotelOption(
            name=f"Mid-Range Hotel - {destination}",
            rating="4.2",
            price="~$150/night",
            address=f"Downtown {destination}",
        ).model_dump(),
        HotelOption(
            name=f"Luxury Resort - {destination}",
            rating="4.8",
            price="~$300/night",
            address=f"Premium area, {destination}",
        ).model_dump(),
    ]

    return {**state, "flights": flights, "hotels": hotels}


# ── Node 4: Build the prompt ────────────────────────────────────────────
def gather_context(state: AgentState) -> AgentState:
    req = state["trip_request"]

    extras = []
    if req.get("current_location"):
        extras.append(f"- Traveler's current location / origin: {req['current_location']}")
    if req.get("budget"):
        extras.append(f"- Budget per person: {req['budget']}")
    if req.get("trip_type"):
        extras.append(f"- Trip type: {req['trip_type']}")
    if req.get("accommodation"):
        extras.append(f"- Preferred accommodation: {req['accommodation']}")
    if req.get("transport"):
        extras.append(f"- Preferred transport: {req['transport']}")
    if req.get("interests"):
        extras.append(f"- Interests: {req['interests']}")
    if req.get("notes"):
        extras.append(f"- Additional notes: {req['notes']}")

    # Add country info to context if available
    country = state.get("country_info")
    if country:
        extras.append(f"- Local currency: {country.get('currency', '')}")
        extras.append(f"- Language spoken: {country.get('language', '')}")
        extras.append(f"- Timezone: {country.get('timezone', '')}")

    extras_block = "\n".join(extras) if extras else "None"

    prompt = f"""Plan a detailed day-by-day travel itinerary for the following trip:

- Title: {req['title']}
- Destination: {req['destination']}
- Dates: {req['start_date']} to {req['end_date']}
- Number of travelers: {req['num_people']}
- Preferences:
{extras_block}

Return ONLY a JSON array (no markdown, no code fences) where each element has:
  "day": "Day 1" (or "Day 2-3" for multi-day segments),
  "title": short activity title,
  "details": 2-3 sentence description of activities for that day,
  "location": a specific place name for map pinning (e.g. "Eiffel Tower, Paris").

Cover every day of the trip. Be specific with real place names, restaurants, and activities."""

    return {**state, "prompt": prompt}


# ── Node 5: Call Gemini ─────────────────────────────────────────────────
def generate_itinerary(state: AgentState) -> AgentState:
    try:
        messages = [
            SystemMessage(content="You are a world-class travel planner. You respond only with valid JSON arrays."),
            HumanMessage(content=state["prompt"]),
        ]
        response = llm.invoke(messages)
        return {**state, "raw_response": response.content, "error": ""}
    except Exception as e:
        return {**state, "raw_response": "", "error": str(e)}


# ── Node 6: Parse JSON output ──────────────────────────────────────────
def parse_output(state: AgentState) -> AgentState:
    if state.get("error"):
        return state

    raw = state["raw_response"].strip()

    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
        if raw.endswith("```"):
            raw = raw[:-3]
        raw = raw.strip()

    try:
        data = json.loads(raw)
        itinerary = [
            DayPlan(
                day=item.get("day", f"Day {i+1}"),
                title=item.get("title", ""),
                details=item.get("details", ""),
                location=item.get("location", ""),
            ).model_dump()
            for i, item in enumerate(data)
        ]
        return {**state, "itinerary": itinerary, "error": ""}
    except (json.JSONDecodeError, KeyError) as e:
        return {**state, "itinerary": [], "error": f"Failed to parse LLM response: {e}"}


# ── Build the graph ─────────────────────────────────────────────────────
def build_graph():
    graph = StateGraph(AgentState)

    # Data-fetching nodes (run before context assembly)
    graph.add_node("fetch_country_info", fetch_country_info)
    graph.add_node("fetch_unsplash_image", fetch_unsplash_image)
    graph.add_node("fetch_flights_and_hotels", fetch_flights_and_hotels)

    # LLM nodes
    graph.add_node("gather_context", gather_context)
    graph.add_node("generate_itinerary", generate_itinerary)
    graph.add_node("parse_output", parse_output)

    # Flow: parallel fetch → gather → generate → parse → END
    graph.set_entry_point("fetch_country_info")
    graph.add_edge("fetch_country_info", "fetch_unsplash_image")
    graph.add_edge("fetch_unsplash_image", "fetch_flights_and_hotels")
    graph.add_edge("fetch_flights_and_hotels", "gather_context")
    graph.add_edge("gather_context", "generate_itinerary")
    graph.add_edge("generate_itinerary", "parse_output")
    graph.add_edge("parse_output", END)

    return graph.compile()


# Compiled graph ready to invoke
itinerary_agent = build_graph()


async def generate_trip_itinerary(trip: TripRequest) -> dict:
    """Run the agent and return the result."""
    initial_state: AgentState = {
        "trip_request": trip.model_dump(),
        "prompt": "",
        "raw_response": "",
        "itinerary": [],
        "flights": [],
        "hotels": [],
        "country_info": None,
        "image_url": "",
        "error": "",
    }

    result = itinerary_agent.invoke(initial_state)

    if result.get("error"):
        raise ValueError(result["error"])

    return {
        "trip_title": trip.title,
        "destination": trip.destination,
        "image_url": result.get("image_url", ""),
        "country_info": result.get("country_info"),
        "flights": result.get("flights", []),
        "hotels": result.get("hotels", []),
        "itinerary": result["itinerary"],
    }