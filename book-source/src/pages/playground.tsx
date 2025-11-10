import '../css/custom.css';

import { useEffect, useState } from 'react';
import GraphEditToolbar from '@/components/GraphEditToolbar';
import NaturalLanguageEditBox from '@/components/NaturalLanguageEditBox';
import ReflectionExplanationSidePanel from '@/components/ReflectionExplanationSidePanel';
import ScenarioFeedbackScoring from '@/components/ScenarioFeedbackScoring';
import ScenarioInputPanel from '@/components/ScenarioInputPanel';
import SimulationPanel from '@/components/SimulationPanel';
import TopBarControls from '@/components/TopBarControls';
import SemanticCanvas from '@/components/SemanticCanvas';
import { Node, Edge } from '@/types/graph';
import { webSocketService } from '../services/websocketService';

type PanelMode = 'explanation' | 'quiz' | 'simulation';


const Playground = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<Node | Edge | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>('explanation');
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [score, setScore] = useState<number | null>(null);
  const [violatedPrinciples, setViolatedPrinciples] = useState<string[]>([]);
  const [missingComponents, setMissingComponents] = useState<string[]>([]);
  const [suggestedImprovements, setSuggestedImprovements] = useState<string[]>([]);
  const [summary, setSummary] = useState<string | null>(null);

  
  const handleWorkflowGenerated = (generatedNodes: Node[], generatedEdges: Edge[], newSimulationId: string) => {
    setNodes(generatedNodes);
    setEdges(generatedEdges);
    setSimulationId(newSimulationId);
    setSelectedElement(null);
    setGlobalError(null);
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

  const handleAddNode = () => {
    console.log('Add Node clicked');
  };

  const handleDeleteNode = () => {
    console.log('Delete Node clicked');
  };

  const handleAddConnection = () => {
    console.log('Add Connection clicked');
  };

  const handleRemoveConnection = () => {
    console.log('Remove Connection clicked');
  };

  const handleUndo = () => {
    console.log('Undo clicked');
  };

  const handleRedo = () => {
    console.log('Redo clicked');
  };

  const handleNaturalLanguageCommand = (command: string) => {
    console.log('Natural Language Command:', command);
  };

  const handlePlaySimulation = () => {
    setGlobalError(null);
    if (simulationId) {
      console.log('Play Simulation clicked for ID:', simulationId);
      webSocketService.sendMessage({ type: 'PLAY', payload: { simulationId } });
    } else {
      setGlobalError('No simulation ID available to play. Please generate a workflow first.');
      console.warn('No simulation ID to play.');
    }
  };

  const handlePauseSimulation = () => {
    setGlobalError(null);
    if (simulationId) {
      console.log('Pause Simulation clicked for ID:', simulationId);
      webSocketService.sendMessage({ type: 'PAUSE', payload: { simulationId } });
    } else {
      setGlobalError('No simulation ID available to pause.');
      console.warn('No simulation ID to pause.');
    }
  };

  const handleStepSimulation = () => {
    setGlobalError(null);
    if (simulationId) {
      console.log('Step Simulation clicked for ID:', simulationId);
      webSocketService.sendMessage({ type: 'STEP', payload: { simulationId } });
    } else {
      setGlobalError('No simulation ID available to step.');
      console.warn('No simulation ID to step.');
    }
  };

  const handleResetSimulation = () => {
    setGlobalError(null);
    if (simulationId) {
      console.log('Reset Simulation clicked for ID:', simulationId);
      webSocketService.sendMessage({ type: 'RESET', payload: { simulationId } });
      setNodes([]);
      setEdges([]);
      setSimulationId(null);
      setSelectedElement(null);
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
          setGlobalError(null);
        })
        .catch(error => {
          console.error('Failed to connect WebSocket:', error);
          setGlobalError(error.message);
        });

      const unsubscribeWsMessage = webSocketService.onMessage(message => {
        console.log('Received WebSocket message:', message);
        if (message.event_type === 'architecture_planned') {
          const { agent_network_architecture } = message.payload;
          const newNodes: Node[] = [];
          const newEdges: Edge[] = [];

          agent_network_architecture.agents.forEach((agent: any) => {
            newNodes.push({
              id: agent.id,
              type: "agent",
              label: agent.name,
              zone: "reasoning",
              metadata: {
                description: agent.role,
                principles: [],
                reflection_points: [],
              },
            });
          });

          agent_network_architecture.tools.forEach((tool: any) => {
            newNodes.push({
              id: tool.name,
              type: "tool",
              label: tool.name,
              zone: "action",
              metadata: {
                description: tool.description,
                principles: [],
                reflection_points: [],
              },
            });
          });

          agent_network_architecture.connections.forEach((connection: any) => {
            newEdges.push({
              id: `${connection.source}-${connection.target}`,
              source: connection.source,
              target: connection.target,
              label: connection.data_format,
              metadata: {
                explanation: connection.data_format,
                principle_reference: "",
              },
            });
          });

          setNodes(newNodes);
          setEdges(newEdges);
        }
      });

      return () => {
        unsubscribeWsMessage();
        unsubscribeWsError();
        webSocketService.disconnect();
      };
    } else {
      webSocketService.disconnect();
      setGlobalError(null);
    }
  }, [simulationId]);


  return (
    <div className="min-h-screen bg-background tw" >
      <TopBarControls onModeChange={setPanelMode} currentMode={panelMode} />
      
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <ScenarioInputPanel 
              onWorkflowGenerated={handleWorkflowGenerated}
              setGlobalError={(error) => console.error(error)}
            />
            
            <NaturalLanguageEditBox 
              onNaturalLanguageCommand={handleNaturalLanguageCommand}
            />

            <GraphEditToolbar
              onAddNode={() => console.log('Add node')}
              onDeleteNode={() => console.log('Delete node')}
              onAddConnection={() => console.log('Add connection')}
              onRemoveConnection={() => console.log('Remove connection')}
              onUndo={() => console.log('Undo')}
              onRedo={() => console.log('Redo')}
            />

            <SimulationPanel
              onPlay={() => console.log('Play')}
              onPause={() => console.log('Pause')}
              onStep={() => console.log('Step')}
              onReset={() => console.log('Reset')}
            />
          </div>

          {/* Middle Column - Semantic Canvas */}
          <div className="lg:col-span-1">
            <SemanticCanvas
              nodes={nodes}
              edges={edges}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
            />
          </div>

          {/* Right Column - Side Panel & Feedback */}
          <div className="lg:col-span-1 space-y-6">
            <ReflectionExplanationSidePanel
              selectedElement={selectedElement}
              mode={panelMode}
            />

            <ScenarioFeedbackScoring
              score={score}
              violatedPrinciples={score !== null ? ['Insufficient error handling in perception layer'] : []}
              missingComponents={score !== null ? ['Memory component for context retention'] : []}
              suggestedImprovements={score !== null ? [
                'Add validation layer before processing',
                'Implement feedback loop for continuous learning'
              ] : []}
              summary={score !== null ? 'Good overall design with room for improvement in error handling and memory management.' : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
