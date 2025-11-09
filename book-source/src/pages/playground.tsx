import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Container, Row, Col, Alert } from 'react-bootstrap';

import ScenarioInputPanel from '../components/ScenarioInputPanel';
import SemanticCanvas from '../components/SemanticCanvas';
import ReflectionExplanationSidePanel from '../components/ReflectionExplanationSidePanel';
import GraphEditToolbar from '../components/GraphEditToolbar';
import SimulationPanel from '../components/SimulationPanel';
import ScenarioFeedbackScoring from '../components/ScenarioFeedbackScoring';
import TopBarControls from '../components/TopBarControls';
import Footer from '../components/Footer';
import NaturalLanguageEditBox from '../components/NaturalLanguageEditBox';

import { Node, Edge } from '../types/graph';
import { webSocketService } from '../services/websocketService';

type PanelMode = 'explanation' | 'quiz' | 'simulation'; // Define PanelMode here

function Playground() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<Node | Edge | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>('explanation'); // Default mode
  const [globalError, setGlobalError] = useState<string | null>(null); // Global error state

  // State for ScenarioFeedbackScoring
  const [score, setScore] = useState<number | null>(null);
  const [violatedPrinciples, setViolatedPrinciples] = useState<string[]>([]);
  const [missingComponents, setMissingComponents] = useState<string[]>([]);
  const [suggestedImprovements, setSuggestedImprovements] = useState<string[]>([]);
  const [summary, setSummary] = useState<string | null>(null);

  const handleWorkflowGenerated = (generatedNodes: Node[], generatedEdges: Edge[], newSimulationId: string) => {
    setNodes(generatedNodes);
    setEdges(generatedEdges);
    setSimulationId(newSimulationId);
    setSelectedElement(null); // Clear selection on new workflow
    setGlobalError(null); // Clear global error on new workflow
    // Reset feedback/scoring
    setScore(null);
    setViolatedPrinciples([]);
    setMissingComponents([]);
    setSuggestedImprovements([]);
    setSummary(null);
  };

  const handleNodeClick = (node: Node) => {
    setSelectedElement(node);
  };

  const handleEdgeClick = (edge: Edge) => {
    setSelectedElement(edge);
  };

  // Placeholder functions for GraphEditToolbar
  const handleAddNode = () => {
    console.log('Add Node clicked');
    // Logic to add a new node
  };

  const handleDeleteNode = () => {
    console.log('Delete Node clicked');
    // Logic to delete selected node
  };

  const handleAddConnection = () => {
    console.log('Add Connection clicked');
    // Logic to add a new connection
  };

  const handleRemoveConnection = () => {
    console.log('Remove Connection clicked');
    // Logic to remove selected connection
  };

  const handleUndo = () => {
    console.log('Undo clicked');
    // Logic to undo last action
  };

  const handleRedo = () => {
    console.log('Redo clicked');
    // Logic to redo last action
  };

  // Placeholder for Natural Language Command
  const handleNaturalLanguageCommand = (command: string) => {
    console.log('Natural Language Command:', command);
    // Logic to process natural language command and modify workflow
  };

  // Placeholder functions for SimulationPanel
  const handlePlaySimulation = () => {
    setGlobalError(null); // Clear global error before playing
    if (simulationId) {
      console.log('Play Simulation clicked for ID:', simulationId);
      webSocketService.sendMessage({ type: 'PLAY', payload: { simulationId } });
      // Simulate some feedback for now
      setScore(75);
      setViolatedPrinciples(['Principle 1: Missing clear success criteria']);
      setMissingComponents(['Validation Agent']);
      setSuggestedImprovements(['Add a validation step to ensure output quality.']);
      setSummary('Initial simulation feedback. Focus on improving validation.');
    } else {
      setGlobalError('No simulation ID available to play. Please generate a workflow first.');
      console.warn('No simulation ID to play.');
    }
  };

  const handlePauseSimulation = () => {
    setGlobalError(null); // Clear global error before pausing
    if (simulationId) {
      console.log('Pause Simulation clicked for ID:', simulationId);
      webSocketService.sendMessage({ type: 'PAUSE', payload: { simulationId } });
    } else {
      setGlobalError('No simulation ID available to pause.');
      console.warn('No simulation ID to pause.');
    }
  };

  const handleStepSimulation = () => {
    setGlobalError(null); // Clear global error before stepping
    if (simulationId) {
      console.log('Step Simulation clicked for ID:', simulationId);
      webSocketService.sendMessage({ type: 'STEP', payload: { simulationId } });
    } else {
      setGlobalError('No simulation ID available to step.');
      console.warn('No simulation ID to step.');
    }
  };

  const handleResetSimulation = () => {
    setGlobalError(null); // Clear global error before resetting
    if (simulationId) {
      console.log('Reset Simulation clicked for ID:', simulationId);
      webSocketService.sendMessage({ type: 'RESET', payload: { simulationId } });
      setNodes([]);
      setEdges([]);
      setSimulationId(null);
      setSelectedElement(null);
      // Reset feedback/scoring
      setScore(null);
      setViolatedPrinciples([]);
      setMissingComponents([]);
      setSuggestedImprovements([]);
      setSummary(null);
    } else {
      setGlobalError('No simulation ID available to reset.');
      console.warn('No simulation ID to reset.');
    }
  };

  const handlePanelModeChange = (mode: PanelMode) => {
    setPanelMode(mode);
  };

  useEffect(() => {
    const unsubscribeWsError = webSocketService.onError((error) => {
      setGlobalError(error.message);
    });

    if (simulationId) {
      webSocketService.connect(simulationId)
        .then(() => {
          console.log('WebSocket connected successfully for simulation:', simulationId);
          setGlobalError(null); // Clear error if connection is successful
        })
        .catch(error => {
          console.error('Failed to connect WebSocket:', error);
          setGlobalError(error.message);
        });

      const unsubscribeWsMessage = webSocketService.onMessage(message => {
        console.log('Received WebSocket message:', message);
        // Handle incoming messages to update UI, e.g., simulation progress, node highlights
        // This will be further implemented in Phase 4
      });

      return () => {
        unsubscribeWsMessage();
        unsubscribeWsError();
        webSocketService.disconnect();
      };
    } else {
      // If simulationId becomes null, ensure WebSocket is disconnected and error is cleared
      webSocketService.disconnect();
      setGlobalError(null);
    }
  }, [simulationId]);

  return (
    <Layout title="AI-Native Scenario Playground" description="Playground for designing and simulating AI-Native workflows.">
      <Container fluid className="my-4">
        {globalError && <Alert variant="danger" onClose={() => setGlobalError(null)} dismissible>{globalError}</Alert>}
        <Row>
          <Col xs={12}>
            <TopBarControls onModeChange={handlePanelModeChange} currentMode={panelMode} />
          </Col>
        </Row>
        <Row>
          <Col lg={3} md={4} xs={12}>
            <ScenarioInputPanel onWorkflowGenerated={handleWorkflowGenerated} setGlobalError={setGlobalError} />
            <GraphEditToolbar
              onAddNode={handleAddNode}
              onDeleteNode={handleDeleteNode}
              onAddConnection={handleAddConnection}
              onRemoveConnection={handleRemoveConnection}
              onUndo={handleUndo}
              onRedo={handleRedo}
            />
            <NaturalLanguageEditBox onNaturalLanguageCommand={handleNaturalLanguageCommand} />
            <SimulationPanel
              onPlay={handlePlaySimulation}
              onPause={handlePauseSimulation}
              onStep={handleStepSimulation}
              onReset={handleResetSimulation}
            />
          </Col>
          <Col lg={9} md={8} xs={12}>
            <SemanticCanvas
              nodes={nodes}
              edges={edges}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ReflectionExplanationSidePanel selectedElement={selectedElement} mode={panelMode} />
            <ScenarioFeedbackScoring
              score={score}
              violatedPrinciples={violatedPrinciples}
              missingComponents={missingComponents}
              suggestedImprovements={suggestedImprovements}
              summary={summary}
            />
          </Col>
        </Row>
      </Container>
      <Footer />
    </Layout>
  );
}

export default Playground;

