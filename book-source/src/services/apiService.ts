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

    return response.json();
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
