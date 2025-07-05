
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield } from "lucide-react";
import { StoresTab } from "./StoresTab";
import { FrequencyTab } from "./FrequencyTab";
import { ReviewsTab } from "./ReviewsTab";
import { UsersTab } from "./UsersTab";
import type { Store, UpdateConfig, Review, User } from "@/types/admin";

interface AdminLayoutProps {
  stores: Store[];
  setStores: (stores: Store[]) => void;
  updateFrequency: string;
  setUpdateFrequency: (frequency: string) => void;
  updateConfig: UpdateConfig;
  setUpdateConfig: (config: UpdateConfig) => void;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
}

export const AdminLayout = ({
  stores,
  setStores,
  updateFrequency,
  setUpdateFrequency,
  updateConfig,
  setUpdateConfig,
  reviews,
  setReviews,
  users,
  setUsers
}: AdminLayoutProps) => {
  const reportedUsers = users.filter(user => 
    user.status === "reported" || user.status === "banned" || 
    user.reportCount > 0 || user.aiDetections.length > 0
  );

  const reportedReviews = reviews.filter(review => 
    review.status === "reported" || review.reports.length > 0 || review.aiDetection
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Settings className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <Badge variant="secondary" className="ml-auto">
          <Shield className="h-4 w-4 mr-2" />
          Acceso Seguro
        </Badge>
      </div>

      <Tabs defaultValue="stores" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stores">Tiendas</TabsTrigger>
          <TabsTrigger value="frequency">Frecuencia</TabsTrigger>
          <TabsTrigger value="reviews">
            Reseñas Reportadas
            <Badge variant="destructive" className="ml-2">
              {reportedReviews.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="users">
            Usuarios Reportados
            <Badge variant="destructive" className="ml-2">
              {reportedUsers.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-6">
          <StoresTab stores={stores} setStores={setStores} />
        </TabsContent>
        
        <TabsContent value="frequency" className="space-y-6">
          <FrequencyTab 
            stores={stores}
            updateFrequency={updateFrequency}
            setUpdateFrequency={setUpdateFrequency}
            updateConfig={updateConfig}
            setUpdateConfig={setUpdateConfig}
          />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <ReviewsTab 
            reviews={reviews}
            setReviews={setReviews}
            users={users}
            setUsers={setUsers}
          />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UsersTab users={users} setUsers={setUsers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
