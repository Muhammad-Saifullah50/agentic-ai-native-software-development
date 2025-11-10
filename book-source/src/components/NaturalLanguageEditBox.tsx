import React, { useState, useEffect } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NaturalLanguageEditBoxProps {
  onNaturalLanguageCommand: (command: string) => void;
  isNLCommandLoading: boolean;
}

const NaturalLanguageEditBox: React.FC<NaturalLanguageEditBoxProps> = ({ onNaturalLanguageCommand, isNLCommandLoading }) => {
  const [command, setCommand] = useState('');

  useEffect(() => {
    console.log('NaturalLanguageEditBox mounted');
    return () => {
      console.log('NaturalLanguageEditBox unmounted');
    };
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (command.trim() && !isNLCommandLoading) {
      console.log('Natural language command submitted:', command);
      onNaturalLanguageCommand(command);
      setCommand('');
    }
  };

  return (
    <Card className="shadow-lg border-border/50 bg-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Natural Language Workflow Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="e.g., 'Add a memory agent before the classifier'"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="flex-1 bg-background border-border focus:ring-2 focus:ring-primary"
              disabled={isNLCommandLoading}
            />
            <Button
              type="submit"
              className="gap-2 bg-primary hover:bg-primary/90 transition-colors"
              disabled={isNLCommandLoading}
            >
              {isNLCommandLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              Apply
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Type commands to modify the workflow using natural language.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default NaturalLanguageEditBox;
