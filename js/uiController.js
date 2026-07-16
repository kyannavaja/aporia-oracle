const UIController = {

  lastNodeId: null,   // ⭐ Track the previous node for chaining

  init() {
    const input = document.getElementById("user-input");
    const chatLog = document.getElementById("chat-log");

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const text = input.value.trim();
        if (text.length === 0) return;

        // ⭐ Display user message in chat
        chatLog.innerHTML += `<div class="user-msg">${text}</div>`;
        input.value = "";

        // ⭐ Determine inherited colour + type from preceding bot node
        let lastBotNode = null;
        if (this.lastNodeId !== null) {
          lastBotNode = ReasoningGraph.nodes.find(n => n.id === this.lastNodeId);
        }

        const inheritedColor = lastBotNode ? lastBotNode.color : "#cccccc";
        const inheritedType  = lastBotNode ? lastBotNode.type  : "claim";

        // ⭐ Add USER NODE (square, inherits bot colour)
        const userNodeId = ReasoningGraph.addNode(
          text,
          inheritedType,
          "square",
          inheritedColor
        );

        // ⭐ Link previous node → user node (Option A)
        if (this.lastNodeId !== null) {
          ReasoningGraph.addEdge(this.lastNodeId, userNodeId);
        }

        // ⭐ Update lastNodeId to user node
        this.lastNodeId = userNodeId;

        // ⭐ Process Socratic turn → adds bot node + edge
        this.lastNodeId = SocraticEngine.processTurn(text, this.lastNodeId);

        // ⭐ Display the Socratic question in chat
        const question = ReasoningGraph.nodes[this.lastNodeId - 1].text;
        chatLog.innerHTML += `<div class="bot-msg">${question}</div>`;

        // Render updated graph
        ReasoningGraph.renderGraph();
      }
    });
  }
};
