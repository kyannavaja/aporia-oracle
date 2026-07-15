const UIController = {

  lastNodeId: null,   // ⭐ Track the previous node for chaining

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

        // ⭐ Process Socratic turn → adds node, edge, updates graph
        this.lastNodeId = SocraticEngine.processTurn(text, this.lastNodeId);

        // ⭐ Display the Socratic question in chat
        const question = ReasoningGraph.nodes[this.lastNodeId - 1].text;
        chatLog.innerHTML += `<div class="bot-msg">${question}</div>`;
      }
    });
  }
};
