import React, { useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SimulationPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ onPlay, onPause, onStep, onReset }) => {
  useEffect(() => {
    console.log('SimulationPanel mounted');
    return () => {
      console.log('SimulationPanel unmounted');
    };
  }, []);

  return (
    <Card className="shadow-lg border-border/50 bg-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Simulation controls">
          <Button 
            size="sm"
            title="Play Simulation" 
            onClick={onPlay}
            className="gap-2 bg-success hover:bg-success/90 text-success-foreground transition-colors"
          >
            <Play className="h-4 w-4" />
            Play
          </Button>
          <Button 
            size="sm"
            title="Pause Simulation" 
            onClick={onPause}
            className="gap-2 bg-warning hover:bg-warning/90 text-warning-foreground transition-colors"
          >
            <Pause className="h-4 w-4" />
            Pause
          </Button>
          <Button 
            size="sm"
            title="Step Forward" 
            onClick={onStep}
            className="gap-2 bg-info hover:bg-info/90 text-info-foreground transition-colors"
          >
            <SkipForward className="h-4 w-4" />
            Step
          </Button>
          <Button 
            size="sm"
            title="Reset Simulation" 
            onClick={onReset}
            className="gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationPanel;
