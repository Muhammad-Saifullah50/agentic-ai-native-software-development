# backend/src/models/simulation.py
from pydantic import BaseModel, Field, ConfigDict
import re

# No longer need to_snake_case if using Field(alias=...)
# def to_snake_case(camel_case_string: str) -> str:
#     s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', camel_case_string)
#     return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

class SimulationRequest(BaseModel):
    scenario_text: str = Field(alias="scenarioText")
    scenario_type: str = Field(alias="scenarioType")

    model_config = ConfigDict(
        populate_by_name=True, # Allow population by field name or alias
        json_schema_extra={
            "examples": [
                {
                    "scenarioText": "Build an agent that submits my homeworks on google classroom",
                    "scenarioType": "other",
                }
            ]
        }
    )
