/*
  Socratic Engine
  ----------------
  Random question selection.
  Aporia resets on normal responses.
  Termination occurs ONLY when the user says "idk" twice in a row.
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

  // Final termination message
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

    // ⭐ Reset aporia count if user gives a normal response
    if (!this.isAporia(userText)) {
      this.aporiaCount = 0;
    }

    // ⭐ Aporia detection
    if (this.isAporia(userText)) {
      this.aporiaCount++;

      // First aporia → pivot
      if (this.aporiaCount === 1) {
        return this.askPivotQuestion(lastNodeId);
      }

      // Second aporia → TERMINATION
      if (this.aporiaCount === 2) {
        return this.endDialogue(lastNodeId);
      }
    }

    // Normal Socratic turn: RANDOM question type
    const q = this.generateQuestion();
    return this.addBotNode(q.text, q.type, lastNodeId);
  }
};
