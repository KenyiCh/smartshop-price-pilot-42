
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Laptop, Smartphone, Headphones, Watch, Monitor } from "lucide-react";

const categories = [
  { 
    name: "Celulares", 
    icon: Smartphone, 
    count: 189, 
    description: "Smartphones de marcas reconocidas",
    trending: true
  },
  { 
    name: "Monitores", 
    icon: Monitor, 
    count: 134, 
    description: "Pantallas para gaming, trabajo y diseño",
    trending: false
  },
  { 
    name: "Smartwatches", 
    icon: Watch, 
    count: 78, 
    description: "Relojes inteligentes y fitness trackers",
    trending: true
  },
  { 
    name: "Audífonos", 
    icon: Headphones, 
    count: 156, 
    description: "Auriculares con y sin cable, gaming",
    trending: false
  },
  { 
    name: "PCs de Marca", 
    icon: Monitor, 
    count: 87, 
    description: "Computadoras de escritorio ya armadas",
    trending: true
  },
  { 
    name: "Laptops", 
    icon: Laptop, 
    count: 245, 
    description: "Computadoras portátiles de todas las marcas",
    trending: true
  }
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Categorías de Productos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explora nuestra selección de productos tecnológicos de comunicación de alta demanda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              to={`/category/${category.name.toLowerCase()}`}
              className="group"
            >
              <Card className="hover:shadow-lg transition-all duration-300 group-hover:scale-105 h-full">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <category.icon className="h-16 w-16 mx-auto text-primary group-hover:text-primary/80 transition-colors" />
                    {category.trending && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-2 -right-2 text-xs px-2 py-1"
                      >
                        Trending
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {category.count} productos
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Sección de categorías más populares */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Categorías Más Populares</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Smartphone className="h-12 w-12 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">Celulares Flagship</h3>
                    <p className="text-blue-700">Los smartphones más avanzados</p>
                    <Badge variant="secondary" className="mt-2">67 productos</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Laptop className="h-12 w-12 text-green-600" />
                  <div>
                    <h3 className="text-xl font-bold text-green-900">Laptops Gaming</h3>
                    <p className="text-green-700">Las mejores laptops para gamers</p>
                    <Badge variant="secondary" className="mt-2">43 productos</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
