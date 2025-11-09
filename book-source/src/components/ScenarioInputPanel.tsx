import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { simulateScenario } from '../services/apiService';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

interface ScenarioInputPanelProps {
  onWorkflowGenerated: (nodes: any[], edges: any[], simulationId: string) => void;
  setGlobalError: (error: string | null) => void;
}

const ScenarioInputPanel: React.FC<ScenarioInputPanelProps> = ({ onWorkflowGenerated, setGlobalError }) => {
  const [scenarioText, setScenarioText] = useState<string>('');
  const [scenarioType, setScenarioType] = useState<string>('marketing'); // Default type
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    setGlobalError(null);

    if (!scenarioText.trim()) {
      setLocalError('Scenario description cannot be empty.');
      return;
    }

    setIsLoading(true);
    try {
      const newSimulationId = uuidv4(); // Generate a new UUID for simulationId
      const response = await simulateScenario(newSimulationId, scenarioText, scenarioType);
      onWorkflowGenerated(response.nodes, response.edges, response.simulationId);
    } catch (error: any) {
      console.error('Failed to generate workflow:', error);
      setGlobalError(error.message || 'An unexpected error occurred during simulation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Header as="h5">Scenario Input</Card.Header>
      <Card.Body>
        {localError && <Alert variant="danger">{localError}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="scenarioText">
            <Form.Label>Describe your AI-Native Scenario:</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={scenarioText}
              onChange={(e) => setScenarioText(e.target.value)}
              placeholder="e.g., 'Build an AI agent that analyzes customer feedback and automatically generates personalized email responses.'"
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="scenarioType">
            <Form.Label>Scenario Type:</Form.Label>
            <Form.Control
              as="select"
              value={scenarioType}
              onChange={(e) => setScenarioType(e.target.value)}
              disabled={isLoading}
            >
              <option value="marketing">Marketing</option>
              <option value="customer_service">Customer Service</option>
              <option value="software_development">Software Development</option>
              <option value="research">Research</option>
              <option value="other">Other</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Generating Workflow...
              </>
            ) : (
              'Generate Workflow'
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ScenarioInputPanel;
