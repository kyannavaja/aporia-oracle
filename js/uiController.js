const UIController = {

  lastNodeId: null,
  lastBotNodeId: null,
  conversationEnded: false,

  init() {
    const input = document.getElementById("user-input");
    const chatLog = document.getElementById("chat-log");

    input.addEventListener("keydown", (e) => {

      if (this.conversationEnded) return;
      if (e.key !== "Enter") return;

      const text = input.value.trim();
      if (!text) return;

      // Display user message
      chatLog.innerHTML += `<div class="user-msg">${text}</div>`;
      input.value = "";

      // Inherit bot node style
      const lastBotNode = ReasoningGraph.nodes.find(n => n.id === this.lastBotNodeId);
      const inheritedColor = lastBotNode?.color || "#cccccc";
      const inheritedType  = lastBotNode?.type  || "claim";

      // Add USER node
      const userNodeId = ReasoningGraph.addNode(text, inheritedType, "square", inheritedColor);

      if (this.lastNodeId !== null) {
        ReasoningGraph.addEdge(this.lastNodeId, userNodeId);
      }

      // Process Socratic turn → BOT node
      const botNodeId = SocraticEngine.processTurn(text, userNodeId);

      this.lastNodeId = botNodeId;
      this.lastBotNodeId = botNodeId;

      const botNode = ReasoningGraph.nodes.find(n => n.id === botNodeId);

      chatLog.innerHTML += `<div class="bot-msg">${botNode.text}</div>`;

      // END DIALOGUE when final aporia message appears
      if (botNode.text.includes("aporia")) {
        this.conversationEnded = true;
        input.disabled = true;
        input.placeholder = "Dialogue concluded.";
      }

      ReasoningGraph.renderGraph();
    });
  }
};
