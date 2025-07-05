
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { OnboardingData } from "../OnboardingFlow";
import { formatPrice } from "@/utils/priceUtils";

interface RecommendationsStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

const mockProducts = [
  {
    id: "rec-1",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "smartphone",
    price: 3796.75,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300",
    reason: "Popular en celulares"
  },
  {
    id: "rec-2",
    name: "MacBook Pro 14 M3",
    brand: "Apple",
    category: "laptop",
    price: 7596.50,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300",
    reason: "Trending en laptops"
  },
  {
    id: "rec-3",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "headphones",
    price: 1326.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
    reason: "Mejor valorado"
  },
  {
    id: "rec-4",
    name: "Samsung Galaxy Watch 6",
    brand: "Samsung",
    category: "smartwatch",
    price: 1199.99,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300",
    reason: "Más vendido"
  },
  {
    id: "rec-5",
    name: "LG UltraWide Monitor",
    brand: "LG",
    category: "monitor",
    price: 2299.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300",
    reason: "Recomendado"
  },
  {
    id: "rec-6",
    name: "iPad Air M2",
    brand: "Apple",
    category: "tablet",
    price: 2276.50,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300",
    reason: "Trending"
  }
];

const RecommendationsStep = ({ data, onUpdate }: RecommendationsStepProps) => {
  const [interests, setInterests] = useState<{[key: string]: 'interested' | 'not_interested' | 'neutral'}>(data.interests);

  useEffect(() => {
    onUpdate({ interests });
  }, [interests, onUpdate]);

  const handleInterest = (productId: string, interest: 'interested' | 'not_interested') => {
    setInterests(prev => ({
      ...prev,
      [productId]: interest
    }));
  };

  // Filtrar productos basado en las preferencias del usuario
  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = data.categories.length === 0 || data.categories.includes(product.category);
    const matchesBrand = data.brands.length === 0 || data.brands.includes(product.brand.toLowerCase());
    const matchesPrice = product.price >= data.priceRange.min && product.price <= data.priceRange.max;
    
    return matchesCategory && matchesBrand && matchesPrice;
  });

  const products = filteredProducts.length > 0 ? filteredProducts : mockProducts.slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Recomendaciones iniciales</h3>
        <p className="text-muted-foreground">
          Basadas en tus preferencias, te mostramos estos productos populares. 
          Indícanos cuáles te interesan para mejorar futuras recomendaciones.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 space-y-3 min-w-0">
                  <div>
                    <h4 className="font-medium text-base line-clamp-2 mb-2">{product.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{product.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-semibold text-lg text-primary">S/ {formatPrice(product.price)}</p>
                    <Badge variant="secondary" className="text-xs">
                      {product.reason}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col space-y-2 pt-2">
                    <Button
                      size="sm"
                      variant={interests[product.id] === 'interested' ? 'default' : 'outline'}
                      onClick={() => handleInterest(product.id, 'interested')}
                      className="w-full h-9 text-sm"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Me interesa
                    </Button>
                    <Button
                      size="sm"
                      variant={interests[product.id] === 'not_interested' ? 'destructive' : 'outline'}
                      onClick={() => handleInterest(product.id, 'not_interested')}
                      className="w-full h-9 text-sm"
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      No me interesa
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Productos evaluados: {Object.keys(interests).length} de {products.length}
        </p>
      </div>
    </div>
  );
};

export default RecommendationsStep;
