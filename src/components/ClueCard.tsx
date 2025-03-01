
import { Card, CardContent } from "@/components/ui/card";

interface ClueCardProps {
  clue: string;
  isLoading: boolean;
}

const ClueCard = ({ clue, isLoading }: ClueCardProps) => {
  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <div className="h-2 w-2 rounded-full bg-primary mr-2" />
          <h3 className="text-sm font-medium text-primary">CRYPTIC CLUE</h3>
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
