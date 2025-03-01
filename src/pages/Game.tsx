
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GameContainer from '@/components/GameContainer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Game = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract challenge parameters
  const inviterUsername = searchParams.get('inviter');
  const inviterScore = searchParams.get('score') ? parseInt(searchParams.get('score') || '0', 10) : null;
  const roomId = searchParams.get('roomId');
  
  useEffect(() => {
    // Check if username is set in session storage
    const username = sessionStorage.getItem('globetrotter_username');
    
    // If not set and we're not coming from an invitation link, redirect to home
    if (!username && !inviterUsername) {
      navigate('/');
    }
  }, [navigate, inviterUsername]);

  return (
    <div className="min-h-screen py-8 px-4 globe-bg">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Button
            variant="ghost"
            className="flex items-center space-x-2 hover:bg-white/20"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
          
          <h1 className="text-2xl font-bold gradient-text">Globetrotter Challenge</h1>
        </div>
        
        <GameContainer inviterScore={inviterScore} />
      </div>
    </div>
  );
};

export default Game;
