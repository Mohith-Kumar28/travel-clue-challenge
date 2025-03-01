
export interface Destination {
  id: string;
  name: string;
  clues: string[];
  facts: string[];
  imageUrl?: string;
}

export interface GameState {
  currentDestination: Destination | null;
  options: Destination[];
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  score: {
    correct: number;
    incorrect: number;
    total: number;
  };
  username: string;
  displayedClue: string;
  displayedFact: string;
  loading: boolean;
}

export interface UserScore {
  username: string;
  score: {
    correct: number;
    incorrect: number;
    total: number;
  };
}
