# Quickstart: Core Backend for AI-Native Scenario Simulator

This document provides a quickstart guide for setting up and running the backend service.

## Prerequisites

- Python 3.13+
- Poetry for dependency management
- PostgreSQL server running

## Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd <repository-url>
    ```

2.  **Install dependencies**
    ```bash
    poetry install
    ```

3.  **Configure environment variables**
    Create a `.env` file in the `backend` directory and add the following:
    ```
    DATABASE_URL="postgresql://user:password@localhost/dbname"
    ```

4.  **Run database migrations**
    ```bash
    poetry run alembic upgrade head
    ```

5.  **Run the application**
    ```bash
    poetry run uvicorn src.main:app --reload
    ```

## API Usage

The API will be available at `http://localhost:8000`.

-   **POST /simulate**: Submit a scenario for simulation.
-   **GET /scenarios**: Retrieve all persisted scenarios.
-   **GET /ws/{simulation_id}**: Connect to the websocket for real-time updates.
