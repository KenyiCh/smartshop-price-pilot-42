
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Smartphone, Laptop, Monitor, Headphones, Watch, Gamepad2 } from "lucide-react";
import { OnboardingData } from "../OnboardingFlow";

interface CategoriesStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

const categories = [
  { id: "smartphone", name: "Celulares", icon: Smartphone },
  { id: "laptop", name: "Laptops", icon: Laptop },
  { id: "monitor", name: "Monitores", icon: Monitor },
  { id: "headphones", name: "Audífonos", icon: Headphones },
  { id: "smartwatch", name: "Smartwatches", icon: Watch },
  { id: "accessories", name: "Accesorios", icon: Gamepad2 }
];

const CategoriesStep = ({ data, onUpdate }: CategoriesStepProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(data.categories);

  useEffect(() => {
    onUpdate({ categories: selectedCategories });
  }, [selectedCategories, onUpdate]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Selecciona las categorías de productos que más te interesan
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCategories.includes(category.id)
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
            onClick={() => toggleCategory(category.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <category.icon className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium">{category.name}</span>
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => {}}
                  className="pointer-events-none"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Seleccionadas: {selectedCategories.length} categorías
      </p>
    </div>
  );
};

export default CategoriesStep;
