import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OnboardingFlow from "@/components/OnboardingFlow";
import { 
  sanitizeInput, 
  validateEmail, 
  validatePassword, 
  generateSecureToken,
  isAdminUser,
  createAdminSession,
  loginRateLimiter
} from "@/utils/security";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!sanitizedEmail || !sanitizedPassword) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (loginRateLimiter.isRateLimited(sanitizedEmail)) {
      const remainingTime = Math.ceil(loginRateLimiter.getRemainingTime(sanitizedEmail) / 1000 / 60);
      toast({
        title: "Demasiados intentos",
        description: `Espera ${remainingTime} minutos antes de intentar nuevamente`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (isAdminUser(sanitizedEmail, sanitizedPassword)) {
      const adminUser = createAdminSession();
      
      toast({
        title: "¡Bienvenido Administrador!",
        description: "Has iniciado sesión como administrador",
      });
      navigate("/admin");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!validatePassword(sanitizedPassword)) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const user = {
      id: generateUserId(),
      name: name || sanitizedEmail.split("@")[0],
      email: sanitizedEmail,
      role: "user",
      sessionToken: generateSecureToken()
    };
    
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("sessionExpiry", (Date.now() + 24 * 60 * 60 * 1000).toString());
    
    toast({
      title: "¡Bienvenido!",
      description: "Has iniciado sesión exitosamente",
    });
    
    navigate("/");
    setIsLoading(false);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedAddress = sanitizeInput(address);

    if (!sanitizedName || !sanitizedEmail || !sanitizedPassword || !sanitizedPhone) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!validatePassword(sanitizedPassword)) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (sanitizedPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const user = {
      id: generateUserId(),
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      address: sanitizedAddress,
      role: "user",
      sessionToken: generateSecureToken()
    };
    
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("sessionExpiry", (Date.now() + 24 * 60 * 60 * 1000).toString());
    
    // Marcar como nuevo usuario para mostrar onboarding
    sessionStorage.setItem("isNewUser", "true");
    
    toast({
      title: "¡Registro exitoso!",
      description: "Tu cuenta ha sido creada. Personaliza tu experiencia.",
    });
    
    // Navegar directamente al onboarding después del registro
    navigate("/onboarding");
    
    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft' | 'apple') => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const socialUser = {
        id: generateUserId(),
        name: provider === 'google' ? 'Usuario Google' : 
              provider === 'microsoft' ? 'Usuario Microsoft' : 'Usuario Apple',
        email: `usuario@${provider}.com`,
        role: "user",
        sessionToken: generateSecureToken(),
        provider: provider
      };
      
      localStorage.setItem("user", JSON.stringify(socialUser));
      localStorage.setItem("sessionExpiry", (Date.now() + 24 * 60 * 60 * 1000).toString());
      
      toast({
        title: "¡Bienvenido!",
        description: `Has iniciado sesión con ${provider === 'google' ? 'Google' : 
                     provider === 'microsoft' ? 'Microsoft' : 'Apple'}`,
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar el inicio de sesión social",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const generateUserId = () => {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackToHome}
        className="absolute top-4 left-4 flex items-center space-x-1"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver</span>
      </Button>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">SmartShop</span>
            </div>
          </div>
          <CardTitle>{isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}</CardTitle>
          <CardDescription>
            {isRegistering 
              ? "Crea tu cuenta para acceder a todas las funciones"
              : "Ingresa a tu cuenta para continuar"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRegistering && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Número de teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+51 999 999 999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={20}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Dirección (opcional)</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Tu dirección"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  maxLength={200}
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={128}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {isRegistering && (
            <>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmación de contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    maxLength={128}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  Acepto los términos y condiciones
                </Label>
              </div>
            </>
          )}
          
          <Button 
            className="w-full" 
            onClick={isRegistering ? handleRegister : handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : (isRegistering ? "Crear Cuenta" : "Iniciar Sesión")}
          </Button>
          
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => setIsRegistering(!isRegistering)}
              disabled={isLoading}
            >
              {isRegistering 
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"
              }
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-md mt-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O continúa con
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('microsoft')}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" fill="#00A4EF" viewBox="0 0 24 24">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
            </svg>
            Continuar con Microsoft
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('apple')}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" fill="#000000" viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
            </svg>
            Continuar con Apple
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
