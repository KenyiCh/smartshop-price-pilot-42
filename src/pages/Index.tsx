import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, Heart, TrendingUp, Laptop, Smartphone, Headphones, Watch, Monitor, Mic } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import RecommendationsSection from "@/components/RecommendationsSection";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const featuredProducts = [
  {
    id: 1,
    name: "MacBook Pro 14 M3",
    category: "laptop",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    minPrice: 7596.50,
    maxPrice: 9495.99,
    rating: 4.8,
    stores: 5,
    trend: "down" as const
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    category: "smartphone",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
    minPrice: 3796.75,
    maxPrice: 4556.25,
    rating: 4.6,
    stores: 8,
    trend: "up" as const
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    category: "headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    minPrice: 1326.99,
    maxPrice: 1516.50,
    rating: 4.7,
    stores: 6,
    trend: "stable" as const
  },
  {
    id: 4,
    name: "Apple Watch Series 9",
    category: "smartwatch",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500",
    minPrice: 1516.00,
    maxPrice: 3036.75,
    rating: 4.5,
    stores: 7,
    trend: "down" as const
  }
];

const categories = [
  { name: "Celulares", icon: Smartphone, count: 189 },
  { name: "Monitores", icon: Monitor, count: 134 },
  { name: "Smartwatches", icon: Watch, count: 78 },
  { name: "Audífonos", icon: Headphones, count: 156 },
  { name: "PCs de Marca", icon: Monitor, count: 87 },
  { name: "Laptops", icon: Laptop, count: 245 }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserSession = () => {
      const userData = localStorage.getItem("user");
      const onboardingCompleted = localStorage.getItem("onboardingCompleted");
      const isUserLoggedIn = !!userData;
      
      setIsLoggedIn(isUserLoggedIn);
      
      // Check if user is logged in but hasn't completed onboarding
      if (isUserLoggedIn && !onboardingCompleted) {
        setShouldShowOnboarding(true);
      }
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

  // Redirect to onboarding if needed
  useEffect(() => {
    if (shouldShowOnboarding) {
      navigate('/onboarding');
    }
  }, [shouldShowOnboarding, navigate]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error de búsqueda",
        description: "Por favor ingresa un término de búsqueda",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to products page with search query
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleVoiceSearch = () => {
    toast({
      title: "Búsqueda por voz",
      description: "Función de búsqueda por voz próximamente disponible",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            SmartShop
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Compara precios de productos tecnológicos de comunicación en tiempo real. 
            Encuentra las mejores ofertas de celulares, laptops, monitores y más.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Buscar productos tecnológicos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-24 h-12 text-lg"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleVoiceSearch}
                className="p-2"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleSearch}
                size="sm"
              >
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link key={category.name} to={`/category/${category.name.toLowerCase()}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center">
                  <CardContent className="p-6">
                    <category.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} productos</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Productos Destacados</h2>
            <Link to="/products">
              <Button variant="outline">Ver todos</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations Section - Only for logged in users */}
      <RecommendationsSection isLoggedIn={isLoggedIn} />

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué SmartShop?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Historial de Precios</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Rastrea el historial de precios y recibe alertas cuando baje el precio de tus productos favoritos.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Heart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Lista de Deseos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Guarda productos en tu lista de deseos y recibe notificaciones de ofertas especiales.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Star className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Recibe recomendaciones personalizadas basadas en tus gustos y búsquedas anteriores.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
