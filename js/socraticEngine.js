/*
  Socratic Engine
  ----------------
  Generates Socratic questions based on user input.
  Now includes:
  - Aporia detection ("I don't know", "idk", etc.)
  - Aporia state tracking
  - Pivot questions
  - Graceful dialogue ending
*/

const SocraticEngine = {

  aporiaCount: 0,   // ⭐ Track how many times user expresses aporia

  // ⭐ Simple aporia phrase detection
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

  /*
    addBotNode
    ----------
    Adds a bot node to the graph and links it to the previous node.
  */
  addBotNode(text, type, lastNodeId) {
    const nodeId = ReasoningGraph.addNode(text, type, "circle");
    if (lastNodeId !== null) {
      ReasoningGraph.addEdge(lastNodeId, nodeId);
    }
    return nodeId;
  },

  /*
    Aporia pivot #1
  */
  askPivotQuestion(lastNodeId) {
    const text =
      "That's alright — reaching uncertainty is part of inquiry. Let's try a different angle: what do you think might motivate this idea?";
    return this.addBotNode(text, "question", lastNodeId);
  },

  /*
    Aporia pivot #2
  */
  askFinalPivot(lastNodeId) {
    const text =
      "No problem. Maybe consider this: what underlying assumption might be shaping your view?";
    return this.addBotNode(text, "question", lastNodeId);
  },

  /*
    Aporia conclusion
  */
  endDialogue(lastNodeId) {
    const text =
      "It seems we've reached aporia — a point where further questioning won't clarify things. Thank you for exploring this with me.";
    return this.addBotNode(text, "claim", lastNodeId);
  },

  /*
    generateQuestion
    -----------------
    Your original question generator.
    (Kept exactly as-is except for minor cleanup.)
  */
  generateQuestion(userText) {
    if (userText.length < 5) {
      return {
        text: "Could you elaborate a bit more?",
        type: "question"
      };
    }

    if (userText.includes("because")) {
      return {
        text: "What leads you to believe that?",
        type: "justification"
      };
    }

    if (userText.includes("should")) {
      return {
        text: "What assumption is behind that 'should'?",
        type: "assumption"
      };
    }

    return {
      text: "What makes you think that?",
      type: "question"
    };
  },

  /*
    processTurn
    -----------
    Main Socratic engine logic.
    Now includes aporia detection + branching.
  */
  processTurn(userText, lastNodeId) {

    // ⭐ Detect aporia
    if (this.isAporia(userText)) {
      this.aporiaCount++;

      if (this.aporiaCount === 1) {
        return this.askPivotQuestion(lastNodeId);
      }

      if (this.aporiaCount === 2) {
        return this.askFinalPivot(lastNodeId);
      }

      // ⭐ Third aporia → end dialogue
      if (this.aporiaCount >= 3) {
        return this.endDialogue(lastNodeId);
      }
    }

    // ⭐ Normal Socratic question generation
    const q = this.generateQuestion(userText);
    return this.addBotNode(q.text, q.type, lastNodeId);
  }
};
