
import { useEffect, useState, useCallback, useRef } from 'react';
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
import html2canvas from 'html2canvas'; // Import html2canvas

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
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false); // New state for loading feedback
  const [isNLCommandLoading, setIsNLCommandLoading] = useState(false); // New state for NL command loading

  // Undo/Redo history
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Ref for the SemanticCanvas component to capture its content
  const semanticCanvasRef = useRef<HTMLDivElement>(null);

  // Helper to save state to history
  const saveStateToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, { nodes: newNodes, edges: newEdges }]);
    setHistoryIndex(newHistory.length);
  }, [history, historyIndex]);

  
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
    saveStateToHistory(generatedNodes, generatedEdges); // Save initial state
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
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    saveStateToHistory(newNodes, edges);
  };

  const handleDeleteNode = () => {
    if (selectedElement && 'type' in selectedElement && (selectedElement.type === 'agent' || selectedElement.type === 'tool')) {
      const nodeIdToDelete = selectedElement.id;
      const newNodes = nodes.filter((node) => node.id !== nodeIdToDelete);
      const newEdges = edges.filter((edge) => edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete);
      setNodes(newNodes);
      setEdges(newEdges);
      setSelectedElement(null);
      saveStateToHistory(newNodes, newEdges);
    } else {
      console.warn('No node selected for deletion or selected element is not a node.');
    }
  };

  const handleRemoveConnection = () => {
    if (selectedElement && !('type' in selectedElement)) { // Check if it's an edge (not a node)
      const edgeIdToDelete = selectedElement.id;
      const newEdges = edges.filter((edge) => edge.id !== edgeIdToDelete);
      setEdges(newEdges);
      setSelectedElement(null);
      saveStateToHistory(nodes, newEdges);
    } else {
      console.warn('No edge selected for deletion or selected element is not an edge.');
    }
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
    const newEdges = [...edges, newEdge];
    setEdges(newEdges);
    setShowFeedbackButton(true);
    saveStateToHistory(nodes, newEdges);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevState = history[prevIndex];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prevIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextState = history[nextIndex];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(nextIndex);
    }
  };

  const handleGetAIFeedback = async () => {
    if (!simulationId) {
      setGlobalError('Cannot get AI feedback without a simulation ID.');
      return;
    }
    setIsFeedbackLoading(true); // Set loading state to true
    try {
      const feedback = await getAIFeedback(simulationId, nodes, edges);
      console.log('Received feedback:', feedback); // Add this line
      setScore(feedback.score);
      setViolatedPrinciples(feedback.violatedPrinciples || []); // Ensure it's an array
      setMissingComponents(feedback.missingComponents || []); // Ensure it's an array
      setSuggestedImprovements(feedback.suggestedImprovements || []); // Ensure it's an array
      setSummary(feedback.summary);
    } catch (error: any) {
      setGlobalError(error.message);
    } finally {
      setIsFeedbackLoading(false); // Set loading state to false
    }
  };

  const handleNaturalLanguageCommand = async (command: string) => {
    if (!simulationId) {
      setGlobalError('Cannot edit workflow without a simulation ID.');
      return;
    }
    setIsNLCommandLoading(true); // Set loading state to true
    try {
      const { nodes: newNodes, edges: newEdges } = await editWorkflow(simulationId, command);
      setNodes(newNodes);
      setEdges(newEdges);
      saveStateToHistory(newNodes, newEdges); // Save state after NL command
    } catch (error: any) {
      setGlobalError(error.message);
    } finally {
      setIsNLCommandLoading(false); // Set loading state to false
    }
  };

  const handleExportPng = async () => {
    if (semanticCanvasRef.current) {
      const canvas = await html2canvas(semanticCanvasRef.current);
      const image = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = image;
      a.download = 'workflow.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log('Export as PNG clicked.');
    } else {
      console.warn('SemanticCanvas ref is not available for PNG export.');
    }
  };

  const handleExportJson = () => {
    const data = { nodes, edges };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('Export as JSON clicked.');
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
      setHistory([]); // Clear history on reset
      setHistoryIndex(0);
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
              label: connection.label,
              metadata: {
                explanation: connection.label,
                principle_reference: "",
              },
            });
          });

          setNodes(newNodes);
          setEdges(newEdges);
          saveStateToHistory(newNodes, newEdges); // Save initial state from WebSocket
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
  }, [simulationId, saveStateToHistory]); // Add saveStateToHistory to dependencies

  const isExportDisabled = nodes.length === 0;

  return (
    <div id="tw" className="tw min-h-screen bg-background flex flex-col" >
      <TopBarControls
        onModeChange={setPanelMode}
        currentMode={panelMode}
        onExportPng={handleExportPng}
        onExportJson={handleExportJson}
        isExportDisabled={isExportDisabled}
      />
      
      <div className="container mx-auto px-4 pb-8 flex-grow flex flex-col">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <div className="mb-4 lg:mb-0 w-full">
            <GraphEditToolbar
              onAddNode={handleAddNode}
              onDeleteNode={handleDeleteNode}
              onUndo={handleUndo}
              onRedo={handleRedo}
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
              isNLCommandLoading={isNLCommandLoading}
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
              onGetAIFeedback={handleGetAIFeedback}
              isFeedbackDisabled={!showFeedbackButton}
              isFeedbackLoading={isFeedbackLoading}
              ref={semanticCanvasRef}
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
