import React, { useState, useEffect } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { FaMagic } from 'react-icons/fa';

interface NaturalLanguageEditBoxProps {
  onNaturalLanguageCommand: (command: string) => void;
}

const NaturalLanguageEditBox: React.FC<NaturalLanguageEditBoxProps> = ({ onNaturalLanguageCommand }) => {
  const [command, setCommand] = useState('');

  // Log component mount/unmount
  useEffect(() => {
    console.log('NaturalLanguageEditBox mounted');
    return () => {
      console.log('NaturalLanguageEditBox unmounted');
    };
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (command.trim()) {
      console.log('Natural language command submitted:', command);
      onNaturalLanguageCommand(command);
      setCommand('');
    }
  };

  return (
    <Card className="mb-3">
      <Card.Header as="h5">Natural Language Workflow Editor</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-2">
            <Form.Control
              type="text"
              placeholder="e.g., 'Add a memory agent before the classifier'"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
            />
            <Button variant="primary" type="submit">
              <FaMagic /> Apply
            </Button>
          </InputGroup>
        </Form>
        <small className="text-muted mt-2 d-block">
          Type commands to modify the workflow using natural language.
        </small>
      </Card.Body>
    </Card>
  );
};

export default NaturalLanguageEditBox;
