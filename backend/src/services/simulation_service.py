import datetime
import json
from loguru import logger
from typing import List

from agents import Runner
from src.models.api import AgentNetworkArchitecture, SimulationEvent, Connection, Node, Agent, Tool, ReviewFeedback
from src.sim_agents.scenario_interpreter import scenario_interpreter_agent
from src.sim_agents.architecture_planner import architecture_planner_agent
from src.sim_agents.architecture_editor import architecture_editor_agent
from src.sim_agents.simulation_reviewer_agent import simulation_reviewer_agent


from src.models.gemini import config
from src.websocket_manager import manager

simulation_architectures = {}


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
    simulation_architectures[simulation_id] = agent_network_architecture

    for agent in agent_network_architecture.agents:
        for tool_name in agent.tools:
            agent_network_architecture.connections.append(
                Connection(source=agent.id, target=tool_name, label="uses")
            )

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


async def edit_simulation(simulation_id: str, command: str) -> AgentNetworkArchitecture:
    logger.info(f"Editing simulation {simulation_id} with command: {command}")

    existing_architecture = simulation_architectures.get(simulation_id)
    if not existing_architecture:
        raise ValueError(f"Simulation with ID {simulation_id} not found.")

    edit_input = f"""Existing architecture:
{json.dumps(existing_architecture.model_dump(), indent=2)}

Command: {command}
"""

    edit_result = await Runner.run(
        starting_agent=architecture_editor_agent,
        input=edit_input,
        context="Edit the agent network architecture based on the command.",
        run_config=config
    )

    new_architecture = edit_result.final_output
    simulation_architectures[simulation_id] = new_architecture

    for agent in new_architecture.agents:
        for tool_name in agent.tools:
            new_architecture.connections.append(
                Connection(source=agent.id, target=tool_name, label="uses")
            )

    ev = SimulationEvent(
        simulation_id=simulation_id,
        timestamp=datetime.datetime.now().isoformat(),
        event_type="architecture_edited",
        payload={"agent_network_architecture": new_architecture}
    )
    await manager.broadcast(ev.model_dump_json())

    logger.info(f"Simulation {simulation_id} edited successfully.")
    return new_architecture

async def review_simulation(simulation_id: str, nodes: List[Node], edges: List[Connection]) -> ReviewFeedback:
    logger.info(f"Reviewing simulation {simulation_id} with {len(nodes)} nodes and {len(edges)} edges.")

    # Construct AgentNetworkArchitecture from nodes and edges
    agents = []
    tools = []
    for node in nodes:
        if node.type == "agent":
            agents.append(Agent(id=node.id, name=node.label, role=node.metadata.get("description", ""), tools=[], dependencies=[]))
        elif node.type == "tool":
            tools.append(Tool(name=node.label, description=node.metadata.get("description", "")))

    # Map frontend Edge to backend Connection
    backend_connections = []
    for edge in edges:
        backend_connections.append(Connection(source=edge.source, target=edge.target, label=edge.label))

    architecture = AgentNetworkArchitecture(
        agents=agents,
        tools=tools,
        connections=backend_connections,
    )

    review_input = json.dumps(architecture.model_dump(), indent=2)

    review_result = await Runner.run(
        starting_agent=simulation_reviewer_agent,
        input=review_input,
        context="Review the provided agent network architecture.",
        run_config=config,
    )

    review_feedback = review_result.final_output
    logger.info(f"Review feedback from agent: {review_feedback}") # Add this line
    return review_feedback

