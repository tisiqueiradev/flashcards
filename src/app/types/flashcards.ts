export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  createdAt: number;
  // Spaced repetition data (SM-2 algorithm)
  interval: number; // days until next review
  repetition: number; // number of consecutive correct responses
  easeFactor: number; // difficulty factor (min 1.3)
  nextReview: number; // timestamp for next review
  lastReview: number | null;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: number;
  cardCount: number;
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;
// 0 - Complete blackout
// 1 - Incorrect; correct answer remembered
// 2 - Incorrect; correct answer easy to recall
// 3 - Correct; significant difficulty
// 4 - Correct; hesitation
// 5 - Perfect response

export interface StudySession {
  deckId: string;
  cardsReviewed: number;
  correctCount: number;
  startTime: number;
  endTime: number | null;
}

export interface DeckStats {
  totalCards: number;
  newCards: number;
  dueCards: number;
  learnedCards: number;
}
