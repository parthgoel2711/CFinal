"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, removeFromCart, cartTotal, updateQuantity } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({});
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showCheckoutOptions, setShowCheckoutOptions] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckoutClick = () => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setShowCheckoutOptions(true);
    }
  };

  const generateWhatsAppLink = () => {
    if (!user) return "";
    let message = `Hello Genial Stoffa, I would like to place a bespoke order.\n\n`;
    message += `*Customer:* ${user.name || user.username}\n`;
    message += `*Contact:* ${user.username}\n\n`;
    message += `*Order Details:*\n`;
    
    items.forEach((item, idx) => {
      message += `${idx + 1}. *${item.name}* (Size: ${item.size})\n`;
      message += `   Qty: ${item.quantity}\n`;
      if (item.size === "Custom" && item.customMeasurements) {
        const m = item.customMeasurements;
        message += `   *Measurements (${m.unit}):*\n`;
        if (m.top) {
          if (m.top.topLength) message += `   - Top Length: ${m.top.topLength}\n`;
          if (m.top.chest) message += `   - Chest: ${m.top.chest}\n`;
          if (m.top.tummy) message += `   - Tummy: ${m.top.tummy}\n`;
          if (m.top.hip) message += `   - Hip: ${m.top.hip}\n`;
          if (m.top.shoulder) message += `   - Shoulder: ${m.top.shoulder}\n`;
          if (m.top.sleeve) message += `   - Sleeve: ${m.top.sleeve}\n`;
        }
        if (m.bottom) {
          if (m.bottom.bottomLength) message += `   - Bottom Length: ${m.bottom.bottomLength}\n`;
          if (m.bottom.waist) message += `   - Waist: ${m.bottom.waist}\n`;
          if (m.bottom.hip) message += `   - Bottom Hip: ${m.bottom.hip}\n`;
          if (m.bottom.thigh) message += `   - Thigh: ${m.bottom.thigh}\n`;
        }
        if (m.notes) {
          message += `   - Notes: ${m.notes}\n`;
        }
      }
      message += `\n`;
    });
    

    message += `Please review these details and let me know the next steps for my fittings. Thank you!`;
    
    return `https://wa.me/919122782023?text=${encodeURIComponent(message)}`;
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCartOpen(false);
                setShowCheckoutOptions(false);
              }}
              className="fixed inset-0 bg-[#111111]/50 backdrop-blur-sm z-50"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FAFAFA] border-l border-[#E5E5E5] shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
                <h2 className="text-xl font-serif text-[#111111] tracking-widest uppercase">Your Cart</h2>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    setShowCheckoutOptions(false);
                  }}
                  className="p-2 text-[#6B7280] hover:text-[#111111] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <p className="text-[#6B7280] font-light mb-4">Your collection is currently empty.</p>
                    <button 
                      onClick={() => {
                        setIsCartOpen(false);
                        router.push("/shop");
                      }}
                      className="text-[#111111] uppercase tracking-[0.1em] text-sm hover:text-[#111111] transition-colors border-b border-[#111111] pb-1 cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 bg-[#F3F4F6] p-4 rounded-sm border border-[#E5E5E5]">
                        <div 
                          className="relative w-24 h-32 bg-[#D1CCC5] rounded-sm overflow-hidden shrink-0 cursor-pointer"
                          onClick={() => {
                            setIsCartOpen(false);
                            router.push(`/shop/${item.productId}`);
                          }}
                        >
                          <Image src={item.image} alt={item.name} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h3 
                                className="text-[#111111] font-serif text-lg cursor-pointer hover:text-[#4B5563] transition-colors"
                                onClick={() => {
                                  setIsCartOpen(false);
                                  router.push(`/shop/${item.productId}`);
                                }}
                              >
                                {item.name}
                              </h3>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-[#6B7280] hover:text-[#111111] transition-colors p-1"
                                aria-label="Remove item"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <p className="text-[#6B7280] text-xs tracking-widest uppercase mb-2">Size: {item.size}</p>
                            
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-[#6B7280] text-[10px] tracking-wider uppercase font-semibold">Qty:</span>
                              <div className="flex items-center bg-white border border-[#E5E5E5] rounded-sm overflow-hidden h-7">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-full flex items-center justify-center text-[#4B5563] hover:text-[#111111] hover:bg-[#F3F4F6] transition-colors cursor-pointer text-xs focus:outline-none select-none active:bg-zinc-200 border-r border-[#E5E5E5]"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center bg-transparent text-[#111111] font-medium text-[10px] select-none">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-full flex items-center justify-center text-[#4B5563] hover:text-[#111111] hover:bg-[#F3F4F6] transition-colors cursor-pointer text-xs focus:outline-none select-none active:bg-zinc-200 border-l border-[#E5E5E5]"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            {item.size === "Custom" && item.customMeasurements && (
                              <div className="mt-2 pt-2 border-t border-[#E5E5E5]">
                                <button 
                                  onClick={() => toggleExpand(item.id)}
                                  className="flex items-center gap-1 text-[10px] text-[#111111] uppercase tracking-wider hover:text-[#111111] transition-colors cursor-pointer focus:outline-none"
                                >
                                  <Ruler className="w-3 h-3" />
                                  <span>{expandedItems[item.id] ? "Hide Sizes" : "View Sizes"}</span>
                                  {expandedItems[item.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                                
                                {expandedItems[item.id] && (
                                  <div className="mt-2 text-[10px] text-[#4B5563] space-y-1 bg-[#FAFAFA] p-2 border border-[#E5E5E5] rounded-sm font-light">
                                    {item.customMeasurements.top && (
                                      <div>
                                        <p className="text-[9px] uppercase tracking-wider text-[#6B7280] font-semibold mb-0.5">Top Details</p>
                                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                                          {item.customMeasurements.top.topLength && <p>Top Length: {item.customMeasurements.top.topLength}{item.customMeasurements.unit}</p>}
                                          {item.customMeasurements.top.chest && <p>Chest: {item.customMeasurements.top.chest}{item.customMeasurements.unit}</p>}
                                          {item.customMeasurements.top.tummy && <p>Tummy: {item.customMeasurements.top.tummy}{item.customMeasurements.unit}</p>}
                                          {item.customMeasurements.top.hip && <p>Hip: {item.customMeasurements.top.hip}{item.customMeasurements.unit}</p>}
                                          {item.customMeasurements.top.shoulder && <p>Shoulder: {item.customMeasurements.top.shoulder}{item.customMeasurements.unit}</p>}
                                          {item.customMeasurements.top.sleeve && <p>Sleeve: {item.customMeasurements.top.sleeve}{item.customMeasurements.unit}</p>}
                                        </div>
                                      </div>
                                    )}
                                    {item.customMeasurements.bottom && (
                                      <div className={item.customMeasurements.top ? "mt-2 pt-2 border-t border-[#E5E5E5]" : ""}>
                                        <p className="text-[9px] uppercase tracking-wider text-[#6B7280] font-semibold mb-0.5">Bottom Details</p>
                                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                                          {item.customMeasurements.bottom.bottomLength && <p>Length: {item.customMeasurements.bottom.bottomLength}{item.customMeasurements.unit}</p>}
                                          {item.customMeasurements.bottom.waist && <p>Waist: {item.customMeasurements.bottom.waist}{item.customMeasurements.unit}</p>}
                                          {item.customMeasurements.bottom.hip && <p>Hip: {item.customMeasurements.bottom.hip}{item.customMeasurements.unit}</p>}
                                          {item.customMeasurements.bottom.thigh && <p>Thigh: {item.customMeasurements.bottom.thigh}{item.customMeasurements.unit}</p>}
                                        </div>
                                      </div>
                                    )}
                                    {item.customMeasurements.notes && (
                                      <div className="mt-1.5 pt-1.5 border-t border-[#E5E5E5]">
                                        <p className="italic text-[#6B7280] font-light text-[9px] break-words">Notes: {item.customMeasurements.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-[#E5E5E5] bg-white">
                  <div className="flex justify-between text-[#111111] font-serif text-xl mb-6">
                    <span>Enquiry List</span>
                  </div>
                  
                  {showCheckoutOptions ? (
                    <div className="space-y-4">
                      <p className="text-[#4B5563] text-xs font-light leading-relaxed mb-2">
                        To enquire about your cart or place a bespoke order, connect directly with our master tailors on WhatsApp. We will review your measurements, fabric preferences, and finalize your fitting details.
                      </p>
                      <a 
                        href={generateWhatsAppLink()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] text-[#111111] py-4 uppercase tracking-[0.2em] font-semibold text-xs hover:bg-[#20ba5a] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer rounded-sm"
                      >
                        <MessageSquare className="w-4 h-4 fill-current" /> Enquire on WhatsApp
                      </a>
                      <button 
                        onClick={() => setShowCheckoutOptions(false)} 
                        className="w-full text-[#6B7280] hover:text-[#111111] text-xs uppercase tracking-widest py-2 transition-colors cursor-pointer focus:outline-none"
                      >
                        Back to Cart
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleCheckoutClick}
                      className="w-full bg-[#111111] text-white py-4 uppercase tracking-[0.2em] font-semibold text-sm hover:bg-[#111111] transition-all duration-300 cursor-pointer"
                    >
                      Enquire / Checkout
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
