"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, LogOut, ChevronDown, Settings } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import BookingModal from "./BookingModal";
import AuthModal from "./AuthModal";
import ProfileModal from "./ProfileModal";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { items, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed w-full z-40 bg-[#050505]/90 backdrop-blur-md border-b border-[#222]"
      >
        <div className="max-w-[1600px] mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/">
              <div className="text-2xl font-serif tracking-widest text-white uppercase hover:text-[#C6A87C] transition-colors">
                GENIAL STOFFA
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/shop" className="text-sm font-medium uppercase tracking-[0.1em] text-zinc-400 hover:text-white transition-colors">
                Collection
              </Link>
              <Link href="/#contact" className="text-sm font-medium uppercase tracking-[0.1em] text-zinc-400 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* User Session Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-[#C6A87C] transition-colors p-2 text-sm uppercase tracking-wider font-medium cursor-pointer"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{user.name || user.username}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-[#0A0A0A] border border-[#222] rounded-sm shadow-xl z-20 py-2"
                      >
                        <div className="px-4 py-2 border-b border-[#222] text-[10px] text-zinc-500 uppercase tracking-wider">
                          Sartorial Session
                        </div>
                        <button
                          onClick={() => {
                            setIsProfileOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-zinc-400 hover:text-[#C6A87C] hover:bg-[#111] transition-all flex items-center gap-3 cursor-pointer"
                        >
                          <Settings className="w-4 h-4" /> Edit Profile
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-zinc-400 hover:text-red-400 hover:bg-[#111] transition-all flex items-center gap-3 cursor-pointer border-t border-[#222]/50"
                        >
                          <LogOut className="w-4 h-4" /> Log Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="text-zinc-400 hover:text-[#C6A87C] transition-colors p-2 cursor-pointer"
                aria-label="Sign In"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-zinc-400 hover:text-[#C6A87C] transition-colors p-2 cursor-pointer"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#C6A87C] text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] hover:text-[#C6A87C] transition-colors text-white cursor-pointer"
            >
              Consultation
            </button>
          </div>
        </div>
      </motion.nav>
      
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
