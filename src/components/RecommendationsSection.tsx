
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/utils/priceUtils";
import AddToWishlistDialog from "./AddToWishlistDialog";

interface RecommendedProduct {
  id: number;
  name: string;
  image: string;
  currentPrice: number;
  originalPrice?: number;
  rating: number;
  category: string;
  reason: string;
}

interface RecommendationsSectionProps {
  isLoggedIn: boolean;
}

const RecommendationsSection = ({ isLoggedIn }: RecommendationsSectionProps) => {
  const [showWishlistDialog, setShowWishlistDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<RecommendedProduct | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(isLoggedIn);
  const { toast } = useToast();

  // Actualizar el estado interno cuando cambie la prop
  useEffect(() => {
    setUserLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  // Verificar el estado de sesión en tiempo real
  useEffect(() => {
    const checkUserSession = () => {
      const userData = localStorage.getItem("user");
      setUserLoggedIn(!!userData);
    };

    // Verificar inmediatamente
    checkUserSession();

    // Configurar un listener para cambios en localStorage
    const handleStorageChange = () => {
      checkUserSession();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También verificar periódicamente por si el localStorage cambia en la misma pestaña
    const interval = setInterval(checkUserSession, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Mock wishlists data
  const mockWishlists = [
    { id: 1, name: "Tecnología", itemCount: 2 },
    { id: 2, name: "Hogar", itemCount: 1 },
  ];

  const recommendedProducts: RecommendedProduct[] = [
    {
      id: 9,
      name: "iPad Air M2",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
      currentPrice: 2276.50,
      originalPrice: 2846.25,
      rating: 4.7,
      category: "tablet",
      reason: "Basado en tu interés en productos Apple"
    },
    {
      id: 10,
      name: "Samsung Galaxy Buds Pro",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
      currentPrice: 569.99,
      originalPrice: 759.25,
      rating: 4.4,
      category: "audifonos",
      reason: "Perfectos para acompañar tu smartphone"
    },
    {
      id: 11,
      name: "Logitech MX Master 3S",
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
      currentPrice: 379.50,
      originalPrice: 456.75,
      rating: 4.6,
      category: "accesorios",
      reason: "Ideal para trabajar con tu MacBook"
    }
  ];

  const handleWishlistClick = (product: RecommendedProduct) => {
    if (!userLoggedIn) {
      toast({
        title: "Iniciar sesión requerido",
        description: "Debes iniciar sesión para agregar productos a tu lista de deseos",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedProduct(product);
    setShowWishlistDialog(true);
  };

  const handleAddToWishlist = (wishlistId: number, product: any) => {
    console.log("Adding product to wishlist:", wishlistId, product);
  };

  const handleCreateWishlistAndAdd = (name: string, product: any) => {
    console.log("Creating new wishlist and adding product:", name, product);
  };

  // No mostrar si el usuario no está logueado
  if (!userLoggedIn) {
    return null;
  }

  return (
    <>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recomendaciones para ti</h2>
              <p className="text-muted-foreground">
                Productos seleccionados especialmente según tus intereses
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      onClick={() => handleWishlistClick(product)}
                    >
                      <Heart className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-primary">
                        S/ {formatPrice(product.currentPrice)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          S/ {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground italic">
                      {product.reason}
                    </p>
                  </div>
                </CardContent>

                <div className="p-4 pt-0">
                  <Link to={`/product/${product.id}`} className="w-full">
                    <Button className="w-full">Ver Producto</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {selectedProduct && (
        <AddToWishlistDialog
          open={showWishlistDialog}
          onClose={() => {
            setShowWishlistDialog(false);
            setSelectedProduct(null);
          }}
          product={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            image: selectedProduct.image,
            currentPrice: selectedProduct.currentPrice,
          }}
          wishlists={mockWishlists}
          onAddToWishlist={handleAddToWishlist}
          onCreateWishlistAndAdd={handleCreateWishlistAndAdd}
        />
      )}
    </>
  );
};

export default RecommendationsSection;
