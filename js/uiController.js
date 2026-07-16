const UIController = {

  lastNodeId: null,        // last node in the chain
  lastBotNodeId: null,     // last BOT node only
  conversationEnded: false, // block input after aporia termination

  init() {
    const input = document.getElementById("user-input");
    const chatLog = document.getElementById("chat-log");

    input.addEventListener("keydown", (e) => {

      // Block further input after aporia termination
      if (this.conversationEnded) return;

      if (e.key === "Enter") {
        const text = input.value.trim();
        if (text.length === 0) return;

        // Display user message
        chatLog.innerHTML += `<div class="user-msg">${text}</div>`;
        input.value = "";

        // Inherit colour + type from preceding BOT node
        let lastBotNode = null;
        if (this.lastBotNodeId !== null) {
          lastBotNode = ReasoningGraph.nodes.find(n => n.id === this.lastBotNodeId);
        }

        const inheritedColor = lastBotNode ? lastBotNode.color : "#cccccc";
        const inheritedType  = lastBotNode ? lastBotNode.type  : "claim";

        // Add USER node
        const userNodeId = ReasoningGraph.addNode(
          text,
          inheritedType,
          "square",
          inheritedColor
        );

        // Link previous node → USER
        if (this.lastNodeId !== null) {
          ReasoningGraph.addEdge(this.lastNodeId, userNodeId);
        }

        // Process Socratic turn → BOT node
        const botNodeId = SocraticEngine.processTurn(text, userNodeId);

        // Update tracking
        this.lastNodeId = botNodeId;
        this.lastBotNodeId = botNodeId;

        // Display bot message
        const botNode = ReasoningGraph.nodes.find(n => n.id === botNodeId);
        const question = botNode ? botNode.text : "";
        if (question) {
          chatLog.innerHTML += `<div class="bot-msg">${question}</div>`;
        }

        // ⭐ Terminate ONLY when user says "idk" twice in a row
        if (SocraticEngine.aporiaCount === 2) {
          this.conversationEnded = true;
          input.disabled = true;
          input.placeholder = "Dialogue concluded.";
        }

        // Render updated graph
        ReasoningGraph.renderGraph();
      }
    });
  }
};
