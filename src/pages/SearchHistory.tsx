
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { History, Trash2, Filter, TrendingUp, TrendingDown, Minus, Calendar, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { formatPrice } from "@/utils/priceUtils";

interface HistoryItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  categoryId: string;
  category: string;
  store: string;
  currentPrice: number;
  priceAtVisit: number;
  visitDate: string;
  visitTime: string;
  priceChange: "up" | "down" | "stable";
}

const SearchHistory = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  // Filter states
  const [dateFilter, setDateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [priceRangeMin, setPriceRangeMin] = useState("");
  const [priceRangeMax, setPriceRangeMax] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setIsLoggedIn(!!userData);
    
    if (userData) {
      loadHistoryData();
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [historyItems, dateFilter, categoryFilter, storeFilter, sortBy, priceRangeMin, priceRangeMax]);

  const loadHistoryData = () => {
    // Mock data - in real app this would come from API
    const mockHistory: HistoryItem[] = [
      {
        id: 1,
        productId: 1,
        productName: "MacBook Pro 14 M3",
        productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
        categoryId: "laptop",
        category: "Laptops",
        store: "Amazon",
        currentPrice: 7200.50,
        priceAtVisit: 7596.50,
        visitDate: "2024-01-20",
        visitTime: "14:30",
        priceChange: "down"
      },
      {
        id: 2,
        productId: 2,
        productName: "iPhone 15 Pro",
        productImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200",
        categoryId: "smartphone",
        category: "Smartphones",
        store: "Mercado Libre",
        currentPrice: 3950.75,
        priceAtVisit: 3796.75,
        visitDate: "2024-01-19",
        visitTime: "10:15",
        priceChange: "up"
      },
      {
        id: 3,
        productId: 3,
        productName: "Sony WH-1000XM5",
        productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
        categoryId: "headphones",
        category: "Audífonos",
        store: "Ripley",
        currentPrice: 1140.00,
        priceAtVisit: 1140.00,
        visitDate: "2024-01-18",
        visitTime: "16:45",
        priceChange: "stable"
      }
    ];
    
    setHistoryItems(mockHistory);
  };

  const applyFilters = () => {
    let filtered = [...historyItems];

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date();
      const filterDate = new Date();
      
      if (dateFilter === "today") {
        filterDate.setDate(today.getDate());
      } else if (dateFilter === "week") {
        filterDate.setDate(today.getDate() - 7);
      } else if (dateFilter === "month") {
        filterDate.setMonth(today.getMonth() - 1);
      }
      
      filtered = filtered.filter(item => new Date(item.visitDate) >= filterDate);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.categoryId === categoryFilter);
    }

    // Store filter
    if (storeFilter !== "all") {
      filtered = filtered.filter(item => item.store === storeFilter);
    }

    // Price range filter
    if (priceRangeMin) {
      filtered = filtered.filter(item => item.currentPrice >= parseFloat(priceRangeMin));
    }
    if (priceRangeMax) {
      filtered = filtered.filter(item => item.currentPrice <= parseFloat(priceRangeMax));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.visitDate + " " + b.visitTime).getTime() - new Date(a.visitDate + " " + a.visitTime).getTime();
        case "oldest":
          return new Date(a.visitDate + " " + a.visitTime).getTime() - new Date(b.visitDate + " " + b.visitTime).getTime();
        case "price-low":
          return a.currentPrice - b.currentPrice;
        case "price-high":
          return b.currentPrice - a.currentPrice;
        case "name":
          return a.productName.localeCompare(b.productName);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  };

  const getPriceChangeIcon = (change: "up" | "down" | "stable") => {
    switch (change) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case "stable":
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriceChangeColor = (change: "up" | "down" | "stable") => {
    switch (change) {
      case "up":
        return "text-red-500";
      case "down":
        return "text-green-500";
      case "stable":
        return "text-muted-foreground";
    }
  };

  const handleItemSelection = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length > 0) {
      setShowDeleteDialog(true);
    }
  };

  const confirmDelete = () => {
    setHistoryItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setShowDeleteDialog(false);
    toast({
      title: "Elementos eliminados",
      description: `${selectedItems.length} elementos eliminados del historial.`,
    });
  };

  const clearFilters = () => {
    setDateFilter("all");
    setCategoryFilter("all");
    setStoreFilter("all");
    setSortBy("recent");
    setPriceRangeMin("");
    setPriceRangeMax("");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <History className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Iniciar sesión requerido</h3>
              <p className="text-muted-foreground mb-4">
                Debes iniciar sesión para ver tu historial de búsquedas
              </p>
              <Link to="/login">
                <Button>Iniciar Sesión</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <History className="h-8 w-8 mr-3 text-primary" />
              Mi Historial
            </h1>
            <p className="text-muted-foreground">
              {filteredItems.length} productos consultados
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            
            {selectedItems.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar ({selectedItems.length})
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtros y Ordenamiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <Label>Fecha</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las fechas</SelectItem>
                      <SelectItem value="today">Hoy</SelectItem>
                      <SelectItem value="week">Última semana</SelectItem>
                      <SelectItem value="month">Último mes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Categoría</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      <SelectItem value="laptop">Laptops</SelectItem>
                      <SelectItem value="smartphone">Smartphones</SelectItem>
                      <SelectItem value="headphones">Audífonos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tienda</Label>
                  <Select value={storeFilter} onValueChange={setStoreFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las tiendas</SelectItem>
                      <SelectItem value="Amazon">Amazon</SelectItem>
                      <SelectItem value="Mercado Libre">Mercado Libre</SelectItem>
                      <SelectItem value="Ripley">Ripley</SelectItem>
                      <SelectItem value="Falabella">Falabella</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Ordenar por</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Más reciente</SelectItem>
                      <SelectItem value="oldest">Más antiguo</SelectItem>
                      <SelectItem value="price-low">Precio menor</SelectItem>
                      <SelectItem value="price-high">Precio mayor</SelectItem>
                      <SelectItem value="name">Nombre A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Rango de precio</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRangeMin}
                      onChange={(e) => setPriceRangeMin(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRangeMax}
                      onChange={(e) => setPriceRangeMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Select all checkbox */}
        {filteredItems.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              checked={selectedItems.length === filteredItems.length}
              onCheckedChange={handleSelectAll}
            />
            <Label>Seleccionar todos los elementos visibles</Label>
          </div>
        )}

        {/* History items */}
        {filteredItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tu historial está vacío</h3>
              <p className="text-muted-foreground mb-4">
                Comienza a explorar productos para ver tu historial aquí
              </p>
              <Link to="/products">
                <Button>Explorar productos</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleItemSelection(item.id)}
                    />
                    
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link to={`/product/${item.productId}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                              {item.productName}
                            </h3>
                          </Link>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Badge variant="secondary">{item.category}</Badge>
                            <span>•</span>
                            <span>{item.store}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <div className="text-lg font-bold">S/ {formatPrice(item.currentPrice)}</div>
                              {item.priceAtVisit !== item.currentPrice && (
                                <div className="text-sm text-muted-foreground line-through">
                                  S/ {formatPrice(item.priceAtVisit)}
                                </div>
                              )}
                            </div>
                            <div className={`flex items-center ${getPriceChangeColor(item.priceChange)}`}>
                              {getPriceChangeIcon(item.priceChange)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(item.visitDate).toLocaleDateString()} a las {item.visitTime}</span>
                        </div>
                        
                        <Link to={`/product/${item.productId}`}>
                          <Button size="sm">Ver producto</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Eliminar elementos del historial"
        description={`¿Estás seguro de que deseas eliminar ${selectedItems.length} elementos del historial? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};

export default SearchHistory;
