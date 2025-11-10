from fastapi import APIRouter
from src.models.api import AgentNetworkArchitecture
from src.services.simulation_service import run_simulation,edit_simulation
from src.models.simulation import SimulationRequest, EditRequest

router = APIRouter()

@router.post("/simulate/{simulation_id}", response_model=AgentNetworkArchitecture)
async def simulate_scenario(simulation_id: str, request_body: SimulationRequest):
    return await run_simulation(simulation_id, request_body.scenario_text, request_body.scenario_type)

@router.post("/simulations/{simulation_id}/edit", response_model=AgentNetworkArchitecture)
async def edit_scenario(simulation_id: str, request_body: EditRequest):
    return await edit_simulation(simulation_id, request_body.command)
