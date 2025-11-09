import React, { useEffect } from 'react';
import { ButtonGroup, Button, Card } from 'react-bootstrap';
import { FaPlay, FaPause, FaStepForward, FaRedo } from 'react-icons/fa';

interface SimulationPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ onPlay, onPause, onStep, onReset }) => {
  // Log component mount/unmount
  useEffect(() => {
    console.log('SimulationPanel mounted');
    return () => {
      console.log('SimulationPanel unmounted');
    };
  }, []);

  return (
    <Card className="mb-3">
      <Card.Header as="h5">Simulation Controls</Card.Header>
      <Card.Body>
        <ButtonGroup aria-label="Simulation controls" className="d-flex flex-wrap">
          <Button variant="success" title="Play Simulation" onClick={onPlay} className="m-1">
            <FaPlay /> Play
          </Button>
          <Button variant="warning" title="Pause Simulation" onClick={onPause} className="m-1">
            <FaPause /> Pause
          </Button>
          <Button variant="info" title="Step Forward" onClick={onStep} className="m-1">
            <FaStepForward /> Step
          </Button>
          <Button variant="danger" title="Reset Simulation" onClick={onReset} className="m-1">
            <FaRedo /> Reset
          </Button>
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
};

export default SimulationPanel;
