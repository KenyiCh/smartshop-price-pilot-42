
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { UpdateConfig, Store } from "@/types/admin";

interface FrequencyTabProps {
  stores: Store[];
  updateFrequency: string;
  setUpdateFrequency: (frequency: string) => void;
  updateConfig: UpdateConfig;
  setUpdateConfig: (config: UpdateConfig) => void;
}

export const FrequencyTab = ({ 
  stores, 
  updateFrequency, 
  setUpdateFrequency, 
  updateConfig, 
  setUpdateConfig 
}: FrequencyTabProps) => {
  const [availableCategories] = useState([
    "laptop", "smartphone", "headphones", "tablet", "gaming", "smartwatch"
  ]);
  
  const { toast } = useToast();

  const handleUpdateFrequency = () => {
    toast({
      title: "Frecuencia actualizada",
      description: `La frecuencia de actualización se ha cambiado a ${updateFrequency} minutos`,
    });
  };

  const handleAdvancedUpdateConfig = () => {
    const { frequency, startDate, endDate, isSpecialEvent, eventName } = updateConfig;
    
    const minFreq = isSpecialEvent ? 10 : 30;
    const maxFreq = 120;
    const freqNum = parseInt(frequency);
    
    if (freqNum < minFreq || freqNum > maxFreq) {
      toast({
        title: "Frecuencia no viable",
        description: `La frecuencia debe estar entre ${minFreq} y ${maxFreq} minutos. Se recomienda 30 minutos por defecto.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Debes especificar el periodo de vigencia",
        variant: "destructive",
      });
      return;
    }
    
    if (isSpecialEvent && !eventName.trim()) {
      toast({
        title: "Error", 
        description: "Debes especificar el nombre del evento",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Configuración avanzada aplicada",
      description: `Frecuencia: ${frequency} min. ${isSpecialEvent ? `Evento: ${eventName}` : ''} Periodo: ${startDate} - ${endDate}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Configuración Avanzada de Actualización
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Configuración Básica</h3>
          <div className="flex space-x-4">
            <Select value={updateFrequency} onValueChange={setUpdateFrequency}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleUpdateFrequency}>
              Aplicar Configuración Básica
            </Button>
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Configuración Avanzada</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="advancedFreq">Frecuencia (minutos)</Label>
              <Input
                id="advancedFreq"
                type="number"
                min={updateConfig.isSpecialEvent ? 10 : 30}
                max="120"
                value={updateConfig.frequency}
                onChange={(e) => setUpdateConfig({...updateConfig, frequency: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha inicio</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={updateConfig.startDate}
                onChange={(e) => setUpdateConfig({...updateConfig, startDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha fin</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={updateConfig.endDate}
                onChange={(e) => setUpdateConfig({...updateConfig, endDate: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="specialEvent"
                checked={updateConfig.isSpecialEvent}
                onCheckedChange={(checked) => 
                  setUpdateConfig({...updateConfig, isSpecialEvent: checked as boolean})
                }
              />
              <Label htmlFor="specialEvent">Activar Modo Evento Especial</Label>
            </div>
            
            {updateConfig.isSpecialEvent && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="eventName">Nombre del evento</Label>
                <Input
                  id="eventName"
                  placeholder="Ej: CyberWow 2024, CyberDays, etc."
                  value={updateConfig.eventName}
                  onChange={(e) => setUpdateConfig({...updateConfig, eventName: e.target.value})}
                />
                <p className="text-sm text-muted-foreground">
                  Modo evento permite frecuencias desde 10 minutos
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tiendas a actualizar</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {stores.filter(store => store.status === "active").map((store) => (
                <div key={store.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`store-${store.id}`}
                    checked={updateConfig.selectedStores.length === 0 || updateConfig.selectedStores.includes(store.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setUpdateConfig({
                          ...updateConfig, 
                          selectedStores: [...updateConfig.selectedStores, store.id]
                        });
                      } else {
                        setUpdateConfig({
                          ...updateConfig, 
                          selectedStores: updateConfig.selectedStores.filter(id => id !== store.id)
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`store-${store.id}`} className="text-sm">
                    {store.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categorías a actualizar</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`}
                    checked={updateConfig.selectedCategories.length === 0 || updateConfig.selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setUpdateConfig({
                          ...updateConfig, 
                          selectedCategories: [...updateConfig.selectedCategories, category]
                        });
                      } else {
                        setUpdateConfig({
                          ...updateConfig, 
                          selectedCategories: updateConfig.selectedCategories.filter(cat => cat !== category)
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm capitalize">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleAdvancedUpdateConfig} className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Aplicar Configuración Avanzada
          </Button>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Estado Actual del Sistema</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p><strong>Frecuencia actual:</strong> {updateFrequency} minutos</p>
              <p><strong>Tiendas activas:</strong> {stores.filter(s => s.status === "active").length}</p>
            </div>
            <div>
              <p><strong>Última actualización:</strong> {new Date().toLocaleString()}</p>
              <p><strong>Estado:</strong> Sistema operativo</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
