
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  image: string;
  currentPrice: number;
}

interface Wishlist {
  id: number;
  name: string;
  itemCount: number;
}

interface AddToWishlistDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  wishlists: Wishlist[];
  onAddToWishlist: (wishlistId: number, product: Product) => void;
  onCreateWishlistAndAdd: (name: string, product: Product) => void;
}

const AddToWishlistDialog = ({
  open,
  onClose,
  product,
  wishlists,
  onAddToWishlist,
  onCreateWishlistAndAdd
}: AddToWishlistDialogProps) => {
  const [selectedWishlist, setSelectedWishlist] = useState<string>("");
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!product) return;

    if (showCreateNew) {
      if (!newListName.trim()) {
        setError("Debes ingresar un nombre para la lista.");
        return;
      }

      if (wishlists.some(list => 
        list.name.toLowerCase() === newListName.trim().toLowerCase()
      )) {
        setError("Ya tienes una lista con ese nombre.");
        return;
      }

      onCreateWishlistAndAdd(newListName.trim(), product);
      toast({
        title: "Lista creada y producto añadido",
        description: "Lista creada y producto añadido exitosamente.",
      });
    } else {
      if (!selectedWishlist) {
        setError("Selecciona una lista de deseos.");
        return;
      }

      onAddToWishlist(parseInt(selectedWishlist), product);
      toast({
        title: "Producto añadido",
        description: "Producto añadido correctamente a tu Lista de Deseos seleccionada.",
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setSelectedWishlist("");
    setShowCreateNew(false);
    setNewListName("");
    setError("");
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-primary" />
            Agregar a Lista de Deseos
          </DialogTitle>
          <DialogDescription>
            Selecciona una lista existente o crea una nueva para agregar "{product.name}".
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Producto */}
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">S/ {product.currentPrice.toFixed(2)}</p>
            </div>
          </div>

          {wishlists.length > 0 && !showCreateNew && (
            <div className="space-y-3">
              <Label>Selecciona una lista:</Label>
              <RadioGroup
                value={selectedWishlist}
                onValueChange={setSelectedWishlist}
                className="space-y-2"
              >
                {wishlists.map((wishlist) => (
                  <div key={wishlist.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={wishlist.id.toString()} id={`wishlist-${wishlist.id}`} />
                    <Label 
                      htmlFor={`wishlist-${wishlist.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex justify-between">
                        <span>{wishlist.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {wishlist.itemCount} productos
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {(wishlists.length === 0 || showCreateNew) && (
            <div className="space-y-3">
              <Label htmlFor="newListName">Nombre de la nueva lista:</Label>
              <Input
                id="newListName"
                value={newListName}
                onChange={(e) => {
                  setNewListName(e.target.value);
                  setError("");
                }}
                placeholder="Ej: Tecnología, Hogar, Regalos..."
                maxLength={50}
              />
            </div>
          )}

          {wishlists.length > 0 && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreateNew(!showCreateNew)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showCreateNew ? "Seleccionar lista existente" : "Crear nueva lista"}
              </Button>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {showCreateNew || wishlists.length === 0 ? "Crear y añadir" : "Añadir a lista"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToWishlistDialog;
