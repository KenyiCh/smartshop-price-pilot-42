import { useState } from "react";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Zap } from "lucide-react";
import { formatPrice } from "@/utils/priceUtils";

const dealProducts = [
  {
    id: 1,
    name: "MacBook Pro 14 M3",
    category: "laptop",
    image: "/placeholder.svg",
    minPrice: 6800,
    maxPrice: 9495,
    rating: 4.8,
    stores: 5,
    trend: "down" as const,
    discount: 20,
    originalPrice: 8500
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    category: "smartphone",
    image: "/placeholder.svg",
    minPrice: 3200,
    maxPrice: 4556,
    rating: 4.6,
    stores: 8,
    trend: "down" as const,
    discount: 15,
    originalPrice: 3796
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    category: "headphones",
    image: "/placeholder.svg",
    minPrice: 1100,
    maxPrice: 1516,
    rating: 4.7,
    stores: 6,
    trend: "down" as const,
    discount: 17,
    originalPrice: 1326
  }
];

const Deals = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("user");
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Ofertas Especiales</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Los mejores descuentos encontrados en las tiendas afiliadas. ¡Aprovecha estas ofertas exclusivas!
          </p>
        </div>

        {/* Estadísticas de ofertas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingDown className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold">25%</h3>
                  <p className="text-muted-foreground">Descuento promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingDown className="h-8 w-8 text-orange-500" />
                <div>
                  <h3 className="text-2xl font-bold">S/ 1,200</h3>
                  <p className="text-muted-foreground">Ahorro promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Zap className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="text-2xl font-bold">{dealProducts.length}</h3>
                  <p className="text-muted-foreground">Ofertas activas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de ofertas */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Ofertas Destacadas</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {dealProducts.map((product) => (
              <Card key={product.id} className="relative overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-red-500 text-white">
                    -{product.discount}%
                  </Badge>
                </div>
                
                <CardContent className="p-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            S/ {formatPrice(product.minPrice)}
                          </div>
                          <div className="text-sm text-muted-foreground line-through">
                            S/ {formatPrice(product.originalPrice)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-600 font-medium">
                            Ahorras S/ {formatPrice(product.originalPrice - product.minPrice)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="secondary">
                        {product.stores} tiendas
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <TrendingDown className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">
                          Mejor precio
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Información adicional */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              ¿Cómo funcionan nuestras ofertas?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Mejores descuentos</h4>
                <p>Comparamos precios en tiempo real para encontrar los mejores descuentos disponibles en nuestras tiendas afiliadas.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Precios en tiempo real</h4>
                <p>Los precios se actualizan constantemente para mostrarte las mejores ofertas disponibles en el mercado.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Deals;
