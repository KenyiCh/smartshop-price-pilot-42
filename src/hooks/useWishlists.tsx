
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: number;
  name: string;
  image: string;
  currentPrice: number;
  targetPrice: number;
  category: string;
}

interface Wishlist {
  id: number;
  name: string;
  items: WishlistItem[];
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  currentPrice: number;
}

export const useWishlists = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([
    {
      id: 1,
      name: "Tecnología",
      createdAt: "2024-01-15",
      items: [
        {
          id: 1,
          name: "MacBook Pro 14 M3",
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
          currentPrice: 7596,
          targetPrice: 6840,
          category: "laptop"
        }
      ]
    }
  ]);

  const { toast } = useToast();

  const createWishlist = (name: string): boolean => {
    if (wishlists.length >= 50) {
      toast({
        title: "Límite alcanzado",
        description: "Has alcanzado el número máximo de listas permitidas.",
        variant: "destructive",
      });
      return false;
    }

    if (wishlists.some(list => list.name.toLowerCase() === name.toLowerCase())) {
      toast({
        title: "Nombre duplicado",
        description: "Ya tienes una lista con ese nombre.",
        variant: "destructive",
      });
      return false;
    }

    const newWishlist: Wishlist = {
      id: Date.now(),
      name,
      items: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setWishlists(prev => [...prev, newWishlist]);
    return true;
  };

  const addToWishlist = (wishlistId: number, product: Product) => {
    const newItem: WishlistItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      currentPrice: product.currentPrice,
      targetPrice: product.currentPrice * 0.9, // 10% menos como objetivo por defecto
      category: "general"
    };

    setWishlists(prev => 
      prev.map(wishlist => 
        wishlist.id === wishlistId
          ? { ...wishlist, items: [...wishlist.items, newItem] }
          : wishlist
      )
    );
  };

  const createWishlistAndAdd = (name: string, product: Product) => {
    const newWishlist: Wishlist = {
      id: Date.now(),
      name,
      items: [{
        id: product.id,
        name: product.name,
        image: product.image,
        currentPrice: product.currentPrice,
        targetPrice: product.currentPrice * 0.9,
        category: "general"
      }],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setWishlists(prev => [...prev, newWishlist]);
  };

  const deleteWishlist = (wishlistId: number) => {
    setWishlists(prev => prev.filter(list => list.id !== wishlistId));
  };

  const removeFromWishlist = (wishlistId: number, itemId: number) => {
    setWishlists(prev =>
      prev.map(wishlist =>
        wishlist.id === wishlistId
          ? { ...wishlist, items: wishlist.items.filter(item => item.id !== itemId) }
          : wishlist
      )
    );
  };

  const getWishlistsForSelect = () => {
    return wishlists.map(wishlist => ({
      id: wishlist.id,
      name: wishlist.name,
      itemCount: wishlist.items.length
    }));
  };

  return {
    wishlists,
    createWishlist,
    addToWishlist,
    createWishlistAndAdd,
    deleteWishlist,
    removeFromWishlist,
    getWishlistsForSelect
  };
};
