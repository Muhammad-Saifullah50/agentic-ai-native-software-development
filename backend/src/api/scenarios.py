from fastapi import APIRouter
from typing import List
from src.models.api import AgentNetworkArchitecture # Reusing for now, will define a ScenarioList model later

router = APIRouter()

@router.get("/scenarios", response_model=List[AgentNetworkArchitecture])
async def get_scenarios():
    # For now, returning an empty list as database persistence is skipped
    return []
