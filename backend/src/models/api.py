from typing import List, Dict, Any
from pydantic import BaseModel, Field
import uuid

class Agent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    tools: List[str] = []
    dependencies: List[str] = []

class Tool(BaseModel):
    name: str
    description: str

class Connection(BaseModel):
    source: str
    target: str
    data_format: str

class AgentNetworkArchitecture(BaseModel):
    agents: List[Agent]
    tools: List[Tool]
    connections: List[Connection]

class SimulationEvent(BaseModel):
    simulation_id: str
    timestamp: str
    event_type: str
    payload: Dict[str, Any]

class FailureMode(BaseModel):
    type: str
    description: str
    severity: str
    trigger_condition: str
