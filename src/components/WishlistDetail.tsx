
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Trash2, Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { formatPrice } from "@/utils/priceUtils";

interface WishlistItem {
  id: number;
  name: string;
  image: string;
  currentPrice: number;
  category: string;
  rating: number;
  stores: number;
  trend: "up" | "down" | "stable";
}

const WishlistDetail = () => {
  const { id } = useParams();
  const [deleteItem, setDeleteItem] = useState<WishlistItem | null>(null);
  const { toast } = useToast();

  // Mock data - in real app this would be fetched based on the ID
  const wishlist = {
    id: 1,
    name: "Tecnología",
    createdAt: "2024-01-15",
    items: [
      {
        id: 1,
        name: "MacBook Pro 14 M3",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        currentPrice: 7596.50,
        category: "laptop",
        rating: 4.8,
        stores: 5,
        trend: "down" as const
      },
      {
        id: 2,
        name: "iPhone 15 Pro",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
        currentPrice: 3796.75,
        category: "smartphone",
        rating: 4.6,
        stores: 8,
        trend: "up" as const
      }
    ]
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case "stable":
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-red-500";
      case "down":
        return "text-green-500";
      case "stable":
        return "text-muted-foreground";
    }
  };

  const confirmDeleteItem = (item: WishlistItem) => {
    console.log("Deleting item:", item.id);
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado de tu lista de deseos.",
    });
    setDeleteItem(null);
  };

  const getTrendPercentage = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "+5%";
      case "down":
        return "-8%";
      case "stable":
        return "0%";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/wishlist">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Heart className="h-8 w-8 mr-3 text-primary" />
            {wishlist.name}
          </h1>
          <p className="text-muted-foreground">
            {wishlist.items.length} productos • Creada el {new Date(wishlist.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {wishlist.items.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lista vacía</h3>
            <p className="text-muted-foreground mb-4">
              Aún no has agregado productos a esta lista
            </p>
            <Link to="/products">
              <Button>Explorar productos</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {wishlist.items.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium ml-1">{item.rating}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {item.stores} tiendas
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Precio actual</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-primary">
                            S/ {formatPrice(item.currentPrice)}
                          </span>
                          <div className={`flex items-center space-x-1 ${getTrendColor(item.trend)}`}>
                            {getTrendIcon(item.trend)}
                            <span className="text-sm">
                              {getTrendPercentage(item.trend)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-end space-x-2">
                        <Link to={`/product/${item.id}`} className="flex-1">
                          <Button className="w-full">Ver Producto</Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDeleteItem(item)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {deleteItem && (
        <DeleteConfirmDialog
          open={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={() => confirmDeleteItem(deleteItem)}
          title="Eliminar producto"
          description={`¿Estás seguro de que deseas eliminar "${deleteItem.name}" de tu lista de deseos?`}
        />
      )}
    </div>
  );
};

export default WishlistDetail;
