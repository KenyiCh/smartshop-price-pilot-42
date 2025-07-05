
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft, MessageSquare, Calendar, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import EditReviewDialog from "@/components/EditReviewDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

const ReviewHistory = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      productId: 1,
      productName: "MacBook Pro 14 M3",
      productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      rating: 5,
      comment: "Excelente producto, muy rápido y eficiente para trabajo profesional. La pantalla es increíble y la batería dura todo el día.",
      date: "2024-01-20",
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      productId: 2,
      productName: "iPhone 15 Pro",
      productImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
      rating: 4,
      comment: "Muy buen teléfono, la cámara es espectacular. Solo le falta un poco más de batería.",
      date: "2024-01-15",
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      productId: 3,
      productName: "Sony WH-1000XM5",
      productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      rating: 5,
      comment: "Los mejores audífonos con cancelación de ruido que he probado. Sonido excepcional.",
      date: "2024-01-10",
      helpful: 15,
      verified: false
    }
  ]);

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
  const { toast } = useToast();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getTotalReviews = () => reviews.length;
  const getAverageRating = () => {
    if (reviews.length === 0) return "0.0";
    const average = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    return average.toFixed(1);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
  };

  const handleSaveReview = (updatedReview: Review) => {
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === updatedReview.id ? updatedReview : review
      )
    );
    setEditingReview(null);
  };

  const handleDeleteReview = (reviewId: number) => {
    setDeletingReviewId(reviewId);
  };

  const confirmDeleteReview = () => {
    if (deletingReviewId) {
      const reviewToDelete = reviews.find(r => r.id === deletingReviewId);
      setReviews(prevReviews => 
        prevReviews.filter(review => review.id !== deletingReviewId)
      );
      
      toast({
        title: "Reseña eliminada",
        description: `La reseña de "${reviewToDelete?.productName}" ha sido eliminada permanentemente`,
      });
      
      setDeletingReviewId(null);
    }
  };

  const deletingReview = reviews.find(r => r.id === deletingReviewId);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Link to="/profile">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Perfil
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <MessageSquare className="h-8 w-8 mr-3 text-primary" />
                Mi Historial de Reseñas
              </h1>
              <p className="text-muted-foreground">
                {getTotalReviews()} reseña{getTotalReviews() !== 1 ? 's' : ''} • Calificación promedio: {getAverageRating()}/5.0
              </p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No cuentas con reseñas escritas</h3>
                <p className="text-muted-foreground mb-4">
                  Aún no has escrito ninguna reseña de productos
                </p>
                <Link to="/products">
                  <Button>Explorar productos</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <img
                        src={review.productImage}
                        alt={review.productName}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link to={`/product/${review.productId}`}>
                              <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                                {review.productName}
                              </h3>
                            </Link>
                            <div className="flex items-center space-x-3 mt-2">
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                                <span className="text-sm font-medium ml-1">{review.rating}/5</span>
                              </div>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Compra verificada
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="text-sm text-muted-foreground">
                            {review.helpful} personas encontraron esta reseña útil
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditReview(review)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteReview(review.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </Button>
                            <Link to={`/product/${review.productId}`}>
                              <Button variant="outline" size="sm">
                                Ver Producto
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Review Dialog */}
      <EditReviewDialog
        open={!!editingReview}
        onClose={() => setEditingReview(null)}
        review={editingReview}
        onSave={handleSaveReview}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deletingReviewId}
        onClose={() => setDeletingReviewId(null)}
        onConfirm={confirmDeleteReview}
        title="¿Estás seguro?"
        description={`Se eliminará permanentemente la reseña de "${deletingReview?.productName}". Esta acción no se puede deshacer.`}
      />
    </div>
  );
};

export default ReviewHistory;
