import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      return;
    }
    const { data } = await API.get("/cart");
    setCart(data);
  };

  useEffect(() => {
    fetchCart().catch(() => setCart({ items: [], totalItems: 0, totalPrice: 0 }));
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await API.post("/cart", { productId, quantity });
    setCart(data);
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await API.put(`/cart/${productId}`, { quantity: Number(quantity) });
    setCart(data);
  };

  const removeFromCart = async (productId) => {
    const { data } = await API.delete(`/cart/${productId}`);
    setCart(data);
  };

  const clearCart = async () => {
    const { data } = await API.delete("/cart");
    setCart(data);
  };

  return <CartContext.Provider value={{ cart, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
