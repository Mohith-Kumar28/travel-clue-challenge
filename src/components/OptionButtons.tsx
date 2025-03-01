
import { Destination } from "@/types";
import { Button } from "@/components/ui/button";

interface OptionButtonsProps {
  options: Destination[];
  onSelect: (destinationId: string) => void;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  disabled: boolean;
}

const OptionButtons = ({
  options,
  onSelect,
  selectedAnswer,
  isCorrect,
  disabled
}: OptionButtonsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full animate-fade-in" style={{ animationDelay: "0.2s" }}>
      {options.map((destination) => {
        const isSelected = selectedAnswer === destination.id;
        let buttonStyle = "option-button";
        
        if (isSelected && isCorrect === true) {
          buttonStyle += " bg-green-100 border-green-300";
        } else if (isSelected && isCorrect === false) {
          buttonStyle += " bg-red-100 border-red-300";
        }
        
        return (
          <button
            key={destination.id}
            className={buttonStyle}
            onClick={() => onSelect(destination.id)}
            disabled={disabled || selectedAnswer !== null}
          >
            <span className="option-button-content">{destination.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default OptionButtons;
