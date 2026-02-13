'use client';

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Flashcard } from "@/types/flashcards";

interface EditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: Flashcard | null;
  onSave: (updatedCard: Flashcard) => void;
}

export function EditCardDialog({
  open,
  onOpenChange,
  card,
  onSave,
}: EditCardDialogProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    setTimeout(() => {
      if (card) {
      setFront(card.front);
      setBack(card.back);
    }
    }, 0)

  }, [card]);

  const handleSave = () => {
    if (!card) return;
    if (!front.trim() || !back.trim()) return;

    const updatedCard: Flashcard = {
      ...card,
      front: front.trim(),
      back: back.trim(),
    };

    onSave(updatedCard);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Frente</Label>
            <Textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label>Verso</Label>
            <Textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleSave} disabled={!front.trim() || !back.trim()}>
            Salvar alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
