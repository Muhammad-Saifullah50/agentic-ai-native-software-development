// book-source/src/services/apiService.ts
import { Node, Edge } from '../types/graph'; // Assuming these types will be defined later

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8000';

interface SimulateResponse {
  nodes: Node[];
  edges: Edge[];
  simulationId: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  // Add other scenario properties as needed
}

export const simulateScenario = async (simulationId: string, scenarioText: string, scenarioType: string): Promise<SimulateResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulate/${simulationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scenarioText, scenarioType }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Server error: ${response.status} ${response.statusText}`);
    }

    const backendResponse = await response.json();

    // Transform backend response (AgentNetworkArchitecture) to frontend SimulateResponse (nodes, edges)
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Map agents to nodes
    backendResponse.agents.forEach((agent: any) => {
      nodes.push({
        id: agent.id,
        type: "agent",
        label: agent.name,
        zone: "reasoning", // Default or infer if possible
        metadata: {
          description: agent.role,
          principles: [], // Agent.dependencies are agent IDs, not principles. Initialize as empty.
          reflection_points: [],
        },
      });
    });

    // Map tools to nodes
    backendResponse.tools.forEach((tool: any) => {
      nodes.push({
        id: tool.name, // Assuming tool names are unique and can serve as IDs
        type: "tool",
        label: tool.name,
        zone: "action", // Tools typically perform actions
        metadata: {
          description: tool.description,
          principles: [],
          reflection_points: [],
        },
      });
    });

    // Map connections to edges
    backendResponse.connections.forEach((connection: any) => {
      edges.push({
        id: `${connection.source}-${connection.target}`, // Generate unique ID
        source: connection.source,
        target: connection.target,
        label: connection.data_format,
        metadata: {
          explanation: connection.data_format,
          principle_reference: "",
        },
      });
    });

    return {
      nodes,
      edges,
      simulationId: backendResponse.simulation_id || simulationId, // Use backend's simulation_id if available, else frontend generated
    };
  } catch (error: any) {
    console.error('Error simulating scenario:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Could not connect to the backend server. Please ensure the server is running.');
    }
    throw error;
  }
};

export const getScenarios = async (): Promise<Scenario[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/scenarios`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Server error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error: any) {
    console.error('Error fetching scenarios:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Could not connect to the backend server. Please ensure the server is running.');
    }
    throw error;
  }
};
