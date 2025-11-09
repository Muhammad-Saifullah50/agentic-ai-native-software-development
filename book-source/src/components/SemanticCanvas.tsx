import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card } from 'react-bootstrap';
import * as d3 from 'd3';
import { Node, Edge } from '../types/graph';

interface SemanticCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (node: Node) => void;
  onEdgeClick?: (edge: Edge) => void;
}

const SemanticCanvas: React.FC<SemanticCanvasProps> = ({ nodes, edges, onNodeClick, onEdgeClick }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const cardBodyRef = useRef<HTMLDivElement | null>(null); // Ref for the Card.Body
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Log component mount/unmount
  useEffect(() => {
    console.log('SemanticCanvas mounted');
    return () => {
      console.log('SemanticCanvas unmounted');
    };
  }, []);

  const renderGraph = useCallback(() => {
    console.log('Rendering graph with nodes:', nodes.length, 'edges:', edges.length, 'dimensions:', dimensions);
    if (!svgRef.current || nodes.length === 0 || dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    svg.selectAll('*').remove(); // Clear previous render

    // Initialize tooltip if it doesn't exist
    if (!tooltipRef.current) {
      tooltipRef.current = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', 'white')
        .style('border', '1px solid #ccc')
        .style('padding', '5px')
        .style('border-radius', '3px')
        .style('pointer-events', 'none')
        .node();
    }
    const tooltip = d3.select(tooltipRef.current);

    const simulation = d3.forceSimulation<Node, Edge>(nodes)
      .force('link', d3.forceLink<Node, Edge>(edges).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.metadata.explanation.length / 10))
      .on('click', (event, d) => {
        onEdgeClick && onEdgeClick(d);
      })
      .on('mouseenter', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`<strong>Edge:</strong> ${d.label}<br/><em>${d.metadata.explanation}</em>`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseleave', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 10)
      .attr('fill', d => {
        switch (d.zone) {
          case 'perception': return '#1f77b4';
          case 'reasoning': return '#ff7f0e';
          case 'action': return '#2ca02c';
          case 'memory': return '#d62728';
          default: return '#9467bd';
        }
      })
      .call(d3.drag<SVGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        onNodeClick && onNodeClick(d);
      })
      .on('mouseenter', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`<strong>Node:</strong> ${d.label}<br/><em>${d.metadata.description}</em>`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseleave', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    const labels = svg.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '10px')
      .attr('fill', 'black')
      .text(d => d.label);

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x || 0)
        .attr('y1', d => (d.source as Node).y || 0)
        .attr('x2', d => (d.target as Node).x || 0)
        .attr('y2', d => (d.target as Node).y || 0);

      node
        .attr('cx', d => d.x || 0)
        .attr('cy', d => d.y || 0);

      labels
        .attr('x', d => d.x || 0)
        .attr('y', d => d.y ? d.y + 15 : 15);
    });

    function dragstarted(event: d3.D3DragEvent<SVGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGElement, Node, Node>) {
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
        if (entry.target === cardBodyRef.current) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });

    if (cardBodyRef.current) {
      resizeObserver.observe(cardBodyRef.current);
    }

    // Cleanup tooltip and observer on component unmount
    return () => {
      if (tooltipRef.current) {
        d3.select(tooltipRef.current).remove();
        tooltipRef.current = null;
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Card className="mb-3">
      <Card.Header as="h5">Semantic Canvas</Card.Header>
      <Card.Body ref={cardBodyRef} style={{ height: '500px', border: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {nodes.length === 0 ? (
          <p className="text-muted">Workflow visualization will appear here.</p>
        ) : (
          <svg ref={svgRef} width="100%" height="100%"></svg>
        )}
      </Card.Body>
    </Card>
  );
};

export default SemanticCanvas;
