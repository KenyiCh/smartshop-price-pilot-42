
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, User, Menu, X, ShoppingCart, Bell, LogOut, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isSessionValid, clearSecureStorage } from "@/utils/security";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role?: string;
    sessionToken?: string;
  } | null>(null);
  const location = useLocation();
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

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === "admin" || user?.email === "admin@admin.com";
  
  const navigationItems = [
    { name: "Inicio", path: "/" },
    { name: "Productos", path: "/products" },
    { name: "Categorías", path: "/categories" }
  ];

  return (
    <nav className="bg-background border-b sticky top-0 z-50 py-[2px]">
      <div className="container mx-auto px-4 my-[22px]">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">SmartShop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navigationItems.map(item => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) 
                    ? "text-primary border-b-2 border-primary pb-4" 
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {user ? (
              <>
                <Link to="/wishlist">
                  <Button variant="ghost" size="sm" className="relative">
                    <Heart className="h-5 w-5" />
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      3
                    </Badge>
                  </Button>
                </Link>
                
                <Link to="/notifications">
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      2
                    </Badge>
                  </Button>
                </Link>

                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5 mr-2" />
                    {user.name}
                  </Button>
                </Link>
                
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-5 w-5 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                
                <Button variant="ghost" size="sm" onClick={() => handleLogout()}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button>Iniciar Sesión</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              {navigationItems.map(item => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={`text-sm font-medium ${
                    isActive(item.path) ? "text-primary" : "text-muted-foreground"
                  }`} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user && (
                <>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm">
                        <Heart className="h-5 w-5 mr-2" />
                        Lista de Deseos
                      </Button>
                    </Link>
                    
                    <Link to="/notifications" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm">
                        <Bell className="h-5 w-5 mr-2" />
                        Notificaciones
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm">
                        <User className="h-5 w-5 mr-2" />
                        Perfil
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-5 w-5 mr-2" />
                          Administración
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleLogout()}>
                      <LogOut className="h-5 w-5 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </div>
                </>
              )}
              
              {!user && (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm">Iniciar Sesión</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
