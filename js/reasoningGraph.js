/*
  Reasoning Graph
  ----------------
  Stores nodes + edges and renders a force-directed graph.
*/

const ReasoningGraph = {

  nodes: [],
  edges: [],

  nodeStyles: {
    claim : {color:"#cccccc"},
    definition : {color:"#6fa8dc"},
    assumption : {color:"#f6b26b"},
    implication : {color:"#93c47d"},
    justification : {color:"#ffd966"},
    evidence : {color:"#8e7cc3"},
    counterexample : {color:"#e06666"},
    question : {color:"#76a5af"},
    alternative : {color:"#3fa9f5"}   // ⭐ NEW: needed for SocraticEngine
  },

  addNode(text, type = "claim") {
    const id = this.nodes.length + 1;
    const style = this.nodeStyles[type] || this.nodeStyles.claim;
    this.nodes.push({ id, text, type, color: style.color });
    return id;
  },

  addEdge(fromId, toId, type = "supports") {
    this.edges.push({ fromId, toId, type });
  },

  // ⭐ NEW: Obsidian-style force-directed graph renderer
  renderGraph() {
    const width = 800;
    const height = 600;

    const svg = d3.select("#graph")
      .html("") // clear previous graph
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const simulation = d3.forceSimulation(this.nodes)
      .force("link", d3.forceLink(this.edges).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(this.edges)
      .enter().append("line")
      .attr("stroke-width", 2);

    const node = svg.append("g")
      .selectAll("circle")
      .data(this.nodes)
      .enter().append("circle")
      .attr("r", 18)
      .attr("fill", d => d.color)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    const label = svg.append("g")
      .selectAll("text")
      .data(this.nodes)
      .enter().append("text")
      .text(d => d.text)
      .attr("font-size", "12px")
      .attr("dx", 22)
      .attr("dy", 4);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
};
