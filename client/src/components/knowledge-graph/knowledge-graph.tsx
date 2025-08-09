import { useEffect, useRef } from "react";

interface GraphNode {
  id: string;
  name: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  category: string;
  difficulty: string;
  estimatedTime: number;
}

interface GraphLink {
  source: string;
  target: string;
}

interface KnowledgeGraphProps {
  data: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
  onNodeSelect?: (node: GraphNode) => void;
}

export default function KnowledgeGraph({ data, onNodeSelect }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length || typeof window === 'undefined' || !window.d3) {
      return;
    }

    const d3 = window.d3;
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous content
    svg.selectAll("*").remove();

    // Set up SVG
    svg.attr("width", width).attr("height", height);

    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(35));

    // Create links
    const link = svg.append("g")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    // Create nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .enter().append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles for nodes
    node.append("circle")
      .attr("r", (d: GraphNode) => {
        if (d.status === 'in_progress') return 25;
        return 20;
      })
      .attr("fill", (d: GraphNode) => {
        switch (d.status) {
          case 'completed': return "#10b981"; // green
          case 'in_progress': return "#3b82f6"; // blue
          default: return "#9ca3af"; // gray
        }
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (onNodeSelect) {
          onNodeSelect(d as GraphNode);
        }
      })
      .on("mouseover", function() {
        d3.select(this).attr("stroke-width", 4);
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke-width", 2);
      });

    // Add labels
    node.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("pointer-events", "none")
      .text((d: GraphNode) => {
        // Show abbreviated name
        const words = d.title.split(' ');
        if (words.length > 1) {
          return words.map(w => w[0]).join('').toUpperCase();
        }
        return d.title.substring(0, 3).toUpperCase();
      });

    // Add tooltips
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "10px")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("font-size", "12px")
      .style("z-index", 1000);

    node.on("mouseover", function(event, d) {
      const nodeData = d as GraphNode;
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html(`
        <strong>${nodeData.title}</strong><br/>
        Status: ${nodeData.status.replace('_', ' ')}<br/>
        Progress: ${nodeData.progress}%<br/>
        Difficulty: ${nodeData.difficulty}<br/>
        Time: ${nodeData.estimatedTime} min
      `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [data, onNodeSelect]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
}
