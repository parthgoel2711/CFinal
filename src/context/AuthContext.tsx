"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "@/lib/db";

interface User {
  username: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string, currentCart: CartItem[]) => Promise<CartItem[]>;
  register: (name: string, username: string, password: string, currentCart: CartItem[]) => Promise<CartItem[]>;
  logout: () => void;
  updateProfile: (profileData: { firstName: string; lastName: string; email: string; phone: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("tailors_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, currentCart: CartItem[]): Promise<CartItem[]> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    const loggedInUser = { 
      username: data.username, 
      name: data.name,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone
    };
    setUser(loggedInUser);
    localStorage.setItem("tailors_user", JSON.stringify(loggedInUser));

    return data.cart || [];
  };

  const register = async (name: string, username: string, password: string, currentCart: CartItem[]): Promise<CartItem[]> => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, name, cart: currentCart }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    const loggedInUser = { 
      username: data.username, 
      name: data.name,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone
    };
    setUser(loggedInUser);
    localStorage.setItem("tailors_user", JSON.stringify(loggedInUser));

    return data.cart || [];
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tailors_user");
    localStorage.removeItem("tailors_guest_cart");
  };

  const updateProfile = async (profileData: { firstName: string; lastName: string; email: string; phone: string }) => {
    if (!user) return;
    const response = await fetch("/api/auth/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, ...profileData }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to update profile");
    }

    const updatedUser = { 
      username: data.username, 
      name: data.name,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone
    };
    setUser(updatedUser);
    localStorage.setItem("tailors_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
