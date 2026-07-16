const UIController = {

  lastNodeId: null,
  lastBotNodeId: null,
  conversationEnded: false,

  init() {
    const input = document.getElementById("user-input");
    const chatLog = document.getElementById("chat-log");

    input.addEventListener("keydown", (e) => {

      if (this.conversationEnded) return;

      if (e.key === "Enter") {
        const text = input.value.trim();
        if (text.length === 0) return;

        chatLog.innerHTML += `<div class="user-msg">${text}</div>`;
        input.value = "";

        let lastBotNode = null;
        if (this.lastBotNodeId !== null) {
          lastBotNode = ReasoningGraph.nodes.find(n => n.id === this.lastBotNodeId);
        }

        const inheritedColor = lastBotNode ? lastBotNode.color : "#cccccc";
        const inheritedType  = lastBotNode ? lastBotNode.type  : "claim";

        const userNodeId = ReasoningGraph.addNode(
          text,
          inheritedType,
          "square",
          inheritedColor
        );

        if (this.lastNodeId !== null) {
          ReasoningGraph.addEdge(this.lastNodeId, userNodeId);
        }

        const botNodeId = SocraticEngine.processTurn(text, userNodeId);

        this.lastNodeId = botNodeId;
        this.lastBotNodeId = botNodeId;

        const botNode = ReasoningGraph.nodes.find(n => n.id === botNodeId);
        const question = botNode ? botNode.text : "";
        if (question) {
          chatLog.innerHTML += `<div class="bot-msg">${question}</div>`;
        }

        if (SocraticEngine.aporiaCount >= 3) {
          this.conversationEnded = true;
          input.disabled = true;
          input.placeholder = "Dialogue concluded.";
        }

        ReasoningGraph.renderGraph();
      }
    });
  }
};
