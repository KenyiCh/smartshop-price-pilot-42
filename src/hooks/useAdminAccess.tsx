
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { isSessionValid } from "@/utils/security";

export const useAdminAccess = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    validateAdminAccess();
  }, [navigate, toast]);

  const validateAdminAccess = () => {
    try {
      if (!isSessionValid()) {
        toast({
          title: "Sesión expirada",
          description: "Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const userData = localStorage.getItem("user");
      if (!userData) {
        toast({
          title: "Acceso no autorizado",
          description: "Debes iniciar sesión para acceder a esta sección",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const user = JSON.parse(userData);
      
      const isValidAdmin = (
        user.role === "admin" && 
        user.email === "admin@admin.com" &&
        user.sessionToken
      );
      
      if (!isValidAdmin) {
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos para acceder al panel de administración",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      
      setIsAdmin(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error validating admin access:", error);
      toast({
        title: "Error de validación",
        description: "Ocurrió un error al validar tus permisos",
        variant: "destructive",
      });
      navigate("/login");
    }
  };

  return { isAdmin, isLoading };
};
