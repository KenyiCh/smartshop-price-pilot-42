import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Star, Heart, TrendingDown, ExternalLink, Store } from "lucide-react";
import Navigation from "@/components/Navigation";
import PriceChart from "@/components/PriceChart";
import AddToWishlistDialog from "@/components/AddToWishlistDialog";
import { useToast } from "@/hooks/use-toast";
import { contentModerationService } from "@/services/contentModerationService";

const ProductDetail = () => {
  const { id } = useParams();
  const [showWishlistDialog, setShowWishlistDialog] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviewErrors, setReviewErrors] = useState<string[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setIsLoggedIn(!!userData);
  }, []);

  // Mock wishlists data
  const mockWishlists = [
    { id: 1, name: "Tecnología", itemCount: 2 },
    { id: 2, name: "Hogar", itemCount: 1 },
  ];

  // Mock data actualizado con imágenes reales
  const product = {
    id: 1,
    name: "MacBook Pro 14 M3",
    brand: "Apple",
    model: "2023",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    rating: 4.8,
    totalReviews: 156,
    description: "La MacBook Pro de 14 pulgadas con chip M3 ofrece un rendimiento excepcional para profesionales creativos y desarrolladores.",
    specifications: {
      "Procesador": "Apple M3",
      "RAM": "16GB",
      "Almacenamiento": "512GB SSD",
      "Pantalla": "14.2 pulgadas Liquid Retina XDR",
      "Peso": "1.6 kg"
    }
  };

  const stores = [
    { 
      name: "Amazon", 
      price: 7596.50, 
      productUrl: "https://amazon.com.pe/macbook-pro-14-m3/dp/B0EXAMPLE1", 
      shipping: "Envío gratis", 
      rating: 4.5 
    },
    { 
      name: "Mercado Libre", 
      price: 7999.75, 
      productUrl: "https://articulo.mercadolibre.com.pe/MPE-macbook-pro-14-m3-example", 
      shipping: "Recogida en tienda", 
      rating: 4.3 
    },
    { 
      name: "Ripley", 
      price: 8199.25, 
      productUrl: "https://simple.ripley.com.pe/macbook-pro-14-m3-example", 
      shipping: "Envío gratis", 
      rating: 4.2 
    },
    { 
      name: "Falabella", 
      price: 8049.50, 
      productUrl: "https://falabella.com.pe/falabella-pe/product/macbook-pro-14-m3/example", 
      shipping: "Solo miembros", 
      rating: 4.4 
    }
  ];

  const reviews = [
    {
      id: 1,
      user: "Carlos M.",
      rating: 5,
      date: "2024-01-15",
      comment: "Excelente laptop, muy rápida y la batería dura todo el día."
    },
    {
      id: 2,
      user: "Ana L.",
      rating: 4,
      date: "2024-01-10",
      comment: "Muy buena calidad, aunque el precio es alto vale la pena."
    }
  ];

  const handleWishlistClick = () => {
    if (!isLoggedIn) {
      toast({
        title: "Iniciar sesión requerido",
        description: "Debes iniciar sesión para agregar productos a tu lista de deseos",
        variant: "destructive",
      });
      return;
    }
    setShowWishlistDialog(true);
  };

  const handleAddToWishlist = (wishlistId: number, product: any) => {
    console.log("Adding product to wishlist:", wishlistId, product);
  };

  const handleCreateWishlistAndAdd = (name: string, product: any) => {
    console.log("Creating new wishlist and adding product:", name, product);
  };

  const submitReview = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Iniciar sesión requerido",
        description: "Debes iniciar sesión para escribir una reseña",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!validateReviewForm()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingReview(true);

    // Content moderation
    const moderationResult = contentModerationService.moderateContent(review.trim(), userRating);
    
    if (!moderationResult.isAppropriate) {
      setIsSubmittingReview(false);
      toast({
        title: "Contenido inapropiado detectado",
        description: moderationResult.reason,
        variant: "destructive",
      });
      
      // Show specific suggestions
      if (moderationResult.suggestedChanges) {
        setReviewErrors(moderationResult.suggestedChanges);
      }
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Reseña enviada:", { rating: userRating, review: review.trim() });
    setUserRating(0);
    setReview("");
    setReviewErrors([]);
    setIsSubmittingReview(false);
    
    toast({
      title: "Reseña enviada",
      description: "Tu reseña ha sido enviada exitosamente",
    });
  };

  const handleStoreClick = (productUrl: string, storeName: string) => {
    window.open(productUrl, '_blank');
    toast({
      title: "Redirigiendo a " + storeName,
      description: "Se abrirá una nueva pestaña con el producto",
    });
  };

  // Convert product for wishlist dialog
  const wishlistProduct = {
    id: product.id,
    name: product.name,
    image: product.image,
    currentPrice: 7596.50,
  };

  const validateReviewForm = () => {
    const errors: string[] = [];

    if (userRating === 0) {
      errors.push("La calificación es obligatoria");
    }

    if (!review.trim()) {
      errors.push("El comentario es obligatorio");
    }

    setReviewErrors(errors);
    return errors.length === 0;
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.brand} • {product.model}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">({product.totalReviews} reseñas)</span>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">Mejor precio:</span>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-green-500" />
                  <span className="text-green-500 font-medium">-8% esta semana</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">
                S/ 7,596.50
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Disponible en 4 tiendas
              </p>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleWishlistClick}
                className="flex-1"
              >
                <Heart className="h-5 w-5 mr-2" />
                Agregar a Deseos
              </Button>
              <Button className="flex-1">
                Ver Mejor Oferta
              </Button>
            </div>

            <p className="text-muted-foreground">{product.description}</p>
          </div>
        </div>

        <Tabs defaultValue="stores" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stores">Tiendas</TabsTrigger>
            <TabsTrigger value="price-history">Historial</TabsTrigger>
            <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
            <TabsTrigger value="reviews">Reseñas</TabsTrigger>
          </TabsList>

          <TabsContent value="stores" className="space-y-4">
            <div className="grid gap-4">
              {stores.map((store, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Store className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">{store.name}</h3>
                          <p className="text-sm text-muted-foreground">{store.shipping}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">{store.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">S/ {store.price.toFixed(2)}</div>
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleStoreClick(store.productUrl, store.name)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver en {store.name}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="price-history">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Precios</CardTitle>
              </CardHeader>
              <CardContent>
                <PriceChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications">
            <Card>
              <CardHeader>
                <CardTitle>Especificaciones Técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {/* Escribir reseña */}
            <Card>
              <CardHeader>
                <CardTitle>Escribir una Reseña</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isLoggedIn ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Debes iniciar sesión para escribir una reseña
                    </p>
                    <Button variant="outline" onClick={handleLoginRedirect}>
                      Iniciar Sesión
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Calificación *
                        {reviewErrors.some(error => error.includes("calificación")) && (
                          <span className="text-red-500 ml-1">- Campo obligatorio</span>
                        )}
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setUserRating(star)}
                            className="p-1"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= userRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Comentario *
                        {reviewErrors.some(error => error.includes("comentario")) && (
                          <span className="text-red-500 ml-1">- Campo obligatorio</span>
                        )}
                      </label>
                      <Textarea
                        placeholder="Escribe tu reseña del producto..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className={reviewErrors.some(error => error.includes("comentario")) ? "border-red-500" : ""}
                        rows={4}
                        maxLength={500}
                      />
                      <div className="text-sm text-muted-foreground mt-1">
                        {review.length}/500 caracteres
                      </div>
                    </div>

                    {/* Error messages */}
                    {reviewErrors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <h4 className="text-sm font-medium text-red-800 mb-2">
                          Por favor corrige los siguientes problemas:
                        </h4>
                        <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                          {reviewErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button 
                      onClick={submitReview}
                      disabled={isSubmittingReview}
                    >
                      {isSubmittingReview ? "Enviando..." : "Enviar Reseña"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Reseñas existentes */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{review.user}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddToWishlistDialog
        open={showWishlistDialog}
        onClose={() => setShowWishlistDialog(false)}
        product={wishlistProduct}
        wishlists={mockWishlists}
        onAddToWishlist={handleAddToWishlist}
        onCreateWishlistAndAdd={handleCreateWishlistAndAdd}
      />
    </div>
  );
};

export default ProductDetail;
