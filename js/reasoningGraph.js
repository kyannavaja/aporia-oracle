/*
  Reasoning Graph (Golden Thread)
  --------------------------------
  Stores nodes + edges.
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
    question : {color:"#76a5af"}
  },
                    

  addNode(text, type = "claim") {
    const id = this.nodes.length + 1;
    const style = this.nodeStyles[type] || this.nodeStyles.claim;
    this.nodes.push({id, text, type, color:style.color});
    return id;
  },

  addEdge(fromId, toId, type = "supports") {
    this.edges.push({fromId, toId, type});
  },

  render() {
    let out = "";
    this.nodes.forEach(n=> {
      out += `[${n.id}] (${n.type}, ${n.color}) ${n.text}\n`;
    });
    return out;
  }
};
