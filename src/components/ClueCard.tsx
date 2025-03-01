
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

interface ClueCardProps {
  clue: string;
  isLoading: boolean;
  onRequestHint: () => void;
  hintsAvailable: boolean;
}

const ClueCard = ({ clue, isLoading, onRequestHint, hintsAvailable }: ClueCardProps) => {
  const [animateHint, setAnimateHint] = useState(false);

  const handleHintClick = () => {
    setAnimateHint(true);
    onRequestHint();
    setTimeout(() => setAnimateHint(false), 1000);
  };

  return (
    <Card className="glass-card overflow-hidden animate-fade-in relative">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-primary mr-2" />
            <h3 className="text-sm font-medium text-primary">CRYPTIC CLUE</h3>
          </div>
          
          {hintsAvailable && (
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs flex items-center gap-1 ${animateHint ? 'animate-pulse' : ''}`} 
              onClick={handleHintClick}
            >
              <HelpCircle className="h-3 w-3" />
              <span>Hint</span>
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : (
          <p className="text-xl text-gray-800 italic">"{clue}"</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ClueCard;
