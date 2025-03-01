import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ClueCard from './ClueCard';
import OptionButtons from './OptionButtons';
import ResultFeedback from './ResultFeedback';
import ScoreDisplay from './ScoreDisplay';
import ShareChallenge from './ShareChallenge';
import HighScores from './HighScores';
import { gameService } from '@/services/gameService';
import { websocketService } from '@/services/websocketService';
import { GameState, Destination, UserScore, WebSocketMessage } from '@/types';
import { AlertTriangle, Award, Trophy, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GameContainerProps {
  inviterScore?: number | null;
}

const GameContainer = ({ inviterScore }: GameContainerProps) => {
  const [searchParams] = useSearchParams();
  const inviterUsername = searchParams.get('inviter');
  const roomId = searchParams.get('roomId');
  const { toast } = useToast();
  const scoreBeatenRef = useRef(false);
  
  const [gameState, setGameState] = useState<GameState>({
    currentDestination: null,
    options: [],
    selectedAnswer: null,
    isCorrect: null,
    score: {
      correct: 0,
      incorrect: 0,
      total: 0
    },
    username: '',
    displayedClue: '',
    displayedFact: '',
    clueIndex: 0,
    loading: true,
    roomId: roomId || undefined
  });
  
  const [inviterScoreData, setInviterScoreData] = useState<UserScore | null>(null);
  const [roomParticipants, setRoomParticipants] = useState<UserScore[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'score_update':
        if (message.roomId === gameState.roomId) {
          setRoomParticipants(prevParticipants => {
            const updatedParticipants = [...prevParticipants];
            const index = updatedParticipants.findIndex(p => p.username === message.score.username);
            
            if (index !== -1) {
              updatedParticipants[index] = message.score;
            } else {
              updatedParticipants.push(message.score);
            }
            
            return updatedParticipants.sort((a, b) => b.score.correct - a.score.correct);
          });
          
          if (inviterUsername && message.score.username === inviterUsername) {
            setInviterScoreData(message.score);
          }
          
          if (message.score.username !== gameState.username) {
            toast({
              title: "Score Updated",
              description: `${message.score.username}'s score: ${message.score.score.correct}/${message.score.score.total}`,
            });
          }
        }
        break;
        
      case 'join_room':
        if (message.roomId === gameState.roomId && message.username !== gameState.username) {
          toast({
            title: "New Player Joined",
            description: `${message.username} has joined the challenge!`,
          });
          if (gameState.roomId) {
            setRoomParticipants(gameService.getRoomScores(gameState.roomId));
          }
        }
        break;
        
      case 'room_data':
        setRoomParticipants(message.participants);
        break;
        
      case 'leave_room':
        if (message.roomId === gameState.roomId) {
          toast({
            title: "Player Left",
            description: `${message.username} has left the challenge.`,
            variant: "destructive"
          });
          if (gameState.roomId) {
            setRoomParticipants(gameService.getRoomScores(gameState.roomId));
          }
        }
        break;
    }
  };

  useEffect(() => {
    websocketService.connect();
    const unsubscribe = websocketService.onMessage(handleWebSocketMessage);
    
    const storedUsername = sessionStorage.getItem('globetrotter_username');
    
    if (storedUsername) {
      const userScore = gameService.getScore(storedUsername);
      
      setGameState(prev => ({
        ...prev,
        username: storedUsername,
        score: userScore.score
      }));
      
      if (roomId) {
        gameService.joinRoom(storedUsername, roomId);
        websocketService.joinRoom(storedUsername, roomId);
        
        setRoomParticipants(gameService.getRoomScores(roomId));
      }
    } else if (inviterUsername) {
      const guestUsername = "Guest_" + Math.random().toString(36).substring(2, 7);
      
      setGameState(prev => ({
        ...prev,
        username: guestUsername
      }));
      
      gameService.registerUser(guestUsername);
      
      if (roomId) {
        gameService.joinRoom(guestUsername, roomId);
        websocketService.joinRoom(guestUsername, roomId);
        
        setRoomParticipants(gameService.getRoomScores(roomId));
      }
      
      sessionStorage.setItem('globetrotter_username', guestUsername);
      
      if (inviterUsername && inviterScore !== null) {
        setInviterScoreData({
          username: inviterUsername,
          score: {
            correct: inviterScore,
            incorrect: 0,
            total: inviterScore,
          },
          beaten: false
        });
      } else if (inviterUsername) {
        const inviterScoreFromService = gameService.getScore(inviterUsername);
        setInviterScoreData(inviterScoreFromService);
      }
    }
    
    loadNextQuestion();
    
    const interval = setInterval(() => {
      if (gameState.roomId) {
        setRoomParticipants(gameService.getRoomScores(gameState.roomId));
      }
    }, 10000);
    
    return () => {
      clearInterval(interval);
      unsubscribe();
      websocketService.leaveRoom();
      websocketService.disconnect();
    };
  }, [inviterUsername, roomId, inviterScore]);

  useEffect(() => {
    if (inviterScoreData && 
        !inviterScoreData.beaten && 
        gameState.score.correct > inviterScoreData.score.correct) {
      
      setInviterScoreData(prev => prev ? { ...prev, beaten: true } : null);
      
      setShowCelebration(true);
      
      toast({
        title: "🎉 New Achievement!",
        description: `You beat ${inviterScoreData.username}'s score of ${inviterScoreData.score.correct}!`,
        variant: "default",
      });
      
      setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
    }
  }, [gameState.score.correct, inviterScoreData, toast]);

  const loadNextQuestion = async () => {
    setGameState(prev => ({
      ...prev,
      selectedAnswer: null,
      isCorrect: null,
      clueIndex: 0,
      loading: true
    }));

    try {
      const destination = await gameService.getRandomDestination();
      
      const options = await gameService.getRandomOptions(destination);
      
      const clue = await gameService.getClueByIndex(destination, 0);
      
      const fact = await gameService.getRandomFact(destination);
      
      setGameState(prev => ({
        ...prev,
        currentDestination: destination,
        options,
        displayedClue: clue,
        displayedFact: fact,
        loading: false
      }));
    } catch (error) {
      console.error('Error loading question:', error);
      setGameState(prev => ({
        ...prev,
        loading: false
      }));
    }
  };

  const handleSelectAnswer = (destinationId: string) => {
    const isCorrect = destinationId === gameState.currentDestination?.id;
    
    const newScore = {
      ...gameState.score,
      total: gameState.score.total + 1,
      correct: isCorrect ? gameState.score.correct + 1 : gameState.score.correct,
      incorrect: !isCorrect ? gameState.score.incorrect + 1 : gameState.score.incorrect
    };
    
    gameService.saveScore(gameState.username, isCorrect, gameState.roomId);
    
    setGameState(prev => ({
      ...prev,
      selectedAnswer: destinationId,
      isCorrect,
      score: newScore
    }));
    
    updateHighScores();
  };

  const handleRequestHint = async () => {
    if (!gameState.currentDestination || gameState.selectedAnswer !== null) return;
    
    const nextClueIndex = gameState.clueIndex + 1;
    
    if (nextClueIndex < gameState.currentDestination.clues.length) {
      try {
        const nextClue = await gameService.getClueByIndex(
          gameState.currentDestination,
          nextClueIndex
        );
        
        setGameState(prev => ({
          ...prev,
          displayedClue: nextClue,
          clueIndex: nextClueIndex
        }));
        
        toast({
          title: "New hint revealed!",
          description: "Here's another clue to help you guess.",
        });
      } catch (error) {
        console.error('Error getting next clue:', error);
      }
    } else {
      toast({
        title: "No more hints available",
        description: "You've seen all the clues for this destination.",
        variant: "destructive"
      });
    }
  };

  const hasMoreClues = gameState.currentDestination && 
    gameState.clueIndex < gameState.currentDestination.clues.length - 1;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 relative">
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="celebration-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i}
                className="confetti animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-20px',
                  width: `${Math.random() * 15 + 5}px`,
                  height: `${Math.random() * 15 + 5}px`,
                  backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                }}
              />
            ))}
            <div className="bg-white/90 p-6 rounded-xl shadow-lg animate-bounce text-center z-10">
              <h2 className="text-2xl font-bold text-primary mb-2">YOU DID IT! 🏆</h2>
              <p className="text-lg">You beat {inviterScoreData?.username}'s score!</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <ScoreDisplay score={gameState.score} displayName="Your Score" />
        <ShareChallenge username={gameState.username} score={gameState.score} />
      </div>
      
      {gameState.roomId && (
        <div className="glass-card p-4 animate-fade-in">
          <div className="flex items-center text-gray-700">
            <AlertTriangle className="h-5 w-5 text-green-500 mr-2" />
            <p>
              You are in room <span className="font-medium">{gameState.roomId}</span> with {roomParticipants.length} players
            </p>
          </div>
        </div>
      )}
      
      {inviterScoreData && (
        <div className={`glass-card p-4 animate-fade-in ${inviterScoreData.beaten ? 'border-2 border-green-500' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <Trophy className={`h-5 w-5 ${inviterScoreData.beaten ? 'text-green-500' : 'text-amber-500'} mr-2`} />
              <p>
                <span className="font-medium">{inviterUsername}</span> has challenged you! Their score: 
                <span className="font-bold ml-1">{inviterScoreData.score.correct}/{inviterScoreData.score.total || inviterScoreData.score.correct}</span>
              </p>
            </div>
            
            {inviterScoreData.beaten && (
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                <span>Beaten!</span> <Sparkles className="h-3 w-3 ml-1" />
              </div>
            )}
          </div>
        </div>
      )}
      
      {gameState.roomId && roomParticipants.length > 0 && (
        <div className="mb-6">
          <HighScores 
            scores={roomParticipants} 
            currentUsername={gameState.username} 
          />
        </div>
      )}
      
      <div className="space-y-8">
        <ClueCard 
          clue={gameState.displayedClue} 
          isLoading={gameState.loading}
          onRequestHint={handleRequestHint}
          hintsAvailable={hasMoreClues && gameState.selectedAnswer === null}
        />
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-700">Where am I?</h3>
          <OptionButtons
            options={gameState.options}
            onSelect={handleSelectAnswer}
            selectedAnswer={gameState.selectedAnswer}
            isCorrect={gameState.isCorrect}
            disabled={gameState.loading}
          />
        </div>
        
        <ResultFeedback
          isCorrect={gameState.isCorrect}
          fact={gameState.displayedFact}
          onNextQuestion={loadNextQuestion}
        />
      </div>
    </div>
  );
};

export default GameContainer;
