
import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, TrendingDown, Heart, Star, Check, Settings } from "lucide-react";
import { formatPrice } from "@/utils/priceUtils";

const notifications = [
  {
    id: 1,
    type: "price_drop",
    title: "¡Precio reducido!",
    message: `MacBook Pro 14 M3 bajó de precio: S/ ${formatPrice(8799)} → S/ ${formatPrice(7999)}`,
    time: "Hace 2 horas",
    read: false,
    icon: TrendingDown
  },
  {
    id: 2,
    type: "wishlist",
    title: "Producto en lista de deseos",
    message: `iPhone 15 Pro está en oferta en 3 tiendas desde S/ ${formatPrice(3799)}`,
    time: "Hace 5 horas",
    read: false,
    icon: Heart
  },
  {
    id: 3,
    type: "recommendation",
    title: "Recomendación personalizada",
    message: `Basado en tus búsquedas: Sony WH-1000XM5 con 15% de descuento - S/ ${formatPrice(1199)}`,
    time: "Hace 1 día",
    read: true,
    icon: Star
  },
  {
    id: 4,
    type: "price_alert",
    title: "Alerta de precio",
    message: `Apple Watch Series 9 alcanzó tu precio objetivo de S/ ${formatPrice(1599)}`,
    time: "Hace 2 días",
    read: true,
    icon: TrendingDown
  }
];

const Notifications = () => {
  const [notificationList, setNotificationList] = useState(notifications);

  const markAsRead = (id: number) => {
    setNotificationList(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notificationList.filter(notif => !notif.read).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notificaciones</h1>
            <p className="text-muted-foreground">
              Mantente al día con alertas de precios y recomendaciones
            </p>
          </div>
          <div className="flex space-x-2">
            <Link to="/notification-settings">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Editar notificaciones
              </Button>
            </Link>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <Check className="h-4 w-4 mr-2" />
                Marcar todas como leídas
              </Button>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <div className="mb-6">
            <Badge variant="default" className="text-sm">
              {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
            </Badge>
          </div>
        )}

        <div className="space-y-4">
          {notificationList.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-colors ${
                  !notification.read ? 'border-primary/50 bg-primary/5' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${
                      !notification.read ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${
                          !notification.read ? 'text-primary' : ''
                        }`}>
                          {notification.title}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">
                          Nueva
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {notificationList.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <CardTitle className="mb-2">No hay notificaciones</CardTitle>
              <CardDescription>
                Te notificaremos cuando haya cambios de precios o nuevas ofertas
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;
