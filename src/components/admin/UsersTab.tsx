
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, AlertTriangle, Eye, Ban, UserX, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types/admin";

interface UsersTabProps {
  users: User[];
  setUsers: (users: User[]) => void;
}

export const UsersTab = ({ users, setUsers }: UsersTabProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState("");
  
  const { toast } = useToast();

  const reportedUsers = users.filter(user => 
    user.status === "reported" || user.status === "banned" || 
    user.reportCount > 0 || user.aiDetections.length > 0
  ).sort((a, b) => {
    if (a.status === "reported" && b.status !== "reported") return -1;
    if (b.status === "reported" && a.status !== "reported") return 1;
    return b.reportCount - a.reportCount;
  });

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "reported": return "destructive";
      case "banned": return "outline";
      default: return "secondary";
    }
  };

  const handleBanUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (!banReason.trim()) {
      toast({
        title: "Error",
        description: "Debes especificar un motivo para el baneo",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: "banned" as const }
        : u
    ));
    
    toast({
      title: "Usuario baneado",
      description: `${user.name} ha sido baneado exitosamente. Motivo: ${banReason}. Se ha enviado una notificación automática.`,
      variant: "destructive",
    });
    
    setSelectedUser(null);
    setBanReason("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Moderación de Usuarios Reportados
          </div>
          <Badge variant="destructive">
            {reportedUsers.length} usuarios requieren atención
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Esta vista muestra únicamente los usuarios que han sido reportados por otros usuarios o identificados por nuestra IA como infractores a las políticas de comportamiento.
            </AlertDescription>
          </Alert>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Reportes</TableHead>
              <TableHead>Detecciones IA</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead>Actividad</TableHead>
              <TableHead>Reseñas</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportedUsers.map((user) => (
              <TableRow 
                key={user.id}
                className="bg-red-50 border-red-200"
              >
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getUserStatusColor(user.status)}>
                    {user.status === "active" ? "Activo" :
                     user.status === "reported" ? "Reportado" : "Baneado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">{user.reportCount}</Badge>
                </TableCell>
                <TableCell>
                  {user.aiDetections.length > 0 ? (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      {user.aiDetections.length} detecciones
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
                <TableCell>{user.registrationDate}</TableCell>
                <TableCell>{user.lastActivity}</TableCell>
                <TableCell>{user.reviewsCount}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detalles del Usuario Reportado</DialogTitle>
                          <DialogDescription>
                            Historial completo de reportes y detecciones de IA
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedUser && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-semibold">Nombre:</Label>
                                <p>{selectedUser.name}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Email:</Label>
                                <p>{selectedUser.email}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-semibold">Estado:</Label>
                                <Badge variant={getUserStatusColor(selectedUser.status)}>
                                  {selectedUser.status === "active" ? "Activo" :
                                   selectedUser.status === "reported" ? "Reportado" : "Baneado"}
                                </Badge>
                              </div>
                              <div>
                                <Label className="font-semibold">Total de reportes:</Label>
                                <p className="text-red-600 font-bold">{selectedUser.reportCount}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-semibold">Fecha de registro:</Label>
                                <p>{selectedUser.registrationDate}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Última actividad:</Label>
                                <p>{selectedUser.lastActivity}</p>
                              </div>
                            </div>
                            
                            <div>
                              <Label className="font-semibold">Reseñas escritas:</Label>
                              <p>{selectedUser.reviewsCount} reseñas</p>
                            </div>

                            {selectedUser.aiDetections.length > 0 && (
                              <div>
                                <Label className="font-semibold text-orange-600">Detecciones por IA:</Label>
                                <div className="mt-2 space-y-2">
                                  {selectedUser.aiDetections.map((detection, index) => (
                                    <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                                      <div className="flex items-center space-x-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                                        <span className="text-orange-800">{detection}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <Label className="font-semibold">Historial de Reportes ({selectedUser.reports.length}):</Label>
                              <div className="mt-2 space-y-2">
                                {selectedUser.reports.map((report, index) => (
                                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium text-red-800">{report.reportedBy}</span>
                                        <Badge variant="destructive" className="text-xs">
                                          {report.reason}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          {report.status === "pending" ? "Pendiente" : 
                                           report.status === "reviewed" ? "Revisado" : "Resuelto"}
                                        </Badge>
                                      </div>
                                      <span className="text-xs text-red-600">{report.date}</span>
                                    </div>
                                    <p className="text-sm text-red-700">{report.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {selectedUser.status !== "banned" && (
                              <div className="pt-4 border-t">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="destructive" className="w-full">
                                      <Ban className="h-4 w-4 mr-2" />
                                      Banear Usuario
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Banear Usuario</DialogTitle>
                                      <DialogDescription>
                                        Esta acción eliminará el acceso del usuario al sistema y se enviará una notificación automática.
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="font-semibold">Motivo del baneo *</Label>
                                        <Textarea 
                                          placeholder="Especifica el motivo del baneo..."
                                          value={banReason}
                                          onChange={(e) => setBanReason(e.target.value)}
                                          required
                                        />
                                      </div>
                                      
                                      <div className="p-3 bg-muted rounded-md">
                                        <p className="text-sm font-medium">Resumen del usuario:</p>
                                        <p className="text-sm text-muted-foreground">
                                          • {selectedUser.reportCount} reportes recibidos<br/>
                                          • {selectedUser.aiDetections.length} detecciones por IA<br/>
                                          • {selectedUser.reviewsCount} reseñas escritas
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setBanReason("")}>
                                        Cancelar
                                      </Button>
                                      <Button 
                                        variant="destructive" 
                                        onClick={() => handleBanUser(selectedUser.id)}
                                        disabled={!banReason.trim()}
                                      >
                                        Confirmar Baneo
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    {user.status !== "banned" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <UserX className="h-4 w-4 mr-1" />
                            Banear
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Banear Usuario</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Está seguro de que desea banear al usuario {user.name}? Esta acción eliminará su acceso al sistema.
                              <br/><br/>
                              <strong>Resumen:</strong> {user.reportCount} reportes, {user.aiDetections.length} detecciones IA
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="my-4">
                            <Label htmlFor="quickBanReason">Motivo del baneo:</Label>
                            <Textarea 
                              id="quickBanReason"
                              placeholder="Especifica el motivo..."
                              value={banReason}
                              onChange={(e) => setBanReason(e.target.value)}
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setBanReason("")}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleBanUser(user.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={!banReason.trim()}
                            >
                              Sí, banear usuario
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
