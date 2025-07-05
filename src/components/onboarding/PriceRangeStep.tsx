
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingData } from "../OnboardingFlow";
import { formatPrice } from "@/utils/priceUtils";

interface PriceRangeStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

const priceRanges = [
  { label: "Económico", min: 0, max: 1000, color: "bg-green-100 border-green-200" },
  { label: "Medio", min: 1000, max: 3000, color: "bg-blue-100 border-blue-200" },
  { label: "Premium", min: 3000, max: 8000, color: "bg-purple-100 border-purple-200" },
  { label: "Lujo", min: 8000, max: 15000, color: "bg-gold-100 border-gold-200" }
];

const PriceRangeStep = ({ data, onUpdate }: PriceRangeStepProps) => {
  const [minPrice, setMinPrice] = useState(data.priceRange.min);
  const [maxPrice, setMaxPrice] = useState(data.priceRange.max);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  useEffect(() => {
    onUpdate({ 
      priceRange: { min: minPrice, max: maxPrice }
    });
  }, [minPrice, maxPrice, onUpdate]);

  const handleRangeSelect = (range: typeof priceRanges[0]) => {
    setMinPrice(range.min);
    setMaxPrice(range.max);
    setSelectedRange(range.label);
  };

  const handleSliderChange = (values: number[]) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
    setSelectedRange(null);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Selecciona tu rango de precios preferido para recibir mejores recomendaciones
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {priceRanges.map((range) => (
          <Card
            key={range.label}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRange === range.label
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
            onClick={() => handleRangeSelect(range)}
          >
            <CardContent className="p-3 text-center">
              <div className="space-y-1">
                <h4 className="font-medium text-sm">{range.label}</h4>
                <p className="text-xs text-muted-foreground">
                  S/ {formatPrice(range.min)} - S/ {formatPrice(range.max)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Rango personalizado</Label>
        
        <div className="px-3">
          <Slider
            value={[minPrice, maxPrice]}
            onValueChange={handleSliderChange}
            max={15000}
            min={0}
            step={100}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minPrice">Precio mínimo</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                S/
              </span>
              <Input
                id="minPrice"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="pl-8"
                min={0}
                max={maxPrice}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxPrice">Precio máximo</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                S/
              </span>
              <Input
                id="maxPrice"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="pl-8"
                min={minPrice}
                max={15000}
              />
            </div>
          </div>
        </div>

        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">
            Rango seleccionado: <span className="font-medium">
              S/ {formatPrice(minPrice)} - S/ {formatPrice(maxPrice)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeStep;
