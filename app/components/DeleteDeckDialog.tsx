import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Trash2 } from "lucide-react";

interface DeleteCardDialogProps {
  onConfirm: () => void;
}

export function DeleteDeckDialog({ onConfirm }: DeleteCardDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="p-1 rounded-lg group ">
          <Trash2 className="w-5 h-5 text-red-600 group-hover:text-red-900 transition-colors" />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="text-warning">
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. O deck e os cards associados serão removidos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
