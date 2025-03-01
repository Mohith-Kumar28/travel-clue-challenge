import { Destination, UserScore, GameRoom } from '@/types';
import { websocketService } from './websocketService';

// This is a mock dataset that would normally be fetched from a backend
const mockDestinations: Destination[] = [
  {
    id: "1",
    name: "Eiffel Tower",
    clues: [
      "I am an iron lady standing tall in the city of love.",
      "Built for a world exposition, I was once considered an eyesore.",
      "From my top, you can see the entire city spread below like a map."
    ],
    facts: [
      "I was built by Gustave Eiffel for the 1889 World's Fair.",
      "I'm 324 meters tall and was the tallest structure in the world until 1930.",
      "My body contains 18,038 pieces of iron held together by 2.5 million rivets."
    ],
    imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "2",
    name: "Taj Mahal",
    clues: [
      "I am a marble mausoleum built as a testament to love.",
      "My reflection in water is almost as famous as my structure.",
      "My design incorporates Persian, Islamic, and Indian architectural styles."
    ],
    facts: [
      "I was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife.",
      "My construction took approximately 20 years to complete.",
      "My marble changes color depending on the time of day due to light reflection."
    ],
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "3",
    name: "Statue of Liberty",
    clues: [
      "I was a gift from one republic to another.",
      "My torch lights the way to freedom.",
      "I stand on an island welcoming visitors to a new world."
    ],
    facts: [
      "I was designed by French sculptor Frédéric Auguste Bartholdi.",
      "My full height, from the ground to the torch, is 305 feet and 6 inches.",
      "My copper skin is only 3/32 of an inch thick but weighs 200,000 pounds."
    ],
    imageUrl: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "4",
    name: "Great Wall of China",
    clues: [
      "I am one of the few human-made structures visible from space.",
      "I was built to protect an ancient empire from invaders.",
      "I snake across mountains and valleys for thousands of miles."
    ],
    facts: [
      "I was built over approximately 2,000 years by different dynasties.",
      "My total length is approximately 13,171 miles, including all branches.",
      "I have been designated as a UNESCO World Heritage Site since 1987."
    ],
    imageUrl: "https://images.unsplash.com/photo-1508804052814-cd3ba865a116?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "5",
    name: "Machu Picchu",
    clues: [
      "I am a hidden city in the clouds.",
      "I was built by an ancient civilization and later abandoned.",
      "I remained unknown to the outside world until the early 20th century."
    ],
    facts: [
      "I was built around 1450 at the height of the Inca Empire.",
      "I was designated as a UNESCO World Heritage Site in 1983.",
      "My name in Quechua means 'Old Mountain' or 'Old Peak'."
    ],
    imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "6",
    name: "Colosseum",
    clues: [
      "I am an ancient amphitheater where gladiators once fought.",
      "I could hold up to 80,000 spectators in my prime.",
      "Despite earthquakes and stone-robbers, I still stand as a symbol of imperial Rome."
    ],
    facts: [
      "My construction began under Emperor Vespasian in AD 72 and was completed in AD 80 under his successor Titus.",
      "I am the largest amphitheater ever built.",
      "My original name was the Flavian Amphitheater."
    ],
    imageUrl: "https://images.unsplash.com/photo-1552432552-06c0b6004d25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "7",
    name: "Petra",
    clues: [
      "I am a city carved into rose-colored rock.",
      "I was lost to the Western world for hundreds of years.",
      "I was made famous in the modern era by a certain adventure film."
    ],
    facts: [
      "I was established possibly as early as 312 BC as the capital of the Nabataean Kingdom.",
      "I was designated as a UNESCO World Heritage Site in 1985.",
      "My most famous structure is Al-Khazneh, also known as The Treasury."
    ],
    imageUrl: "https://images.unsplash.com/photo-1563177978-4c005bfd56e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "8",
    name: "Sydney Opera House",
    clues: [
      "My distinctive sail-shaped shells make me instantly recognizable.",
      "I stand at the edge of a beautiful harbor in the Southern Hemisphere.",
      "My design was initially rejected, then later became iconic."
    ],
    facts: [
      "I was designed by Danish architect Jørn Utzon.",
      "My construction was completed in 1973, ten years later than planned.",
      "I was designated as a UNESCO World Heritage Site in 2007."
    ],
    imageUrl: "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

// This would normally be a database or backend service
const userScores: Record<string, UserScore> = {};
const gameRooms: Record<string, GameRoom> = {};

// Create a game service to handle all game logic
class GameService {
  async getDestinations(): Promise<Destination[]> {
    // In a real app, this would be a fetch request to your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDestinations);
      }, 500);
    });
  }

  async getRandomDestination(): Promise<Destination> {
    const destinations = await this.getDestinations();
    const randomIndex = Math.floor(Math.random() * destinations.length);
    return destinations[randomIndex];
  }

  async getRandomOptions(correctDestination: Destination, count: number = 4): Promise<Destination[]> {
    const destinations = await this.getDestinations();
    const filteredDestinations = destinations.filter(d => d.id !== correctDestination.id);
    
    // Shuffle the array
    const shuffled = [...filteredDestinations].sort(() => 0.5 - Math.random());
    
    // Take up to count-1 random destinations
    const randomOptions = shuffled.slice(0, count - 1);
    
    // Add the correct destination
    const options = [...randomOptions, correctDestination];
    
    // Shuffle again so the correct answer isn't always last
    return options.sort(() => 0.5 - Math.random());
  }

  async getRandomClue(destination: Destination): Promise<string> {
    const randomIndex = Math.floor(Math.random() * destination.clues.length);
    return destination.clues[randomIndex];
  }

  async getClueByIndex(destination: Destination, index: number): Promise<string> {
    // Make sure the index is within bounds
    if (index < 0 || index >= destination.clues.length) {
      return destination.clues[0];
    }
    return destination.clues[index];
  }

  async getRandomFact(destination: Destination): Promise<string> {
    const randomIndex = Math.floor(Math.random() * destination.facts.length);
    return destination.facts[randomIndex];
  }

  saveScore(username: string, isCorrect: boolean, roomId?: string): void {
    if (!userScores[username]) {
      userScores[username] = {
        username,
        score: {
          correct: 0,
          incorrect: 0,
          total: 0
        },
        timestamp: Date.now(),
        roomId
      };
    }

    const score = userScores[username].score;
    score.total += 1;
    
    if (isCorrect) {
      score.correct += 1;
    } else {
      score.incorrect += 1;
    }
    
    // Update timestamp
    userScores[username].timestamp = Date.now();
    
    // If user is in a room, update the score via WebSocket
    if (roomId) {
      userScores[username].roomId = roomId;
      websocketService.updateScore(userScores[username]);
    }
  }

  getScore(username: string): UserScore {
    return userScores[username] || {
      username,
      score: {
        correct: 0,
        incorrect: 0,
        total: 0
      }
    };
  }

  getAllScores(): UserScore[] {
    return Object.values(userScores)
      .sort((a, b) => {
        // First sort by correct answers
        if (b.score.correct !== a.score.correct) {
          return b.score.correct - a.score.correct;
        }
        // If tied, sort by percentage
        const aPercentage = a.score.total > 0 ? a.score.correct / a.score.total : 0;
        const bPercentage = b.score.total > 0 ? b.score.correct / b.score.total : 0;
        if (bPercentage !== aPercentage) {
          return bPercentage - aPercentage;
        }
        // If still tied, sort by most recent
        return (b.timestamp || 0) - (a.timestamp || 0);
      });
  }

  getRoomScores(roomId: string): UserScore[] {
    return Object.values(userScores)
      .filter(score => score.roomId === roomId)
      .sort((a, b) => {
        // First sort by correct answers
        if (b.score.correct !== a.score.correct) {
          return b.score.correct - a.score.correct;
        }
        // If tied, sort by percentage
        const aPercentage = a.score.total > 0 ? a.score.correct / a.score.total : 0;
        const bPercentage = b.score.total > 0 ? b.score.correct / b.score.total : 0;
        if (bPercentage !== aPercentage) {
          return bPercentage - aPercentage;
        }
        // If still tied, sort by most recent
        return (b.timestamp || 0) - (a.timestamp || 0);
      });
  }

  createRoom(username: string): string {
    const roomId = Math.random().toString(36).substring(2, 10);
    
    gameRooms[roomId] = {
      id: roomId,
      participants: [],
      createdBy: username,
      createdAt: Date.now()
    };
    
    return roomId;
  }

  getRoom(roomId: string): GameRoom | null {
    return gameRooms[roomId] || null;
  }

  joinRoom(username: string, roomId: string): boolean {
    const room = this.getRoom(roomId);
    
    if (!room) return false;
    
    // Check if user is already in the room
    const isInRoom = room.participants.some(p => p.username === username);
    
    if (!isInRoom) {
      const userScore = this.getScore(username);
      userScore.roomId = roomId;
      room.participants.push(userScore);
      
      // Update userScores record as well
      if (userScores[username]) {
        userScores[username].roomId = roomId;
      }
    }
    
    return true;
  }

  registerUser(username: string): void {
    if (!userScores[username]) {
      userScores[username] = {
        username,
        score: {
          correct: 0,
          incorrect: 0,
          total: 0
        },
        timestamp: Date.now()
      };
    }
  }

  generateShareUrl(username: string): string {
    // Create a new room for this challenge
    const roomId = this.createRoom(username);
    
    // Add the user to the room
    this.joinRoom(username, roomId);
    
    // In a real app, this would be a proper URL to your deployed app
    return `${window.location.origin}/game?inviter=${encodeURIComponent(username)}&roomId=${encodeURIComponent(roomId)}`;
  }
}

export const gameService = new GameService();
