from openai_agents.agents import Agent, ModelSettings
from backend.src.models.api import AgentNetworkArchitecture
from backend.src.models.gemini import gemini_model

tool_skill_mapper_agent = Agent(
    name="ToolSkillMapperAgent",
    instructions="""
You are a 'Tool Skill Mapper Agent'. Your job is to analyze the planned agent network architecture and map specific tools and skills to each agent based on their roles and responsibilities.
""",
    model=gemini_model,
    model_settings=ModelSettings(temperature=0.1),
    output_type=AgentNetworkArchitecture,
)
