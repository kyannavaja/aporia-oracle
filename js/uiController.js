/*
  UI Controller
  ----------------
  Hanles chat + graph updates.
*/

const UI = {

  chatlog: document.getElementById("chat-log"),
  graphOutput: document.getElementById("graph-output"),

  addMessage(sender, text) {
    const div = document.createElement("div");
    div.className = sender;
    div.textContent = text;
    this.chatLog.appendChild(div);
    this.chatLog.scrollTop = this.chatLog.scrollHeight;
  },

  updateGraph() {
    this.graphOutput.textContent = ReasoningGraph.render();
  }
};
