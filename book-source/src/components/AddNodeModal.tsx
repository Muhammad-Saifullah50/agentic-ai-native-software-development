import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (type: 'agent' | 'tool', name: string) => void;
}

const AddNodeModal: React.FC<AddNodeModalProps> = ({ isOpen, onClose, onAddNode }) => {
  const [nodeType, setNodeType] = useState<'agent' | 'tool'>('agent');
  const [nodeName, setNodeName] = useState('');

  const handleAdd = () => {
    if (nodeName.trim()) {
      onAddNode(nodeType, nodeName);
      onClose();
      setNodeName('');
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Add New Node</ModalTitle>
          <ModalDescription>
            Select the type of node and give it a name.
          </ModalDescription>
        </ModalHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="node-type" className="text-right">
              Type
            </Label>
            <Select value={nodeType} onValueChange={(value: 'agent' | 'tool') => setNodeType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a node type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="tool">Tool</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="node-name" className="text-right">
              Name
            </Label>
            <Input
              id="node-name"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 'Classifier Agent'"
            />
          </div>
        </div>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </ModalClose>
          <Button onClick={handleAdd}>Add Node</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddNodeModal;
