/*
  Reasoning Graph (Golden Thread)
  --------------------------------
  Stores nodes + edges.
*/

const ReasoningGraph = {

  nodes: [],
  edges: [],

  addNode(text, type = "claim") {
    const id = this.nodes.length + 1;
    this.nodes.push({id, text, type});
    return id;
  },

  addEdge(fromId, toId, type = "supports") {
    this.edges.push({fromId, toId, type});
  },

  render() {
    let out = "";
    this.nodes.forEach(n=> {
      out += `[${n.id}] (${n.type}) ${n.text}\n`;
    });
    return out;
  }
};
