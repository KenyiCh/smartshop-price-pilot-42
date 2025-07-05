
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateWishlistDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateWishlist: (name: string) => void;
  existingNames: string[];
  maxLists: number;
  currentCount: number;
}

const CreateWishlistDialog = ({
  open,
  onClose,
  onCreateWishlist,
  existingNames,
  maxLists,
  currentCount
}: CreateWishlistDialogProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Debes ingresar un nombre para la lista.");
      return;
    }

    if (existingNames.some(existingName => 
      existingName.toLowerCase() === name.trim().toLowerCase()
    )) {
      setError("Ya tienes una lista con ese nombre. Elige un nombre diferente.");
      return;
    }

    if (currentCount >= maxLists) {
      setError("Has alcanzado el número máximo de listas permitidas.");
      return;
    }

    onCreateWishlist(name.trim());
    setName("");
    setError("");
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nueva lista de deseos</DialogTitle>
          <DialogDescription>
            Ingresa un nombre único para tu nueva lista de deseos. 
            Tienes {currentCount} de {maxLists} listas permitidas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre de la lista</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Ej: Tecnología, Hogar, Regalos..."
                maxLength={50}
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={currentCount >= maxLists}>
              Crear lista
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWishlistDialog;
