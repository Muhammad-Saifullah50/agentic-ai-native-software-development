import datetime
import json
from loguru import logger

from agents import Runner
from src.models.api import AgentNetworkArchitecture, SimulationEvent
from src.sim_agents.scenario_interpreter import scenario_interpreter_agent
from src.sim_agents.architecture_planner import architecture_planner_agent
from src.sim_agents.failure_simulation import failure_simulation_agent
from src.sim_agents.observability_narrative import observability_narrative_agent

from src.models.gemini import config
from src.websocket_manager import manager


async def run_simulation(
    simulation_id: str,
    scenario_text: str,
    scenario_type: str
) -> AgentNetworkArchitecture:

    logger.info(f"Starting simulation {simulation_id} for scenario: {scenario_text}")

    # ✅ keep event history for Step 4
    simulation_events: list[SimulationEvent] = []

    # --------------------------------------------
    # ✅ Initial event
    # --------------------------------------------
    start_event = SimulationEvent(
        simulation_id=simulation_id,
        timestamp=datetime.datetime.now().isoformat(),
        event_type="simulation_started",
        payload={"message": f"Simulation {simulation_id} started for scenario: {scenario_text}"}
    )
    simulation_events.append(start_event)
    await manager.broadcast(start_event.model_dump_json())

    # --------------------------------------------
    # ✅ STEP 1 — Scenario Interpretation
    # --------------------------------------------
    logger.info("Step 1: Interpreting scenario…")

    scenario_result = await Runner.run(
        starting_agent=scenario_interpreter_agent,
        input=scenario_text,
        context=f"Interpret the scenario of type '{scenario_type}' and extract structured requirements.",
        run_config=config
    )

    interpreted_scenario = scenario_result.final_output

    ev = SimulationEvent(
        simulation_id=simulation_id,
        timestamp=datetime.datetime.now().isoformat(),
        event_type="scenario_interpreted",
        payload={"interpreted_scenario": interpreted_scenario}
    )
    simulation_events.append(ev)
    await manager.broadcast(ev.model_dump_json())

    logger.info("Step 1 completed.")

    # --------------------------------------------
    # ✅ STEP 2 — Architecture Planning
    # --------------------------------------------
    logger.info("Step 2: Planning agent network architecture…")

    architecture_input = f"""Interpreted scenario:
{json.dumps(interpreted_scenario.model_dump(), indent=2)}
"""

    architecture_result = await Runner.run(
        starting_agent=architecture_planner_agent,
        input=architecture_input,
        context="Plan the agent network architecture based on the interpreted scenario.",
        run_config=config
    )

    agent_network_architecture = architecture_result.final_output

    ev = SimulationEvent(
        simulation_id=simulation_id,
        timestamp=datetime.datetime.now().isoformat(),
        event_type="architecture_planned",
        payload={"agent_network_architecture": agent_network_architecture}
    )
    simulation_events.append(ev)
    await manager.broadcast(ev.model_dump_json())

    logger.info("Step 2 completed.")

    # --------------------------------------------
    # ✅ STEP 3 — Failure Simulation
    # --------------------------------------------
    logger.info("Step 3: Simulating failure modes…")

    failure_input = (
        f"Scenario text:\n{scenario_text}\n\n"
        f"Agent network architecture:\n{agent_network_architecture}"
    )

    failure_result = await Runner.run(
        starting_agent=failure_simulation_agent,
        input=failure_input,
        context="Simulate realistic failure modes and breakdown points.",
        run_config=config
    )

    failure_modes = failure_result.final_output

    ev = SimulationEvent(
        simulation_id=simulation_id,
        timestamp=datetime.datetime.now().isoformat(),
        event_type="failure_modes_identified",
        payload={"failure_modes": failure_modes}
    )
    simulation_events.append(ev)
    await manager.broadcast(ev.model_dump_json())

    logger.info("Step 3 completed.")

   # --------------------------------------------
    # ✅ STEP 4 — Observability Narrative
    # --------------------------------------------
    logger.info("Step 4: Generating observability narrative…")

    def safe_serialize(obj):
        if hasattr(obj, "model_dump"):
            return obj.model_dump()
        if isinstance(obj, (list, tuple)):
            return [safe_serialize(i) for i in obj]
        if isinstance(obj, dict):
            return {k: safe_serialize(v) for k, v in obj.items()}
        return obj  # fallback: primitives

    events_text = "\n\n".join([
        json.dumps(
            {
                "event_type": event.event_type,
                "payload": safe_serialize(event.payload)
            },
            indent=2
        )
        for event in simulation_events
    ])

    # ✅ Missing part — run narrative agent!
    observability_result = await Runner.run(
        starting_agent=observability_narrative_agent,
        input=events_text,
        context="Generate a detailed observability narrative from the simulation events.",
        run_config=config
    )

    observability_narrative = observability_result.final_output

    ev = SimulationEvent(
        simulation_id=simulation_id,
        timestamp=datetime.datetime.now().isoformat(),
        event_type="observability_narrative_generated",
        payload={"observability_narrative": observability_narrative}
    )
    simulation_events.append(ev)
    await manager.broadcast(ev.model_dump_json())

    logger.info("Step 4 completed.")

    # --------------------------------------------
    # ✅ FINAL EVENT
    # --------------------------------------------
    complete_event = SimulationEvent(
        simulation_id=simulation_id,
        timestamp=datetime.datetime.now().isoformat(),
        event_type="simulation_completed",
        payload={"message": f"Simulation {simulation_id} completed."}
    )
    simulation_events.append(complete_event)
    await manager.broadcast(complete_event.model_dump_json())

    logger.info(f"Simulation {simulation_id} finished successfully.")
    logger.info(f"Simulation  results: {agent_network_architecture}")

    return agent_network_architecture
