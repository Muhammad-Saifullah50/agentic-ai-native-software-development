from fastapi import APIRouter, HTTPException

from src.models.api import  ReviewRequest
from src.services.simulation_service import review_simulation

router = APIRouter()

@router.post("/simulations/{simulation_id}/review")
async def review_simulation_api(simulation_id: str, request: ReviewRequest):
    try:
        feedback = await review_simulation(simulation_id, request.nodes, request.edges)
        return feedback
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
