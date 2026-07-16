const UIController = {

  lastNodeId: null,   // ⭐ Always track the last BOT node onlyyy

  init() {
    const input = document.getElementById("user-input");
    const chatLog = document.getElementById("chat-log");

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const text = input.value.trim();
        if (text.length === 0) return;

        // ⭐ Display user message
        chatLog.innerHTML += `<div class="user-msg">${text}</div>`;
        input.value = "";

        // ⭐ Determine inherited colour + type from preceding BOT node
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

        // ⭐ Link BOT → USER
        if (this.lastNodeId !== null) {
          ReasoningGraph.addEdge(this.lastNodeId, userNodeId);
        }

        // ⭐ Process Socratic turn → adds BOT node
        const botNodeId = SocraticEngine.processTurn(text, userNodeId);

        // ⭐ Update lastNodeId ONLY to the BOT node
        this.lastNodeId = botNodeId;

        // ⭐ Display bot message
        const question = ReasoningGraph.nodes[this.lastNodeId - 1].text;
        chatLog.innerHTML += `<div class="bot-msg">${question}</div>`;

        // ⭐ Render updated graph
        ReasoningGraph.renderGraph();
      }
    });
  }
};
