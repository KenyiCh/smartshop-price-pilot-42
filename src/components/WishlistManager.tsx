import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Trash2, Edit } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import CreateWishlistDialog from "./CreateWishlistDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import WishlistDetail from "./WishlistDetail";

interface WishlistItem {
  id: number;
  name: string;
  image: string;
  currentPrice: number;
  targetPrice: number;
  category: string;
}

interface Wishlist {
  id: number;
  name: string;
  items: WishlistItem[];
  createdAt: string;
}

const WishlistManager = () => {
  const { id } = useParams();
  
  // If we have an ID, show the detail view
  if (id) {
    return <WishlistDetail />;
  }

  const [wishlists, setWishlists] = useState<Wishlist[]>([
    {
      id: 1,
      name: "Tecnología",
      createdAt: "2024-01-15",
      items: [
        {
          id: 1,
          name: "MacBook Pro 14 M3",
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
          currentPrice: 7596,
          targetPrice: 6840,
          category: "laptop"
        },
        {
          id: 2,
          name: "iPhone 15 Pro",
          image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
          currentPrice: 3796,
          targetPrice: 3420,
          category: "smartphone"
        }
      ]
    },
    {
      id: 2,
      name: "Hogar",
      createdAt: "2024-01-10",
      items: [
        {
          id: 3,
          name: "Sony WH-1000XM5",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
          currentPrice: 1326,
          targetPrice: 1140,
          category: "headphones"
        }
      ]
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteWishlist, setDeleteWishlist] = useState<Wishlist | null>(null);
  const { toast } = useToast();

  const createNewWishlist = (name: string) => {
    if (wishlists.length >= 50) {
      toast({
        title: "Límite alcanzado",
        description: "Has alcanzado el número máximo de listas permitidas. Elimina una lista existente para crear una nueva.",
        variant: "destructive",
      });
      return;
    }

    if (wishlists.some(list => list.name.toLowerCase() === name.toLowerCase())) {
      toast({
        title: "Nombre duplicado",
        description: "Ya tienes una lista con ese nombre. Elige un nombre diferente.",
        variant: "destructive",
      });
      return;
    }

    const newWishlist: Wishlist = {
      id: Date.now(),
      name,
      items: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setWishlists(prev => [...prev, newWishlist]);
    toast({
      title: "Lista creada",
      description: "Tu nueva Lista de Deseos ha sido creada exitosamente.",
    });
    setShowCreateDialog(false);
  };

  const confirmDeleteWishlist = (wishlist: Wishlist) => {
    setWishlists(prev => prev.filter(list => list.id !== wishlist.id));
    toast({
      title: "Lista eliminada",
      description: "La lista de deseos ha sido eliminada correctamente.",
    });
    setDeleteWishlist(null);
  };

  const getTotalItems = () => {
    return wishlists.reduce((total, list) => total + list.items.length, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis Listas de Deseos</h1>
          <p className="text-muted-foreground">
            Tienes {wishlists.length} listas con {getTotalItems()} productos en total
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Crear nueva lista
        </Button>
      </div>

      {wishlists.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tienes listas de deseos</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primera lista para organizar tus productos favoritos
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear primera lista
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {wishlists.map((wishlist) => (
            <Card key={wishlist.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-primary" />
                      {wishlist.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {wishlist.items.length} productos • Creada el {new Date(wishlist.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/wishlist/${wishlist.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Ver lista
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteWishlist(wishlist)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {wishlist.items.length === 0 ? (
                  <p className="text-muted-foreground italic">Lista vacía</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {wishlist.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">S/ {item.currentPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    {wishlist.items.length > 3 && (
                      <div className="flex items-center justify-center p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          +{wishlist.items.length - 3} productos más
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateWishlistDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateWishlist={createNewWishlist}
        existingNames={wishlists.map(list => list.name)}
        maxLists={50}
        currentCount={wishlists.length}
      />

      {deleteWishlist && (
        <DeleteConfirmDialog
          open={!!deleteWishlist}
          onClose={() => setDeleteWishlist(null)}
          onConfirm={() => confirmDeleteWishlist(deleteWishlist)}
          title="Eliminar lista de deseos"
          description={`¿Estás seguro de que deseas eliminar la lista "${deleteWishlist.name}"? Esta acción no se puede deshacer.`}
        />
      )}
    </div>
  );
};

export default WishlistManager;
