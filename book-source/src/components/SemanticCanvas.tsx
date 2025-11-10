import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';



// Type definitions
interface Node {
  id: string;
  label?: string;
  x?: number;
  y?: number;
  zone?: 'perception' | 'reasoning' | 'action' | 'memory';
  metadata?: {
    description?: string;
    [key: string]: any;
  };
}

interface Edge {
  id?: string;
  source: string | { id: string };
  target: string | { id: string };
  label?: string;
  metadata?: {
    explanation?: string;
    [key: string]: any;
  };
}

interface SemanticCanvasProps {
  nodes?: Node[];
  edges?: Edge[];
  onNodeClick?: (node: Node) => void;
  onEdgeClick?: (edge: Edge) => void;
}

const SemanticCanvas: React.FC<SemanticCanvasProps> = ({
  nodes = [],
  edges = [],
  onNodeClick,
  onEdgeClick,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [rfNodes, setRfNodes] = useState([]);
  const [rfEdges, setRfEdges] = useState([]);

  useEffect(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB' });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 150, height: 50 });
    });

    edges.forEach((edge) => {
      const sourceId = typeof edge.source === 'object' ? edge.source.id : String(edge.source);
      const targetId = typeof edge.target === 'object' ? edge.target.id : String(edge.target);
      dagreGraph.setEdge(sourceId, targetId);
    });

    dagre.layout(dagreGraph);

    const newRfNodes = nodes.map(n => {
      const nodeWithPosition = dagreGraph.node(n.id);
      return {
        id: n.id,
        position: { x: nodeWithPosition.x, y: nodeWithPosition.y },
        data: {
          label: n.label,
          metadata: n.metadata,
          zone: n.zone,
          originalNode: n,
        },
        style: {
          background:
            (() => {
              switch (n.zone) {
                case 'perception': return 'hsl(217 91% 60%)';
                case 'reasoning':  return 'hsl(38 92% 50%)';
                case 'action':     return 'hsl(142 76% 36%)';
                case 'memory':     return 'hsl(0 84% 60%)';
                default:           return 'hsl(217 91% 60%)';
              }
            })(),
          stroke: 'var(--background)',
          strokeWidth: 2,
          cursor: 'pointer',
        }
      }
    });
    setRfNodes(newRfNodes);
  }, [nodes, edges]);

  useEffect(() => {
    const newRfEdges = edges.map(e => {
      const sourceId = typeof e.source === 'object' ? e.source.id : String(e.source);
      const sourceNode = nodes.find(n => n.id === sourceId);
      const zone = sourceNode?.zone || 'default';
      const color =
        (() => {
          switch (zone) {
            case 'perception': return 'hsl(217 91% 60%)';
            case 'reasoning':  return 'hsl(38 92% 50%)';
            case 'action':     return 'hsl(142 76% 36%)';
            case 'memory':     return 'hsl(0 84% 60%)';
            default:           return 'hsl(217 91% 60%)';
          }
        })();

      return {
        id: e.id ?? `${sourceId}-${(typeof e.target === 'object' ? e.target.id : String(e.target))}`,
        source: sourceId,
        target: typeof e.target === 'object' ? e.target.id : String(e.target),
        data: {
          label: e.label,
          metadata: e.metadata,
          originalEdge: e,
        },
        style: {
          stroke: color,
          strokeWidth: 2,
          strokeOpacity: 0.6,
          cursor: 'pointer',
        },
        markerEnd: {
          type: 'arrowclosed',
          color: color,
        }
      };
    });
    setRfEdges(newRfEdges);
  }, [edges, nodes]);

  const onNodesChange = useCallback(
    (changes) => setRfNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setRfEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const onConnect = useCallback(
    (params) => setRfEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  useEffect(() => {
    let tooltip = document.querySelector('.graph-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'graph-tooltip fixed opacity-0 bg-popover text-popover-foreground border border-border rounded-md px-3 py-2 text-sm shadow-md pointer-events-none z-50 transition-opacity duration-200';
      tooltip.style.maxWidth = '300px';
      document.body.appendChild(tooltip);
    }
    return () => {
      tooltip?.remove();
    };
  }, []);

  const showTooltip = useCallback((content, x, y) => {
    const tooltip = document.querySelector('.graph-tooltip');
    if (tooltip) {
      tooltip.innerHTML = content;
      tooltip.style.left = `${x + 10}px`;
      tooltip.style.top = `${y - 28}px`;
      tooltip.style.opacity = '1';
    }
  }, []);

  const hideTooltip = useCallback(() => {
    const tooltip = document.querySelector('.graph-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
    }
  }, []);

  const handleNodeClick = useCallback((event, node) => {
    event.stopPropagation();
    const original = node.data.originalNode;
    if (onNodeClick && original) {
      onNodeClick(original);
    }
  }, [onNodeClick]);

  const handleEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    const original = edge.data.originalEdge;
    if (onEdgeClick && original) {
      onEdgeClick(original);
    }
  }, [onEdgeClick]);

  const handleNodeMouseEnter = useCallback((event, node) => {
    const original = node.data.originalNode;
    const label = original.label || 'Node';
    const description = original.metadata?.description || 'No description available';
    const content = `<div class="font-semibold">${label}</div><div class="text-muted-foreground text-xs mt-1">${description}</div>`;
    showTooltip(content, event.pageX, event.pageY);
  }, [showTooltip]);

  const handleNodeMouseLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  const handleEdgeMouseEnter = useCallback((event, edge) => {
    const original = edge.data.originalEdge;
    const label = original.label || 'Connection';
    const explanation = original.metadata?.explanation || 'No explanation available';
    const content = `<div class="font-semibold">${label}</div><div class="text-muted-foreground text-xs mt-1">${explanation}</div>`;
    showTooltip(content, event.pageX, event.pageY);
  }, [showTooltip]);

  const handleEdgeMouseLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  return (
    <Card className="h-[600px] flex flex-col shadow-xl border-border/50 animate-fade-in">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="text-lg font-semibold">Workflow Canvas</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0" ref={wrapperRef}>
        {nodes.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center p-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Canvas Ready</h3>
              <p className="text-sm text-muted-foreground">Your workflow visualization will appear here</p>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
              nodes={rfNodes}
              edges={rfEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              onNodeMouseEnter={handleNodeMouseEnter}
              onNodeMouseLeave={handleNodeMouseLeave}
              onEdgeMouseEnter={handleEdgeMouseEnter}
              onEdgeMouseLeave={handleEdgeMouseLeave}
              fitView
              nodesDraggable={true}
              nodesSelectable={true}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SemanticCanvas;