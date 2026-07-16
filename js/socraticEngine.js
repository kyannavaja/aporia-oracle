/*
  Socratic Engine
  ----------------
  Simple aporia tally:
  1st aporia → pivot
  2nd aporia → final pivot
  3rd aporia → termination
*/

const SocraticEngine = {

  aporiaCount: 0,

  // Detect aporia phrases
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

  // Add BOT node and link it
  addBotNode(text, type, lastNodeId) {
    const nodeId = ReasoningGraph.addNode(text, type, "circle");
    ReasoningGraph.addEdge(lastNodeId, nodeId);
    return nodeId;
  },

  // First aporia pivot
  askPivotQuestion(lastNodeId) {
    const text =
      "That's alright — uncertainty is part of inquiry. Let's try a different angle: what do you think might motivate this idea?";
    return this.addBotNode(text, "question", lastNodeId);
  },

  // Second aporia pivot
  askFinalPivot(lastNodeId) {
    const text =
      "No problem. Maybe consider this: what underlying assumption might be shaping your view?";
    return this.addBotNode(text, "question", lastNodeId);
  },

  // Third aporia → termination
  endDialogue(lastNodeId) {
    const text =
      "It seems we've reached aporia — a point where further questioning won't clarify things. Thank you for exploring this with me.";
    return this.addBotNode(text, "claim", lastNodeId);
  },

  // Random question generator
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

      if (this.aporiaCount === 3) {
        return this.endDialogue(lastNodeId);
      }
    }

    // Normal Socratic turn: RANDOM question type
    const q = this.generateQuestion();
    return this.addBotNode(q.text, q.type, lastNodeId);
  }
};
