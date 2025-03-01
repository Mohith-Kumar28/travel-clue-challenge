
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
  clueIndex: number;
  loading: boolean;
  roomId?: string; // Added roomId for challenge rooms
}

export interface UserScore {
  username: string;
  score: {
    correct: number;
    incorrect: number;
    total: number;
  };
  timestamp?: number;
  roomId?: string; // Added roomId for challenge rooms
  beaten?: boolean; // Track if this score has been beaten by the current user
}

export interface GameRoom {
  id: string;
  participants: UserScore[];
  createdBy: string;
  createdAt: number;
}

// WebSocket message types
export type WebSocketMessage = 
  | { type: 'join_room'; username: string; roomId: string }
  | { type: 'score_update'; score: UserScore; roomId: string }
  | { type: 'room_data'; participants: UserScore[] }
  | { type: 'leave_room'; username: string; roomId: string };
