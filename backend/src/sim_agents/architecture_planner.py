from agents import Agent, ModelSettings
from src.models.api import AgentNetworkArchitecture
from src.models.gemini import gemini_model

architecture_planner_agent = Agent(
    name="ArchitecturePlannerAgent",
    instructions="""
You are an 'Architecture Planner Agent'. Your job is to take a structured scenario interpretation and plan the agent network architecture, defining the agents, their roles, the tools they will use, and how they connect.
""",
    model=gemini_model,
    model_settings=ModelSettings(temperature=0.1),
    output_type=AgentNetworkArchitecture,
)
