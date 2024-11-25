import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgradeClick: () => void;
}

export const UpgradeDialog = ({ open, onOpenChange, onUpgradeClick }: UpgradeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Limite de Recibos Atingido</DialogTitle>
          <DialogDescription>
            Você atingiu o limite mensal de recibos do seu plano atual. 
            Para continuar gerando recibos, faça um upgrade do seu plano.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onUpgradeClick}>
            Ver Planos Disponíveis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};