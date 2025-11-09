import React, { useEffect } from 'react';
import { Card, ListGroup } from 'react-bootstrap';

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
  // Log component mount/unmount
  useEffect(() => {
    console.log('ScenarioFeedbackScoring mounted');
    return () => {
      console.log('ScenarioFeedbackScoring unmounted');
    };
  }, []);

  // Log prop changes
  useEffect(() => {
    console.log('ScenarioFeedbackScoring props changed:', { score, violatedPrinciples, missingComponents, suggestedImprovements, summary });
  }, [score, violatedPrinciples, missingComponents, suggestedImprovements, summary]);

  return (
    <Card className="mb-3">
      <Card.Header as="h5">Scenario Feedback & Scoring</Card.Header>
      <Card.Body style={{ minHeight: '200px' }}>
        {score !== null ? (
          <div>
            <h5>Score: {score}/100</h5>
            {summary && <p><strong>Summary:</strong> {summary}</p>}

            {violatedPrinciples.length > 0 && (
              <>
                <h6>Violated Principles:</h6>
                <ListGroup className="mb-2">
                  {violatedPrinciples.map((p, index) => (
                    <ListGroup.Item key={index} variant="danger">{p}</ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}

            {missingComponents.length > 0 && (
              <>
                <h6>Missing Components:</h6>
                <ListGroup className="mb-2">
                  {missingComponents.map((c, index) => (
                    <ListGroup.Item key={index} variant="warning">{c}</ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}

            {suggestedImprovements.length > 0 && (
              <>
                <h6>Suggested Improvements:</h6>
                <ListGroup>
                  {suggestedImprovements.map((i, index) => (
                    <ListGroup.Item key={index} variant="info">{i}</ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}
          </div>
        ) : (
          <p className="text-muted">Feedback and scoring details will appear here after simulation.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default ScenarioFeedbackScoring;
