
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ClueCard from './ClueCard';
import OptionButtons from './OptionButtons';
import ResultFeedback from './ResultFeedback';
import ScoreDisplay from './ScoreDisplay';
import ShareChallenge from './ShareChallenge';
import { gameService } from '@/services/gameService';
import { GameState, Destination } from '@/types';
import { AlertTriangle } from 'lucide-react';

const GameContainer = () => {
  const [searchParams] = useSearchParams();
  const inviterUsername = searchParams.get('inviter');
  
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
    loading: true
  });
  
  const [inviterScore, setInviterScore] = useState(null);

  useEffect(() => {
    // Get username from session storage
    const storedUsername = sessionStorage.getItem('globetrotter_username');
    
    if (storedUsername) {
      // Initialize the game with the stored username
      const userScore = gameService.getScore(storedUsername);
      
      setGameState(prev => ({
        ...prev,
        username: storedUsername,
        score: userScore.score
      }));
    } else if (inviterUsername) {
      // If we have an inviter but no username, we'll use "Guest" for now
      setGameState(prev => ({
        ...prev,
        username: "Guest"
      }));
      
      // Get the inviter's score to display
      const inviterScoreData = gameService.getScore(inviterUsername);
      setInviterScore(inviterScoreData);
    }
    
    // Load the first question
    loadNextQuestion();
  }, [inviterUsername]);

  const loadNextQuestion = async () => {
    setGameState(prev => ({
      ...prev,
      selectedAnswer: null,
      isCorrect: null,
      loading: true
    }));

    try {
      // Get a random destination
      const destination = await gameService.getRandomDestination();
      
      // Get random options including the correct destination
      const options = await gameService.getRandomOptions(destination);
      
      // Get a random clue for this destination
      const clue = await gameService.getRandomClue(destination);
      
      // Get a random fact for this destination
      const fact = await gameService.getRandomFact(destination);
      
      // Update game state
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
    
    // Update score
    const newScore = {
      ...gameState.score,
      total: gameState.score.total + 1,
      correct: isCorrect ? gameState.score.correct + 1 : gameState.score.correct,
      incorrect: !isCorrect ? gameState.score.incorrect + 1 : gameState.score.incorrect
    };
    
    // Save score to the service
    gameService.saveScore(gameState.username, isCorrect);
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      selectedAnswer: destinationId,
      isCorrect,
      score: newScore
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Header area with scores */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <ScoreDisplay score={gameState.score} username={gameState.username} />
        <ShareChallenge username={gameState.username} score={gameState.score} />
      </div>
      
      {/* Inviter score display (if applicable) */}
      {inviterScore && (
        <div className="glass-card p-4 animate-fade-in">
          <div className="flex items-center text-gray-700">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <p>
              <span className="font-medium">{inviterUsername}</span> has challenged you! Their score: 
              <span className="font-bold ml-1">{inviterScore.score.correct}/{inviterScore.score.total}</span>
            </p>
          </div>
        </div>
      )}
      
      {/* Main game content */}
      <div className="space-y-8">
        {/* Clue card */}
        <ClueCard 
          clue={gameState.displayedClue} 
          isLoading={gameState.loading} 
        />
        
        {/* Options */}
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
        
        {/* Result feedback and next button */}
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
