
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart } from "lucide-react";
import CategoriesStep from "./onboarding/CategoriesStep";
import PriceRangeStep from "./onboarding/PriceRangeStep";
import BrandsStep from "./onboarding/BrandsStep";
import RecommendationsStep from "./onboarding/RecommendationsStep";
import { useToast } from "@/hooks/use-toast";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export interface OnboardingData {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  brands: string[];
  interests: {
    [key: string]: 'interested' | 'not_interested' | 'neutral';
  };
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    categories: [],
    priceRange: { min: 0, max: 5000 },
    brands: [],
    interests: {}
  });
  const { toast } = useToast();

  const steps = [
    {
      title: "Categorías de Interés",
      component: CategoriesStep
    },
    {
      title: "Rango de Precios",
      component: PriceRangeStep
    },
    {
      title: "Marcas Preferidas",
      component: BrandsStep
    },
    {
      title: "Recomendaciones",
      component: RecommendationsStep
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Guardar preferencias del usuario
    localStorage.setItem("userPreferences", JSON.stringify(data));
    localStorage.setItem("onboardingCompleted", "true");
    
    toast({
      title: "¡Perfecto!",
      description: "Tus preferencias han sido guardadas exitosamente",
    });
    
    onComplete();
  };

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">SmartShop</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">¡Personaliza tu experiencia!</h1>
          <p className="text-muted-foreground mb-4">
            {steps[currentStep].title} - Paso {currentStep + 1} de {steps.length}
          </p>
          <Progress value={progress} className="w-full" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              data={data}
              onUpdate={updateData}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleSkip}
          >
            Saltar
          </Button>
          <Button
            onClick={handleNext}
          >
            {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
