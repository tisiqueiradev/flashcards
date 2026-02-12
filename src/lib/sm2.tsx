import { Flashcard, ReviewQuality } from "../app/types/flashcards";
import { v4 as uuidv4} from "uuid";

// SM-2 Algorithm Implementation
// Based on SuperMemo 2 algorithm by Piotr Wozniak

export function calculateNextReview(
  card: Flashcard,
  quality: ReviewQuality
): Partial<Flashcard> {
  let { interval, repetition, easeFactor } = card;

  if (quality < 3) {
    // Incorrect response - reset repetition
    repetition = 0;
    interval = 1;
  } else {
    // Correct response
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetition += 1;
  }

  // Update ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ensure minimum ease factor of 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const now = Date.now();
  const nextReview = now + interval * 24 * 60 * 60 * 1000; // Convert days to ms

  return {
    interval,
    repetition,
    easeFactor,
    nextReview,
    lastReview: now,
  };
}

export function createNewCard(
  deckId: string,
  front: string,
  back: string
): Flashcard {
  return {
    id: uuidv4(),
    deckId,
    front,
    back,
    createdAt: Date.now(),
    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
    nextReview: Date.now(), // New cards are immediately due
    lastReview: null,
  };
}

export function getQualityLabel(quality: ReviewQuality): string {
  const labels: Record<ReviewQuality, string> = {
    0: "Esqueci",
    1: "Errei",
    2: "Difícil",
    3: "Bom",
    4: "Fácil",
    5: "Perfeito",
  };
  return labels[quality];
}

export function getQualityColor(quality: ReviewQuality): string {
  const colors: Record<ReviewQuality, string> = {
    0: "destructive",
    1: "destructive",
    2: "hard",
    3: "warning",
    4: "success",
    5: "primary",
  };
  return colors[quality];
}
