import { Deck, DeckStats } from "@/types/flashcards";
import { Card } from "../components/ui/card";
import { BookOpen, Clock, Sparkles, SquarePen } from "lucide-react";
import { DeleteDeckDialog } from "./DeleteDeckDialog";


interface DeckCardProps {
  deck: Deck;
  stats: DeckStats;
  onClick: () => void;
  onDelete: () => void;
  onEdit: (deck: Deck) => void;
}


export function DeckCard({ deck, stats, onClick, onDelete, onEdit}: DeckCardProps) {


  return (
    <div>
      <Card
        className="card-gradient border-border hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden group"
        onClick={onClick}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: deck.color }}
            />
            <span className="text-xs text-muted-foreground">
              {deck.cardCount} cards
            </span>

          </div>

          <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {deck.name}
          </h3>
          {deck.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {deck.description}
            </p>

          )}

          <div className="flex items-center gap-4 text-xs">
            {stats.newCards > 0 && (
              <div className="flex items-center gap-1 text-primary">
                <Sparkles className="w-3 h-3" />
                <span>{stats.newCards} novos</span>
              </div>
            )}
            {stats.dueCards > 0 && (
              <div className="flex items-center gap-1 text-warning">
                <Clock className="w-3 h-3" />
                <span>{stats.dueCards} para revisar</span>
              </div>
            )}
            {stats.dueCards === 0 && stats.newCards === 0 && (
              <div className="flex items-center gap-1 text-success">
                <BookOpen className="w-3 h-3" />
                <span>Em dia!</span>
              </div>
            )}
          </div>


        </div>

      </Card>
      <div className='p-1 flex justify-start items-baseline gap-1 '>

        <DeleteDeckDialog onConfirm={onDelete} />
        <button
          className="text-warning p-1 rounded-lg hover:text-warning/50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(deck);
          }}
        >
          <SquarePen className="w-4 h-4" />
        </button>

      </div>
    </div>


  );
}
