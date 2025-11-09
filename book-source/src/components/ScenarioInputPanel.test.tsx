// book-source/src/components/ScenarioInputPanel.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScenarioInputPanel from './ScenarioInputPanel';
import { simulateScenario } from '../services/apiService';

// Mock the apiService
jest.mock('../services/apiService', () => ({
  simulateScenario: jest.fn(),
}));

describe('ScenarioInputPanel', () => {
  const mockOnWorkflowGenerated = jest.fn();
  const mockSetGlobalError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <ScenarioInputPanel
        onWorkflowGenerated={mockOnWorkflowGenerated}
        setGlobalError={mockSetGlobalError}
      />
    );

    expect(screen.getByText('Scenario Input')).toBeInTheDocument();
    expect(screen.getByLabelText('Describe your AI-Native Scenario:')).toBeInTheDocument();
    expect(screen.getByLabelText('Scenario Type:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate Workflow' })).toBeInTheDocument();
  });

  it('shows an error if scenario text is empty on submit', async () => {
    render(
      <ScenarioInputPanel
        onWorkflowGenerated={mockOnWorkflowGenerated}
        setGlobalError={mockSetGlobalError}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Generate Workflow' }));

    await waitFor(() => {
      expect(screen.getByText('Scenario description cannot be empty.')).toBeInTheDocument();
    });
    expect(mockOnWorkflowGenerated).not.toHaveBeenCalled();
    expect(mockSetGlobalError).toHaveBeenCalledWith(null); // Global error should be cleared
  });

  it('calls simulateScenario and onWorkflowGenerated on successful submission', async () => {
    const mockNodes = [{ id: '1', label: 'Node 1', type: 'agent', zone: 'perception', metadata: { description: 'desc', explanation: 'exp', principles: [] } }];
    const mockEdges = [{ id: 'e1-2', source: '1', target: '2', label: 'Edge 1-2', metadata: { explanation: 'exp' } }];
    const mockSimulationId = 'sim-123';

    (simulateScenario as jest.Mock).mockResolvedValueOnce({
      nodes: mockNodes,
      edges: mockEdges,
      simulationId: mockSimulationId,
    });

    render(
      <ScenarioInputPanel
        onWorkflowGenerated={mockOnWorkflowGenerated}
        setGlobalError={mockSetGlobalError}
      />
    );

    fireEvent.change(screen.getByLabelText('Describe your AI-Native Scenario:'), {
      target: { value: 'Test scenario description' },
    });
    fireEvent.change(screen.getByLabelText('Scenario Type:'), {
      target: { value: 'marketing' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Generate Workflow' }));

    expect(screen.getByText('Generating Workflow...')).toBeInTheDocument();

    await waitFor(() => {
      expect(simulateScenario).toHaveBeenCalledTimes(1);
      expect(simulateScenario).toHaveBeenCalledWith('Test scenario description', 'marketing');
      expect(mockOnWorkflowGenerated).toHaveBeenCalledWith(mockNodes, mockEdges, mockSimulationId);
      expect(mockSetGlobalError).toHaveBeenCalledWith(null); // Global error should be cleared on success
    });
  });

  it('calls setGlobalError on simulateScenario failure', async () => {
    const errorMessage = 'Backend simulation failed';
    (simulateScenario as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(
      <ScenarioInputPanel
        onWorkflowGenerated={mockOnWorkflowGenerated}
        setGlobalError={mockSetGlobalError}
      />
    );

    fireEvent.change(screen.getByLabelText('Describe your AI-Native Scenario:'), {
      target: { value: 'Failing scenario' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Generate Workflow' }));

    expect(screen.getByText('Generating Workflow...')).toBeInTheDocument();

    await waitFor(() => {
      expect(simulateScenario).toHaveBeenCalledTimes(1);
      expect(mockOnWorkflowGenerated).not.toHaveBeenCalled();
      expect(mockSetGlobalError).toHaveBeenCalledWith(errorMessage);
    });
    expect(screen.queryByText('An unexpected error occurred during simulation.')).not.toBeInTheDocument(); // Local error should not be shown
  });
});
