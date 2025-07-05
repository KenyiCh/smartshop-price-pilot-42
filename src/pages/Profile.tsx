import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Heart, Bell, History, Settings, Shield, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { isSessionValid, clearSecureStorage } from "@/utils/security";

const Profile = () => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role?: string;
    sessionToken?: string;
  } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = () => {
    const userData = localStorage.getItem("user");
    const sessionExpiry = localStorage.getItem("sessionExpiry");
    
    if (userData && sessionExpiry) {
      const expiryTime = parseInt(sessionExpiry);
      
      if (Date.now() > expiryTime) {
        // Session expired
        handleLogout(true);
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        handleLogout(true);
      }
    } else {
      // No session data found
      setUser(null);
    }
  };

  const handleLogout = (isSessionExpired = false) => {
    // Secure logout - clear all session data
    clearSecureStorage();
    
    setUser(null);
    
    if (isSessionExpired) {
      toast({
        title: "Sesión expirada",
        description: "Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    }
    
    navigate("/");
  };

  const handleLogoutClick = () => {
    handleLogout(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              No has iniciado sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center mb-4">
              Por favor, inicia sesión para ver tu perfil.
            </p>
            <Link to="/login">
              <Button className="w-full">Iniciar Sesión</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAdmin = user?.role === "admin" || user?.email === "admin@admin.com";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge variant={isAdmin ? "default" : "secondary"} className="mt-2">
                  {isAdmin ? "Administrador" : "Usuario"}
                </Badge>
              </div>
            </div>
            
            <Button variant="outline" onClick={handleLogoutClick}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Link to="/wishlist" className="block">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Mis Listas</h3>
                  <p className="text-sm text-muted-foreground">2 listas de deseos</p>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Link to="/notifications" className="block">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Notificaciones</h3>
                  <p className="text-sm text-muted-foreground">2 nuevas</p>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Link to="/search-history" className="block">
                  <History className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Mi Historial</h3>
                  <p className="text-sm text-muted-foreground">Ver búsquedas anteriores</p>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Link to="/review-history" className="block">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Reseñas</h3>
                  <p className="text-sm text-muted-foreground">Mis reseñas escritas</p>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configuración de Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button>Guardar cambios</Button>
                <Button variant="outline">Cambiar contraseña</Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Panel Access */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Administración
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Accede al panel de administración para gestionar tiendas, productos y usuarios.
                </p>
                <Link to="/admin">
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Ir al Panel de Admin
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
