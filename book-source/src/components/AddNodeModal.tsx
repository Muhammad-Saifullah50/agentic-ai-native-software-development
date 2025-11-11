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
      <ModalContent className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <ModalHeader>
          <ModalTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Add New Node
          </ModalTitle>
          <ModalDescription className="text-sm text-gray-500 dark:text-gray-400">
            Select the type of node and give it a name.
          </ModalDescription>
        </ModalHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="node-type" className="text-right text-gray-700 dark:text-gray-300">
              Type
            </Label>
            <Select
              value={nodeType}
              onValueChange={(value: 'agent' | 'tool') => setNodeType(value)}
            >
              <SelectTrigger className="col-span-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md">
                <SelectValue placeholder="Select a node type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="tool">Tool</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="node-name" className="text-right text-gray-700 dark:text-gray-300">
              Name
            </Label>
            <Input
              id="node-name"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              className="col-span-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md"
              placeholder="e.g., 'Classifier Agent'"
            />
          </div>
        </div>
        <ModalFooter className="space-x-2">
          <ModalClose asChild>
            <Button variant="outline" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
              Cancel
            </Button>
          </ModalClose>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
            Add Node
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddNodeModal;
