'use client';

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Button } from "../components/ui/button";
import { Trophy, ArrowLeft, Sparkles } from "lucide-react";

interface StudyCompleteProps {
  cardsReviewed: number;
  onBack: () => void;
}

export function StudyComplete({ cardsReviewed, onBack }: StudyCompleteProps) {
  useEffect(() => {
    if (cardsReviewed <= 0) return;

    const duration = 1800;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
      });

      confetti({
        particleCount: 6,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }

      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    };

    frame();


  }, [cardsReviewed]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">


      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow">
          <Trophy className="w-12 h-12 text-primary" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-warning animate-bounce" />
      </div>

      <h2 className="font-display text-2xl font-bold mb-2">
        🎉 Parabéns!
      </h2>

      <p className="text-muted-foreground mb-6">
        Você revisou{" "}
        <span className="text-primary font-semibold">
          {cardsReviewed}
        </span>{" "}
        {cardsReviewed === 1 ? "card" : "cards"} hoje!
      </p>

      <Button onClick={onBack} size="lg">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar aos Decks
      </Button>
    </div>
  );
}
