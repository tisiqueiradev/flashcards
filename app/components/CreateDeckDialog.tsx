"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Deck {
  id: string;
  name: string;
  description?: string;
  color: string;
}

export type DeckFormData = {
  name: string;
  description: string;
  color: string;
};


interface CreateDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: DeckFormData) => void;
  initialData?: Deck | null;
}

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
];

export function CreateDeckDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
}: CreateDeckDialogProps) {
  const isEditing = !!initialData;

  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [color, setColor] = useState(initialData?.color ?? COLORS[0]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setColor(COLORS[0]);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name,
      description,
      color,
    });

    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Deck" : "Criar Novo Deck"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nome do deck"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 ${
                  color === c ? "border-black" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <Button onClick={handleSave} className="w-full">
            {isEditing ? "Salvar Alterações" : "Criar Deck"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
