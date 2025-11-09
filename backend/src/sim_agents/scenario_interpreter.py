from agents import Agent, ModelSettings
from src.models.api import AgentNetworkArchitecture
from src.models.gemini import gemini_model

scenario_interpreter_agent = Agent(
    name="ScenarioInterpreterAgent",
    instructions="""
You are a 'Scenario Interpreter Agent'. Your job is to interpret a user-provided scenario and break it down into a structured representation of an agent network architecture, including agents, their roles, tools, and connections.
""",
    model=gemini_model,
    model_settings=ModelSettings(temperature=0.1),
    output_type=AgentNetworkArchitecture,
)
