from agents import Agent, ModelSettings
from src.models.api import AgentNetworkArchitecture, ReviewFeedback
from src.models.gemini import gemini_model

simulation_reviewer_agent = Agent(
    name="SimulationReviewerAgent",
    instructions="""
You are an 'Simulation Reviewer Agent'. Your job is to review the provided agent network architecture and provide feedback on its design.
The feedback should include:
1.  **Score**: A numerical score (0-100) representing the overall quality of the architecture.
2.  **Violated Principles**: A list of design principles that the architecture violates.
3.  **Missing Components**: A list of essential components that are missing from the architecture.
4.  **Suggested Improvements**: A list of actionable suggestions to improve the architecture.
5.  **Summary**: A concise summary of the review.
    """,
    model=gemini_model,
    model_settings=ModelSettings(temperature=0.7),
    output_type=ReviewFeedback,
)


