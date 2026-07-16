const UIController = {

  lastNodeId: null,      // last node in the chain (bot or user)
  lastBotNodeId: null,   // last BOT node only (for colour/type inheritance)

  init() {
    const input = document.getElementById("user-input");
    const chatLog = document.getElementById("chat-log");

    input.addEventListener("keydown", (e) => {
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

        // Add USER node (square, inherits bot colour)
        const userNodeId = ReasoningGraph.addNode(
          text,
          inheritedType,
          "square",
          inheritedColor
        );

        // Link previous node → USER (if any)
        if (this.lastNodeId !== null) {
          ReasoningGraph.addEdge(this.lastNodeId, userNodeId);
        }

        // Now process Socratic turn: engine adds BOT node, linked from USER
        const botNodeId = SocraticEngine.processTurn(text, userNodeId);

        // Update tracking:
        this.lastNodeId = botNodeId;      // last node in chain
        this.lastBotNodeId = botNodeId;   // last BOT node for next inheritance

        // Display bot message
        const botNode = ReasoningGraph.nodes.find(n => n.id === botNodeId);
        const question = botNode ? botNode.text : "";
        if (question) {
          chatLog.innerHTML += `<div class="bot-msg">${question}</div>`;
        }

        // Render updated graph
        ReasoningGraph.renderGraph();
      }
    });
  }
};
