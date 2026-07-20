"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import { useCart } from "@/context/CartContext";
import { products, categories } from "@/data/products";

const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Shop() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<{ [key: string]: string }>({});
  const [filterSticky, setFilterSticky] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setFilterSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredCollection = activeCategory === "All"
    ? products
    : products.filter(item => item.category === activeCategory);

  const handleAddToCart = (product: typeof products[0]) => {
    const size = selectedSize[product.id];
    if (!size) return;
    addToCart({
      id: `${product.id}-${size}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      size,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-zinc-100 font-sans selection:bg-[#111111] selection:text-white">
      <ScrollProgress />
      <Navbar />

      {/* ── Shop Hero Banner ─────────────────────────────────────── */}
      <section className="relative h-[38vh] min-h-[260px] flex items-end pb-12 px-6 overflow-hidden bg-[#111111]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero_suit.png"
            alt="Genial Stoffa traditional and western bespoke collection catalogue"
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/80 to-[#111111]/40" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-[1600px] mx-auto w-full"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-none tracking-tight">
            The Collection
          </h1>
        </motion.div>
      </section>

      {/* Sentinel for sticky filter */}
      <div ref={sentinelRef} className="h-0" />

      {/* ── Sticky Glassmorphism Filter Bar ─────────────────────── */}
      <div
        ref={filterRef}
        className={`z-40 w-full transition-all duration-500 ${
          filterSticky
            ? "sticky top-0 bg-white/80 backdrop-blur-xl border-b border-[#111111]/8 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 py-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex overflow-x-auto md:flex-wrap md:justify-center gap-6 md:gap-10 no-scrollbar"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative whitespace-nowrap text-[10px] md:text-xs uppercase tracking-[0.25em] transition-all duration-400 pb-1.5 flex-shrink-0 font-medium cursor-pointer ${
                  activeCategory === cat
                    ? "text-[#111111]"
                    : "text-[#9CA3AF] hover:text-[#111111]"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="filterUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A84C]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <main className="pb-32 px-6 max-w-[1600px] mx-auto">

        {/* Product count */}
        <div className="flex items-center justify-between py-8 border-b border-[#111111]/8 mb-12">
          <motion.span
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#9CA3AF] text-xs tracking-[0.2em] uppercase"
          >
            {filteredCollection.length} {filteredCollection.length === 1 ? "piece" : "pieces"}
          </motion.span>
          <span className="text-[#9CA3AF] text-xs tracking-[0.2em] uppercase">Made to Measure</span>
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 justify-items-center">
          <AnimatePresence mode="popLayout">
            {filteredCollection.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-16 h-16 border border-[#E5E5E5] flex items-center justify-center mb-8">
                  <Package className="w-7 h-7 text-[#D6D6D6]" />
                </div>
                <p className="font-serif text-2xl text-[#111111] mb-4">Coming Soon</p>
                <p className="text-[#9CA3AF] text-sm font-light tracking-wide max-w-xs">
                  This collection is being curated. Please explore our other offerings.
                </p>
                <button
                  onClick={() => setActiveCategory("All")}
                  className="mt-8 text-[10px] uppercase tracking-[0.25em] text-[#111111] border-b border-[#111111] pb-0.5"
                >
                  View All Pieces
                </button>
              </motion.div>
            ) : (
              filteredCollection.map((product, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.6, delay: idx * 0.04 }}
                  key={product.id}
                  className="group flex flex-col w-full max-w-[340px] mx-auto"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Image container */}
                  <div className="relative aspect-[3/4] w-full bg-[#F5F5F3] overflow-hidden mb-5">
                    <Link href={`/shop/${product.id}`} className="block absolute inset-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={`opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.4s] ease-out cursor-pointer ${
                          product.category === "Accessories" ? "object-contain p-6" : "object-cover object-top"
                        }`}
                      />
                    </Link>

                    {/* Subtle border on hover */}
                    <div className="absolute inset-0 border border-transparent group-hover:border-[#111111]/15 transition-all duration-700 pointer-events-none" />

                    {/* Inline Size Selector — slides up on hover */}
                    <AnimatePresence>
                      {hoveredProduct === product.id && (
                        <motion.div
                          initial={{ y: "100%", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: "100%", opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/95 via-black/85 to-transparent pointer-events-auto"
                        >
                          <p className="text-white/60 text-[8px] tracking-[0.3em] uppercase mb-2.5 font-medium">Select Size</p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {sizes.map((s) => (
                              <button
                                key={s}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSize(prev => ({ ...prev, [product.id]: s }));
                                }}
                                className={`w-8 h-8 text-[9px] font-semibold border transition-all duration-200 flex items-center justify-center uppercase tracking-wider cursor-pointer ${
                                  selectedSize[product.id] === s
                                    ? "border-white bg-white text-[#111111]"
                                    : "border-zinc-500 text-white hover:border-white bg-transparent"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                            disabled={!selectedSize[product.id]}
                            className="w-full bg-white text-[#111111] py-2.5 uppercase tracking-[0.2em] font-semibold text-[10px] hover:bg-[#C9A84C] hover:text-white transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            {selectedSize[product.id] ? "Add to Enquiry" : "Select a Size"}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                   {/* Product Info */}
                  <div className="px-1">
                    <div className="flex items-start justify-between mb-1.5">
                      <span className="text-[#9CA3AF] text-[9px] uppercase tracking-[0.3em] font-medium">{product.category}</span>
                    </div>
                    <Link href={`/shop/${product.id}`}>
                      <h3 className="text-sm md:text-base font-serif text-[#111111] hover:text-[#4B5563] transition-colors duration-300 leading-snug">{product.name}</h3>
                    </Link>
                    <p className="text-[#9CA3AF] text-[10px] tracking-[0.15em] uppercase mt-1.5">{product.deliveryTime} delivery</p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-[#FAFAFA] py-12 px-6 border-t border-[#111111]/10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border border-[#111111]/20 flex items-center justify-center">
              <span className="font-serif text-xs text-[#111111]">GS</span>
            </div>
            <div>
              <p className="text-xs text-[#4B5563] uppercase tracking-[0.2em]">© {new Date().getFullYear()} Genial Stoffa</p>
              <p className="text-[10px] text-[#C9A84C] uppercase tracking-[0.2em] mt-0.5">Crafted with Love in India</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/genialstoffa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#4B5563] border border-[#E5E5E5] px-4 py-2 hover:border-[#111111] hover:text-[#111111] transition-all duration-300"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/919122782023"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#4B5563] border border-[#E5E5E5] px-4 py-2 hover:border-[#25D366] hover:text-[#25D366] transition-all duration-300"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
