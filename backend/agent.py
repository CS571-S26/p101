
import json
import os
from typing import TypedDict

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, StateGraph

from models import DayPlan, TripRequest

load_dotenv()

# ── LLM setup ──────────────────────────────────────────────────────────────
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.7,
)


# ── Graph state ────────────────────────────────────────────────────────────
class AgentState(TypedDict):
    trip_request: dict          # raw TripRequest as dict
    prompt: str                 # assembled prompt for the LLM
    raw_response: str           # raw LLM output
    itinerary: list[dict]       # parsed list of DayPlan dicts
    error: str                  # error message if any


# ── Node 1: Build the prompt ──────────────────────────────────────────────
def gather_context(state: AgentState) -> AgentState:
    req = state["trip_request"]

    extras = []
    if req.get("budget"):
        extras.append(f"- Budget per person: {req['budget']}")
    if req.get("trip_type"):
        extras.append(f"- Trip type: {req['trip_type']}")
    if req.get("accommodation"):
        extras.append(f"- Preferred accommodation: {req['accommodation']}")
    if req.get("transport"):
        extras.append(f"- Preferred transport: {req['transport']}")
    if req.get("notes"):
        extras.append(f"- Additional notes: {req['notes']}")

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
  "details": 2-3 sentence description of activities for that day.

Cover every day of the trip. Be specific with real place names, restaurants, and activities."""

    return {**state, "prompt": prompt}


# ── Node 2: Call Gemini ───────────────────────────────────────────────────
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


# ── Node 3: Parse JSON output ────────────────────────────────────────────
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
            ).model_dump()
            for i, item in enumerate(data)
        ]
        return {**state, "itinerary": itinerary, "error": ""}
    except (json.JSONDecodeError, KeyError) as e:
        return {**state, "itinerary": [], "error": f"Failed to parse LLM response: {e}"}


# ── Build the graph ──────────────────────────────────────────────────────
def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("gather_context", gather_context)
    graph.add_node("generate_itinerary", generate_itinerary)
    graph.add_node("parse_output", parse_output)

    graph.set_entry_point("gather_context")
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
        "error": "",
    }

    result = itinerary_agent.invoke(initial_state)

    if result.get("error"):
        raise ValueError(result["error"])

    return {
        "trip_title": trip.title,
        "destination": trip.destination,
        "itinerary": result["itinerary"],
    }