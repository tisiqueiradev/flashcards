import { Deck, Flashcard } from "../app/types/flashcards";

const DECKS_KEY = "anki_decks";
const CARDS_KEY = "anki_cards";

export const storage = {
  getDecks: (): Deck[] => {
    const data = localStorage.getItem(DECKS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveDeck: (deck: Deck): void => {
    const decks = storage.getDecks();
    const index = decks.findIndex((d) => d.id === deck.id);
    if (index >= 0) {
      decks[index] = deck;
    } else {
      decks.push(deck);
    }
    localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
  },

  deleteDeck: (deckId: string): void => {
    const decks = storage.getDecks().filter((d) => d.id !== deckId);
    localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
    // Also delete all cards in this deck
    const cards = storage.getCards().filter((c) => c.deckId !== deckId);
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  },

  getCards: (): Flashcard[] => {
    const data = localStorage.getItem(CARDS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getCardsByDeck: (deckId: string): Flashcard[] => {
    return storage.getCards().filter((c) => c.deckId === deckId);
  },

  saveCard: (card: Flashcard): void => {
    const cards = storage.getCards();
    const index = cards.findIndex((c) => c.id === card.id);
    if (index >= 0) {
      cards[index] = card;
    } else {
      cards.push(card);
      // Update deck card count
      const decks = storage.getDecks();
      const deck = decks.find((d) => d.id === card.deckId);
      if (deck) {
        deck.cardCount = (deck.cardCount || 0) + 1;
        storage.saveDeck(deck);
      }
    }
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  },

  deleteCard: (cardId: string): void => {
    const cards = storage.getCards();
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      const newCards = cards.filter((c) => c.id !== cardId);
      localStorage.setItem(CARDS_KEY, JSON.stringify(newCards));
      // Update deck card count
      const decks = storage.getDecks();
      const deck = decks.find((d) => d.id === card.deckId);
      if (deck && deck.cardCount > 0) {
        deck.cardCount -= 1;
        storage.saveDeck(deck);
      }
    }
  },

  getDueCards: (deckId: string): Flashcard[] => {
    const now = Date.now();
    return storage
      .getCardsByDeck(deckId)
      .filter((card) => card.nextReview <= now);
  },
};
