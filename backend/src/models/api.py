from typing import List, Dict, Any
from pydantic import BaseModel, Field
import uuid
from pydantic.alias_generators import to_camel

# Helper function for camelCase conversion
def to_camel_case(snake_str: str) -> str:
    return to_camel(snake_str)

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
    label: str

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

class Node(BaseModel):
    id: str
    type: str
    label: str
    zone: str
    metadata: Dict[str, Any]

class ReviewRequest(BaseModel):
    nodes: List[Node]
    edges: List[Connection]

class ReviewFeedback(BaseModel):
    score: float
    violated_principles: List[str]
    missing_components: List[str]
    suggested_improvements: List[str]
    summary: str

    class Config:
        alias_generator = to_camel_case
        populate_by_name = True
