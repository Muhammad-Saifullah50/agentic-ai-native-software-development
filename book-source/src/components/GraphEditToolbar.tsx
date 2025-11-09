import React, { useEffect } from 'react';
import { ButtonGroup, Button, Card } from 'react-bootstrap';
import { FaPlus, FaTrash, FaLink, FaUnlink, FaUndo, FaRedo } from 'react-icons/fa';

interface GraphEditToolbarProps {
  onAddNode: () => void;
  onDeleteNode: () => void;
  onAddConnection: () => void;
  onRemoveConnection: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

const GraphEditToolbar: React.FC<GraphEditToolbarProps> = ({
  onAddNode,
  onDeleteNode,
  onAddConnection,
  onRemoveConnection,
  onUndo,
  onRedo,
}) => {
  // Log component mount/unmount
  useEffect(() => {
    console.log('GraphEditToolbar mounted');
    return () => {
      console.log('GraphEditToolbar unmounted');
    };
  }, []);

  return (
    <Card className="mb-3">
      <Card.Header as="h5">Graph Edit Toolbar</Card.Header>
      <Card.Body>
        <ButtonGroup aria-label="Graph editing controls" className="d-flex flex-wrap">
          <Button variant="outline-primary" title="Add Node" onClick={onAddNode} className="m-1">
            <FaPlus /> Add Node
          </Button>
          <Button variant="outline-danger" title="Delete Node" onClick={onDeleteNode} className="m-1">
            <FaTrash /> Delete Node
          </Button>
          <Button variant="outline-info" title="Add Connection" onClick={onAddConnection} className="m-1">
            <FaLink /> Add Connection
          </Button>
          <Button variant="outline-warning" title="Remove Connection" onClick={onRemoveConnection} className="m-1">
            <FaUnlink /> Remove Connection
          </Button>
          <Button variant="outline-secondary" title="Undo" onClick={onUndo} className="m-1">
            <FaUndo /> Undo
          </Button>
          <Button variant="outline-secondary" title="Redo" onClick={onRedo} className="m-1">
            <FaRedo /> Redo
          </Button>
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
};

export default GraphEditToolbar;
