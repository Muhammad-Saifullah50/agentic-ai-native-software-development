from agents import Agent, ModelSettings
from src.models.api import AgentNetworkArchitecture
from src.models.gemini import gemini_model

architecture_planner_agent = Agent(
    name="ArchitecturePlannerAgent",
    instructions="""
You are an 'Architecture Planner Agent'. Your job is to take a structured scenario interpretation and plan the agent network architecture.
This includes:
1.  **Defining Agents**: Specify their names, roles, and responsibilities.
2.  **Defining Tools**: List the tools agents will use, with clear descriptions.
3.  **Defining Connections**: Crucially, define how agents and tools connect. Ensure every tool is connected to at least one agent, and clearly specify the data format exchanged over these connections.
    """,
    model=gemini_model,
    model_settings=ModelSettings(temperature=0.1),
    output_type=AgentNetworkArchitecture,
)
