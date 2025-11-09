import datetime
from src.models.api import AgentNetworkArchitecture, SimulationEvent
from src.sim_agents.scenario_interpreter import scenario_interpreter_agent
from src.sim_agents.architecture_planner import architecture_planner_agent
from src.sim_agents.failure_simulation import failure_simulation_agent
from src.sim_agents.observability_narrative import observability_narrative_agent
from src.models.gemini import config
from src.websocket_manager import manager
from loguru import logger

async def run_simulation(simulation_id: str, scenario_text: str, scenario_type: str) -> AgentNetworkArchitecture:
    """
    Runs the simulation logic.
    """
    logger.info(f"Starting simulation {simulation_id} for scenario: {scenario_text}")
    # Send initial event
    await manager.broadcast(SimulationEvent(
        simulation_id=simulation_id,
        timestamp=datetime.datetime.now().isoformat(),
        event_type="simulation_started",
        payload={"message": f"Simulation {simulation_id} started for scenario: {scenario_text}"}
    ).json())

    # Step 1: Interpret the scenario
    logger.info(f"Step 1: Interpreting scenario for simulation {simulation_id}")
    interpreted_scenario = await scenario_interpreter_agent.run(
        scenario_text=scenario_text,
        run_config=config
    )
    await manager.broadcast(SimulationEvent(
        simulation_id=simulation_id,
        timestamp=datetime.datetime.now().isoformat(),
        event_type="scenario_interpreted",
        payload={"interpreted_scenario": interpreted_scenario.dict()}
    ).json())
    logger.info(f"Step 1 finished for simulation {simulation_id}")

    # Step 2: Plan the architecture based on the interpreted scenario
    logger.info(f"Step 2: Planning architecture for simulation {simulation_id}")
    agent_network_architecture = await architecture_planner_agent.run(
        scenario_interpretation=interpreted_scenario, # This needs to be adjusted based on planner's input
        run_config=config
    )
    await manager.broadcast(SimulationEvent(
        simulation_id=simulation_id,
        timestamp=datetime.datetime.now().isoformat(),
        event_type="architecture_planned",
        payload={"agent_network_architecture": agent_network_architecture.dict()}
    ).json())
    logger.info(f"Step 2 finished for simulation {simulation_id}")

    # Step 3: Simulate failure modes
    logger.info(f"Step 3: Simulating failure modes for simulation {simulation_id}")
    failure_modes = await failure_simulation_agent.run(
        agent_network_architecture=agent_network_architecture,
        scenario_text=scenario_text,
        run_config=config
    )
    await manager.broadcast(SimulationEvent(
        simulation_id=simulation_id,
        timestamp=datetime.datetime.now().isoformat(),
        event_type="failure_modes_identified",
        payload={"failure_modes": [fm.dict() for fm in failure_modes]}
    ).json())
    logger.info(f"Step 3 finished for simulation {simulation_id}")

    # Step 4: Generate observability narrative (New step)
    logger.info(f"Step 4: Generating observability narrative for simulation {simulation_id}")
    observability_narrative = await observability_narrative_agent.run(
        simulation_events=[
            SimulationEvent(
                simulation_id=simulation_id,
                timestamp=datetime.datetime.now().isoformat(),
                event_type="scenario_interpreted",
                payload={"interpreted_scenario": interpreted_scenario.dict()}
            ),
            SimulationEvent(
                simulation_id=simulation_id,
                timestamp=datetime.datetime.now().isoformat(),
                event_type="architecture_planned",
                payload={"agent_network_architecture": agent_network_architecture.dict()}
            ),
            SimulationEvent(
                simulation_id=simulation_id,
                timestamp=datetime.datetime.now().isoformat(),
                event_type="failure_modes_identified",
                payload={"failure_modes": [fm.dict() for fm in failure_modes]}
            )
        ],
        run_config=config
    )
    await manager.broadcast(SimulationEvent(
        simulation_id=simulation_id,
        timestamp=datetime.datetime.now().isoformat(),
        event_type="observability_narrative",
        payload={"narrative": observability_narrative}
    ).json())
    logger.info(f"Step 4 finished for simulation {simulation_id}")
    
    # Send final event
    await manager.broadcast(SimulationEvent(
        simulation_id=simulation_id,
        timestamp=datetime.datetime.now().isoformat(),
        event_type="simulation_completed",
        payload={"message": f"Simulation {simulation_id} completed."}
    ).json())
    
    logger.info(f"Simulation {simulation_id} completed successfully.")
    return agent_network_architecture

# have to correct the agent run fucntionality by uising Runner.run()