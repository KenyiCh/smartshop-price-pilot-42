
import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, TrendingDown, Heart, Star, Check, Settings, Trash2, Eye, Calendar, Filter, X } from "lucide-react";
import { formatPrice } from "@/utils/priceUtils";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

interface Notification {
  id: number;
  type: "wishlist_price" | "wishlist_offer" | "ai_recommendation";
  category: "Lista de Deseos" | "Notificacion IA";
  title: string;
  message: string;
  time: string;
  date: Date;
  read: boolean;
  productId?: number;
  icon: any;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "wishlist_price",
    category: "Lista de Deseos",
    title: "Producto de lista de deseos",
    message: `MacBook Pro 14 M3 bajó de precio: S/ ${formatPrice(8799)} → S/ ${formatPrice(7999)}`,
    time: "Hace 2 horas",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    productId: 1,
    icon: TrendingDown
  },
  {
    id: 2,
    type: "wishlist_offer",
    category: "Lista de Deseos",
    title: "Producto de lista de deseos",
    message: `iPhone 15 Pro está en oferta en 3 tiendas desde S/ ${formatPrice(3799)}`,
    time: "Hace 5 horas",
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
    productId: 2,
    icon: Heart
  },
  {
    id: 3,
    type: "ai_recommendation",
    category: "Notificacion IA",
    title: "Recomendación personalizada",
    message: `Basado en tus búsquedas: Sony WH-1000XM5 con 15% de descuento - S/ ${formatPrice(1199)}`,
    time: "Hace 1 día",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    productId: 3,
    icon: Star
  },
  {
    id: 4,
    type: "wishlist_price",
    category: "Lista de Deseos",
    title: "Producto de lista de deseos",
    message: `Apple Watch Series 9 bajó de precio: S/ ${formatPrice(1899)} → S/ ${formatPrice(1599)}`,
    time: "Hace 2 días",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    productId: 4,
    icon: TrendingDown
  }
];

