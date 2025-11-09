# Data Model: Core Backend for AI-Native Scenario Simulator

This document describes the data models for the entities used in the backend system.

## Scenario

Represents the input text provided by the user describing the system to be simulated.

- **id**: `UUID` (Primary Key)
- **created_at**: `Timestamp`
- **scenario_text**: `Text`

## AgentNetworkArchitecture

A structured representation of the agents, their connections, and associated tools. This entity is not persisted in the database but is generated on-the-fly and sent to the client.

- **agents**: `List[Agent]`
- **edges**: `List[Edge]`

### Agent

- **id**: `String`
- **type**: `String` (e.g., "Scenario Interpreter", "Architecture Planner")
- **tools**: `List[String]`
- **description**: `String`

### Edge

- **source**: `String` (Agent ID)
- **target**: `String` (Agent ID)
- **label**: `String`

## SimulationEvent

A message representing a single step or state change in the simulation (e.g., `agent_start`, `data_flow`, `failure_mode_triggered`). This entity is not persisted but is streamed to the client via websockets.

- **event_type**: `String`
- **timestamp**: `Timestamp`
- **payload**: `Dict`

## FailureMode

A representation of a potential error or non-ideal behavior in the system (e.g., `tool_api_timeout`, `agent_hallucination`).

- **id**: `String`
- **name**: `String`
- **description**: `String`

## ObservabilityStream

A stream of events mimicking logs, metrics, or traces from a running system. This is not a distinct entity but a type of `SimulationEvent`.