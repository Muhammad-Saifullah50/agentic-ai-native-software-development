import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
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
  onEdgeClick
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const renderGraph = useCallback(() => {
    if (!svgRef.current || nodes.length === 0 || dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // clear previous

    // Tooltip
    let tooltip = d3.select('body').select('.graph-tooltip');
    if (tooltip.empty()) {
      tooltip = d3.select('body')
        .append('div')
        .attr('class', 'graph-tooltip fixed opacity-0 bg-popover text-popover-foreground border border-border rounded-md px-3 py-2 text-sm shadow-md pointer-events-none z-50 transition-opacity duration-200')
        .style('max-width', '300px');
    }

    const simulation = d3.forceSimulation<Node, Edge>(nodes)
      .force('link', d3.forceLink<Node, Edge>(edges).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius(35));

    // Arrow markers
    svg.append('defs').selectAll('marker')
      .data(['perception', 'reasoning', 'action', 'memory', 'default'])
      .join('marker')
      .attr('id', d => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', d => {
        switch (d) {
          case 'perception': return 'hsl(217 91% 60%)';
          case 'reasoning': return 'hsl(38 92% 50%)';
          case 'action': return 'hsl(142 76% 36%)';
          case 'memory': return 'hsl(0 84% 60%)';
          default: return 'hsl(217 91% 60%)';
        }
      })
      .attr('d', 'M0,-5L10,0L0,5');

    // Draw edges
    const link = svg.append('g')
      .selectAll('line')
      .data(edges || [])
      .join('line')
      .attr('stroke', d => {
        const sourceId = typeof d.source === 'object' ? d.source?.id : d.source;
        const sourceNode = nodes.find(n => n.id === sourceId);
        const zone = sourceNode?.zone || 'default';
        switch (zone) {
          case 'perception': return 'hsl(217 91% 60%)';
          case 'reasoning': return 'hsl(38 92% 50%)';
          case 'action': return 'hsl(142 76% 36%)';
          case 'memory': return 'hsl(0 84% 60%)';
          default: return 'hsl(217 91% 60%)';
        }
      })
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', d => {
        const sourceId = typeof d.source === 'object' ? d.source?.id : d.source;
        const sourceNode = nodes.find(n => n.id === sourceId);
        return `url(#arrow-${sourceNode?.zone || 'default'})`;
      })
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onEdgeClick && onEdgeClick(d);
      })
      .on('mouseenter', (event, d) => {
        tooltip.transition().duration(200).style('opacity', '1');
        const label = d.label || 'Connection';
        const explanation = d.metadata?.explanation || 'No explanation available';
        tooltip.html(`<div class="font-semibold">${label}</div><div class="text-muted-foreground text-xs mt-1">${explanation}</div>`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseleave', () => {
        tooltip.transition().duration(200).style('opacity', '0');
      });

    // Draw nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes || [])
      .join('g')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeClick && onNodeClick(d);
      });

    node.append('circle')
      .attr('r', 20)
      .attr('fill', d => {
        const zone = d.zone || 'default';
        switch (zone) {
          case 'perception': return 'hsl(217 91% 60%)';
          case 'reasoning': return 'hsl(38 92% 50%)';
          case 'action': return 'hsl(142 76% 36%)';
          case 'memory': return 'hsl(0 84% 60%)';
          default: return 'hsl(217 91% 60%)';
        }
      })
      .attr('stroke', 'hsl(var(--background))')
      .attr('stroke-width', 2)
      .on('mouseenter', function(event, d) {
        d3.select(this).transition().duration(200).attr('r', 24);
        tooltip.transition().duration(200).style('opacity', '1');
        const label = d.label || 'Node';
        const description = d.metadata?.description || 'No description available';
        tooltip.html(`<div class="font-semibold">${label}</div><div class="text-muted-foreground text-xs mt-1">${description}</div>`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseleave', function() {
        d3.select(this).transition().duration(200).attr('r', 20);
        tooltip.transition().duration(200).style('opacity', '0');
      });

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 35)
      .attr('class', 'text-xs font-medium fill-foreground')
      .text(d => d.label || '');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (typeof d.source === 'object' ? d.source?.x : nodes.find(n => n.id === d.source)?.x) || 0)
        .attr('y1', d => (typeof d.source === 'object' ? d.source?.y : nodes.find(n => n.id === d.source)?.y) || 0)
        .attr('x2', d => (typeof d.target === 'object' ? d.target?.x : nodes.find(n => n.id === d.target)?.x) || 0)
        .attr('y2', d => (typeof d.target === 'object' ? d.target?.y : nodes.find(n => n.id === d.target)?.y) || 0);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }, [nodes, edges, onNodeClick, onEdgeClick, dimensions]);

  useEffect(() => {
    renderGraph();
  }, [renderGraph]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === containerRef.current) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      d3.select('.graph-tooltip').remove();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Card className="h-[600px] flex flex-col shadow-xl border-border/50 animate-fade-in">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="text-lg font-semibold">Workflow Canvas</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0" ref={containerRef}>
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
          <svg ref={svgRef} width="100%" height="100%" className="bg-card"></svg>
        )}
      </CardContent>
    </Card>
  );
};

export default SemanticCanvas;
