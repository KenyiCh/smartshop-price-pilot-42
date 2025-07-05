
import OnboardingFlow from "@/components/OnboardingFlow";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOnboardingComplete = () => {
    localStorage.setItem("onboardingCompleted", "true");
    toast({
      title: "¡Perfecto!",
      description: "Tu experiencia ha sido personalizada exitosamente",
    });
    navigate("/");
  };

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default Onboarding;
