
import { useEffect, useState } from 'react';
import GraphEditToolbar from '@/components/GraphEditToolbar';
import NaturalLanguageEditBox from '@/components/NaturalLanguageEditBox';
import ReflectionExplanationSidePanel from '@/components/ReflectionExplanationSidePanel';
import ScenarioFeedbackScoring from '@/components/ScenarioFeedbackScoring';
import ScenarioInputPanel from '@/components/ScenarioInputPanel';
import TopBarControls from '@/components/TopBarControls';
import SemanticCanvas from '@/components/SemanticCanvas';
import { Node, Edge } from '@/types/graph';
import { webSocketService } from '../services/websocketService';
import { editWorkflow, getAIFeedback } from '../services/apiService';
import { v4 as uuidv4 } from 'uuid';

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
  const [showFeedbackButton, setShowFeedbackButton] = useState(false);

  
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

  const handleAddNode = (type: 'agent' | 'tool', name: string) => {
    const newNode: Node = {
      id: uuidv4(),
      type,
      label: name,
      zone: type === 'agent' ? 'reasoning' : 'action',
      metadata: {
        description: '',
        principles: [],
        reflection_points: [],
      },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const handleDeleteNode = () => {
    console.log('Delete Node clicked');
  };

  const handleAddConnection = (connection: any) => { // Change type to any to access source and target
    const newEdge: Edge = {
      id: `${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      label: "uses", // Default label for new connections
      metadata: {
        explanation: "uses",
        principle_reference: "",
      },
    };
    setEdges((prevEdges) => [...prevEdges, newEdge]);
    setShowFeedbackButton(true);
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

  const handleGetAIFeedback = async () => {
    if (!simulationId) {
      setGlobalError('Cannot get AI feedback without a simulation ID.');
      return;
    }
    try {
      const feedback = await getAIFeedback(simulationId, nodes, edges);
      setScore(feedback.score);
      setViolatedPrinciples(feedback.violatedPrinciples);
      setMissingComponents(feedback.missingComponents);
      setSuggestedImprovements(feedback.suggestedImprovements);
      setSummary(feedback.summary);
    } catch (error: any) {
      setGlobalError(error.message);
    }
  };

  const handleNaturalLanguageCommand = async (command: string) => {
    if (!simulationId) {
      setGlobalError('Cannot edit workflow without a simulation ID.');
      return;
    }
    try {
      const { nodes: newNodes, edges: newEdges } = await editWorkflow(simulationId, command);
      setNodes(newNodes);
      setEdges(newEdges);
    } catch (error: any) {
      setGlobalError(error.message);
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
    <div id="tw" className="tw min-h-screen bg-background flex flex-col" >
      <TopBarControls onModeChange={setPanelMode} currentMode={panelMode} />
      
      <div className="container mx-auto px-4 pb-8 flex-grow flex flex-col">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <div className="mb-4 lg:mb-0 w-full">
            <GraphEditToolbar
              onAddNode={handleAddNode}
              onDeleteNode={() => console.log('Delete node')}
              onAddConnection={handleAddConnection}
              onRemoveConnection={() => console.log('Remove connection')}
              onUndo={() => console.log('Undo')}
              onRedo={() => console.log('Redo')}
              onGetAIFeedback={handleGetAIFeedback}
              isFeedbackDisabled={!showFeedbackButton}
            />
          </div>
         
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Input & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <ScenarioInputPanel 
              onWorkflowGenerated={handleWorkflowGenerated}
              setGlobalError={(error) => console.error(error)}
            />
            
            <NaturalLanguageEditBox 
              onNaturalLanguageCommand={handleNaturalLanguageCommand}
            />
          </div>

          {/* Right Column - Canvas */}
          <div className="lg:col-span-2">
            <SemanticCanvas
              nodes={nodes}
              edges={edges}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              onConnect={handleAddConnection}
            />
          </div>
        </div>

        {/* Bottom Row - Side Panel & Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReflectionExplanationSidePanel
            selectedElement={selectedElement}
            mode={panelMode}
          />

          <ScenarioFeedbackScoring
            score={score}
            violatedPrinciples={violatedPrinciples}
            missingComponents={missingComponents}
            suggestedImprovements={suggestedImprovements}
            summary={summary}
          />
        </div>
      </div>
    </div>
  );
};

export default Playground;
