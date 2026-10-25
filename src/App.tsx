import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollManager from "./components/common/ScrollManager";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import ShopDetail from "./pages/ShopDetail";
import ShirtDetail from "./pages/ShirtDetail";
import WishPool from "./pages/WishPool";
import About from "./pages/About";
import ArtDetail from "./pages/ArtDetail";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import Cart from "./components/shop/Cart";
import CartPage from "./pages/CartPage";

import PreOrder from "./pages/PreOrder";
import PreOrderProductDetail from "./pages/PreOrderProductDetail";
import Admin from "./pages/Admin";

import PageSEO from "./components/common/PageSEO";

export default function App() {
  useEffect(() => {
    // Clear any temporary customizer keys and inline style overrides
    try {
      localStorage.removeItem("327art_artist_theme_colors");
      document.documentElement.style.removeProperty("--color-bg-dark");
      document.documentElement.style.removeProperty("--color-bg-mid");
      document.documentElement.style.removeProperty("--color-bg-light");
      document.documentElement.style.removeProperty("--color-gold-end");
      document.documentElement.style.removeProperty("--color-card-bg");
      document.documentElement.style.removeProperty("--color-card-border");
      document.documentElement.style.removeProperty("--bg-dark");
      document.documentElement.style.removeProperty("--bg-light");
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <Router>
      <ScrollManager />
      <LanguageProvider>
        <PageSEO />
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <div className="global-background" />
            <Navbar />
            <Cart />
            <main className="flex-1 w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:id" element={<ArtDetail />} />
                <Route path="/shop/magic-cards" element={<ShopDetail />} />
                <Route path="/shop/t-shirt" element={<ShirtDetail />} />
                <Route path="/wish-pool" element={<WishPool />} />
                <Route path="/pre-order" element={<PreOrder />} />
                <Route path="/pre-order/:id" element={<PreOrderProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </LanguageProvider>
    </Router>
  );
}
