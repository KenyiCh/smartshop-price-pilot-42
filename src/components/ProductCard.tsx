
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { isSessionValid } from "@/utils/security";
import { formatPrice } from "@/utils/priceUtils";
import AddToWishlistDialog from "./AddToWishlistDialog";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  stores: number;
  trend: "up" | "down" | "stable";
}

interface ProductCardProps {
  product: Product;
  isLoggedIn?: boolean;
}

interface WishlistProduct {
  id: number;
  name: string;
  image: string;
  currentPrice: number;
}

const ProductCard = ({ product, isLoggedIn = false }: ProductCardProps) => {
  const [showWishlistDialog, setShowWishlistDialog] = useState(false);
  const { toast } = useToast();

  // Mock wishlists data - in real app this would come from a hook
  const mockWishlists = [
    { id: 1, name: "Tecnología", itemCount: 2 },
    { id: 2, name: "Hogar", itemCount: 1 },
  ];

  const getTrendIcon = () => {
    switch (product.trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (product.trend) {
      case "up":
        return "text-red-500";
      case "down":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const handleWishlistClick = () => {
    if (!isLoggedIn || !isSessionValid()) {
      toast({
        title: "Iniciar sesión requerido",
        description: "Debes iniciar sesión para agregar productos a tu lista de deseos",
        variant: "destructive",
      });
      return;
    }
    
    setShowWishlistDialog(true);
  };

  const handleAddToWishlist = (wishlistId: number, product: WishlistProduct) => {
    console.log("Adding product to wishlist:", wishlistId, product);
    // Here you would call the actual API to add the product
  };

  const handleCreateWishlistAndAdd = (name: string, product: WishlistProduct) => {
    console.log("Creating new wishlist and adding product:", name, product);
    // Here you would call the actual API to create wishlist and add product
  };

  // Convert product to the format expected by AddToWishlistDialog
  const wishlistProduct: WishlistProduct = {
    id: product.id,
    name: product.name,
    image: product.image,
    currentPrice: product.minPrice,
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200">
        <CardContent className="p-4">
          <div className="relative mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover rounded-md"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-background/80 hover:bg-background"
              onClick={handleWishlistClick}
            >
              <Heart className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          <div className="space-y-2">
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
              <Badge variant="secondary" className="text-xs">
                {product.stores} tiendas
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">
                  S/ {formatPrice(product.minPrice)}
                </div>
                {product.minPrice !== product.maxPrice && (
                  <div className="text-sm text-muted-foreground line-through">
                    S/ {formatPrice(product.maxPrice)}
                  </div>
                )}
              </div>
              <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-sm font-medium">
                  {product.trend === "up" && "+5%"}
                  {product.trend === "down" && "-8%"}
                  {product.trend === "stable" && "0%"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Link to={`/product/${product.id}`} className="w-full">
            <Button className="w-full">Ver Ofertas</Button>
          </Link>
        </CardFooter>
      </Card>

      <AddToWishlistDialog
        open={showWishlistDialog}
        onClose={() => setShowWishlistDialog(false)}
        product={wishlistProduct}
        wishlists={mockWishlists}
        onAddToWishlist={handleAddToWishlist}
        onCreateWishlistAndAdd={handleCreateWishlistAndAdd}
      />
    </>
  );
};

export default ProductCard;
