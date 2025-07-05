
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData } from "../OnboardingFlow";

interface BrandsStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

const brands = [
  { 
    id: "apple", 
    name: "Apple", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Apple-logo.png/240px-Apple-logo.png"
  },
  { 
    id: "samsung", 
    name: "Samsung", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/240px-Samsung_Logo.svg.png"
  },
  { 
    id: "sony", 
    name: "Sony", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/240px-Sony_logo.svg.png"
  },
  { 
    id: "lg", 
    name: "LG", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/LG_logo_%282015%29.svg/240px-LG_logo_%282015%29.svg.png"
  },
  { 
    id: "xiaomi", 
    name: "Xiaomi", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Xiaomi_logo.svg/240px-Xiaomi_logo.svg.png"
  },
  { 
    id: "huawei", 
    name: "Huawei", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Huawei_Standard_logo.svg/240px-Huawei_Standard_logo.svg.png"
  },
  { 
    id: "dell", 
    name: "Dell", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/240px-Dell_Logo.svg.png"
  },
  { 
    id: "hp", 
    name: "HP", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/240px-HP_logo_2012.svg.png"
  },
  { 
    id: "lenovo", 
    name: "Lenovo", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/240px-Lenovo_logo_2015.svg.png"
  },
  { 
    id: "asus", 
    name: "ASUS", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/240px-ASUS_Logo.svg.png"
  },
  { 
    id: "logitech", 
    name: "Logitech", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Logitech_logo_2015.svg/240px-Logitech_logo_2015.svg.png"
  },
  { 
    id: "razer", 
    name: "Razer", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Razer_Logo.svg/240px-Razer_Logo.svg.png"
  }
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
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
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
