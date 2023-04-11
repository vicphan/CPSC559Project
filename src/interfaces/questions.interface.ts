export interface Question {
    _id: string;
    prompt: string;
    correctAnswerIndex: Number;
    answers: string[];
    index: Number;
  }

  // Convert question to JSON
  export function questionToJson(question) {
    return {
      prompt: question.prompt,
      correctAnswerIndex: question.correctAnswerIndex,
      answers: question.answers,
      index: question.index,
    }
  }
  