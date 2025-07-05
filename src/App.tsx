
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Notifications from "./pages/Notifications";
import NotificationSettings from "./pages/NotificationSettings";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import SearchHistory from "./pages/SearchHistory";
import ReviewHistory from "./pages/ReviewHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/wishlist/:id" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notification-settings" element={<NotificationSettings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/search-history" element={<SearchHistory />} />
          <Route path="/review-history" element={<ReviewHistory />} />
          <Route path="/category/:category" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
