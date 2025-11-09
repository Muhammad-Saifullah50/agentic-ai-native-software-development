// book-source/src/types/graph.ts

export interface Node {
  id: string;
  type: "agent" | "tool" | "db" | "input" | "output";
  label: string;
  zone: "perception" | "reasoning" | "action" | "memory";
  metadata: {
    description: string;
    principles: string[];
    reflection_points: string[];
  };
}

export interface Edge {
  id: string;
  source: string; // Changed from 'from' to 'source' to align with common graph libraries like React Flow
  target: string; // Changed from 'to' to 'target'
  label: string;
  metadata: {
    explanation: string;
    principle_reference: string;
  };
}
