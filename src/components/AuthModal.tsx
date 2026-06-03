"use client";

import React, { useState } from "react";
import { X, User, Lock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const { items, setItems } = useCart();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Register user and upload current guest cart
        const dbCart = await register(name, username, password, items);
        // Merge guest items with database items
        setItems((prevLocal) => {
          const merged = [...dbCart];
          prevLocal.forEach((localItem) => {
            const exists = merged.find(
              (dbItem) => dbItem.productId === localItem.productId && dbItem.size === localItem.size
            );
            if (exists) {
              exists.quantity = Math.max(exists.quantity, localItem.quantity);
            } else {
              merged.push(localItem);
            }
          });
          return merged;
        });
      } else {
        // Login user
        const dbCart = await login(username, password, items);
        // Merge guest items with database items
        setItems((prevLocal) => {
          const merged = [...dbCart];
          prevLocal.forEach((localItem) => {
            const exists = merged.find(
              (dbItem) => dbItem.productId === localItem.productId && dbItem.size === localItem.size
            );
            if (exists) {
              exists.quantity = Math.max(exists.quantity, localItem.quantity);
            } else {
              merged.push(localItem);
            }
          });
          return merged;
        });
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setUsername("");
        setPassword("");
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTab = (signUpState: boolean) => {
    setIsSignUp(signUpState);
    setError(null);
    setName("");
    setUsername("");
    setPassword("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/95"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
            className="relative w-full max-w-4xl bg-[#050505] border border-[#222] rounded-lg overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.9)]"
          >
            {/* Left side Image & Visuals */}
            <div className="hidden md:block w-5/12 relative overflow-hidden bg-[#111]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
              <Image
                src="/images/hero_suit.png"
                alt="Genial Stoffa Suit"
                fill
                className="object-cover opacity-60"
                sizes="(max-width: 768px) 0vw, 40vw"
              />
              <div className="absolute bottom-10 left-8 z-20 pr-8">
                <span className="text-[#C6A87C] text-[10px] uppercase tracking-[0.3em] mb-2 block">Sartorial Account</span>
                <h3 className="text-2xl font-serif text-white mb-2 leading-tight">Synchronize Your Collection</h3>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">
                  Log in to track your cart, measurements, and curated suits across all of your devices seamlessly.
                </p>
              </div>
            </div>

            {/* Right side Auth Form */}
            <div className="w-full md:w-7/12 p-8 sm:p-12 relative flex flex-col justify-center">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors bg-[#111]/50 p-2 rounded-full hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.div
                    key="auth-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-[#222] mb-8">
                      <button
                        onClick={() => toggleTab(false)}
                        className={`pb-4 text-sm uppercase tracking-widest font-semibold transition-all relative ${
                          !isSignUp ? "text-[#C6A87C]" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Sign In
                        {!isSignUp && (
                          <motion.div
                            layoutId="active-tab-line"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C6A87C]"
                          />
                        )}
                      </button>
                      <button
                        onClick={() => toggleTab(true)}
                        className={`pb-4 text-sm uppercase tracking-widest font-semibold transition-all relative ${
                          isSignUp ? "text-[#C6A87C]" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Create Account
                        {isSignUp && (
                          <motion.div
                            layoutId="active-tab-line"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C6A87C]"
                          />
                        )}
                      </button>
                    </div>

                    <h2 className="text-2xl font-serif text-white mb-2">
                      {isSignUp ? "Join Genial Stoffa" : "Welcome Back"}
                    </h2>
                    <p className="text-zinc-400 mb-8 text-xs font-light">
                      {isSignUp
                        ? "Register credentials to synchronize your shopping cart on other devices."
                        : "Sign in with your credentials to load your saved selections."}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name (Only for Sign Up) */}
                      {isSignUp && (
                        <div className="relative group">
                          <label htmlFor="name" className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">
                            Full Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#C6A87C] transition-colors">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              id="name"
                              required={isSignUp}
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              onFocus={() => setFocusedField("name")}
                              onBlur={() => setFocusedField(null)}
                              className="w-full bg-transparent border-b border-[#222] text-white pl-10 pr-4 py-3 focus:outline-none transition-colors"
                              placeholder="Enter your name"
                              disabled={isLoading}
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-[1px] bg-[#C6A87C]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === "name" ? "100%" : 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Username */}
                      <div className="relative group">
                        <label htmlFor="username" className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">
                          Username
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#C6A87C] transition-colors">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            id="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setFocusedField("username")}
                            onBlur={() => setFocusedField(null)}
                            className="w-full bg-transparent border-b border-[#222] text-white pl-10 pr-4 py-3 focus:outline-none transition-colors"
                            placeholder="Enter username"
                            disabled={isLoading}
                          />
                          <motion.div 
                            className="absolute bottom-0 left-0 h-[1px] bg-[#C6A87C]"
                            initial={{ width: 0 }}
                            animate={{ width: focusedField === "username" ? "100%" : 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="relative group">
                        <label htmlFor="password" className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#C6A87C] transition-colors">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedField("password")}
                            onBlur={() => setFocusedField(null)}
                            className="w-full bg-transparent border-b border-[#222] text-white pl-10 pr-4 py-3 focus:outline-none transition-colors"
                            placeholder="Enter password"
                            disabled={isLoading}
                          />
                          <motion.div 
                            className="absolute bottom-0 left-0 h-[1px] bg-[#C6A87C]"
                            initial={{ width: 0 }}
                            animate={{ width: focusedField === "password" ? "100%" : 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      {/* Error Msg */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs font-light bg-red-950/20 border border-red-900/50 px-4 py-3 rounded-sm"
                        >
                          {error}
                        </motion.div>
                      )}

                      {/* Submit */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#C6A87C] text-black font-semibold py-4 px-6 mt-4 rounded-sm hover:bg-white transition-colors uppercase tracking-widest text-xs flex justify-center items-center disabled:bg-zinc-700 disabled:text-zinc-400"
                      >
                        {isLoading ? (
                          <span className="inline-block animate-pulse">Processing...</span>
                        ) : isSignUp ? (
                          "Create Account"
                        ) : (
                          "Sign In"
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="auth-success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="h-full flex flex-col items-center justify-center py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <CheckCircle2 className="w-16 h-16 text-[#C6A87C] mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
                    </motion.div>
                    <h2 className="text-2xl font-serif text-white mb-2">
                      {isSignUp ? "Registration Successful" : "Welcome Back"}
                    </h2>
                    <p className="text-zinc-400 text-xs max-w-xs leading-relaxed font-light">
                      Successfully authenticated as <span className="text-white font-medium">{username}</span>. Your shopping cart is now synchronized.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
