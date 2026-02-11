import { useState } from "react";
import { Flashcard, ReviewQuality } from "../types/flashcards";
import { Button } from "../components/ui/button";
import { getQualityLabel } from "../lib/sm2";
import { RotateCcw, Check, X, Brain, Zap } from "lucide-react";

interface FlashcardViewerProps {
  card: Flashcard;
  onReview: (quality: ReviewQuality) => void;
  currentIndex: number;
  totalCards: number;
}

export function FlashcardViewer({
  card,
  onReview,
  currentIndex,
  totalCards,
}: FlashcardViewerProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReview = (quality: ReviewQuality) => {
    setIsFlipped(false);
    onReview(quality);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {totalCards}
        </span>
        <div className="h-1 flex-1 mx-4 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <div
          className="flip-card w-full max-w-md aspect-[3/4] cursor-pointer"
          onClick={handleFlip}
        >
          <div className={`flip-card-inner w-full h-full ${isFlipped ? "flipped" : ""}`}>
            {/* Front */}
            <div className="flip-card-front absolute inset-0 card-gradient rounded-2xl p-6 flex flex-col items-center justify-center border border-border">
              <div className="absolute top-4 left-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Pergunta
                </span>
              </div>
              <p className="text-xl md:text-2xl font-medium text-center text-balance">
                {card.front}
              </p>
              <div className="absolute bottom-4 text-sm text-muted-foreground flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Toque para virar
              </div>
            </div>

            {/* Back */}
            <div className="flip-card-back absolute inset-0 card-gradient rounded-2xl p-6 flex flex-col items-center justify-center border border-primary/30 glow-effect">
              <div className="absolute top-4 left-4">
                <span className="text-xs text-primary uppercase tracking-wider">
                  Resposta
                </span>
              </div>
              <p className="text-xl md:text-2xl font-medium text-center text-balance">
                {card.back}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Buttons */}
      {isFlipped && (
        <div className="p-4 safe-area-bottom animate-slide-up">
          <p className="text-center text-sm text-muted-foreground mb-3">
            Como foi sua lembrança?
          </p>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="review"
              onClick={() => handleReview(0)}
              className="flex-col gap-1 h-auto py-3 border-destructive/50 hover:bg-destructive/10"
            >
              <X className="w-5 h-5 text-destructive" />
              <span className="text-xs">{getQualityLabel(0)}</span>
            </Button>
            <Button
              variant="review"
              onClick={() => handleReview(2)}
              className="flex-col gap-1 h-auto py-3 border-hard/50 hover:bg-hard/10"
            >
              <Brain className="w-5 h-5 text-hard" />
              <span className="text-xs">{getQualityLabel(2)}</span>
            </Button>
            <Button
              variant="review"
              onClick={() => handleReview(3)}
              className="flex-col gap-1 h-auto py-3 border-warning/50 hover:bg-warning/10"
            >
              <Check className="w-5 h-5 text-warning" />
              <span className="text-xs">{getQualityLabel(3)}</span>
            </Button>
            <Button
              variant="review"
              onClick={() => handleReview(5)}
              className="flex-col gap-1 h-auto py-3 border-primary/50 hover:bg-primary/10"
            >
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-xs">{getQualityLabel(5)}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
