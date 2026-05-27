import { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => item && item.medicine && item.medicine._id);
    } catch (e) {
      console.error("Failed to parse cart items from localStorage:", e);
      return [];
    }
  });

  const [showCartDrawer, setShowCartDrawer] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Item to Cart
  const addToCart = (medicine) => {
    if (!medicine || !medicine._id) return;
    setCartItems((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const existing = safePrev.find((item) => item && item.medicine && item.medicine._id === medicine._id);
      if (existing) {
        return safePrev.map((item) =>
          item && item.medicine && item.medicine._id === medicine._id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        );
      }
      return [...safePrev, { medicine, quantity: 1 }];
    });
  };

  // Remove Item from Cart
  const removeFromCart = (medicineId) => {
    if (!medicineId) return;
    setCartItems((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.filter((item) => item && item.medicine && item.medicine._id !== medicineId);
    });
  };

  // Update Item Quantity
  const updateQuantity = (medicineId, quantity) => {
    if (!medicineId) return;
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCartItems((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.map((item) =>
        item && item.medicine && item.medicine._id === medicineId ? { ...item, quantity } : item
      );
    });
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate Total Quantity
  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item ? item.quantity || 0 : 0), 0)
    : 0;

  // Calculate Total Price
  const cartTotal = Array.isArray(cartItems)
    ? cartItems.reduce(
        (sum, item) =>
          sum + (item && item.medicine ? (item.medicine.price || 0) * (item.quantity || 0) : 0),
        0
      )
    : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        showCartDrawer,
        setShowCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

