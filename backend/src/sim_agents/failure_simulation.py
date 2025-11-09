from agents import Agent, ModelSettings
from src.models.api import AgentNetworkArchitecture, FailureMode
from src.models.gemini import gemini_model
from typing import List

failure_simulation_agent = Agent(
    name="FailureSimulationAgent",
    instructions="""
You are a 'Failure Simulation Agent'. Your job is to analyze a given agent network architecture and a scenario (provided as input), then identify potential failure modes, their severity, and trigger conditions.
""",
    model=gemini_model,
    model_settings=ModelSettings(temperature=0.1),
    output_type=List[FailureMode], # This agent will output a list of potential failure modes
)
