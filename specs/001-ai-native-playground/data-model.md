# Data Model: AI-Native Scenario Playground

This document describes the core data models used within the AI-Native Scenario Playground frontend application, primarily for representing the visual workflow on the Semantic Canvas. These models are derived from the `spec.md` and will be used for rendering and manipulating the agent network.

## 1. Node Model

Represents an individual component within the AI-native workflow, such as an agent, tool, database, input, or output.

```typescript
interface Node {
    id: string; // Unique identifier for the node
    type: "agent" | "tool" | "db" | "input" | "output"; // Type of the node
    label: string; // Display name of the node
    zone: "perception" | "reasoning" | "action" | "memory"; // Semantic zone of the node
    metadata: {
        description?: string; // Detailed description of the node
        principles?: string[]; // AI-native principles applied by this node
        reflection_points?: string[]; // Points for user reflection/learning
    };
}
```

**Fields**:

*   `id`: A unique string identifier for the node.
*   `type`: Defines the functional role of the node within the workflow.
    *   `"agent"`: An AI agent performing a specific task.
    *   `"tool"`: An external tool or API used by an agent.
    *   `"db"`: A database or data store.
    *   `"input"`: An input source for the workflow.
    *   `"output"`: An output destination for the workflow.
*   `label`: A human-readable name displayed on the canvas.
*   `zone`: Categorizes the node based on its role in the AI agent's cognitive process.
    *   `"perception"`: Nodes responsible for gathering information.
    *   `"reasoning"`: Nodes responsible for processing information and making decisions.
    *   `"action"`: Nodes responsible for executing tasks or interacting with the environment.
    *   `"memory"`: Nodes responsible for storing and retrieving information.
*   `metadata`: An object containing additional descriptive and pedagogical information.
    *   `description`: A brief explanation of the node's purpose.
    *   `principles`: A list of AI-native principles (from the book) that this node exemplifies.
    *   `reflection_points`: Questions or prompts to encourage user reflection on the node's design.

## 2. Edge Model

Represents a connection or data flow between two nodes in the AI-native workflow.

```typescript
interface Edge {
    id: string; // Unique identifier for the edge
    from: string; // The `id` of the source node
    to: string; // The `id` of the target node
    label?: string; // Optional label for the connection (e.g., "data flow", "trigger")
    metadata: {
        explanation?: string; // Explanation of the connection's purpose
        principle_reference?: string; // Reference to an AI-native principle related to this connection
    };
}
```

**Fields**:

*   `id`: A unique string identifier for the edge.
*   `from`: The `id` of the source `Node` from which the connection originates.
*   `to`: The `id` of the target `Node` to which the connection leads.
*   `label`: An optional human-readable label for the edge, describing the nature of the connection (e.g., "data flow", "control flow", "trigger").
*   `metadata`: An object containing additional descriptive and pedagogical information.
    *   `explanation`: A brief explanation of what the connection represents.
    *   `principle_reference`: A reference to an AI-native principle (from the book) that this connection exemplifies.

## 3. Workflow Data Structure

The overall workflow displayed on the Semantic Canvas will be a collection of `Node` and `Edge` objects.

```typescript
interface Workflow {
    nodes: Node[];
    edges: Edge[];
}
```

This `Workflow` structure will be the primary data representation for the Semantic Canvas, allowing for rendering, manipulation, and serialization of the AI-native scenario.
