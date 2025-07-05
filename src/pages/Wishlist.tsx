
import Navigation from "@/components/Navigation";
import WishlistManager from "@/components/WishlistManager";

const Wishlist = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <WishlistManager />
      </div>
    </div>
  );
};

export default Wishlist;
