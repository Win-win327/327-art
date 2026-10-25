import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { 
  ShippingDestination, 
  DEFAULT_DESTINATION, 
  SHIPPING_DESTINATIONS,
  calculateShipping, 
  CART_DISCOUNT_THRESHOLD, 
  CART_DISCOUNT_RATE,
  DOMESTIC_FREE_SHIPPING_THRESHOLD
} from "../config/shipping";

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  titleEn?: string;
  titleJa?: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  countryId?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  cartCount: number;
  cartDiscount: number;
  cartShipping: number;
  cartShippingOriginal: number;
  cartShippingDiscount: number;
  cartFinalTotal: number;
  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;
  selectedDestination: ShippingDestination;
  setSelectedDestination: (dest: ShippingDestination) => void;
  isInternationalShipping: boolean;
  shippingNotice: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    let parsedCart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
    
    // Enforce correct pricing for items currently in cart
    parsedCart = parsedCart.map(item => {
      if (item.productId === "shirt-unicorn" || item.id.includes("shirt-unicorn") || item.productId.startsWith("po-") || item.id.startsWith("po-")) {
        return { ...item, price: 1280 };
      }
      if (item.productId === "magic-cards" || item.id.includes("magic-cards")) {
        return { ...item, price: 1280 };
      }
      return item;
    });

    return parsedCart;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  // 運送國家與地區設定（預設台灣本島）
  const [selectedDestination, setSelectedDestinationState] = useState<ShippingDestination>(() => {
    try {
      const savedDestId = localStorage.getItem("selected_shipping_dest");
      if (savedDestId) {
        const found = SHIPPING_DESTINATIONS.find(d => d.id === savedDestId);
        if (found) return found;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_DESTINATION;
  });

  const setSelectedDestination = (dest: ShippingDestination) => {
    setSelectedDestinationState(dest);
    try {
      localStorage.setItem("selected_shipping_dest", dest.id);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  // 滿 $3,000 打 9 折 (省 10%)
  const cartDiscount = cartTotal >= CART_DISCOUNT_THRESHOLD 
    ? Math.floor(cartTotal * CART_DISCOUNT_RATE) 
    : 0;

  // 運費計算（依據所選國家與地區）
  const shippingResult = calculateShipping(cartTotal, selectedDestination);
  const cartShipping = cart.length === 0 ? 0 : shippingResult.finalFee;
  const cartShippingOriginal = shippingResult.originalFee;
  const cartShippingDiscount = shippingResult.discount;
  const isInternationalShipping = selectedDestination.isInternational;
  const shippingNotice = selectedDestination.isInternational
    ? "國際運送每筆現折 NT$ 100 禮遇已套用"
    : (cartTotal >= DOMESTIC_FREE_SHIPPING_THRESHOLD ? "台灣境內滿 NT$ 2,000 享免運費" : "未達免運門檻");

  // 最終結帳總金額
  const cartFinalTotal = cart.length === 0 ? 0 : Math.max(0, cartTotal - cartDiscount + cartShipping);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
        cartDiscount,
        cartShipping,
        cartShippingOriginal,
        cartShippingDiscount,
        cartFinalTotal,
        customerInfo,
        setCustomerInfo,
        selectedDestination,
        setSelectedDestination,
        isInternationalShipping,
        shippingNotice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
