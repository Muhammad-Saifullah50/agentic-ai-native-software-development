import React, { useState } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ScenarioInputPanelProps {
  onWorkflowGenerated: (nodes: any[], edges: any[], simulationId: string) => void;
  setGlobalError: (error: string | null) => void;
}

const ScenarioInputPanel: React.FC<ScenarioInputPanelProps> = ({ onWorkflowGenerated, setGlobalError }) => {
  const [scenarioText, setScenarioText] = useState<string>('');
  const [scenarioType, setScenarioType] = useState<string>('marketing');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    setGlobalError(null);

    if (!scenarioText.trim()) {
      setLocalError('Scenario description cannot be empty.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual implementation
      const newSimulationId = `sim-${Date.now()}`;
      // const response = await simulateScenario(newSimulationId, scenarioText, scenarioType);
      // onWorkflowGenerated(response.nodes, response.edges, response.simulationId);
      
      // Mock response for demonstration
      setTimeout(() => {
        const mockNodes = [
          { id: '1', label: 'Start Node', type: 'agent', zone: 'perception', metadata: { description: 'Entry point' } }
        ];
        const mockEdges: any[] = [];
        onWorkflowGenerated(mockNodes, mockEdges, newSimulationId);
        setIsLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error('Failed to generate workflow:', error);
      setGlobalError(error.message || 'An unexpected error occurred during simulation.');
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-border/50 bg-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Scenario Input</CardTitle>
      </CardHeader>
      <CardContent>
        {localError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="flex items-start justify-between gap-2">
              <span className="flex-1">{localError}</span>
              <button
                onClick={() => setLocalError(null)}
                className="text-destructive-foreground hover:text-destructive-foreground/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scenarioText" className="text-sm font-medium">
              Describe your AI-Native Scenario:
            </Label>
            <Textarea
              id="scenarioText"
              placeholder="Enter a detailed description of the AI workflow you want to generate..."
              value={scenarioText}
              onChange={(e) => setScenarioText(e.target.value)}
              rows={5}
              disabled={isLoading}
              className="resize-none bg-background border-border focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scenarioType" className="text-sm font-medium">
              Scenario Type:
            </Label>
            <Select 
              value={scenarioType} 
              onValueChange={setScenarioType}
              disabled={isLoading}
            >
              <SelectTrigger id="scenarioType" className="bg-background border-border">
                <SelectValue placeholder="Select scenario type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="customer_support">Customer Support</SelectItem>
                <SelectItem value="data_analysis">Data Analysis</SelectItem>
                <SelectItem value="content_creation">Content Creation</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 transition-colors gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Workflow...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Workflow
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScenarioInputPanel;
