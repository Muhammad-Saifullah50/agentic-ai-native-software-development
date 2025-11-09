import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Node, Edge } from '../types/graph';

type PanelMode = 'explanation' | 'quiz' | 'simulation';

interface ReflectionExplanationSidePanelProps {
  selectedElement: Node | Edge | null;
  mode: PanelMode;
}

const ReflectionExplanationSidePanel: React.FC<ReflectionExplanationSidePanelProps> = ({ selectedElement, mode }) => {
  // Log component mount/unmount
  useEffect(() => {
    console.log('ReflectionExplanationSidePanel mounted');
    return () => {
      console.log('ReflectionExplanationSidePanel unmounted');
    };
  }, []);

  // Log prop changes
  useEffect(() => {
    console.log('ReflectionExplanationSidePanel props changed: selectedElement:', selectedElement, 'mode:', mode);
  }, [selectedElement, mode]);

  const renderContent = () => {
    if (!selectedElement) {
      return <p className="text-muted p-3">Click on a node or edge in the canvas to see details, explanations, and reflection prompts here.</p>;
    }

    switch (mode) {
      case 'explanation':
        return (
          <div className="p-3">
            <h5>{selectedElement.label || selectedElement.id}</h5>
            {'type' in selectedElement && <p><strong>Type:</strong> {selectedElement.type}</p>}
            {'zone' in selectedElement && <p><strong>Zone:</strong> {selectedElement.zone}</p>}
            {'metadata' in selectedElement && selectedElement.metadata.description && (
              <p><strong>Description:</strong> {selectedElement.metadata.description}</p>
            )}
            {'metadata' in selectedElement && selectedElement.metadata.principles && selectedElement.metadata.principles.length > 0 && (
              <p><strong>Principles:</strong> {selectedElement.metadata.principles.join(', ')}</p>
            )}
            {'metadata' in selectedElement && selectedElement.metadata.explanation && (
              <p><strong>Explanation:</strong> {selectedElement.metadata.explanation}</p>
            )}
            {'metadata' in selectedElement && selectedElement.metadata.principle_reference && (
              <p><strong>Principle Reference:</strong> {selectedElement.metadata.principle_reference}</p>
            )}
            {/* Add more details as needed */}
          </div>
        );
      case 'quiz':
        return (
          <div className="p-3">
            <h5>Quiz for {selectedElement.label || selectedElement.id}</h5>
            <p className="text-muted">Quiz questions related to this element will appear here.</p>
            {/* Placeholder for quiz content */}
          </div>
        );
      case 'simulation':
        return (
          <div className="p-3">
            <h5>Simulation Trace for {selectedElement.label || selectedElement.id}</h5>
            <p className="text-muted">Simulation events and trace for this element will appear here.</p>
            {/* Placeholder for simulation trace */}
          </div>
        );
      default:
        return <p className="text-muted p-3">Select a mode to view content.</p>;
    }
  };

  return (
    <Card className="mb-3">
      <Card.Header as="h5">Reflection & Explanation ({mode.charAt(0).toUpperCase() + mode.slice(1)} Mode)</Card.Header>
      <Card.Body style={{ minHeight: '300px' }}>
        {renderContent()}
      </Card.Body>
    </Card>
  );
};

export default ReflectionExplanationSidePanel;
