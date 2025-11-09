from fastapi import APIRouter
from src.models.api import AgentNetworkArchitecture
from src.services.simulation_service import run_simulation
from src.models.simulation import SimulationRequest # Import the new Pydantic model

router = APIRouter()

@router.post("/simulate/{simulation_id}", response_model=AgentNetworkArchitecture)
async def simulate_scenario(simulation_id: str, request_body: SimulationRequest):
    return await run_simulation(simulation_id, request_body.scenario_text, request_body.scenario_type)
