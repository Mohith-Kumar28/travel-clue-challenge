
import { WebSocketMessage, UserScore } from '@/types';

// Mock WebSocket service using BroadcastChannel API
// In a real app, you would use a real WebSocket server
class WebSocketService {
  private bc: BroadcastChannel | null = null;
  private roomId: string | null = null;
  private username: string | null = null;
  private messageCallbacks: ((message: WebSocketMessage) => void)[] = [];

  connect() {
    // Using BroadcastChannel API to simulate WebSockets between browser tabs
    this.bc = new BroadcastChannel('globetrotter_game');
    
    this.bc.onmessage = (event) => {
      const message = event.data as WebSocketMessage;
      this.messageCallbacks.forEach(callback => callback(message));
    };

    console.log('WebSocket connected');
    return this;
  }

  disconnect() {
    if (this.bc) {
      this.bc.close();
      this.bc = null;
      console.log('WebSocket disconnected');
    }
  }

  joinRoom(username: string, roomId: string) {
    if (!this.bc) {
      this.connect();
    }

    this.username = username;
    this.roomId = roomId;

    const message: WebSocketMessage = {
      type: 'join_room',
      username,
      roomId
    };

    this.sendMessage(message);
    console.log(`User ${username} joined room ${roomId}`);
  }

  leaveRoom() {
    if (this.bc && this.username && this.roomId) {
      const message: WebSocketMessage = {
        type: 'leave_room',
        username: this.username,
        roomId: this.roomId
      };

      this.sendMessage(message);
      console.log(`User ${this.username} left room ${this.roomId}`);
      this.roomId = null;
    }
  }

  updateScore(score: UserScore) {
    if (!this.bc || !this.roomId) return;

    const message: WebSocketMessage = {
      type: 'score_update',
      score: {
        ...score,
        roomId: this.roomId
      },
      roomId: this.roomId
    };

    this.sendMessage(message);
  }

  sendMessage(message: WebSocketMessage) {
    if (this.bc) {
      this.bc.postMessage(message);
    }
  }

  onMessage(callback: (message: WebSocketMessage) => void) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  getCurrentRoom() {
    return this.roomId;
  }
}

export const websocketService = new WebSocketService();
