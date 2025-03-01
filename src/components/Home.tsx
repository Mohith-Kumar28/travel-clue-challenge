
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gameService } from '@/services/gameService';
import { Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Home = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartGame = () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Register the user
    gameService.registerUser(username);
    
    // Store the username in sessionStorage so it persists during the game
    sessionStorage.setItem('globetrotter_username', username);
    
    // Navigate to the game page
    setTimeout(() => {
      navigate('/game');
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 globe-bg">
      <div className="max-w-3xl w-full animate-fade-in">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Globe className="h-16 w-16 text-primary animate-float" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
            Globetrotter Challenge
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Test your knowledge of famous destinations around the world with cryptic clues and fun facts!
          </p>
        </div>

        <div className="glass-card p-8 mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Play</h2>
          <div className="space-y-4 text-gray-600">
            <p className="flex items-start">
              <span className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
              You'll be given cryptic clues about a famous destination
            </p>
            <p className="flex items-start">
              <span className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
              Select the correct destination from multiple choices
            </p>
            <p className="flex items-start">
              <span className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
              Get immediate feedback and learn fun facts
            </p>
            <p className="flex items-start">
              <span className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
              Challenge your friends and compare your scores!
            </p>
          </div>
        </div>

        <div className="glass-card p-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ready to Begin?</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your username
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your unique username"
                className="bg-white/80"
              />
            </div>
            <Button 
              onClick={handleStartGame} 
              disabled={isLoading}
              className="w-full py-6 text-lg font-medium transition-all duration-300"
            >
              {isLoading ? "Loading..." : "Start Adventure"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
