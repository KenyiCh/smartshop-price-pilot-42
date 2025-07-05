import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/utils/priceUtils";

const allProducts = [
  {
    id: 1,
    name: "MacBook Pro 14 M3",
    category: "laptops",
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
    category: "celulares",
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
    category: "audifonos",
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
    category: "smartwatches",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500",
    minPrice: 1516.00,
    maxPrice: 3036.75,
    rating: 4.5,
    stores: 7,
    trend: "down" as const
  },
  {
    id: 5,
    name: "Dell XPS Desktop",
    category: "pcs-de-marca",
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500",
    minPrice: 4936.25,
    maxPrice: 6076.99,
    rating: 4.4,
    stores: 4,
    trend: "stable" as const
  },
  {
    id: 6,
    name: "Samsung Galaxy S24 Ultra",
    category: "celulares",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    minPrice: 4556.80,
    maxPrice: 5316.45,
    rating: 4.5,
    stores: 6,
    trend: "up" as const
  },
  {
    id: 7,
    name: "LG UltraWide 34WP85C",
    category: "monitores",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
    minPrice: 2276.50,
    maxPrice: 3036.00,
    rating: 4.3,
    stores: 5,
    trend: "down" as const
  },
  {
    id: 8,
    name: "AirPods Pro 2",
    category: "audifonos",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500",
    minPrice: 946.99,
    maxPrice: 1136.75,
    rating: 4.6,
    stores: 8,
    trend: "stable" as const
  }
];

// Función para búsqueda inteligente
const smartSearch = (products: typeof allProducts, query: string) => {
  if (!query.trim()) return products;
  
  const searchTerm = query.toLowerCase();
  
  // Mapeo de términos relacionados
  const searchMappings: { [key: string]: string[] } = {
    'celulares': ['telefono', 'móvil', 'smartphone', 'iphone', 'galaxy', 'android'],
    'laptops': ['notebook', 'portatil', 'computadora portatil', 'macbook', 'laptop'],
    'monitores': ['pantalla', 'display', 'screen', 'monitor'],
    'audifonos': ['audifono', 'headphones', 'auriculares', 'airpods', 'cascos'],
    'smartwatches': ['reloj', 'watch', 'reloj inteligente', 'apple watch'],
    'pcs-de-marca': ['pc', 'computadora', 'desktop', 'torre', 'cpu', 'dell', 'hp']
  };
  
  return products.filter(product => {
    // Búsqueda directa en el nombre
    if (product.name.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Búsqueda por categoría
    if (product.category.includes(searchTerm)) {
      return true;
    }
    
    // Búsqueda inteligente usando mapeos
    for (const [category, keywords] of Object.entries(searchMappings)) {
      if (keywords.some(keyword => searchTerm.includes(keyword))) {
        if (product.category === category) {
          return true;
        }
      }
    }
    
    // Búsqueda por marca
    const brands = ['apple', 'samsung', 'sony', 'dell', 'lg', 'macbook', 'iphone', 'galaxy'];
    for (const brand of brands) {
      if (searchTerm.includes(brand) && product.name.toLowerCase().includes(brand)) {
        return true;
      }
    }
    
    return false;
  });
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setIsLoggedIn(!!userData);
    
    const searchFromParams = searchParams.get('search');
    if (searchFromParams) {
      setSearchQuery(searchFromParams);
    }
  }, [searchParams]);

  // Usar búsqueda inteligente
  const searchFilteredProducts = smartSearch(allProducts, searchQuery);
  
  const filteredProducts = searchFilteredProducts.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange === "under-2000") matchesPrice = product.minPrice < 2000;
    else if (priceRange === "2000-4000") matchesPrice = product.minPrice >= 2000 && product.minPrice <= 4000;
    else if (priceRange === "4000-8000") matchesPrice = product.minPrice >= 4000 && product.minPrice <= 8000;
    else if (priceRange === "over-8000") matchesPrice = product.minPrice > 8000;

    let matchesRating = true;
    if (ratingFilter === "4-plus") matchesRating = product.rating >= 4.0;
    else if (ratingFilter === "4.5-plus") matchesRating = product.rating >= 4.5;

    let matchesBrand = true;
    if (brandFilter !== "all") {
      const brand = product.name.split(" ")[0].toLowerCase();
      matchesBrand = brand === brandFilter.toLowerCase();
    }

    return matchesCategory && matchesPrice && matchesRating && matchesBrand;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.minPrice - b.minPrice;
      case "price-high":
        return b.minPrice - a.minPrice;
      case "rating":
        return b.rating - a.rating;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange("all");
    setRatingFilter("all");
    setBrandFilter("all");
    setStoreFilter("all");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error de búsqueda",
        description: "Por favor ingresa un término de búsqueda",
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Todos los Productos</h1>
          <p className="text-muted-foreground mb-6">
            Encuentra y compara precios de {allProducts.length} productos tecnológicos
          </p>

          {/* Filtros y búsqueda */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="celulares">Celulares</SelectItem>
                <SelectItem value="monitores">Monitores</SelectItem>
                <SelectItem value="smartwatches">Smartwatches</SelectItem>
                <SelectItem value="audifonos">Audífonos</SelectItem>
                <SelectItem value="pcs-de-marca">PCs de Marca</SelectItem>
                <SelectItem value="laptops">Laptops</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Rango de precio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los precios</SelectItem>
                <SelectItem value="under-2000">Menos de S/2,000</SelectItem>
                <SelectItem value="2000-4000">S/2,000 - S/4,000</SelectItem>
                <SelectItem value="4000-8000">S/4,000 - S/8,000</SelectItem>
                <SelectItem value="over-8000">Más de S/8,000</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre A-Z</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="rating">Mejor Calificación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtros adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Calidad/Reseñas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las calificaciones</SelectItem>
                <SelectItem value="4-plus">4+ estrellas</SelectItem>
                <SelectItem value="4.5-plus">4.5+ estrellas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="samsung">Samsung</SelectItem>
                <SelectItem value="sony">Sony</SelectItem>
                <SelectItem value="dell">Dell</SelectItem>
                <SelectItem value="lg">LG</SelectItem>
              </SelectContent>
            </Select>

            <Select value={storeFilter} onValueChange={setStoreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tienda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las tiendas</SelectItem>
                <SelectItem value="ripley">Ripley</SelectItem>
                <SelectItem value="saga">Saga Falabella</SelectItem>
                <SelectItem value="plaza-vea">Plaza Vea</SelectItem>
                <SelectItem value="wong">Wong</SelectItem>
                <SelectItem value="hiraoka">Hiraoka</SelectItem>
                <SelectItem value="curacao">Curacao</SelectItem>
                <SelectItem value="promart">Promart</SelectItem>
                <SelectItem value="metro">Metro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resultados y filtros activos */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </span>
            {(searchQuery || selectedCategory !== "all" || priceRange !== "all" || ratingFilter !== "all" || brandFilter !== "all" || storeFilter !== "all") && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Limpiar todos los filtros
              </Button>
            )}
          </div>
        </div>

        {/* Grid de productos */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <SlidersHorizontal className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground mb-4">
                No encontramos productos que coincidan con tus filtros. Intenta con otros términos de búsqueda o ajusta los filtros.
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Products;
