import React, { useEffect } from 'react';
import { Node, Edge } from '../types/graph';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type PanelMode = 'explanation' | 'quiz' | 'simulation';

interface ReflectionExplanationSidePanelProps {
  selectedElement: Node | Edge | null;
  mode: PanelMode;
}

const ReflectionExplanationSidePanel: React.FC<ReflectionExplanationSidePanelProps> = ({ selectedElement, mode }) => {
  useEffect(() => {
    console.log('ReflectionExplanationSidePanel mounted');
    return () => {
      console.log('ReflectionExplanationSidePanel unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('ReflectionExplanationSidePanel props changed: selectedElement:', selectedElement, 'mode:', mode);
  }, [selectedElement, mode]);

  const isNode = (element: Node | Edge): element is Node => {
    return 'type' in element && 'zone' in element;
  };

  const renderContent = () => {
    if (!selectedElement) {
      return (
        <div className="flex items-center justify-center h-full p-6">
          <p className="text-muted-foreground text-center">
            Click on a node or edge in the canvas to see details, explanations, and reflection prompts here.
          </p>
        </div>
      );
    }

    switch (mode) {
      case 'explanation':
        const node = isNode(selectedElement) ? selectedElement : null;
        
        return (
          <div className="p-6 space-y-4 animate-fade-in">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                {selectedElement.label || selectedElement.id}
              </h3>
              {node && (
                <Badge variant="secondary" className="mt-2">
                  {node.type}
                </Badge>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              {node && node.zone && (
                <div>
                  <span className="text-sm font-semibold text-foreground">Zone:</span>
                  <p className="text-sm text-muted-foreground mt-1">{node.zone}</p>
                </div>
              )}

              {node && node.metadata.description && (
                <div>
                  <span className="text-sm font-semibold text-foreground">Description:</span>
                  <p className="text-sm text-muted-foreground mt-1">{node.metadata.description}</p>
                </div>
              )}

              {node && node.metadata.principles && node.metadata.principles.length > 0 && (
                <div>
                  <span className="text-sm font-semibold text-foreground">Principles:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {node.metadata.principles.map((principle, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {principle}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedElement.metadata.explanation && (
                <div>
                  <span className="text-sm font-semibold text-foreground">Explanation:</span>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {selectedElement.metadata.explanation}
                  </p>
                </div>
              )}

              {node && node.metadata.principle_reference && (
                <div>
                  <span className="text-sm font-semibold text-foreground">Principle Reference:</span>
                  <p className="text-sm text-muted-foreground mt-1">{node.metadata.principle_reference}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="p-6 space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold text-foreground">
              Quiz: {selectedElement.label || selectedElement.id}
            </h3>
            <Separator />
            <p className="text-sm text-muted-foreground">
              Quiz questions and interactive elements will appear here. This mode helps you test your understanding.
            </p>
          </div>
        );

      case 'simulation':
        return (
          <div className="p-6 space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold text-foreground">
              Simulation: {selectedElement.label || selectedElement.id}
            </h3>
            <Separator />
            <p className="text-sm text-muted-foreground">
              Live simulation data and real-time updates will be shown here as the workflow executes.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="h-full rounded-lg shadow-xl border-border/50 bg-card overflow-auto">
      {renderContent()}
    </Card>
  );
};

export default ReflectionExplanationSidePanel;
