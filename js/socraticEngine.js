/*
  Socratic Engine
  ----------------
  Chooses probing questions.
*/

const SocraticEngine = {

  questionTemplates: [
    "What do you mean by that?",
    "What assumption are you making here?",
    "How do you know this is true?",
    "What follows from that?",
    "Is there an alternative explanation?",
    "Why do you believe this holds?",
    "What evidence supports this?",
    "Could the opposite also be true?"
  ],
  question_to_node_type: {
    "What do you mean by that?" : "definition",
    "What assumption are you making here?" : "assumption",
    "How do you know this is true?" : "justification",
    "What follows from that?" : "implication",
    "Is there an alternative explanation?" : "alternative",
    "Why do you believe this holds?" : "justification",
    "What evidence supports this?" : "evidence",
    "Could the opposite also be true?" : "counterexample"
  },
  generateQuestion(userStatement) {
    const i = Math.floor(Math.random() * this.questionTemplates.length);
    return this.questionTemplates[i];
  }
};
    
