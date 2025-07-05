
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bell, BellOff, Mail, Smartphone, Monitor, Clock, AlertTriangle, Tag, Store, Percent, RotateCcw, Save } from "lucide-react";

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: {
    mobile: boolean;
    web: boolean;
  };
  frequency: "immediate" | "daily" | "weekly";
  alertTypes: {
    priceDrops: boolean;
    newProducts: boolean;
    specialOffers: boolean;
  };
  selectedWishlists: number[];
  selectedStores: number[];
  minDiscountPercentage: number;
}

const defaultSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: {
    mobile: true,
    web: true,
  },
  frequency: "immediate",
  alertTypes: {
    priceDrops: true,
    newProducts: true,
    specialOffers: true,
  },
  selectedWishlists: [1, 2],
  selectedStores: [1, 2, 3, 4, 5],
  minDiscountPercentage: 10,
};

const wishlists = [
  { id: 1, name: "Tecnología" },
  { id: 2, name: "Hogar" },
];

const stores = [
  { id: 1, name: "Ripley" },
  { id: 2, name: "Saga Falabella" },
  { id: 3, name: "Plaza Vea" },
  { id: 4, name: "Oechsle" },
  { id: 5, name: "Mercado Libre" },
];

const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [allNotificationsEnabled, setAllNotificationsEnabled] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveSettings = () => {
    console.log("Guardando configuraciones:", settings);
    toast({
      title: "Preferencias guardadas exitosamente",
      description: "Tus configuraciones de notificación han sido actualizadas.",
    });
  };

  const handleRestoreDefaults = () => {
    setSettings(defaultSettings);
    setAllNotificationsEnabled(true);
    toast({
      title: "Configuración restaurada",
      description: "Se han restaurado las configuraciones por defecto.",
    });
  };

  const handleToggleAllNotifications = () => {
    if (allNotificationsEnabled) {
      const disabledSettings: NotificationSettings = {
        ...settings,
        emailNotifications: false,
        pushNotifications: {
          mobile: false,
          web: false,
        },
        alertTypes: {
          priceDrops: false,
          newProducts: false,
          specialOffers: false,
        },
      };
      setSettings(disabledSettings);
      setAllNotificationsEnabled(false);
      toast({
        title: "Notificaciones desactivadas",
        description: "Todas las notificaciones han sido desactivadas.",
      });
    } else {
      setSettings(defaultSettings);
      setAllNotificationsEnabled(true);
      toast({
        title: "Notificaciones activadas",
        description: "Las notificaciones han sido activadas con la configuración por defecto.",
      });
    }
  };

  const handleWishlistChange = (wishlistId: number, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      selectedWishlists: checked
        ? [...prev.selectedWishlists, wishlistId]
        : prev.selectedWishlists.filter(id => id !== wishlistId)
    }));
  };

  const handleStoreChange = (storeId: number, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      selectedStores: checked
        ? [...prev.selectedStores, storeId]
        : prev.selectedStores.filter(id => id !== storeId)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/notifications")}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Configurar Notificaciones
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Personaliza cómo y cuándo quieres recibir notificaciones sobre ofertas, productos y más
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Toggle general de notificaciones */}
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center text-xl">
                {allNotificationsEnabled ? (
                  <Bell className="h-6 w-6 mr-3 text-primary" />
                ) : (
                  <BellOff className="h-6 w-6 mr-3 text-muted-foreground" />
                )}
                Control General de Notificaciones
              </CardTitle>
              <CardDescription className="text-base">
                Activa o desactiva todas las notificaciones de una vez
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button
                variant={allNotificationsEnabled ? "destructive" : "default"}
                onClick={handleToggleAllNotifications}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {allNotificationsEnabled ? (
                  <>
                    <BellOff className="h-5 w-5 mr-2" />
                    Desactivar todas las notificaciones
                  </>
                ) : (
                  <>
                    <Bell className="h-5 w-5 mr-2" />
                    Activar notificaciones
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Configuraciones de notificación */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center text-xl">
                <Mail className="h-6 w-6 mr-3 text-primary" />
                Canales de Notificación
              </CardTitle>
              <CardDescription className="text-base">
                Elige cómo quieres recibir las notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">Notificaciones por email</Label>
                    <p className="text-sm text-muted-foreground">Recibe alertas en tu correo electrónico</p>
                  </div>
                </div>
                <Switch
                  id="email"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <Label className="text-base font-medium">Notificaciones push</Label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-4 w-4 text-primary" />
                      <div>
                        <Label htmlFor="push-mobile" className="font-medium">Móvil</Label>
                        <p className="text-xs text-muted-foreground">En tu dispositivo móvil</p>
                      </div>
                    </div>
                    <Switch
                      id="push-mobile"
                      checked={settings.pushNotifications.mobile}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          pushNotifications: { ...prev.pushNotifications, mobile: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-4 w-4 text-primary" />
                      <div>
                        <Label htmlFor="push-web" className="font-medium">Web</Label>
                        <p className="text-xs text-muted-foreground">En tu navegador</p>
                      </div>
                    </div>
                    <Switch
                      id="push-web"
                      checked={settings.pushNotifications.web}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          pushNotifications: { ...prev.pushNotifications, web: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Frecuencia */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center text-xl">
                <Clock className="h-6 w-6 mr-3 text-primary" />
                Frecuencia de Notificaciones
              </CardTitle>
              <CardDescription className="text-base">
                Define con qué frecuencia quieres recibir las notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Select
                value={settings.frequency}
                onValueChange={(value: "immediate" | "daily" | "weekly") =>
                  setSettings(prev => ({ ...prev, frequency: value }))
                }
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate" className="text-base py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Inmediata - Cada 1 hora</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="daily" className="text-base py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary/70 rounded-full"></div>
                      <span>Diaria - Cada 24 horas</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="weekly" className="text-base py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
                      <span>Semanal - Cada 7 días</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tipos de alertas */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center text-xl">
                <AlertTriangle className="h-6 w-6 mr-3 text-primary" />
                Tipos de Alertas
              </CardTitle>
              <CardDescription className="text-base">
                Selecciona qué tipo de notificaciones quieres recibir
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30 border">
                  <Checkbox
                    id="price-drops"
                    checked={settings.alertTypes.priceDrops}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        alertTypes: { ...prev.alertTypes, priceDrops: checked as boolean }
                      }))
                    }
                  />
                  <div>
                    <Label htmlFor="price-drops" className="font-medium">Bajadas de precio</Label>
                    <p className="text-xs text-muted-foreground">Cuando baje el precio de productos</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30 border">
                  <Checkbox
                    id="new-products"
                    checked={settings.alertTypes.newProducts}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        alertTypes: { ...prev.alertTypes, newProducts: checked as boolean }
                      }))
                    }
                  />
                  <div>
                    <Label htmlFor="new-products" className="font-medium">Nuevos productos</Label>
                    <p className="text-xs text-muted-foreground">Productos recién agregados</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30 border">
                  <Checkbox
                    id="special-offers"
                    checked={settings.alertTypes.specialOffers}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        alertTypes: { ...prev.alertTypes, specialOffers: checked as boolean }
                      }))
                    }
                  />
                  <div>
                    <Label htmlFor="special-offers" className="font-medium">Ofertas especiales</Label>
                    <p className="text-xs text-muted-foreground">Promociones y descuentos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Listas de deseos */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center text-xl">
                <Tag className="h-6 w-6 mr-3 text-primary" />
                Listas de Deseos
              </CardTitle>
              <CardDescription className="text-base">
                Selecciona de qué listas quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlists.map((wishlist) => (
                  <div key={wishlist.id} className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30 border">
                    <Checkbox
                      id={`wishlist-${wishlist.id}`}
                      checked={settings.selectedWishlists.includes(wishlist.id)}
                      onCheckedChange={(checked) =>
                        handleWishlistChange(wishlist.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`wishlist-${wishlist.id}`} className="font-medium text-base">
                      {wishlist.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tiendas */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center text-xl">
                <Store className="h-6 w-6 mr-3 text-primary" />
                Tiendas Favoritas
              </CardTitle>
              <CardDescription className="text-base">
                Selecciona de qué tiendas quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map((store) => (
                  <div key={store.id} className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30 border">
                    <Checkbox
                      id={`store-${store.id}`}
                      checked={settings.selectedStores.includes(store.id)}
                      onCheckedChange={(checked) =>
                        handleStoreChange(store.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`store-${store.id}`} className="font-medium text-base">
                      {store.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Porcentaje de descuento mínimo */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center text-xl">
                <Percent className="h-6 w-6 mr-3 text-primary" />
                Descuento Mínimo
              </CardTitle>
              <CardDescription className="text-base">
                Define el porcentaje mínimo de descuento para recibir alertas
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30 border max-w-md">
                <Label htmlFor="discount" className="text-base font-medium whitespace-nowrap">
                  Descuento mínimo:
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="discount"
                    type="number"
                    min="1"
                    max="100"
                    value={settings.minDiscountPercentage}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        minDiscountPercentage: parseInt(e.target.value) || 0
                      }))
                    }
                    className="w-20 h-10 text-center text-lg font-semibold"
                  />
                  <Percent className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button onClick={handleSaveSettings} className="flex-1 h-12 text-lg font-semibold" size="lg">
              <Save className="h-5 w-5 mr-2" />
              Guardar preferencias
            </Button>
            <Button onClick={handleRestoreDefaults} variant="outline" className="h-12 text-lg" size="lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              Restaurar valores por defecto
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
