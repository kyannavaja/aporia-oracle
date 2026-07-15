/*
  Socratic Engine
  ----------------
  Chooses probing questions and integrates with the reasoning graph.
*/

const SocraticEngine = {

  questionTemplates: [
    "What do you mean by that?",
    "What assumption are you making here?",
    "How do you know this is true?",
    "What follows from that?",
    "Is there an alternative explanation?",
    "Why do you believe this holds?",
    "What evidence supports this?",
    "Could the opposite also be true?"
  ],

  question_to_node_type: {
    "What do you mean by that?" : "definition",
    "What assumption are you making here?" : "assumption",
    "How do you know this is true?" : "justification",
    "What follows from that?" : "implication",
    "Is there an alternative explanation?" : "alternative",
    "Why do you believe this holds?" : "justification",
    "What evidence supports this?" : "evidence",
    "Could the opposite also be true?" : "counterexample"
  },

  generateQuestion(userStatement) {
    const i = Math.floor(Math.random() * this.questionTemplates.length);
    return this.questionTemplates[i];
  },

  /*
    NEW: processTurn()
    ------------------
    - Generates a Socratic question
    - Maps it to a reasoning node type
    - Adds it to the graph
    - Connects it to the previous node
    - Re-renders the graph
  */
  processTurn(userStatement, previousNodeId = null) {
    // 1. Generate a Socratic question
    const question = this.generateQuestion(userStatement);

    // 2. Determine node type
    const nodeType = this.question_to_node_type[question] || "claim";

    // 3. Add node to graph
    const newNodeId = ReasoningGraph.addNode(question, nodeType);

    // 4. Connect to previous node
    if (previousNodeId !== null) {
      ReasoningGraph.addEdge(previousNodeId, newNodeId, "socratic");
    }

    // 5. Update graph visually
    ReasoningGraph.renderGraph();

    // 6. Return new node ID for chaining
    return newNodeId;
  }

}; // ⭐ IMPORTANT: this closing brace MUST be here
