/*
  Socratic Engine
  ----------------
  Random question selection.
  User responses inherit the bot's question type.
  Aporia detection remains simple.
*/

const SocraticEngine = {

  aporiaCount: 0,

  // Simple aporia detection
  isAporia(text) {
    const phrases = [
      "i don't know",
      "idk",
      "i do not know",
      "no idea",
      "i'm not sure",
      "not sure",
      "unsure"
    ];
    const lower = text.toLowerCase();
    return phrases.some(p => lower.includes(p));
  },

  // Add a bot node and link it to the previous node
  addBotNode(text, type, lastNodeId) {
    const nodeId = ReasoningGraph.addNode(text, type, "circle");
    ReasoningGraph.addEdge(lastNodeId, nodeId);
    return nodeId;
  },

  // Aporia pivot #1
  askPivotQuestion(lastNodeId) {
    const text =
      "That's alright — uncertainty is part of inquiry. Let's try a different angle: what do you think might motivate this idea?";
    return this.addBotNode(text, "question", lastNodeId);
  },

  // Aporia pivot #2
  askFinalPivot(lastNodeId) {
    const text =
      "No problem. Maybe consider this: what underlying assumption might be shaping your view?";
    return this.addBotNode(text, "question", lastNodeId);
  },

  // Aporia conclusion
  endDialogue(lastNodeId) {
    const text =
      "It seems we've reached aporia — a point where further questioning won't clarify things. Thank you for exploring this with me.";
    return this.addBotNode(text, "claim", lastNodeId);
  },

  // ⭐ RANDOM question generator (the core of your MVP)
  generateQuestion() {
    const types = ["question", "justification", "assumption"];
    const type = types[Math.floor(Math.random() * types.length)];

    const questions = {
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

    const textList = questions[type];
    const text = textList[Math.floor(Math.random() * textList.length)];

    return { text, type };
  },

  // Main Socratic turn logic
  processTurn(userText, lastNodeId) {

    // Aporia detection
    if (this.isAporia(userText)) {
      this.aporiaCount++;

      if (this.aporiaCount === 1) {
        return this.askPivotQuestion(lastNodeId);
      }

      if (this.aporiaCount === 2) {
        return this.askFinalPivot(lastNodeId);
      }

      return this.endDialogue(lastNodeId);
    }

    // Normal Socratic turn: RANDOM question type
    const q = this.generateQuestion();
    return this.addBotNode(q.text, q.type, lastNodeId);
  }
};