const Notifications = () => {
  const [notificationList, setNotificationList] = useState<Notification[]>(initialNotifications);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'single' | 'multiple'>('single');
  const [singleDeleteId, setSingleDeleteId] = useState<number | null>(null);
  
  // Filtros
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { toast } = useToast();

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
    toast({
      title: "Notificaciones marcadas",
      description: "Todas las notificaciones han sido marcadas como leídas.",
    });
  };

  const handleViewProduct = (productId?: number) => {
    if (productId) {
      console.log(`Redirigiendo al producto ${productId}`);
      toast({
        title: "Redirigiendo",
        description: "Te llevamos al detalle del producto.",
      });
    }
  };

  const handleDeleteSingle = (id: number) => {
    setSingleDeleteId(id);
    setDeleteTarget('single');
    setShowDeleteDialog(true);
  };

  const handleDeleteMultiple = () => {
    if (selectedNotifications.length === 0) {
      toast({
        title: "Sin selección",
        description: "Selecciona al menos una notificación para eliminar.",
        variant: "destructive"
      });
      return;
    }
    setDeleteTarget('multiple');
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteTarget === 'single' && singleDeleteId) {
      setNotificationList(prev => prev.filter(notif => notif.id !== singleDeleteId));
      toast({
        title: "Notificación eliminada",
        description: "La notificación ha sido eliminada permanentemente.",
      });
    } else if (deleteTarget === 'multiple') {
      setNotificationList(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
      setSelectedNotifications([]);
      toast({
        title: "Notificaciones eliminadas",
        description: `${selectedNotifications.length} notificaciones han sido eliminadas permanentemente.`,
      });
    }
    setShowDeleteDialog(false);
    setSingleDeleteId(null);
  };

  const handleSelectNotification = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedNotifications(prev => [...prev, id]);
    } else {
      setSelectedNotifications(prev => prev.filter(notifId => notifId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(filteredNotifications.map(notif => notif.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const clearFilters = () => {
    setDateFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  // Aplicar filtros
  const filteredNotifications = notificationList.filter(notification => {
    // Filtro por fecha
    if (dateFilter !== "all") {
      const now = Date.now();
      const notifTime = notification.date.getTime();
      
      switch (dateFilter) {
        case "today":
          if (now - notifTime > 24 * 60 * 60 * 1000) return false;
          break;
        case "week":
          if (now - notifTime > 7 * 24 * 60 * 60 * 1000) return false;
          break;
        case "month":
          if (now - notifTime > 30 * 24 * 60 * 60 * 1000) return false;
          break;
      }
    }
    
    // Filtro por tipo
    if (typeFilter !== "all" && notification.category !== typeFilter) return false;
    
    // Filtro por estado
    if (statusFilter === "read" && !notification.read) return false;
    if (statusFilter === "unread" && notification.read) return false;
    
    return true;
  });

  const unreadCount = filteredNotifications.filter(notif => !notif.read).length;
  const hasActiveFilters = dateFilter !== "all" || typeFilter !== "all" || statusFilter !== "all";

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
                Configuración notificaciones
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

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-auto text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpiar filtros
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rango de fechas</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las fechas</SelectItem>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Última semana</SelectItem>
                    <SelectItem value="month">Último mes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de notificación</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="Lista de Deseos">Lista de Deseos</SelectItem>
                    <SelectItem value="Notificacion IA">Notificación IA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="unread">No vistas</SelectItem>
                    <SelectItem value="read">Vistas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas y acciones */}
        {filteredNotifications.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              {unreadCount > 0 && (
                <Badge variant="default" className="text-sm">
                  {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
                </Badge>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedNotifications.length === filteredNotifications.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  {selectedNotifications.length > 0 
                    ? `${selectedNotifications.length} seleccionada${selectedNotifications.length !== 1 ? 's' : ''}`
                    : 'Seleccionar todas'
                  }
                </span>
              </div>
            </div>
            
            {selectedNotifications.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteMultiple}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar seleccionadas
              </Button>
            )}
          </div>
        )}

        {/* Lista de notificaciones */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const IconComponent = notification.icon;
            const isSelected = selectedNotifications.includes(notification.id);
            
            return (
              <Card 
                key={notification.id} 
                className={`transition-colors ${
                  !notification.read ? 'border-primary/50 bg-primary/5' : ''
                } ${isSelected ? 'ring-2 ring-primary' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectNotification(notification.id, checked as boolean)}
                    />
                    
                    <div className={`p-2 rounded-full ${
                      !notification.read ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className={`font-semibold ${
                            !notification.read ? 'text-primary' : ''
                          }`}>
                            {notification.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {notification.category}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-2 pt-2">
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs">
                            Nueva
                          </Badge>
                        )}
                        
                        <div className="flex space-x-2 ml-auto">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Marcar como leída
                            </Button>
                          )}
                          
                          {notification.productId && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewProduct(notification.productId)}
                            >
                              Ver producto
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSingle(notification.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Estado sin notificaciones */}
        {filteredNotifications.length === 0 && notificationList.length > 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <CardTitle className="mb-2">No se encontraron notificaciones</CardTitle>
              <CardDescription className="mb-4">
                No hay notificaciones que coincidan con los filtros seleccionados
              </CardDescription>
              <Button onClick={clearFilters} variant="outline">
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        )}

        {filteredNotifications.length === 0 && notificationList.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <CardTitle className="mb-2">No tienes notificaciones disponibles por el momento</CardTitle>
              <CardDescription>
                Te notificaremos cuando haya cambios de precios o nuevas ofertas
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de confirmación de eliminación */}
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSingleDeleteId(null);
        }}
        onConfirm={confirmDelete}
        title={deleteTarget === 'single' ? "Eliminar notificación" : "Eliminar notificaciones"}
        description={
          deleteTarget === 'single'
            ? "¿Estás seguro? Esta notificación se eliminará permanentemente."
            : `¿Estás seguro? ${selectedNotifications.length} notificaciones se eliminarán permanentemente.`
        }
      />
    </div>
  );
};

export default Notifications;
