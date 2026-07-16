const SocraticEngine = {

  aporiaCount: 0,

  isAporia(text) {
    const lower = text.toLowerCase();
    return ["i don't know","idk","i do not know","no idea","i'm not sure","not sure","unsure"]
      .some(p => lower.includes(p));
  },

  addBotNode(text, type, lastNodeId) {
    const nodeId = ReasoningGraph.addNode(text, type, "circle");
    ReasoningGraph.addEdge(lastNodeId, nodeId);
    return nodeId;
  },

  askPivot1(lastNodeId) {
    return this.addBotNode(
      "That's alright — uncertainty is part of inquiry. Let's try a different angle: what do you think might motivate this idea?",
      "question",
      lastNodeId
    );
  },

  askPivot2(lastNodeId) {
    return this.addBotNode(
      "No problem. Maybe consider this: what underlying assumption might be shaping your view?",
      "question",
      lastNodeId
    );
  },

  endDialogue(lastNodeId) {
    return this.addBotNode(
      "It seems we've reached aporia — a point where further questioning won't clarify things. Thank you for exploring this with me.",
      "claim",
      lastNodeId
    );
  },

  generateQuestion() {
    const types = ["question", "justification", "assumption"];
    const type = types[Math.floor(Math.random() * types.length)];

    const bank = {
      question: [
        "What makes you think that?",
        "Why do you say that?",
        "What leads you to that view?"
      ],
      justification: [
        "What supports that belief?",
        "Why do you think that is true?",
        "What evidence makes you confident in that?"
      ],
      assumption: [
        "What assumption might be behind that?",
        "What are you taking for granted here?",
        "What underlying idea shapes that view?"
      ]
    };

    const text = bank[type][Math.floor(Math.random() * bank[type].length)];
    return { text, type };
  },

  processTurn(userText, lastNodeId) {

    if (this.isAporia(userText)) {
      this.aporiaCount++;

      if (this.aporiaCount === 1) return this.askPivot1(lastNodeId);
      if (this.aporiaCount === 2) return this.askPivot2(lastNodeId);

      return this.endDialogue(lastNodeId);
    }

    const q = this.generateQuestion();
    return this.addBotNode(q.text, q.type, lastNodeId);
  }
};
