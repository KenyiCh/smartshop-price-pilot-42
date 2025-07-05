
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contentModerationService } from "@/services/contentModerationService";

interface Review {
  id: number;
  productId: number;
  productName: string;
  rating: number;
  comment: string;
  date: string;
}

interface EditReviewDialogProps {
  open: boolean;
  onClose: () => void;
  review: Review | null;
  onSave: (updatedReview: Review) => void;
}

const EditReviewDialog = ({ open, onClose, review, onSave }: EditReviewDialogProps) => {
  const [rating, setRating] = useState(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || "");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
    }
    setErrors([]);
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (rating === 0) {
      newErrors.push("La calificación es obligatoria");
    }

    if (!comment.trim()) {
      newErrors.push("El comentario es obligatorio");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!review) return;

    // Validate required fields
    if (!validateForm()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Content moderation
    const moderationResult = contentModerationService.moderateContent(comment.trim(), rating);
    
    if (!moderationResult.isAppropriate) {
      setIsSubmitting(false);
      toast({
        title: "Contenido inapropiado detectado",
        description: moderationResult.reason,
        variant: "destructive",
      });
      
      // Show specific suggestions
      if (moderationResult.suggestedChanges) {
        setErrors(moderationResult.suggestedChanges);
      }
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedReview: Review = {
      ...review,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    onSave(updatedReview);
    toast({
      title: "Reseña editada",
      description: "Tu reseña ha sido editada exitosamente",
    });

    onClose();
    setIsSubmitting(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
      onClose();
    }
  };

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Reseña</DialogTitle>
          <DialogDescription>
            Modifica tu reseña para {review.productName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rating */}
          <div>
            <Label className="text-sm font-medium">
              Calificación *
              {errors.some(error => error.includes("calificación")) && (
                <span className="text-red-500 ml-1">- Campo obligatorio</span>
              )}
            </Label>
            <div className="flex space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-sm font-medium">
              Comentario *
              {errors.some(error => error.includes("comentario")) && (
                <span className="text-red-500 ml-1">- Campo obligatorio</span>
              )}
            </Label>
            <Textarea
              id="comment"
              placeholder="Escribe tu reseña del producto..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={`mt-2 ${
                errors.some(error => error.includes("comentario")) ? "border-red-500" : ""
              }`}
              rows={4}
            />
            <div className="text-sm text-muted-foreground mt-1">
              {comment.length}/500 caracteres
            </div>
          </div>

          {/* Error messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-red-800 mb-2">
                Por favor corrige los siguientes problemas:
              </h4>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditReviewDialog;
