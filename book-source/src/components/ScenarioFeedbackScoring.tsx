import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ScenarioFeedbackScoringProps {
  score: number | null;
  violatedPrinciples: string[];
  missingComponents: string[];
  suggestedImprovements: string[];
  summary: string | null;
}

const ScenarioFeedbackScoring: React.FC<ScenarioFeedbackScoringProps> = ({
  score,
  violatedPrinciples,
  missingComponents,
  suggestedImprovements,
  summary,
}) => {
  useEffect(() => {
    console.log('ScenarioFeedbackScoring mounted');
    return () => {
      console.log('ScenarioFeedbackScoring unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('ScenarioFeedbackScoring props changed:', { score, violatedPrinciples, missingComponents, suggestedImprovements, summary });
  }, [score, violatedPrinciples, missingComponents, suggestedImprovements, summary]);

  return (
    <Card className="shadow-lg border-border/50 bg-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Scenario Feedback & Scoring</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[200px]">
        {score !== null ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">Score</h3>
              <Badge 
                variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}
                className="text-lg px-4 py-1"
              >
                {score}/100
              </Badge>
            </div>

            {summary && (
              <>
                <Separator />
                <div>
                  <span className="text-sm font-semibold text-foreground">Summary:</span>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{summary}</p>
                </div>
              </>
            )}

            {violatedPrinciples.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    Violated Principles
                  </h4>
                  <div className="space-y-2">
                    {violatedPrinciples.map((p, index) => (
                      <Alert key={index} variant="destructive" className="py-2">
                        <AlertDescription className="text-sm">{p}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </>
            )}

            {missingComponents.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Missing Components
                  </h4>
                  <div className="space-y-2">
                    {missingComponents.map((c, index) => (
                      <Alert key={index} className="border-warning/50 bg-warning/10 py-2">
                        <AlertDescription className="text-sm text-foreground">{c}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </>
            )}

            {suggestedImprovements.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Info className="h-4 w-4 text-info" />
                    Suggested Improvements
                  </h4>
                  <div className="space-y-2">
                    {suggestedImprovements.map((i, index) => (
                      <Alert key={index} className="border-info/50 bg-info/10 py-2">
                        <AlertDescription className="text-sm text-foreground">{i}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[180px]">
            <p className="text-muted-foreground text-center">
              Feedback and scoring details will appear here after simulation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScenarioFeedbackScoring;
