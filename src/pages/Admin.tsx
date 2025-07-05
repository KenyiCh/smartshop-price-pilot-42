
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Shield } from "lucide-react";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Store, UpdateConfig, Review, User } from "@/types/admin";

const Admin = () => {
  const { isAdmin, isLoading } = useAdminAccess();
  
  const [stores, setStores] = useState<Store[]>([
    { id: 1, name: "Amazon", url: "https://amazon.com.pe", status: "active", lastUpdate: "2024-01-15 10:30", apiKey: "", integrationType: "api", categories: [] },
    { id: 2, name: "Mercado Libre", url: "https://mercadolibre.com.pe", status: "active", lastUpdate: "2024-01-15 10:25", apiKey: "", integrationType: "api", categories: [] },
    { id: 3, name: "Ripley", url: "https://ripley.com.pe", status: "inactive", lastUpdate: "2024-01-14 15:20", apiKey: "", integrationType: "api", categories: [] },
    { id: 4, name: "Falabella", url: "https://falabella.com.pe", status: "active", lastUpdate: "2024-01-15 09:45", apiKey: "", integrationType: "api", categories: [] }
  ]);
  
  const [reviews, setReviews] = useState<Review[]>([
    { 
      id: 1, 
      user: "Carlos M.", 
      userId: 1, 
      product: "MacBook Pro 14", 
      productId: 1, 
      comment: "Producto excelente pero el vendedor es un estúpido", 
      status: "reported", 
      date: "2024-01-15", 
      rating: 3,
      reports: [
        { id: 1, reportedBy: "Ana L.", reason: "Lenguaje ofensivo", date: "2024-01-15 14:30", description: "Usa insultos hacia el vendedor" },
        { id: 2, reportedBy: "Pedro S.", reason: "Lenguaje inapropiado", date: "2024-01-15 15:45", description: "Contiene palabras ofensivas" }
      ],
      aiDetection: "Detectado lenguaje ofensivo: uso de insultos"
    },
    { 
      id: 2, 
      user: "Usuario Spam", 
      userId: 3, 
      product: "iPhone 15 Pro", 
      productId: 2, 
      comment: "¡¡¡COMPRA AHORA!!! www.fake-store.com mejor precio garantizado 100%", 
      status: "reported", 
      date: "2024-01-14", 
      rating: 5,
      reports: [
        { id: 3, reportedBy: "Maria G.", reason: "Spam", date: "2024-01-14 16:20", description: "Contiene enlaces sospechosos y promoción no autorizada" },
        { id: 4, reportedBy: "Luis R.", reason: "Contenido promocional", date: "2024-01-14 17:10", description: "Promociona sitio web externo" },
        { id: 5, reportedBy: "Carmen T.", reason: "Información falsa", date: "2024-01-14 18:30", description: "Promete garantías falsas" }
      ],
      aiDetection: "Detectado como spam: enlaces sospechosos, promoción no autorizada y afirmaciones falsas"
    },
    { 
      id: 3, 
      user: "Bot Falso", 
      userId: 4, 
      product: "Sony WH-1000XM5", 
      productId: 3, 
      comment: "AAAAAAAAAAA!!!! Producto horrible horrible horrible no lo compren", 
      status: "reported", 
      date: "2024-01-13", 
      rating: 1,
      reports: [
        { id: 6, reportedBy: "Diego M.", reason: "Comportamiento bot", date: "2024-01-13 12:15", description: "Texto repetitivo y poco natural" }
      ],
      aiDetection: "Detectado comportamiento de bot: caracteres repetitivos y patrones de spam"
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    { 
      id: 1, 
      name: "Carlos M.", 
      email: "carlos@email.com", 
      status: "reported", 
      reportCount: 2, 
      registrationDate: "2024-01-10", 
      lastActivity: "2024-01-15", 
      reviewsCount: 3,
      reports: [
        { id: 1, reportedBy: "Ana L.", reason: "Lenguaje ofensivo", date: "2024-01-15 14:30", description: "Utiliza insultos en sus reseñas", status: "pending" },
        { id: 2, reportedBy: "Pedro S.", reason: "Comportamiento agresivo", date: "2024-01-15 16:20", description: "Responde de manera agresiva a otros usuarios", status: "pending" }
      ],
      aiDetections: ["Uso frecuente de lenguaje ofensivo", "Patrones de comportamiento agresivo"]
    },
    { 
      id: 3, 
      name: "Usuario Spam", 
      email: "spam@email.com", 
      status: "reported", 
      reportCount: 8, 
      registrationDate: "2024-01-05", 
      lastActivity: "2024-01-14", 
      reviewsCount: 12,
      reports: [
        { id: 3, reportedBy: "Maria G.", reason: "Spam", date: "2024-01-14 16:20", description: "Publica contenido promocional no autorizado", status: "pending" },
        { id: 4, reportedBy: "Luis R.", reason: "Enlaces sospechosos", date: "2024-01-14 17:10", description: "Incluye enlaces a sitios externos", status: "pending" },
        { id: 5, reportedBy: "Carmen T.", reason: "Información falsa", date: "2024-01-14 18:30", description: "Hace afirmaciones falsas sobre productos", status: "pending" },
        { id: 6, reportedBy: "Roberto H.", reason: "Spam", date: "2024-01-13 09:45", description: "Contenido repetitivo y promocional", status: "reviewed" },
        { id: 7, reportedBy: "Elena V.", reason: "Comportamiento sospechoso", date: "2024-01-12 14:22", description: "Actividad automatizada detectada", status: "reviewed" }
      ],
      aiDetections: ["Alto volumen de contenido promocional", "Patrones de comportamiento automatizado", "Enlaces a sitios no verificados"]
    },
    { 
      id: 4, 
      name: "Bot Falso", 
      email: "bot@fake.com", 
      status: "reported", 
      reportCount: 3, 
      registrationDate: "2024-01-08", 
      lastActivity: "2024-01-13", 
      reviewsCount: 5,
      reports: [
        { id: 8, reportedBy: "Diego M.", reason: "Comportamiento bot", date: "2024-01-13 12:15", description: "Comportamiento no humano detectado", status: "pending" },
        { id: 9, reportedBy: "Sofia L.", reason: "Contenido repetitivo", date: "2024-01-12 10:30", description: "Publica el mismo tipo de contenido repetidamente", status: "pending" },
        { id: 10, reportedBy: "Manuel P.", reason: "Actividad sospechosa", date: "2024-01-11 16:45", description: "Patrón de actividad irregular", status: "reviewed" }
      ],
      aiDetections: ["Comportamiento automatizado detectado", "Patrones de texto no humanos", "Actividad irregular en horarios"]
    }
  ]);
  
  const [updateFrequency, setUpdateFrequency] = useState("30");
  const [updateConfig, setUpdateConfig] = useState<UpdateConfig>({
    frequency: "30",
    startDate: "",
    endDate: "",
    selectedStores: [],
    selectedCategories: [],
    isSpecialEvent: false,
    eventName: ""
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto text-primary mb-4 animate-spin" />
            <h1 className="text-2xl font-bold">Verificando permisos...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <AdminLayout
        stores={stores}
        setStores={setStores}
        updateFrequency={updateFrequency}
        setUpdateFrequency={setUpdateFrequency}
        updateConfig={updateConfig}
        setUpdateConfig={setUpdateConfig}
        reviews={reviews}
        setReviews={setReviews}
        users={users}
        setUsers={setUsers}
      />
    </div>
  );
};

export default Admin;
