
import { Award } from "lucide-react";

interface ScoreDisplayProps {
  score: {
    correct: number;
    incorrect: number;
    total: number;
  };
  displayName?: string;
  username?: string;
}

const ScoreDisplay = ({ score, displayName = "Score", username }: ScoreDisplayProps) => {
  const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="glass-card p-4 flex items-center space-x-4 animate-fade-in">
      <div className="bg-primary/10 rounded-full p-2">
        <Award className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{displayName}</p>
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl font-bold text-gray-800">{score.correct}</p>
          <p className="text-sm text-gray-500">correct of {score.total} ({percentage}%)</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
