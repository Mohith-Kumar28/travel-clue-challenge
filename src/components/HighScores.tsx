
import { UserScore } from '@/types';
import { Trophy, Medal, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface HighScoresProps {
  scores: UserScore[];
  currentUsername: string;
}

const HighScores = ({ scores, currentUsername }: HighScoresProps) => {
  if (!scores.length) return null;
  
  // Check if these scores are from a room (all have the same roomId)
  const isRoomScores = scores.length > 0 && 
    scores[0].roomId !== undefined && 
    scores.every(s => s.roomId === scores[0].roomId);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {isRoomScores ? (
            <>
              <Users className="h-5 w-5 text-green-500" />
              <span>Challenge Room</span>
            </>
          ) : (
            <>
              <Trophy className="h-5 w-5 text-amber-500" />
              <span>High Scores</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {scores.slice(0, 5).map((score, index) => {
            const isCurrentUser = score.username === currentUsername;
            const percentage = score.score.total > 0 
              ? Math.round((score.score.correct / score.score.total) * 100) 
              : 0;
            
            return (
              <div 
                key={score.username} 
                className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                  isCurrentUser ? 'bg-primary/10' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {index < 3 && (
                    <Medal className={`h-4 w-4 ${
                      index === 0 ? 'text-yellow-500' : 
                      index === 1 ? 'text-gray-400' : 'text-amber-800'
                    }`} />
                  )}
                  <span className={`${isCurrentUser ? 'font-medium' : ''}`}>
                    {index + 1}. {score.username}
                    {isCurrentUser && <span className="text-xs ml-1">(you)</span>}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold">{score.score.correct}</span>
                  <span className="text-xs text-gray-500">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default HighScores;
