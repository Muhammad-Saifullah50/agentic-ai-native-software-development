import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link2, Unlink, Undo, Redo, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AddNodeModal from './AddNodeModal';

interface GraphEditToolbarProps {
  onAddNode: (type: 'agent' | 'tool', name: string) => void;
  onDeleteNode: () => void;
  onAddConnection: () => void;
  onRemoveConnection: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onGetAIFeedback: () => void;
  isFeedbackDisabled: boolean;
}

const GraphEditToolbar: React.FC<GraphEditToolbarProps> = ({
  onAddNode,
  onDeleteNode,
  onAddConnection,
  onRemoveConnection,
  onUndo,
  onRedo,
  onGetAIFeedback,
  isFeedbackDisabled,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodeTypeToAdd, setNodeTypeToAdd] = useState<'agent' | 'tool'>('agent');

  useEffect(() => {
    console.log('GraphEditToolbar mounted');
    return () => {
      console.log('GraphEditToolbar unmounted');
    };
  }, []);

  const handleAddNodeClick = (type: 'agent' | 'tool') => {
    setNodeTypeToAdd(type);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="shadow-lg border-border/50 bg-card animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Graph Edit Toolbar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Graph editing controls">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  title="Add Node"
                  className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Node
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleAddNodeClick('agent')}>
                  Add Agent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddNodeClick('tool')}>
                  Add Tool
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              title="Delete Node"
              onClick={onDeleteNode}
              className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Node
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="Add Connection"
              onClick={onAddConnection}
              className="gap-2 hover:bg-info hover:text-info-foreground transition-colors"
            >
              <Link2 className="h-4 w-4" />
              Add Connection
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="Remove Connection"
              onClick={onRemoveConnection}
              className="gap-2 hover:bg-warning hover:text-warning-foreground transition-colors"
            >
              <Unlink className="h-4 w-4" />
              Remove Connection
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="Undo"
              onClick={onUndo}
              className="gap-2 hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              <Undo className="h-4 w-4" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="Redo"
              onClick={onRedo}
              className="gap-2 hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              <Redo className="h-4 w-4" />
              Redo
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="Get AI Feedback"
              onClick={onGetAIFeedback}
              disabled={isFeedbackDisabled}
              className="gap-2 hover:bg-success hover:text-success-foreground transition-colors"
            >
              <Wand2 className="h-4 w-4" />
              Get AI Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
      <AddNodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddNode={onAddNode}
      />
    </>
  );
};

export default GraphEditToolbar;
