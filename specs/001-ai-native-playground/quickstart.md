# Quickstart: AI-Native Scenario Playground Frontend

This document provides instructions on how to set up and run the AI-Native Scenario Playground frontend application.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js** (LTS version, e.g., 18.x or 20.x)
*   **npm** or **Yarn** (npm is usually bundled with Node.js)
*   **Git**
*   The `002-scenario-backend` running (refer to its `README.md` for setup instructions). The frontend expects the backend to be accessible at `http://localhost:8000` for REST API calls and `ws://localhost:8000` for WebSocket connections.

## Setup Instructions

1.  **Clone the repository**:
    If you haven't already, clone the main project repository:
    ```bash
    git clone https://github.com/Panaverse/agentic-ai-native-software-development.git
    cd agentic-ai-native-software-development
    ```

2.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

3.  **Install dependencies**:
    ```bash
    npm install
    # or if you prefer yarn
    # yarn install
    ```

4.  **Start the development server**:
    ```bash
    npm start
    # or if you prefer yarn
    # yarn start
    ```
    This will start the React development server, usually on `http://localhost:3000`. The application will automatically open in your default web browser.

## Usage

Once the application is running:

1.  Ensure the `002-scenario-backend` is also running.
2.  Use the "Scenario Input Panel" to describe your AI-native scenario.
3.  Click "Generate Workflow" to visualize the agent network on the "Semantic Canvas".
4.  Interact with the canvas, use the "Graph Edit Toolbar" or "Natural Language Edit Box" to modify the workflow.
5.  Use the "Simulation Panel" to step through the workflow execution.
6.  Review feedback and scoring in the dedicated panel.

## Troubleshooting

*   **"Backend not reachable" errors**: Ensure the `002-scenario-backend` is running and accessible at `http://localhost:8000`. Check your browser's developer console for network errors.
*   **Dependency installation issues**: Try clearing your npm/yarn cache (`npm cache clean --force` or `yarn cache clean`) and reinstalling.
*   **Port conflicts**: If `http://localhost:3000` is already in use, the development server might suggest another port. Adjust accordingly.
