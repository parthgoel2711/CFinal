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
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
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
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  
  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 1000], [0, 400]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % chunkedProducts.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + chunkedProducts.length) % chunkedProducts.length);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribeStatus("loading");
    setSubscribeMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed");
      setSubscribeStatus("success");
      setSubscribeMessage(data.message || "Subscribed successfully!");
      setNewsletterEmail("");
    } catch (err: any) {
      setSubscribeStatus("error");
      setSubscribeMessage(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-100 font-sans selection:bg-[#111111] selection:text-white overflow-x-hidden w-full">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-36 md:pb-48 px-6 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/60 to-[#050505] z-10" />
          <motion.div
            style={{ y: yHeroBg }}
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
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
          <motion.span variants={fadeUpVariant} className="text-white text-xs md:text-sm uppercase tracking-[0.4em] mb-8 block drop-shadow-md">
            Master Tailors Since 1998
          </motion.span>
          <motion.h1 variants={fadeUpVariant} className="text-4xl sm:text-5xl md:text-7xl lg:text-[6.5rem] font-serif text-white mb-8 md:mb-10 leading-[1.2] md:leading-[1.1] max-w-5xl drop-shadow-2xl tracking-normal">
            Elevating Menswear to an <br className="sm:hidden" /><span className="italic font-light">Art Form</span>
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-zinc-300/90 mb-16 max-w-2xl font-light leading-relaxed drop-shadow-md tracking-wide">
            Experience the pinnacle of bespoke tailoring. Handcrafted perfection, designed exclusively for your exact proportions and unparalleled style.
          </motion.p>
          <motion.button
            variants={fadeUpVariant}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/shop'}
            className="group flex items-center gap-4 md:gap-6 bg-transparent border border-white/50 text-white px-8 py-4 md:px-14 md:py-6 uppercase tracking-[0.25em] text-[10px] md:text-sm hover:bg-white hover:text-[#111111] hover:border-white transition-all duration-1000 ease-[0.16,1,0.3,1] shadow-2xl"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-4 transition-transform duration-1000 ease-[0.16,1,0.3,1]" />
          </motion.button>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="py-48 px-6 bg-[#FAFAFA] border-t border-[#111]/10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-[1600px] mx-auto"
        >
          <motion.div variants={fadeUpVariant} className="text-center mb-32">
            <h2 className="text-4xl md:text-6xl font-serif text-[#111111] mb-8 tracking-tight">The Genial Stoffa Process</h2>
            <div className="w-24 h-[1px] bg-[#111111]/80 mx-auto"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-20 md:gap-16 lg:gap-24">
            {/* Step 1 */}
            <motion.div variants={fadeUpVariant} className="group text-center">
              <div className="relative h-[450px] mb-12 overflow-hidden rounded-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                <Image
                  src="/images/process_measurement.png"
                  alt="Measurement"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-90 group-hover:opacity-100"
                />
              </div>
              <Ruler className="w-8 h-8 text-[#111111] mx-auto mb-8 opacity-80" />
              <h3 className="text-2xl font-serif text-[#111111] mb-6 tracking-wide">01. Measurement</h3>
              <p className="text-[#4B5563] font-light text-base leading-loose max-w-sm mx-auto">
                Over 40 precise measurements ensure a flawless fit, accounting for posture and silhouette to create your unique pattern.
              </p>
            </motion.div>
            {/* Step 2 */}
            <motion.div variants={fadeUpVariant} className="group text-center mt-0 md:mt-24">
              <div className="relative h-[450px] mb-12 overflow-hidden rounded-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                <Image
                  src="/images/process_fabric.png"
                  alt="Fabric Selection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-90 group-hover:opacity-100"
                />
              </div>
              <Sparkles className="w-8 h-8 text-[#111111] mx-auto mb-8 opacity-80" />
              <h3 className="text-2xl font-serif text-[#111111] mb-6 tracking-wide">02. Fabric Selection</h3>
              <p className="text-[#4B5563] font-light text-base leading-loose max-w-sm mx-auto">
                Curated premium wools, cashmeres, and silks sourced exclusively from world-renowned mills in Italy and England.
              </p>
            </motion.div>
            {/* Step 3 */}
            <motion.div variants={fadeUpVariant} className="group text-center mt-0 md:mt-48">
              <div className="relative h-[450px] mb-12 overflow-hidden rounded-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                <Image
                  src="/images/process_stitching.png"
                  alt="Hand-Stitching"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-90 group-hover:opacity-100"
                />
              </div>
              <Scissors className="w-8 h-8 text-[#111111] mx-auto mb-8 opacity-80" />
              <h3 className="text-2xl font-serif text-[#111111] mb-6 tracking-wide">03. Hand-Stitching</h3>
              <p className="text-[#4B5563] font-light text-base leading-loose max-w-sm mx-auto">
                Artisanal construction featuring hand-rolled lapels and a full floating canvas designed for ultimate longevity.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Catalogue Slideshow Section */}
      <section className="py-48 bg-white overflow-hidden border-t border-[#111]/10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-[1600px] mx-auto px-6 mb-24"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div>
              <motion.span variants={fadeUpVariant} className="text-[#111111] text-xs uppercase tracking-[0.4em] mb-6 block font-medium">Exclusive Designs</motion.span>
              <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-6xl font-serif text-[#111111] mb-8 tracking-tight">Our Catalogue</motion.h2>
              <motion.div variants={fadeUpVariant} className="w-24 h-[1px] bg-gradient-to-r from-[#111111] to-transparent"></motion.div>
            </div>
            <motion.div variants={fadeUpVariant} className="flex items-center gap-4">
              <span className="text-[#6B7280] text-xs uppercase tracking-[0.2em] font-light hidden md:block mr-2">
                {String(currentSlide + 1).padStart(2, '0')} / {String(chunkedProducts.length).padStart(2, '0')}
              </span>
              <button onClick={prevSlide} className="w-14 h-14 border border-[#E5E5E5] text-[#4B5563] hover:border-[#111111] hover:text-[#111111] hover:bg-[#111111]/5 transition-all duration-500 flex items-center justify-center cursor-pointer">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextSlide} className="w-14 h-14 border border-[#E5E5E5] text-[#4B5563] hover:border-[#111111] hover:text-[#111111] hover:bg-[#111111]/5 transition-all duration-500 flex items-center justify-center cursor-pointer">
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
                <div key={chunkIdx} className="min-w-full flex flex-col md:flex-row gap-5 lg:gap-7">
                  {chunk.map((item) => (
                    <div key={item.id} className="relative flex-1 group cursor-pointer max-w-[320px] mx-auto w-full">
                      <Link href={`/shop/${item.id}`} className="block">
                        {/* Image Container — elegant portrait ratio */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAFAFA]">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill 
                            className={`opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2s] ease-[0.16,1,0.3,1] ${
                              item.category === "Accessories" ? "object-contain p-6" : "object-cover object-top"
                            }`} 
                          />
                          {/* Refined gradient — darker at bottom for text, subtle at top */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-[1.5s] pointer-events-none" />
                          
                          {/* Subtle gold border accent on hover */}
                          <div className="absolute inset-0 border border-transparent group-hover:border-[#111111]/20 transition-all duration-[2s] ease-[0.16,1,0.3,1] pointer-events-none" />
                          
                          {/* Rising gold line on hover */}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-[1px] bg-[#111111]/40 transition-all duration-[1.5s] ease-[0.16,1,0.3,1] pointer-events-none" />

                          {/* Product Info Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-20 pointer-events-none flex flex-col justify-end h-full">
                            <span className="text-zinc-400 text-[9px] uppercase tracking-[0.4em] mb-2 block font-medium">
                              {item.category}
                            </span>
                            <h3 className="text-lg md:text-xl font-serif text-white leading-tight mb-4 group-hover:text-zinc-200 transition-colors duration-700">
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
                                className="text-white font-medium text-sm md:text-base tracking-widest uppercase pointer-events-auto hover:text-zinc-300 transition-colors cursor-pointer drop-shadow-md"
                              >
                                Enquiry
                              </button>
                              <span className="text-white text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-1.5 drop-shadow-md">
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
          <div className="flex items-center justify-center gap-6 mt-20">
            {chunkedProducts.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className="py-4 px-2 cursor-pointer group focus:outline-none"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div 
                  className={`transition-all duration-1000 ease-[0.16,1,0.3,1] ${
                    currentSlide === idx 
                      ? 'w-16 h-[2px] bg-[#111111]' 
                      : 'w-8 h-[1px] bg-[#111111]/30 group-hover:bg-[#111111]/60'
                  }`} 
                />
              </button>
            ))}
          </div>

          {/* View Full Collection CTA */}
          <div className="text-center mt-16">
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#111111] border border-[#111111]/30 px-10 py-4 hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-500 font-medium"
            >
              View Full Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#FAFAFA] pt-48 pb-24 px-6 border-t border-[#111]/10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-24 mb-32"
        >
          <motion.div variants={fadeUpVariant}>
            <h2 className="text-4xl md:text-5xl font-serif text-[#111111] mb-10 tracking-tight">Stay Connected</h2>
            <p className="text-[#4B5563] font-light mb-12 max-w-lg leading-loose text-lg">
              Subscribe to our newsletter for exclusive updates, styling advice, and invitations to private fitting events.
            </p>
            <form className="max-w-md group" onSubmit={handleSubscribe}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={subscribeStatus === "loading"}
                  placeholder="Enter your email"
                  className="bg-transparent border border-[#D6D6D6] sm:border-r-0 text-[#111111] px-6 py-4 sm:px-8 sm:py-5 w-full focus:outline-none focus:border-[#111111] transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === "loading"}
                  className="bg-[#111111] text-white px-6 py-4 sm:px-8 sm:py-5 font-semibold hover:bg-[#111111] transition-colors tracking-widest uppercase text-sm disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                >
                  {subscribeStatus === "loading" ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
              {subscribeMessage && (
                <p className={`mt-3 text-sm font-medium ${subscribeStatus === "success" ? "text-emerald-600" : "text-red-500"}`}>
                  {subscribeMessage}
                </p>
              )}
            </form>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="grid sm:grid-cols-2 gap-12">
            <div>
              <h3 className="text-[#111111] uppercase tracking-[0.2em] text-xs mb-8">Contact & Locations</h3>
              <ul className="space-y-6 text-[#4B5563] font-light text-sm">
                <li className="flex items-start gap-4 hover:text-[#111111] transition-colors">
                  <MapPin className="w-5 h-5 text-[#111111] shrink-0 mt-1" />
                  <span className="leading-relaxed">
                    <strong>New Delhi:</strong><br />
                    101/11 Rishi Nagar Rani Bagh,<br />
                    Pitampura, New Delhi - 110034 India
                  </span>
                </li>
                <li className="flex items-start gap-4 hover:text-[#111111] transition-colors">
                  <MapPin className="w-5 h-5 text-[#111111] shrink-0 mt-1" />
                  <span className="leading-relaxed">
                    <strong>Bihar:</strong><br />
                    NS3 P2 Industrial Area Airport Road,<br />
                    Raxaul, East Champaran, Bihar - 845305 India
                  </span>
                </li>
                <li className="flex items-center gap-4 hover:text-[#111111] transition-colors">
                  <Phone className="w-5 h-5 text-[#111111] shrink-0" />
                  <span className="tracking-wide">+91 9122782023</span>
                </li>
                <li className="flex items-center gap-4 hover:text-[#111111] transition-colors">
                  <Mail className="w-5 h-5 text-[#111111] shrink-0" />
                  <span className="tracking-wide">genialstoffa@gmail.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#111111] uppercase tracking-[0.2em] text-xs mb-8">Hours</h3>
              <ul className="space-y-4 text-[#4B5563] font-light text-sm tracking-wide">
                <li>Monday - Sunday: 11:00 AM - 8:00 PM</li>
                <li className="text-[#111111] mt-6 italic font-serif text-lg">By Appointment Only</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
        <div className="max-w-[1600px] mx-auto pt-10 border-t border-[#E5E5E5] flex flex-col md:flex-row justify-between items-center text-xs text-[#4B5563] uppercase tracking-[0.2em]">
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
