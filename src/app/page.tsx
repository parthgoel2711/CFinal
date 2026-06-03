"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Scissors, Ruler, Sparkles, Mail, MapPin, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import BookingModal from "@/components/BookingModal";
import Navbar from "@/components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { products } from "@/data/products";
import Link from "next/link";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Group featured products (first 12 products) into chunks of 3 for desktop slider
const featuredProducts = products.slice(0, 9);
const chunkedProducts: (typeof products)[] = [];
for (let i = 0; i < featuredProducts.length; i += 3) {
  chunkedProducts.push(featuredProducts.slice(i, i + 3));
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 1000], [0, 400]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % chunkedProducts.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + chunkedProducts.length) % chunkedProducts.length);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#C6A87C] selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 px-6 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-[#050505]/70 to-[#050505] z-10" />
          <motion.div
            style={{ y: yHeroBg }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 origin-top"
          >
            <Image
              src="/images/hero_suit.png"
              alt="Bespoke Suit"
              fill
              className="object-cover object-center"
              priority
            />
          </motion.div>
        </div>
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-[1600px] mx-auto w-full flex flex-col items-center text-center mt-12"
        >
          <motion.span variants={fadeUpVariant} className="text-[#C6A87C] text-xs md:text-sm uppercase tracking-[0.4em] mb-8 block">
            Master Tailors Since 1998
          </motion.span>
          <motion.h1 variants={fadeUpVariant} className="text-6xl md:text-8xl lg:text-[7rem] font-serif text-white mb-10 leading-[1.1] max-w-5xl">
            Elevating Menswear to an <span className="italic text-[#C6A87C]">Art Form</span>
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-zinc-400 mb-14 max-w-2xl font-light leading-relaxed">
            Experience the pinnacle of bespoke tailoring. Handcrafted perfection, designed exclusively for your exact proportions and unparalleled style.
          </motion.p>
          <motion.button
            variants={fadeUpVariant}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/shop'}
            className="group flex items-center gap-4 bg-transparent border border-[#C6A87C] text-[#C6A87C] px-10 py-5 uppercase tracking-[0.2em] text-sm hover:bg-[#C6A87C] hover:text-black transition-all duration-500"
          >
            Explore Collection
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
          </motion.button>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-6 bg-[#0A0A0A] border-t border-[#111]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-[1600px] mx-auto"
        >
          <motion.div variants={fadeUpVariant} className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">The Genial Stoffa Process</h2>
            <div className="w-20 h-[1px] bg-[#C6A87C] mx-auto"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-16 md:gap-12 lg:gap-20">
            {/* Step 1 */}
            <motion.div variants={fadeUpVariant} className="group text-center">
              <div className="relative h-96 mb-10 overflow-hidden rounded-sm">
                <Image
                  src="/images/process_measurement.png"
                  alt="Measurement"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                />
              </div>
              <Ruler className="w-10 h-10 text-[#C6A87C] mx-auto mb-6" />
              <h3 className="text-2xl font-serif text-white mb-4">01. Measurement</h3>
              <p className="text-zinc-400 font-light text-base leading-loose max-w-sm mx-auto">
                Over 40 precise measurements ensure a flawless fit, accounting for posture and silhouette to create your unique pattern.
              </p>
            </motion.div>
            {/* Step 2 */}
            <motion.div variants={fadeUpVariant} className="group text-center mt-0 md:mt-16">
              <div className="relative h-96 mb-10 overflow-hidden rounded-sm">
                <Image
                  src="/images/process_fabric.png"
                  alt="Fabric Selection"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                />
              </div>
              <Sparkles className="w-10 h-10 text-[#C6A87C] mx-auto mb-6" />
              <h3 className="text-2xl font-serif text-white mb-4">02. Fabric Selection</h3>
              <p className="text-zinc-400 font-light text-base leading-loose max-w-sm mx-auto">
                Curated premium wools, cashmeres, and silks sourced exclusively from world-renowned mills in Italy and England.
              </p>
            </motion.div>
            {/* Step 3 */}
            <motion.div variants={fadeUpVariant} className="group text-center mt-0 md:mt-32">
              <div className="relative h-96 mb-10 overflow-hidden rounded-sm">
                <Image
                  src="/images/process_stitching.png"
                  alt="Hand-Stitching"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                />
              </div>
              <Scissors className="w-10 h-10 text-[#C6A87C] mx-auto mb-6" />
              <h3 className="text-2xl font-serif text-white mb-4">03. Hand-Stitching</h3>
              <p className="text-zinc-400 font-light text-base leading-loose max-w-sm mx-auto">
                Artisanal construction featuring hand-rolled lapels and a full floating canvas designed for ultimate longevity.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Catalogue Slideshow Section */}
      <section className="py-32 bg-[#050505] overflow-hidden border-t border-[#111]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-[1600px] mx-auto px-6 mb-20"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <motion.span variants={fadeUpVariant} className="text-[#C6A87C] text-xs uppercase tracking-[0.4em] mb-4 block">Exclusive Designs</motion.span>
              <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-6xl font-serif text-white mb-6">Our Catalogue</motion.h2>
              <motion.div variants={fadeUpVariant} className="w-24 h-[1px] bg-gradient-to-r from-[#C6A87C] to-transparent"></motion.div>
            </div>
            <motion.div variants={fadeUpVariant} className="flex items-center gap-4">
              <span className="text-zinc-500 text-xs uppercase tracking-[0.2em] font-light hidden md:block mr-2">
                {String(currentSlide + 1).padStart(2, '0')} / {String(chunkedProducts.length).padStart(2, '0')}
              </span>
              <button onClick={prevSlide} className="w-14 h-14 border border-[#222] text-zinc-400 hover:border-[#C6A87C] hover:text-[#C6A87C] hover:bg-[#C6A87C]/5 transition-all duration-500 flex items-center justify-center cursor-pointer">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextSlide} className="w-14 h-14 border border-[#222] text-zinc-400 hover:border-[#C6A87C] hover:text-[#C6A87C] hover:bg-[#C6A87C]/5 transition-all duration-500 flex items-center justify-center cursor-pointer">
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </motion.div>

        <div className="relative w-full max-w-[1600px] mx-auto px-6">
          <div className="relative w-full overflow-hidden">
            <motion.div
              className="flex w-full"
              animate={{ x: `-${currentSlide * 100}%` }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            >
              {chunkedProducts.map((chunk, chunkIdx) => (
                <div key={chunkIdx} className="min-w-full flex gap-5 lg:gap-7">
                  {chunk.map((item) => (
                    <div key={item.id} className="relative flex-1 group cursor-pointer max-w-[400px] mx-auto w-full">
                      <Link href={`/shop/${item.id}`} className="block">
                        {/* Image Container — elegant portrait ratio */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0A0A0A]">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill 
                            className={`opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.2s] ease-out ${
                              item.category === "Accessories" ? "object-contain p-6" : "object-cover object-top"
                            }`} 
                          />
                          {/* Refined gradient — darker at bottom for text, subtle at top */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />
                          
                          {/* Subtle gold border accent on hover */}
                          <div className="absolute inset-0 border border-transparent group-hover:border-[#C6A87C]/20 transition-all duration-700 pointer-events-none" />
                          
                          {/* Rising gold line on hover */}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-[1px] bg-gradient-to-r from-transparent via-[#C6A87C] to-transparent transition-all duration-700 pointer-events-none" />

                          {/* Product Info Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 pointer-events-none">
                            <span className="text-[#C6A87C] text-[9px] md:text-[10px] uppercase tracking-[0.35em] mb-3 block font-medium">
                              {item.category}
                            </span>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-serif text-white leading-snug mb-3 group-hover:text-[#C6A87C]/90 transition-colors duration-500">
                              {item.name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const size = window.prompt("Please confirm your size (S, M, L, XL, XXL, XXXL):", "");
                                  if (!size) return;
                                  const message = `Hello, I would like to enquire about this product:\n\n*Product:* ${item.name}\n*Style Code:* ${item.styleCode || 'N/A'}\n*Size:* ${size}\n\nCould you please provide more information? Thank you!`;
                                  const url = `https://wa.me/919122782023?text=${encodeURIComponent(message)}`;
                                  window.open(url, "_blank");
                                }}
                                className="text-[#C6A87C] font-medium text-sm md:text-base tracking-widest uppercase pointer-events-auto hover:text-white transition-colors cursor-pointer"
                              >
                                Enquiry
                              </button>
                              <span className="text-[#C6A87C] text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-1.5">
                                View <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Premium Slide Indicators */}
          <div className="flex items-center justify-center gap-4 mt-14">
            {chunkedProducts.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className="py-4 px-2 cursor-pointer group focus:outline-none"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div 
                  className={`transition-all duration-700 ease-out ${
                    currentSlide === idx 
                      ? 'w-14 h-[3px] bg-[#C6A87C]' 
                      : 'w-7 h-[2px] bg-[#333] group-hover:bg-[#555]'
                  }`} 
                />
              </button>
            ))}
          </div>

          {/* View Full Collection CTA */}
          <div className="text-center mt-16">
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#C6A87C] border border-[#C6A87C]/30 px-10 py-4 hover:bg-[#C6A87C] hover:text-black hover:border-[#C6A87C] transition-all duration-500 font-medium"
            >
              View Full Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#000000] pt-32 pb-16 px-6 border-t border-[#111]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-20 mb-20"
        >
          <motion.div variants={fadeUpVariant}>
            <h2 className="text-4xl font-serif text-white mb-8">Stay Connected</h2>
            <p className="text-zinc-400 font-light mb-10 max-w-md leading-loose">
              Subscribe to our newsletter for exclusive updates, styling advice, and invitations to private fitting events.
            </p>
            <form className="flex max-w-md group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border border-[#333] border-r-0 text-white px-8 py-5 w-full focus:outline-none focus:border-[#C6A87C] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#C6A87C] text-black px-8 py-5 font-semibold hover:bg-white transition-colors tracking-widest uppercase text-sm"
              >
                Subscribe
              </button>
            </form>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="grid sm:grid-cols-2 gap-12">
            <div>
              <h3 className="text-white uppercase tracking-[0.2em] text-xs mb-8">Contact & Locations</h3>
              <ul className="space-y-6 text-zinc-400 font-light text-sm">
                <li className="flex items-start gap-4 hover:text-white transition-colors">
                  <MapPin className="w-5 h-5 text-[#C6A87C] shrink-0 mt-1" />
                  <span className="leading-relaxed">
                    <strong>New Delhi:</strong><br />
                    101/11 Rishi Nagar Rani Bagh,<br />
                    Pitampura, New Delhi - 110034 India
                  </span>
                </li>
                <li className="flex items-start gap-4 hover:text-white transition-colors">
                  <MapPin className="w-5 h-5 text-[#C6A87C] shrink-0 mt-1" />
                  <span className="leading-relaxed">
                    <strong>Bihar:</strong><br />
                    NS3 P2 Industrial Area Airport Road,<br />
                    Raxaul, East Champaran, Bihar - 845305 India
                  </span>
                </li>
                <li className="flex items-center gap-4 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-[#C6A87C] shrink-0" />
                  <span className="tracking-wide">+91 9122782023</span>
                </li>
                <li className="flex items-center gap-4 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 text-[#C6A87C] shrink-0" />
                  <span className="tracking-wide">genialstoffa@gmail.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white uppercase tracking-[0.2em] text-xs mb-8">Hours</h3>
              <ul className="space-y-4 text-zinc-400 font-light text-sm tracking-wide">
                <li>Monday - Sunday: 11:00 AM - 8:00 PM</li>
                <li className="text-[#C6A87C] mt-6 italic font-serif text-lg">By Appointment Only</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
        <div className="max-w-[1600px] mx-auto pt-10 border-t border-[#111] flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 uppercase tracking-[0.2em]">
          <p>&copy; {new Date().getFullYear()} Genial Stoffa. All rights reserved.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a href="https://www.instagram.com/genialstoffa" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="https://wa.me/919122782023" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
