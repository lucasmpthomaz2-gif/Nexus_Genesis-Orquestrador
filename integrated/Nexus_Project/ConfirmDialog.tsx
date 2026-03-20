import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  isDangerous?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  isLoading = false,
  isDangerous = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border/50">
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            {isDangerous && (
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <AlertDialogTitle className={isDangerous ? "text-red-400" : ""}>
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={isDangerous ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {isLoading ? "Processando..." : confirmLabel}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
