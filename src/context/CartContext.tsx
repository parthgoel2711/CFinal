"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export interface CustomMeasurements {
  unit: "in" | "cm";
  top?: {
    topLength?: number;
    chest?: number;
    tummy?: number;
    hip?: number;
    shoulder?: number;
    sleeve?: number;
  };
  bottom?: {
    bottomLength?: number;
    waist?: number;
    hip?: number;
    thigh?: number;
  };
  notes?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  customMeasurements?: CustomMeasurements;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  // Load cart on start or auth change (guest or user)
  useEffect(() => {
    if (user) {
      // Logged in: Load from database
      fetch(`/api/cart?username=${user.username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.cart) {
            setItems(data.cart);
          }
        })
        .catch((err) => console.error("Error loading user cart:", err));
    } else {
      // Guest: Load from localStorage
      const guestCart = localStorage.getItem("tailors_guest_cart");
      if (guestCart) {
        try {
          setItems(JSON.parse(guestCart));
        } catch (e) {
          console.error("Error parsing guest cart", e);
        }
      } else {
        setItems([]);
      }
    }
  }, [user]);

  // Sync cart changes to server (for logged-in user) or localStorage (for guest)
  useEffect(() => {
    if (user) {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, cart: items }),
      }).catch((err) => console.error("Error syncing cart:", err));
    } else {
      localStorage.setItem("tailors_guest_cart", JSON.stringify(items));
    }
  }, [items, user]);

  const areMeasurementsEqual = (a?: CustomMeasurements, b?: CustomMeasurements) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a.unit !== b.unit) return false;
    if (a.notes !== b.notes) return false;
    
    const topKeys = ["topLength", "chest", "tummy", "hip", "shoulder", "sleeve"] as const;
    for (const key of topKeys) {
      if (a.top?.[key] !== b.top?.[key]) return false;
    }
    
    const bottomKeys = ["bottomLength", "waist", "hip", "thigh"] as const;
    for (const key of bottomKeys) {
      if (a.bottom?.[key] !== b.bottom?.[key]) return false;
    }
    
    return true;
  };

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(item => 
        item.productId === newItem.productId && 
        item.size === newItem.size &&
        (newItem.size !== "Custom" || areMeasurementsEqual(item.customMeasurements, newItem.customMeasurements))
      );
      if (existing) {
        return prev.map(item => 
          item.id === existing.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...prev, newItem];
    });
    toast.success("Added to cart");
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => 
      prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, setItems, addToCart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal }}>
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
