from agents import Agent, ModelSettings
from src.models.api import AgentNetworkArchitecture
from src.models.gemini import gemini_model

architecture_editor_agent = Agent(
    name="ArchitectureEditorAgent",
    instructions="""
You are an 'Architecture Editor Agent'. Your job is to take an existing agent network architecture and a natural language command, and modify the architecture based on the command.
This includes:
1.  **Adding or removing agents**: Modify the list of agents.
2.  **Adding or removing tools**: Modify the list of tools.
3.  **Adding or removing connections**: Modify the list of connections.
Ensure that the modified architecture is valid and that all tools are connected to at least one agent.
""",
    model=gemini_model,
    model_settings=ModelSettings(temperature=0.1),
    output_type=AgentNetworkArchitecture,
)
