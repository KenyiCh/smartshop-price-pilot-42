
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData } from "../OnboardingFlow";

interface BrandsStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

const brands = [
  { id: "apple", name: "Apple", logo: "🍎" },
  { id: "samsung", name: "Samsung", logo: "📱" },
  { id: "sony", name: "Sony", logo: "🎧" },
  { id: "lg", name: "LG", logo: "📺" },
  { id: "xiaomi", name: "Xiaomi", logo: "📱" },
  { id: "huawei", name: "Huawei", logo: "📱" },
  { id: "dell", name: "Dell", logo: "💻" },
  { id: "hp", name: "HP", logo: "💻" },
  { id: "lenovo", name: "Lenovo", logo: "💻" },
  { id: "asus", name: "ASUS", logo: "💻" },
  { id: "logitech", name: "Logitech", logo: "🖱️" },
  { id: "razer", name: "Razer", logo: "🎮" }
];

const BrandsStep = ({ data, onUpdate }: BrandsStepProps) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(data.brands);

  useEffect(() => {
    onUpdate({ brands: selectedBrands });
  }, [selectedBrands, onUpdate]);

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Selecciona las marcas que prefieres para recibir recomendaciones más precisas
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {brands.map((brand) => (
          <Card
            key={brand.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedBrands.includes(brand.id)
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
            onClick={() => toggleBrand(brand.id)}
          >
            <CardContent className="p-3 text-center">
              <div className="flex flex-col items-center space-y-2">
                <span className="text-2xl">{brand.logo}</span>
                <span className="text-sm font-medium">{brand.name}</span>
                <Checkbox
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => {}}
                  className="pointer-events-none"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Seleccionadas: {selectedBrands.length} marcas
      </p>
    </div>
  );
};

export default BrandsStep;
