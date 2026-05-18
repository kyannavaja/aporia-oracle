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
    "Why do you believe this holdS?",
    "What evidence supports this?",
    "Could the opposite also be true?"
  ],

  generateQuestion(userStatement) {
    const i = Math.floor(Math.random() * this.questiontemplates.length)
    return this.questionTemplates[i];
  }
};
    
