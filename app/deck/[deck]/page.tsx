'use client';

import { use,useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, BookOpen, List, Trash2, SquarePen} from 'lucide-react';
import { storage } from '@/lib/storage';
import { calculateNextReview, createNewCard } from "@/lib/sm2";
import { Deck, Flashcard, ReviewQuality} from '../../types/flashcards';
import { FlashcardViewer } from "@/components/FlashcardViewer";
import { StudyComplete } from "@/components/StudyComplete";
import { CreateCardDialog } from "@/components/CreateCardDialog";
import { DeleteCardDialog } from '@/components/DeleteCardDialog';
import { EditCardDialog } from '@/components/EditCardDialog';




type PageProps = {
  params: Promise<{
    deck: string;
  }>;
};

export default function DeckPage({ params }: PageProps) {

  const { deck: deckId } = use(params);
  const router = useRouter();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [cardsReviewed, setCardsReviewed] = useState(0);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showCardList, setShowCardList] = useState(false);
  const [showEditCard, setShowEditCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);



  useEffect(() => {
    setTimeout(() => {
      if (!deckId) return;
      const decks = storage.getDecks();
      const found = decks.find((d) => d.id === deckId);
      if (found) {
      setDeck(found);
      const deckCards = storage.getCardsByDeck(deckId);
      setCards(deckCards);
      const due = storage.getDueCards(deckId);
      setDueCards(due);
    }
    }, 0);

  }, [deckId]);

  const handleReview = (quality: ReviewQuality) => {
  const card = dueCards[currentIndex];
  const updates = calculateNextReview(card, quality);
  const updatedCard = { ...card, ...updates };

  storage.saveCard(updatedCard);

  setCardsReviewed((prev) => prev + 1);
  setCurrentIndex((prev) => prev + 1);
};


  const handleCreateCard = (front: string, back: string) => {
    if (!deckId) return;
    const newCard = createNewCard(deckId, front, back);
    storage.saveCard(newCard);
    setCards((prev) => [...prev, newCard]);
    setDueCards((prev) => [...prev, newCard]);
  };

  const handleDeleteCard = (cardId: string) => {
    storage.deleteCard(cardId);
    setCards((prev) => prev.filter((card) => card.id !== cardId));
    setDueCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  const handleEditCard = (updatedCard: Flashcard) => {
    storage.saveCard(updatedCard);
    setCards((prev) =>
      prev.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      )
    );
    setDueCards((prev) =>
      prev.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      )
    );
  };


  const startStudy = () => {
    const due = storage.getDueCards(deckId!);
    setDueCards(due);
    setCurrentIndex(0);
    setCardsReviewed(0);
    setIsStudying(true);
  };




  if (!deck) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Deck não encontrado</p>
      </div>
    );
  }

  if (isStudying && dueCards.length > 0 && currentIndex < dueCards.length) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex items-center gap-3 p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsStudying(false)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display font-semibold truncate">{deck.name}</h1>
        </header>
        <FlashcardViewer
          card={dueCards[currentIndex]}
          onReview={handleReview}
          currentIndex={currentIndex}
          totalCards={dueCards.length}
        />
      </div>
    );
  }

  if (isStudying && (dueCards.length === 0 || currentIndex >= dueCards.length)) {
    return (
      <div className="min-h-screen bg-background">
        <StudyComplete cardsReviewed={cardsReviewed} onBack={() => router.back()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-semibold truncate">{deck.name}</h1>
          <p className="text-xs text-muted-foreground">
            {cards.length} {cards.length === 1 ? "card" : "cards"}
          </p>
        </div>
        <Button variant="hard" size="icon" onClick={() => setShowCardList(!showCardList)}>
          <List className="w-5 h-5"/>
        </Button>
      </header>

      <main className="p-4">
        {showCardList ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Cards</h2>
              <Button size="sm" onClick={() => setShowCreateCard(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>
            {cards.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum card ainda. Adicione o primeiro!
              </p>
            ) : (
              cards.map((card) => (
                <div
                  key={card.id}
                  className="card-gradient rounded-lg p-4 border border-border"
                >
                  <p className="font-medium mb-2">{card.front}</p>
                  <p className="text-sm text-muted-foreground">{card.back}</p>
                  <div className='p-1 flex justify-start items-baseline gap-1 '>
                    <DeleteCardDialog
                      onConfirm={() => handleDeleteCard(card.id)}
                    />

                    <button className=
                      "text-warning p-1 rounded-lg hover:text-warning/50 transition-colors"

                      onClick={() => {
                        setSelectedCard(card);
                        setShowEditCard(true);
                      }}
                      >
                      <SquarePen className="w-4 h-4 "/>

                    </button>


                  </div>

                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="card-gradient rounded-2xl p-8 text-center border border-border max-w-sm w-full">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: deck.color + "20" }}
              >
                <BookOpen className="w-8 h-8 " style={{ color: deck.color }} />
              </div>

              {dueCards.length === 0 ? (
               <></>
            ): ( <h2 className="font-display text-xl font-semibold mb-2">
                Pronto para estudar?
              </h2>)}

              {dueCards.length > 0 ? (
                <>
                  <p className="text-muted-foreground mb-6">
                    Você tem{" "}
                    <span className="text-primary font-semibold">
                      {dueCards.length}
                    </span>{" "}
                    {dueCards.length === 1 ? "card" : "cards"} para revisar
                  </p>
                  <Button onClick={startStudy} size="xl" className="w-full bg-green-300">
                   <span className='text-black'>Começar Revisão</span>
                  </Button>
                </>
              ) : cards.length === 0 ? (
                <>
                  <p className="text-muted-foreground mb-6">
                    Este deck está vazio. Adicione cards para começar!
                  </p>
                  <Button
                    onClick={() => setShowCreateCard(true)}
                    size="xl"
                    className="w-full bg-green-300"
                  >
                    <Plus className="w-5 h-5 mr-2 text-black" />
                    <span className='text-black'>Adicionar Cards</span>
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-muted-foreground mb-6 ">
                    <span className='text-green-700 text-xl'>Todos os cards estão em dia!</span>
                    <p>Volte mais tarde.</p>

                  </div>
                  <Button
                    variant="default"
                    onClick={() => setShowCreateCard(true)}
                    size="lg"
                    className="w-full text-white"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    <span className=''>Adicionar cards</span>

                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <CreateCardDialog
        open={showCreateCard}
        onOpenChange={setShowCreateCard}
        onSave={handleCreateCard}
      />

      <EditCardDialog
        open={showEditCard}
        onOpenChange={setShowEditCard}
        card={selectedCard}
        onSave={handleEditCard}
      />

    </div>
  );
}
