"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

import { products, categories } from "@/data/products";

const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

export default function Shop() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<{ [key: string]: string }>({});


  const filteredCollection = activeCategory === "All" 
    ? products 
    : products.filter(item => item.category === activeCategory);

  const handleAddToCart = (product: typeof products[0]) => {
    const size = selectedSize[product.id];
    if (!size) {
      alert("Please select a size before adding to cart.");
      return;
    }
    
    addToCart({
      id: `${product.id}-${size}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      size: size,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-100 font-sans selection:bg-[#111111] selection:text-white">
      <Navbar />

      <main className="pt-40 pb-24 px-6 max-w-[1600px] mx-auto min-h-screen">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif text-[#111111] mb-6"
          >
            The Collection
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 80 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="h-[1px] bg-[#111111] mx-auto mb-12"
          ></motion.div>

          {/* Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex overflow-x-auto md:flex-wrap md:justify-center gap-6 md:gap-8 max-w-5xl mx-auto pb-4 scrollbar-hide px-4 md:px-0"
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-xs md:text-sm uppercase tracking-[0.2em] transition-all duration-300 pb-1 border-b flex-shrink-0 ${
                  activeCategory === cat 
                    ? "text-[#111111] border-[#111111]" 
                    : "text-[#6B7280] border-transparent hover:text-[#111111]"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 justify-items-center">
          <AnimatePresence mode="popLayout">
            {filteredCollection.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                key={product.id}
                className="group flex flex-col w-full max-w-[480px] mx-auto"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Elegant portrait card for model shots */}
                <div className="relative aspect-[3/4] w-full bg-[#FAFAFA] overflow-hidden mb-5">
                  <Link href={`/shop/${product.id}`} className="block absolute inset-0">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className={`opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.2s] ease-out cursor-pointer ${
                        product.category === "Accessories" ? "object-contain p-6" : "object-cover object-top"
                      }`}
                    />
                  </Link>

                  {/* Refined gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

                  {/* Subtle gold border accent on hover */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-[#111111]/20 transition-all duration-700 pointer-events-none" />
                  
                  {/* Rising gold bottom line */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-[1px] bg-gradient-to-r from-transparent via-[#111111] to-transparent transition-all duration-700 pointer-events-none" />

                  {/* Quick Add Overlay */}
                  <div 
                    className={`absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent pointer-events-auto transition-all duration-300 ${
                      hoveredProduct === product.id ? 'opacity-100 translate-y-0' : 'opacity-100 md:opacity-0 translate-y-0 md:translate-y-4'
                    }`}
                  >
                    <p className="text-white text-[9px] tracking-[0.35em] uppercase mb-3 font-medium drop-shadow-md">Select Size</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                          {sizes.map((s) => (
                            <button
                              key={s}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSize(prev => ({ ...prev, [product.id]: s }));
                              }}
                              className={`w-10 h-10 text-[10px] font-semibold border transition-all duration-300 flex items-center justify-center uppercase tracking-wider ${
                                selectedSize[product.id] === s
                                  ? "border-white bg-white text-[#111111]"
                                  : "border-zinc-400 text-white hover:border-white hover:text-white bg-black/40 backdrop-blur-sm"
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
                          className="w-full bg-[#111111] text-white py-3.5 uppercase tracking-[0.2em] font-semibold text-[11px] hover:bg-[#111111] transition-all duration-300 flex justify-center items-center gap-3 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                        </button>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="flex justify-between items-start px-1">
                  <div>
                    <span className="text-[#111111] text-[9px] uppercase tracking-[0.3em] mb-2 block font-medium">{product.category}</span>
                    <Link href={`/shop/${product.id}`}>
                      <h3 className="text-lg md:text-xl font-serif text-[#111111] hover:text-[#111111] transition-colors duration-300 leading-snug">{product.name}</h3>
                    </Link>
                  </div>
                  <div className="md:hidden">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (!selectedSize[product.id]) {
                          alert("Please select a size from the image overlay first.");
                          return;
                        }
                        handleAddToCart(product);
                      }}
                      className="text-[#111111] text-[10px] uppercase tracking-widest font-bold mt-1 hover:text-[#4B5563] transition-colors cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                  <div className="hidden md:block">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        const size = window.prompt("Please confirm your size (S, M, L, XL, XXL, XXXL):", selectedSize[product.id] || "");
                        if (!size) return;
                        
                        addToCart({
                          id: `${product.id}-${size}`,
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          size: size,
                          image: product.image,
                          quantity: 1,
                        });
                      }}
                      className="text-[#111111] text-[10px] uppercase tracking-widest font-bold mt-1 hover:text-[#4B5563] transition-colors cursor-pointer"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#FAFAFA] py-12 px-6 border-t border-[#E5E5E5]">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-[#4B5563] uppercase tracking-[0.2em]">
          <p>&copy; {new Date().getFullYear()} Genial Stoffa. All rights reserved.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a href="https://www.instagram.com/genialstoffa" target="_blank" rel="noopener noreferrer" className="hover:text-[#111111] transition-colors">Instagram</a>
            <a href="https://wa.me/919122782023" target="_blank" rel="noopener noreferrer" className="hover:text-[#111111] transition-colors">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
