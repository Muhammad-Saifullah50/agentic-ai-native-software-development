# Research: Core Backend for AI-Native Scenario Simulator

This document outlines the technology choices for the backend system.

## Decision: FastAPI for the API Framework

**Rationale**: FastAPI is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints. It provides automatic data model validation, serialization, and interactive API documentation (via Swagger UI and ReDoc), which aligns with our need for a robust and well-documented API. Its asynchronous support is essential for handling websocket connections and long-running simulations.

**Alternatives considered**:
- **Flask**: A mature and flexible framework, but it lacks the built-in asynchronous support and automatic data validation that FastAPI provides.
- **Django**: A full-featured framework that is better suited for monolithic applications with a frontend. It would be overkill for a backend-only API service.

## Decision: OpenAI Agents SDK for Agentic Workflows

**Rationale**: The OpenAI Agents SDK is specifically designed for building agent-based systems. It provides a high-level abstraction for creating agents, defining their tools, and managing their state. This aligns perfectly with the core requirement of simulating a network of AI agents.

**Alternatives considered**:
- **LangChain**: A popular framework for developing applications powered by language models. While it provides similar capabilities, the OpenAI Agents SDK is more focused on the agentic paradigm and is a better fit for this project.
- **Custom Implementation**: Building the agent framework from scratch would be time-consuming and would not provide any significant advantages over using a dedicated SDK.

## Decision: PostgreSQL for Data Persistence

**Rationale**: PostgreSQL is a powerful, open-source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance. It is well-suited for storing the user-provided scenarios.

**Alternatives considered**:
- **MySQL**: Another popular open-source relational database. PostgreSQL is often preferred for its advanced features and extensibility.
- **SQLite**: A lightweight, file-based database. While it is easy to set up, it is not suitable for a production environment with concurrent users.

## Decision: Websockets for Real-time Updates

**Rationale**: Websockets provide a full-duplex communication channel over a single TCP connection, which is ideal for streaming real-time updates from the simulation to the client. This will allow for a more interactive and engaging user experience.

**Alternatives considered**:
- **Server-Sent Events (SSE)**: A simpler protocol for streaming updates from the server to the client. However, it is not suitable for this project as it does not provide a two-way communication channel.
- **Long Polling**: A technique where the client repeatedly polls the server for updates. This is less efficient than websockets and introduces more latency.