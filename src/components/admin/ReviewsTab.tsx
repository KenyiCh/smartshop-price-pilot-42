
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Eye, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Review, User } from "@/types/admin";

interface ReviewsTabProps {
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
}

export const ReviewsTab = ({ reviews, setReviews, users, setUsers }: ReviewsTabProps) => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectComment, setRejectComment] = useState("");
  
  const { toast } = useToast();

  const reportedReviews = reviews.filter(review => 
    review.status === "reported" || review.reports.length > 0 || review.aiDetection
  ).sort((a, b) => {
    const statusOrder = { "reported": 0, "pending": 1, "approved": 2, "rejected": 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "pending": return "secondary";
      case "reported": return "destructive";
      case "rejected": return "outline";
      default: return "secondary";
    }
  };

  const handleApproveReview = (reviewId: number) => {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    setReviews(reviews.map(r => 
      r.id === reviewId 
        ? { ...r, status: "approved" as const }
        : r
    ));
    
    toast({
      title: "Reseña aprobada",
      description: `La reseña de ${review.user} ha sido aprobada y publicada. Se ha enviado notificación al autor.`,
    });
    
    setSelectedReview(null);
  };

  const handleRejectReview = (reviewId: number) => {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    if (!rejectReason) {
      toast({
        title: "Error",
        description: "Debes seleccionar un motivo de rechazo",
        variant: "destructive",
      });
      return;
    }

    setReviews(reviews.filter(r => r.id !== reviewId));
    
    setUsers(users.map(u => 
      u.id === review.userId 
        ? { ...u, reportCount: u.reportCount + 1 }
        : u
    ));
    
    toast({
      title: "Reseña rechazada y eliminada",
      description: `La reseña ha sido eliminada. Se ha enviado notificación al autor con la justificación.`,
      variant: "destructive",
    });
    
    setSelectedReview(null);
    setRejectReason("");
    setRejectComment("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Moderación de Reseñas Reportadas
          </div>
          <Badge variant="destructive">
            {reportedReviews.length} reseñas requieren atención
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Esta vista muestra únicamente las reseñas que han sido reportadas por usuarios o detectadas por nuestra IA como potencialmente problemáticas.
            </AlertDescription>
          </Alert>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Comentario</TableHead>
              <TableHead>Calificación</TableHead>
              <TableHead>Reportes</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportedReviews.map((review) => (
              <TableRow 
                key={review.id}
                className="bg-red-50 border-red-200"
              >
                <TableCell className="font-medium">{review.user}</TableCell>
                <TableCell>{review.product}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={review.comment}>
                    {review.comment}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                    <span className="ml-1 text-sm text-muted-foreground">
                      ({review.rating}/5)
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">
                      {review.reports.length} reportes
                    </Badge>
                    {review.aiDetection && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        IA
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(review.status)}>
                    {review.status === "approved" ? "Aprobada" :
                     review.status === "pending" ? "Pendiente" : 
                     review.status === "reported" ? "Reportada" : "Rechazada"}
                  </Badge>
                </TableCell>
                <TableCell>{review.date}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedReview(review)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detalles de la Reseña Reportada</DialogTitle>
                          <DialogDescription>
                            Análisis completo de reportes y detección de IA
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedReview && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-semibold">Usuario:</Label>
                                <p>{selectedReview.user}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Producto:</Label>
                                <p>{selectedReview.product}</p>
                              </div>
                            </div>
                            
                            <div>
                              <Label className="font-semibold">Contenido de la reseña:</Label>
                              <div className="p-3 bg-muted rounded-md mt-1 border-l-4 border-red-500">
                                {selectedReview.comment}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-semibold">Calificación:</Label>
                                <p>{"★".repeat(selectedReview.rating)} ({selectedReview.rating}/5)</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Fecha:</Label>
                                <p>{selectedReview.date}</p>
                              </div>
                            </div>

                            {selectedReview.aiDetection && (
                              <div>
                                <Label className="font-semibold text-orange-600">Detección por IA:</Label>
                                <div className="p-3 bg-orange-50 border border-orange-200 rounded-md mt-1">
                                  <div className="flex items-center space-x-2">
                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                    <span className="text-orange-800">{selectedReview.aiDetection}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <Label className="font-semibold">Historial de Reportes ({selectedReview.reports.length}):</Label>
                              <div className="mt-2 space-y-2">
                                {selectedReview.reports.map((report, index) => (
                                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium text-red-800">{report.reportedBy}</span>
                                        <Badge variant="destructive" className="text-xs">
                                          {report.reason}
                                        </Badge>
                                      </div>
                                      <span className="text-xs text-red-600">{report.date}</span>
                                    </div>
                                    <p className="text-sm text-red-700">{report.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {(selectedReview.status === "pending" || selectedReview.status === "reported") && (
                              <div className="flex space-x-2 pt-4 border-t">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button>
                                      Aprobar Reseña
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Aprobar Reseña</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        ¿Confirmas que esta reseña cumple con las políticas de la plataforma y debe ser aprobada? Se ignorarán los reportes.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleApproveReview(selectedReview.id)}>
                                        Sí, aprobar reseña
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="destructive">
                                      Rechazar Reseña
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Rechazar Reseña</DialogTitle>
                                      <DialogDescription>
                                        Selecciona el motivo del rechazo. Esta acción eliminará la reseña permanentemente.
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="font-semibold">Motivo del rechazo *</Label>
                                        <Select value={rejectReason} onValueChange={setRejectReason}>
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona un motivo" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="contenido-ofensivo">Contenido ofensivo</SelectItem>
                                            <SelectItem value="spam">Spam</SelectItem>
                                            <SelectItem value="inapropiado">Inapropiado</SelectItem>
                                            <SelectItem value="falsa-informacion">Información falsa</SelectItem>
                                            <SelectItem value="lenguaje-agresivo">Lenguaje agresivo</SelectItem>
                                            <SelectItem value="promocion-no-autorizada">Promoción no autorizada</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div>
                                        <Label>Comentario adicional (opcional)</Label>
                                        <Textarea 
                                          placeholder="Detalles adicionales sobre el rechazo..."
                                          value={rejectComment}
                                          onChange={(e) => setRejectComment(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setRejectReason("")}>
                                        Cancelar
                                      </Button>
                                      <Button 
                                        variant="destructive" 
                                        onClick={() => handleRejectReview(selectedReview.id)}
                                      >
                                        Rechazar y Eliminar
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
