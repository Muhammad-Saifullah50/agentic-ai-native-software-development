from agents import Agent, ModelSettings
from src.models.gemini import gemini_model

observability_narrative_agent = Agent(
    name="ObservabilityNarrativeAgent",
    instructions="""
You are an 'Observability Narrative Agent'. Your job is to generate a human-readable narrative of the simulation's progress and key events, based on the stream of SimulationEvent objects.
""",
    model=gemini_model,
    model_settings=ModelSettings(temperature=0.1),
    output_type=str, # This agent will output a string narrative
)
