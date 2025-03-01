
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { gameService } from "@/services/gameService";
import { useToast } from "@/components/ui/use-toast";
import { Share2 } from "lucide-react";
import CopyLinkButton from "./CopyLinkButton";

interface ShareChallengeProps {
  username: string;
  score: {
    correct: number;
    incorrect: number;
    total: number;
  };
}

const ShareChallenge = ({ username, score }: ShareChallengeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const shareUrl = gameService.generateShareUrl(username);

  const handleShare = async () => {
    // Try to use the Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Globetrotter Challenge',
          text: `I scored ${score.correct}/${score.total} in the Globetrotter Challenge! Can you beat me?`,
          url: shareUrl,
        });
        toast({
          title: "Shared successfully!",
          description: "Your challenge has been shared.",
        });
      } catch (error) {
        console.error('Error sharing:', error);
        setIsOpen(true);
      }
    } else {
      // Fallback to dialog if Web Share API is not available
      setIsOpen(true);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center space-x-2 hover:bg-primary/5"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        <span>Challenge a Friend</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Challenge a Friend</DialogTitle>
            <DialogDescription>
              Share this link with your friends to challenge them to beat your score!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div className="bg-white/80 p-6 rounded-lg text-center">
              <p className="text-lg font-semibold mb-1">{username}'s Score</p>
              <p className="text-3xl font-bold gradient-text">{score.correct}/{score.total}</p>
              <p className="text-sm text-gray-500 mt-1">
                Correct answers: {score.correct} | Success rate: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Copy this link and share it with your friends:</p>
              <div className="flex items-center">
                <div className="bg-white/60 p-3 rounded-l-lg border border-r-0 border-gray-200 flex-1 truncate text-gray-600 text-sm">
                  {shareUrl}
                </div>
                <CopyLinkButton textToCopy={shareUrl} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(`I scored ${score.correct}/${score.total} in the Globetrotter Challenge! Can you beat me? ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white py-2 px-4 rounded-lg text-center flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-colors"
              >
                <span>Share on WhatsApp</span>
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I scored ${score.correct}/${score.total} in the Globetrotter Challenge! Can you beat me? ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1DA1F2] text-white py-2 px-4 rounded-lg text-center flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-colors"
              >
                <span>Share on Twitter</span>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareChallenge;
