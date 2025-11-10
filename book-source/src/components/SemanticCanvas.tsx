import React, { useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  OnConnect,
  Node as RFNode,
  Edge as RFEdge,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Node, Edge } from '@/types/graph';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SemanticCanvasProps {
  nodes?: Node[];  // optional, default to []
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

  // Convert your nodes/edges to React Flow format
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const newRfNodes: RFNode[] = nodes.map(n => ({
      id: n.id,
      position: { x: n.x ?? 0, y: n.y ?? 0 },
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
    }));
    setRfNodes(newRfNodes);
  }, [nodes]);

  useEffect(() => {
    const newRfEdges: RFEdge[] = edges.map(e => {
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
  }, [edges, nodes]); // Depend on nodes as well, since edge color depends on source node's zone

  const onConnect: OnConnect = useCallback(
    params => setRfEdges(eds => addEdge(params, eds)),
    [setRfEdges]
  );

  // Tooltip setup (DOM element)
  useEffect(() => {
    let tooltip = document.querySelector('.graph-tooltip') as HTMLDivElement | null;
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

  const showTooltip = useCallback((content: string, x: number, y: number) => {
    const tooltip = document.querySelector('.graph-tooltip') as HTMLDivElement | null;
    if (tooltip) {
      tooltip.innerHTML = content;
      tooltip.style.left = `${x + 10}px`;
      tooltip.style.top = `${y - 28}px`;
      tooltip.style.opacity = '1';
    }
  }, []);

  const hideTooltip = useCallback(() => {
    const tooltip = document.querySelector('.graph-tooltip') as HTMLDivElement | null;
    if (tooltip) {
      tooltip.style.opacity = '0';
    }
  }, []);

  // Node click
  const handleNodeClick = useCallback((event: React.MouseEvent, node: RFNode) => {
    event.stopPropagation();
    const original = node.data.originalNode as Node;
    if (onNodeClick && original) {
      onNodeClick(original);
    }
  }, [onNodeClick]);

  // Edge click
  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: RFEdge) => {
    event.stopPropagation();
    const original = edge.data.originalEdge as Edge;
    if (onEdgeClick && original) {
      onEdgeClick(original);
    }
  }, [onEdgeClick]);

  // Node hover
  const handleNodeMouseEnter = useCallback((event: MouseEvent, node: RFNode) => {
    const original = node.data.originalNode as Node;
    const label = original.label || 'Node';
    const description = original.metadata?.description || 'No description available';
    const content = `<div class="font-semibold">${label}</div><div class="text-muted-foreground text-xs mt-1">${description}</div>`;
    showTooltip(content, event.pageX, event.pageY);
  }, [showTooltip]);

  const handleNodeMouseLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  // Edge hover
  const handleEdgeMouseEnter = useCallback((event: MouseEvent, edge: RFEdge) => {
    const original = edge.data.originalEdge as Edge;
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v‑6a2 2 0 00‑2‑2H5a2 2 0 00‑2 2v6a2 2 0 002 2h2a2 2 0 0‑2zm0 0V9a2 2 0 012‑2h2a2 2 0 0 2v10m‑6 0a2 2 0 002 2h2a2 2 0 0‑2m0 0V5a2 2 0 012‑2h2a2 2 0 01‑2 2v14a2 2 0 01‑2 2h‑2a2 2 0 0‑2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Canvas Ready</h3>
              <p className="text-sm text-muted-foreground">Your workflow visualization will appear here</p>
            </div>
          </div>
        ) : (
          <ReactFlowProvider>
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
              style={{ width: '100%', height: '100%' }}
              nodesDraggable={true}
              nodesSelectable={true}
            />
          </ReactFlowProvider>
        )}
      </CardContent>
    </Card>
  );
};

export default SemanticCanvas;
