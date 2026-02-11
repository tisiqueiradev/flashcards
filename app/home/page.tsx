'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "../lib/storage";
import { Deck, DeckStats } from "../types/flashcards";
import { DeckCard } from "../components/DeckCard";
import { CreateDeckDialog } from "../components/CreateDeckDialog";
import { InstallPWA } from "../components/InstallPWA";
import { Button } from "../components/ui/button";
import { Plus, Sparkles, Brain, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../components/ui/Logo";
import { v4 as uuidv4} from "uuid";

export default function Home() {
  const router = useRouter();
  const { signOut } = useAuth();

  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckStatsMap, setDeckStatsMap] = useState<Record<string, DeckStats>>({});
  const [showCreateDeck, setShowCreateDeck] = useState(false);

  // Função pura para calcular stats
  const calculateDeckStats = (decks: Deck[]): Record<string, DeckStats> => {
    const now = Date.now();
    const map: Record<string, DeckStats> = {};

    decks.forEach((deck) => {
      const cards = storage.getCardsByDeck(deck.id);
      const dueCards = cards.filter((c) => c.nextReview <= now);
      const newCards = cards.filter((c) => c.lastReview === null);
      const learnedCards = cards.filter((c) => c.lastReview !== null && c.nextReview > now);

      map[deck.id] = {
        totalCards: cards.length,
        newCards: newCards.length,
        dueCards: dueCards.length,
        learnedCards: learnedCards.length,
      };
    });

    return map;
  };

  // Carrega decks e stats de forma segura
  useEffect(() => {
    setTimeout(() => {
      const loadedDecks = storage.getDecks();
      setDecks(loadedDecks);
      setDeckStatsMap(calculateDeckStats(loadedDecks));
    }, 0);
  }, []);

  const handleCreateDeck = async (data: Omit<Deck, "id" | "createdAt" | "cardCount">) => {
    const newDeck: Deck = {
      ...data,
      id: uuidv4(),
      createdAt: Date.now(),
      cardCount: 0,
    };
    storage.saveDeck(newDeck);

    setDecks((prev) => {
      const updated = [...prev, newDeck];
      setDeckStatsMap(calculateDeckStats(updated));
      return updated;
    });
  };

  const totalDueCards = Object.values(deckStatsMap).reduce(
    (acc, stats) => acc + stats.dueCards,
    0
  );

  return (
    <div className="min-h-screen bg-background ">
      {/* Header */}
      <header className="p-4 border-b border-border flex items-center justify-between">
        {/* Logo e textos */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
            <Logo />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">FlashCard</h1>
            <p className="text-xs text-muted-foreground">
              Aprenda todos os dias. <span className="text-green-300">Evolua sempre.</span>
            </p>
          </div>
        </div>

        {/* Indicador de cards e logout */}
        <div className="flex items-center gap-2">
          {totalDueCards > 0 && (
            <div className="flex items-center gap- bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {totalDueCards} para revisar
            </div>
          )}
          <Button  variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="w-4 h-4"/>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="  p-4 pb-24">
        <div className="  flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">Seus Decks</h2>
          <Button size="sm" variant="default"onClick={() => setShowCreateDeck(true)}>
            <Plus className="w-4 h-4 mr-1 " />
            <span className="">Novo Deck</span>
          </Button>
        </div>

        {decks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Brain className="w-10 h-10 text-green-700" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">
              Nenhum deck ainda
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Crie seu primeiro deck de flashcards e comece a aprender com repetição espaçada!
            </p>
            <Button onClick={() => setShowCreateDeck(true)} size="lg" className="bg-green-300">
              <Plus className="w-5 h-5 mr-2  text-black" />
              <span className="text-black">Criar Primeiro Deck</span>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {decks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                stats={deckStatsMap[deck.id]}
                onClick={() => router.push(`/deck/${deck.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <CreateDeckDialog
        open={showCreateDeck}
        onOpenChange={setShowCreateDeck}
        onSave={handleCreateDeck}
      />

      <InstallPWA />
    </div>
  );
}
