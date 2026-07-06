"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, LogOut, ChevronDown, Settings, Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsHomePage(window.location.pathname === "/");
      const handleScroll = () => {
        setIsScrolled(window.scrollY > window.innerHeight);
      };
      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const isTransparent = isHomePage && !isScrolled && !isMobileMenuOpen;

  const textColor = isTransparent 
    ? "text-white/90 hover:text-white" 
    : "text-[#4B5563] hover:text-[#111111]";

  const textHeadingColor = isTransparent 
    ? "text-white" 
    : "text-[#111111]";

  const iconColor = isTransparent 
    ? "text-white hover:text-white/80" 
    : "text-[#4B5563] hover:text-[#111111]";

  const activeUnderline = isTransparent 
    ? "after:bg-white" 
    : "after:bg-[#111111]";

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path === "/") {
        const hasPoppedHome = localStorage.getItem("hasAutoPoppedUpHome");
        if (!hasPoppedHome) {
          const timer = setTimeout(() => {
            setIsAuthOpen(true);
            localStorage.setItem("hasAutoPoppedUpHome", "true");
          }, 1500);
          return () => clearTimeout(timer);
        }
      } else if (path === "/shop") {
        const hasPoppedShop = localStorage.getItem("hasAutoPoppedUpShop");
        if (!hasPoppedShop) {
          const timer = setTimeout(() => {
            setIsAuthOpen(true);
            localStorage.setItem("hasAutoPoppedUpShop", "true");
          }, 1500);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [user]);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed w-full z-40 transition-all duration-500 ${
          isTransparent 
            ? "bg-transparent border-transparent" 
            : "bg-white/70 backdrop-blur-xl border-b border-[#111111]/5"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/" aria-label="Genial Stoffa Home" className="flex items-center gap-2 md:gap-3 group">
              <div className="relative h-20 w-20 md:h-24 md:w-24 group-hover:opacity-80 transition-opacity duration-300 flex-shrink-0">
                <Image
                  src="/logo-21.png"
                  alt="Genial Stoffa Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <span className={`text-xs sm:text-sm md:text-base font-serif tracking-[0.1em] sm:tracking-[0.2em] uppercase font-medium line-clamp-1 sm:line-clamp-none whitespace-nowrap transition-colors duration-500 ${textHeadingColor}`}>
                Genial Stoffa
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-10 ml-4">
              <Link href="/shop" className={`text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-500 relative after:absolute after:-bottom-1.5 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:transition-all after:duration-500 ease-out ${textColor} ${activeUnderline}`}>
                Collection
              </Link>
              <Link href="/#contact" className={`text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-500 relative after:absolute after:-bottom-1.5 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:transition-all after:duration-500 ease-out ${textColor} ${activeUnderline}`}>
                Contact Us
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
            {/* User Session Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 transition-colors duration-500 p-2 text-xs uppercase tracking-[0.15em] font-medium cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:transition-all after:duration-500 ease-out ${textColor} ${activeUnderline}`}
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
                        className="absolute right-0 mt-2 w-48 bg-[#FAFAFA] border border-[#E5E5E5] rounded-sm shadow-xl z-20 py-2"
                      >
                        <div className="px-4 py-2 border-b border-[#E5E5E5] text-[10px] text-[#4B5563] uppercase tracking-wider">
                          Sartorial Session
                        </div>
                        <button
                          onClick={() => {
                            setIsProfileOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-[#4B5563] hover:text-[#111111] hover:bg-[#F3F4F6] transition-all flex items-center gap-3 cursor-pointer"
                        >
                          <Settings className="w-4 h-4" /> Edit Profile
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-[#4B5563] hover:text-red-500 hover:bg-[#F3F4F6] transition-all flex items-center gap-3 cursor-pointer border-t border-[#E5E5E5]"
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
                className={`transition-colors duration-500 p-2 cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:transition-all after:duration-300 ${iconColor} ${activeUnderline}`}
                aria-label="Sign In"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative transition-colors duration-500 p-2 cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:transition-all after:duration-500 ease-out ${iconColor} ${activeUnderline}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className={`hidden md:inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-500 cursor-pointer relative after:absolute after:-bottom-1.5 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:transition-all after:duration-500 ease-out ${textHeadingColor} ${activeUnderline}`}
            >
              Consultation
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={`md:hidden transition-colors duration-500 p-2 cursor-pointer ${iconColor}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white border-b border-[#E5E5E5] px-6"
            >
              <div className="flex flex-col py-6 space-y-6">
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium uppercase tracking-[0.1em] text-[#111111]"
                >
                  Collection
                </Link>
                <Link
                  href="/#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium uppercase tracking-[0.1em] text-[#111111]"
                >
                  Contact Us
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="text-left text-sm font-medium uppercase tracking-[0.1em] text-[#111111]"
                >
                  Book Consultation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
