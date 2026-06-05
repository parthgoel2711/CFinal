"use client";

import React, { useState } from "react";
import { X, User, Lock, CheckCircle2, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import toast from "react-hot-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const { items, setItems } = useCart();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
        const dbCart = await register(name, email, password, email, phone, items);
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
        const dbCart = await login(email, password, items);
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
      toast.success(isSignUp ? "Account created successfully" : "Signed in successfully");
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setEmail("");
        setPhone("");
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
    setEmail("");
    setPhone("");
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#111111]/50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-[#E5E5E5] rounded-lg overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.9)]"
          >
            {/* Left side Image & Visuals */}
            <div className="hidden md:block w-5/12 relative overflow-hidden bg-[#F3F4F6]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
              <Image
                src="/images/hero_suit.png"
                alt="Genial Stoffa Suit"
                fill
                className="object-cover opacity-60"
                sizes="(max-width: 768px) 0vw, 40vw"
              />
              <div className="absolute bottom-10 left-8 z-20 pr-8">
                <span className="text-zinc-300 text-[10px] uppercase tracking-[0.3em] mb-2 block drop-shadow-md">Sartorial Account</span>
                <h3 className="text-2xl font-serif text-white mb-2 leading-tight drop-shadow-md">Synchronize Your Collection</h3>
                <p className="text-zinc-300 text-xs font-light leading-relaxed drop-shadow-md">
                  Log in to track your cart, measurements, and curated suits across all of your devices seamlessly.
                </p>
              </div>
            </div>

            {/* Right side Auth Form */}
            <div className="w-full md:w-7/12 p-6 sm:p-8 relative flex flex-col justify-center overflow-y-auto no-scrollbar">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-[#6B7280] hover:text-[#111111] transition-colors bg-[#F3F4F6]/50 p-2 rounded-full hover:bg-zinc-100"
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
                    <div className="flex gap-6 border-b border-[#E5E5E5] mb-5">
                      <button
                        onClick={() => toggleTab(false)}
                        className={`pb-4 text-sm uppercase tracking-widest font-semibold transition-all relative ${
                          !isSignUp ? "text-[#111111]" : "text-[#6B7280] hover:text-zinc-300"
                        }`}
                      >
                        Sign In
                        {!isSignUp && (
                          <motion.div
                            layoutId="active-tab-line"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111]"
                          />
                        )}
                      </button>
                      <button
                        onClick={() => toggleTab(true)}
                        className={`pb-4 text-sm uppercase tracking-widest font-semibold transition-all relative ${
                          isSignUp ? "text-[#111111]" : "text-[#6B7280] hover:text-zinc-300"
                        }`}
                      >
                        Create Account
                        {isSignUp && (
                          <motion.div
                            layoutId="active-tab-line"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111]"
                          />
                        )}
                      </button>
                    </div>

                    <h2 className="text-2xl font-serif text-[#111111] mb-2">
                      {isSignUp ? "Join Genial Stoffa" : "Welcome Back"}
                    </h2>
                    <p className="text-[#4B5563] mb-5 text-xs font-light">
                      {isSignUp
                        ? "Register credentials to synchronize your shopping cart on other devices."
                        : "Sign in with your credentials to load your saved selections."}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name (Only for Sign Up) */}
                      {isSignUp && (
                        <div className="relative group">
                          <label htmlFor="name" className="block text-[10px] font-medium text-[#4B5563] uppercase tracking-wider mb-1">
                            Full Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] group-focus-within:text-[#111111] transition-colors">
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
                              className="w-full bg-transparent border-b border-[#E5E5E5] text-[#111111] pl-10 pr-4 py-2 focus:outline-none transition-colors"
                              placeholder="Enter your name"
                              disabled={isLoading}
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-[1px] bg-[#111111]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === "name" ? "100%" : 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Phone (Only for Sign Up) */}
                      {isSignUp && (
                        <div className="relative group">
                          <label htmlFor="phone" className="block text-[10px] font-medium text-[#4B5563] uppercase tracking-wider mb-1">
                            Phone Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] group-focus-within:text-[#111111] transition-colors">
                              <span className="text-xs font-semibold">+91</span>
                            </div>
                            <input
                              type="tel"
                              id="phone"
                              required={isSignUp}
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              onFocus={() => setFocusedField("phone")}
                              onBlur={() => setFocusedField(null)}
                              className="w-full bg-transparent border-b border-[#E5E5E5] text-[#111111] pl-10 pr-4 py-2 focus:outline-none transition-colors"
                              placeholder="Enter mobile number"
                              disabled={isLoading}
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-[1px] bg-[#111111]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === "phone" ? "100%" : 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Email (Always shown) */}
                      <div className="relative group">
                        <label htmlFor="email" className="block text-[10px] font-medium text-[#4B5563] uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] group-focus-within:text-[#111111] transition-colors">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            className="w-full bg-transparent border-b border-[#E5E5E5] text-[#111111] pl-10 pr-4 py-2 focus:outline-none transition-colors"
                            placeholder="Enter email address"
                            disabled={isLoading}
                          />
                          <motion.div 
                            className="absolute bottom-0 left-0 h-[1px] bg-[#111111]"
                            initial={{ width: 0 }}
                            animate={{ width: focusedField === "email" ? "100%" : 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      {/* Username */}


                      {/* Password */}
                      <div className="relative group">
                        <label htmlFor="password" className="block text-[10px] font-medium text-[#4B5563] uppercase tracking-wider mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] group-focus-within:text-[#111111] transition-colors">
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
                            className="w-full bg-transparent border-b border-[#E5E5E5] text-[#111111] pl-10 pr-4 py-2 focus:outline-none transition-colors"
                            placeholder="Enter password"
                            disabled={isLoading}
                          />
                          <motion.div 
                            className="absolute bottom-0 left-0 h-[1px] bg-[#111111]"
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
                        className="w-full bg-[#111111] text-white font-semibold py-3 px-6 mt-2 rounded-sm hover:bg-[#111111] transition-colors uppercase tracking-widest text-xs flex justify-center items-center disabled:bg-zinc-700 disabled:text-[#4B5563]"
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
                      <CheckCircle2 className="w-16 h-16 text-[#111111] mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
                    </motion.div>
                    <h2 className="text-2xl font-serif text-[#111111] mb-2">
                      {isSignUp ? "Registration Successful" : "Welcome Back"}
                    </h2>
                    <p className="text-[#4B5563] text-xs max-w-xs leading-relaxed font-light">
                      Successfully authenticated. Your shopping cart is now synchronized.
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
