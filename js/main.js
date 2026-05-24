/*
  Main App Logic
  ----------------
  Handles input -> graph -> Socratic question.
*/

const input = document.getElementById("user-input");

input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    const userText = input.value.trim();
    if (!userText) return;

    // Display user message
    UI.addMessage("user", userText);

    // Add user node
    const userNodeId = ReasoningGraph.addNode(userText, "claim");

    //Generate Socratic question
    const botQuestion = SocraticEngine.generateQuestion(userText);

    // Display bot message
    UI.addMessage("bot", botQuestion);

    // Add bot node
    const botNodeId = ReasoningGraph.addNode(botQuestion, "question");

    // Link nodes
    ReasoningGraph.addEdge(boteNodeId, userNodeId, "challenges");

    // Update graph panel
    UI.updateGraph();

    input.value = "";
  }
});
