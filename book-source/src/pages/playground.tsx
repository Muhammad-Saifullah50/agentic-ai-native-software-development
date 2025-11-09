import './../styles/globals.css'
import { useState } from 'react';
import GraphEditToolbar from '@/components/GraphEditToolbar';
import NaturalLanguageEditBox from '@/components/NaturalLanguageEditBox';
import ReflectionExplanationSidePanel from '@/components/ReflectionExplanationSidePanel';
import ScenarioFeedbackScoring from '@/components/ScenarioFeedbackScoring';
import ScenarioInputPanel from '@/components/ScenarioInputPanel';
import SimulationPanel from '@/components/SimulationPanel';
import TopBarControls from '@/components/TopBarControls';
import SemanticCanvas from '@/components/SemanticCanvas';
import { Node, Edge } from '@/types/graph';

type PanelMode = 'explanation' | 'quiz' | 'simulation';


const Playground = () => {
  const [panelMode, setPanelMode] = useState<PanelMode>('explanation');
  const [selectedElement, setSelectedElement] = useState<Node | Edge | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [nodes] = useState<Node[]>();
  const [edges] = useState<Edge[]>();

  // Demo handlers
  const handleWorkflowGenerated = (nodes: any[], edges: any[], simulationId: string) => {
    console.log('Workflow generated:', { nodes, edges, simulationId });
    // Simulate a completed workflow with feedback
    setTimeout(() => {
      setScore(85);
    }, 2000);
  };

  const handleNaturalLanguageCommand = (command: string) => {
    console.log('Natural language command:', command);
  };

  const handleNodeClick = (node: Node) => {
    console.log('Node clicked:', node);
    setSelectedElement(node);
  };

  const handleEdgeClick = (edge: Edge) => {
    console.log('Edge clicked:', edge);
    setSelectedElement(edge);
  };

  return (
    <div className="min-h-screen bg-background">
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
