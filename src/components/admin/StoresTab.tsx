
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Store, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sanitizeInput } from "@/utils/security";
import type { Store as StoreType } from "@/types/admin";

interface StoresTabProps {
  stores: StoreType[];
  setStores: (stores: StoreType[]) => void;
}

export const StoresTab = ({ stores, setStores }: StoresTabProps) => {
  const [newStore, setNewStore] = useState({ 
    name: "", 
    url: "", 
    apiKey: "", 
    integrationType: "api", 
    status: "active",
    categories: [] as string[]
  });
  
  const { toast } = useToast();

  const handleAddStore = () => {
    const sanitizedName = sanitizeInput(newStore.name);
    const sanitizedUrl = sanitizeInput(newStore.url);
    const sanitizedApiKey = sanitizeInput(newStore.apiKey);
    
    if (!sanitizedName || !sanitizedUrl) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios (nombre y URL)",
        variant: "destructive",
      });
      return;
    }

    const existingStore = stores.find(store => 
      store.name.toLowerCase() === sanitizedName.toLowerCase() || 
      store.url === sanitizedUrl
    );
    
    if (existingStore) {
      toast({
        title: "Tienda ya existente",
        description: "Esta tienda ya está registrada en el sistema",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(sanitizedUrl);
    } catch {
      toast({
        title: "Error",
        description: "Por favor ingresa una URL válida",
        variant: "destructive",
      });
      return;
    }

    const store = {
      id: stores.length + 1,
      name: sanitizedName,
      url: sanitizedUrl,
      apiKey: sanitizedApiKey,
      integrationType: newStore.integrationType,
      status: newStore.status as "active" | "inactive",
      categories: newStore.categories,
      lastUpdate: new Date().toLocaleString()
    };
    
    setStores([...stores, store]);
    setNewStore({ 
      name: "", 
      url: "", 
      apiKey: "", 
      integrationType: "api", 
      status: "active",
      categories: []
    });
    
    toast({
      title: "Tienda registrada exitosamente",
      description: `${sanitizedName} ha sido agregada y está ${newStore.status === "active" ? "activa" : "inactiva"}`,
    });
  };

  const handleDeleteStore = (id: number) => {
    setStores(stores.filter(store => store.id !== id));
    toast({
      title: "Tienda eliminada",
      description: "La tienda ha sido eliminada permanentemente",
      variant: "destructive",
    });
  };

  const handleToggleStoreStatus = (id: number) => {
    const store = stores.find(s => s.id === id);
    const newStatus = store?.status === "active" ? "inactive" : "active";
    
    setStores(stores.map(store => 
      store.id === id 
        ? { ...store, status: newStatus }
        : store
    ));
    
    toast({
      title: `Tienda ${newStatus === "active" ? "activada" : "desactivada"}`,
      description: `La tienda ha sido ${newStatus === "active" ? "activada" : "desactivada temporalmente"}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Store className="h-5 w-5 mr-2" />
          Gestión de Tiendas Afiliadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 border rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="storeName">Nombre de la tienda *</Label>
            <Input
              id="storeName"
              placeholder="Ej: Amazon Perú"
              value={newStore.name}
              onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="storeUrl">URL principal *</Label>
            <Input
              id="storeUrl"
              placeholder="https://amazon.com.pe"
              value={newStore.url}
              onChange={(e) => setNewStore({ ...newStore, url: e.target.value })}
              maxLength={200}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">Clave API (opcional)</Label>
            <Input
              id="apiKey"
              placeholder="API Key"
              value={newStore.apiKey}
              onChange={(e) => setNewStore({ ...newStore, apiKey: e.target.value })}
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="integrationType">Tipo de integración</Label>
            <Select 
              value={newStore.integrationType} 
              onValueChange={(value) => setNewStore({ ...newStore, integrationType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="scraping">Web Scraping</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="storeStatus">Estado inicial</Label>
            <Select 
              value={newStore.status} 
              onValueChange={(value) => setNewStore({ ...newStore, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activa</SelectItem>
                <SelectItem value="inactive">Inactiva</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Tienda
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar registro de tienda</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de que deseas registrar la tienda "{newStore.name}" con estado {newStore.status === "active" ? "activo" : "inactivo"}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAddStore}>
                    Sí, registrar tienda
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tienda</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Última Actualización</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell>{store.url}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {store.integrationType || "API"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={store.status === "active" ? "default" : "secondary"}>
                    {store.status === "active" ? "Activa" : "Inactiva"}
                  </Badge>
                </TableCell>
                <TableCell>{store.lastUpdate}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          {store.status === "active" ? "Desactivar" : "Activar"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {store.status === "active" ? "Desactivar tienda" : "Activar tienda"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {store.status === "active" 
                              ? `¿Deseas desactivar temporalmente la tienda "${store.name}"? No se incluirán sus precios durante el tiempo que esté inactiva.`
                              : `¿Deseas activar la tienda "${store.name}"? Sus precios volverán a incluirse en las comparaciones.`
                            }
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleToggleStoreStatus(store.id)}>
                            Sí, {store.status === "active" ? "desactivar" : "activar"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    {store.status === "inactive" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminar tienda permanentemente</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que deseas eliminar permanentemente la tienda "{store.name}"? Esta acción no se puede deshacer y se eliminarán todos los registros asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteStore(store.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Sí, eliminar permanentemente
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
