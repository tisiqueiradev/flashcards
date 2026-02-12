import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";

interface CreateCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (front: string, back: string) => void;
}

export function CreateCardDialog({
  open,
  onOpenChange,
  onSave,
}: CreateCardDialogProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isDisable, setDisable] = useState(true);


  const handleSave = () => {
    if (!front.trim() || !back.trim()){
      setDisable(true);
      return;
    }
    onSave(front.trim(), back.trim());
    setFront("");
    setBack("");
    setDisable(false);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="card-gradient border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Novo card</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="front">Frente (Pergunta)</Label>
            <Textarea
              id="front"
              placeholder="Digite a pergunta..."
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="bg-secondary border-border resize-none text-base"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="back">Verso (Resposta)</Label>
            <Textarea
              id="back"
              placeholder="Digite a resposta..."
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="bg-secondary border-border resize-none text-base"
              rows={3}
            />
          </div>
          <div className="flex gap-2">

            <Button
              variant="secondary"
              onClick={handleSave}
              className={`
              flex-1
              ${!isDisable ? "text-black" : "text-white"}
            `}
              disabled={!front.trim() || !back.trim()}
            >

              Salvar e Continuar
            </Button>
            <Button
              onClick={() => {
                handleSave();
                onOpenChange(false);
              }}

              disabled={!front.trim() || !back.trim()}
              className={`
              flex-1
              ${!isDisable ? "text-black" : "text-white"}
            `}
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
