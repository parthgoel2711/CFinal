"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Scissors, Ruler, Sparkles, Mail, MapPin, Phone, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import BookingModal from "@/components/BookingModal";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";
import Link from "next/link";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

const featuredProducts = products.slice(0, 9);
const chunkedProducts: (typeof products)[] = [];
for (let i = 0; i < featuredProducts.length; i += 3) {
  chunkedProducts.push(featuredProducts.slice(i, i + 3));
}

const MARQUEE_TEXT = [
  "MASTER TAILORS SINCE 1998",
  "HANDCRAFTED IN INDIA",
  "BESPOKE BY APPOINTMENT",
  "40+ PRECISE MEASUREMENTS",
  "PREMIUM ITALIAN & ENGLISH FABRICS",
  "MADE TO YOUR EXACT PROPORTIONS",
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 1000], [0, 400]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

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
    <div className="min-h-screen bg-[#FAFAF8] text-zinc-100 font-sans selection:bg-[#111111] selection:text-white overflow-x-hidden w-full">
      <ScrollProgress />
      <Navbar />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      {/* ── Hero Section ────────────────────────────────────────── */}
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
              alt="Genial Stoffa luxury bespoke menswear and master tailoring craft"
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
          <motion.span variants={fadeUpVariant} className="text-white/60 text-[10px] md:text-xs uppercase tracking-[0.5em] mb-8 block drop-shadow-md">
            Master Tailors Since 1998
          </motion.span>
          <motion.h1 variants={fadeUpVariant} className="text-4xl sm:text-5xl md:text-7xl lg:text-[6.5rem] font-serif text-white mb-8 md:mb-10 leading-[1.2] md:leading-[1.1] max-w-5xl drop-shadow-2xl tracking-normal">
            Elevating Menswear to an <br className="sm:hidden" /><span className="italic font-light">Art Form</span>
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-zinc-300/90 mb-16 max-w-2xl font-light leading-relaxed drop-shadow-md tracking-wide">
            Experience the pinnacle of bespoke tailoring. Handcrafted perfection, designed exclusively for your exact proportions and unparalleled style.
          </motion.p>

          {/* Dual CTAs */}
          <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/shop'}
              className="btn-liquid group flex items-center gap-4 bg-white text-[#111111] px-10 py-4 md:px-14 md:py-5 uppercase tracking-[0.25em] text-[10px] md:text-xs hover:text-[#111111] transition-all duration-700 shadow-2xl font-medium"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsBookingOpen(true)}
              className="btn-liquid group flex items-center gap-4 bg-transparent border border-white/50 text-white px-10 py-4 md:px-14 md:py-5 uppercase tracking-[0.25em] text-[10px] md:text-xs hover:bg-white hover:text-[#111111] hover:border-white transition-all duration-700"
            >
              Book Free Consultation
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-[9px] uppercase tracking-[0.35em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Marquee Brand Strip ──────────────────────────────────── */}
      <div className="bg-[#111111] py-5 overflow-hidden border-y border-white/5">
        <div className="marquee-track">
          {[...MARQUEE_TEXT, ...MARQUEE_TEXT].map((text, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6 text-white/50 text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-light whitespace-nowrap">
              {text}
              <span className="inline-block w-1 h-1 rounded-full bg-[#C9A84C] shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Process Section ──────────────────────────────────────── */}
      <section className="py-48 px-6 bg-[#FAFAFA] border-t border-[#111]/10 relative overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-[1600px] mx-auto"
        >
          <motion.div variants={fadeUpVariant} className="text-center mb-32">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] mb-4 block">Our Method</span>
            <h2 className="text-4xl md:text-6xl font-serif text-[#111111] mb-8 tracking-tight">The Genial Stoffa Process</h2>
            <div className="luxury-divider" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-20 md:gap-16 lg:gap-24 relative">
            {/* Step 1 */}
            <motion.div variants={fadeUpVariant} className="group text-center relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[120px] font-serif text-[#111111]/5 leading-none pointer-events-none select-none">01</div>
              <div className="relative h-[450px] mb-12 overflow-hidden rounded-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] img-zoom-container">
                <Image
                  src="/images/process_measurement.png"
                  alt="Master tailor taking precise measurements for custom bespoke men's attire at Genial Stoffa"
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100"
                />
              </div>
              <Ruler className="w-7 h-7 text-[#C9A84C] mx-auto mb-6 opacity-80" />
              <h3 className="text-2xl font-serif text-[#111111] mb-6 tracking-wide">01. Measurement</h3>
              <p className="text-[#4B5563] font-light text-base leading-loose max-w-sm mx-auto">
                Over 40 precise measurements ensure a flawless fit, accounting for posture and silhouette to create your unique pattern.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeUpVariant} className="group text-center mt-0 md:mt-24 relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[120px] font-serif text-[#111111]/5 leading-none pointer-events-none select-none">02</div>
              <div className="relative h-[450px] mb-12 overflow-hidden rounded-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] img-zoom-container">
                <Image
                  src="/images/process_fabric.png"
                  alt="Selection of luxury Italian and English wool, cashmere, and silk suit fabrics"
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100"
                />
              </div>
              <Sparkles className="w-7 h-7 text-[#C9A84C] mx-auto mb-6 opacity-80" />
              <h3 className="text-2xl font-serif text-[#111111] mb-6 tracking-wide">02. Fabric Selection</h3>
              <p className="text-[#4B5563] font-light text-base leading-loose max-w-sm mx-auto">
                Curated premium wools, cashmeres, and silks sourced exclusively from world-renowned mills in Italy and England.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeUpVariant} className="group text-center mt-0 md:mt-48 relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[120px] font-serif text-[#111111]/5 leading-none pointer-events-none select-none">03</div>
              <div className="relative h-[450px] mb-12 overflow-hidden rounded-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] img-zoom-container">
                <Image
                  src="/images/process_stitching.png"
                  alt="Master tailor hand-stitching floating canvas lapels on a custom jacket"
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100"
                />
              </div>
              <Scissors className="w-7 h-7 text-[#C9A84C] mx-auto mb-6 opacity-80" />
              <h3 className="text-2xl font-serif text-[#111111] mb-6 tracking-wide">03. Hand-Stitching</h3>
              <p className="text-[#4B5563] font-light text-base leading-loose max-w-sm mx-auto">
                Artisanal construction featuring hand-rolled lapels and a full floating canvas designed for ultimate longevity.
              </p>
            </motion.div>
          </div>

          {/* Start Your Journey CTA */}
          <motion.div variants={fadeUpVariant} className="text-center mt-32">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="btn-liquid-dark inline-flex items-center gap-4 border border-[#111111] text-[#111111] hover:text-white px-12 py-5 uppercase tracking-[0.25em] text-[10px] md:text-xs transition-colors duration-700 font-medium"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Catalogue Slideshow Section ──────────────────────────── */}
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
              <motion.span variants={fadeUpVariant} className="text-[#C9A84C] text-[10px] uppercase tracking-[0.4em] mb-6 block font-medium">Exclusive Designs</motion.span>
              <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-6xl font-serif text-[#111111] mb-8 tracking-tight">Our Catalogue</motion.h2>
              <motion.div variants={fadeUpVariant} className="luxury-divider ml-0" style={{ marginLeft: 0 }} />
            </div>
            <motion.div variants={fadeUpVariant} className="flex items-center gap-5">
              {/* Numbered slide nav */}
              <span className="text-[#111111] font-serif text-2xl tracking-tight hidden md:block">
                <span>{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="text-[#D6D6D6] mx-2">/</span>
                <span className="text-[#D6D6D6]">{String(chunkedProducts.length).padStart(2, '0')}</span>
              </span>
              <button onClick={prevSlide} className="btn-liquid-dark w-14 h-14 border border-[#E5E5E5] text-[#4B5563] hover:text-white hover:border-[#111111] transition-all duration-500 flex items-center justify-center cursor-pointer">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextSlide} className="btn-liquid-dark w-14 h-14 border border-[#E5E5E5] text-[#4B5563] hover:text-white hover:border-[#111111] transition-all duration-500 flex items-center justify-center cursor-pointer">
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
                <div key={chunkIdx} className="min-w-full flex flex-col md:flex-row gap-8 lg:gap-12">
                  {chunk.map((item) => (
                    <div key={item.id} className="relative flex-1 group cursor-pointer max-w-[420px] mx-auto w-full flex flex-col">
                      <Link href={`/shop/${item.id}`} className="block">
                        {/* Image Container */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F5F3] border border-[#111111]/5 img-zoom-container">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className={`opacity-95 group-hover:opacity-100 transition-all duration-[2s] ${
                              item.category === "Accessories" ? "object-contain p-6" : "object-cover object-top"
                            }`}
                          />
                        </div>

                        {/* Product Info below the image */}
                        <div className="pt-6 flex flex-col text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 text-[10px] uppercase tracking-[0.25em] font-medium">
                              {item.category}
                            </span>
                          </div>
                          <h3 className="text-base md:text-lg font-serif text-[#111111] mt-2.5 leading-snug group-hover:text-[#4B5563] transition-colors duration-500">
                            {item.name}
                          </h3>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-[10px] tracking-[0.2em] uppercase text-[#111111] border-b border-[#111111] pb-0.5 font-medium">
                              Inquire for Fit
                            </span>
                            <span className="text-zinc-400 text-[11px] uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-1">
                              View <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Slide Indicators */}
          <div className="flex items-center justify-center gap-6 mt-20">
            {chunkedProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className="py-4 px-2 cursor-pointer group focus:outline-none"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div
                  className={`transition-all duration-700 ease-[0.16,1,0.3,1] ${
                    currentSlide === idx
                      ? 'w-16 h-[2px] bg-[#C9A84C]'
                      : 'w-8 h-[1px] bg-[#111111]/20 group-hover:bg-[#111111]/40'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* View Full Collection CTA */}
          <div className="text-center mt-16">
            <Link
              href="/shop"
              className="btn-liquid-dark inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#111111] hover:text-white border border-[#111111]/30 hover:border-[#111111] px-10 py-4 transition-all duration-700 font-medium"
            >
              View Full Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Instagram Strip ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#111111] border-t border-white/5">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </div>
            <div>
              <p className="text-white text-sm font-medium tracking-wide">Follow the Craft</p>
              <p className="text-white/40 text-xs tracking-[0.2em] uppercase">@genialstoffa</p>
            </div>
          </div>
          <p className="text-white text-xs tracking-[0.3em] uppercase hidden md:block">Exclusive Behind-the-Scenes · New Arrivals · Styling Inspiration</p>
          <a
            href="https://www.instagram.com/genialstoffa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-liquid inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#111111] bg-white px-8 py-3 hover:bg-white transition-all duration-700 font-medium"
          >
            Follow Us
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
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
                  className="bg-transparent border border-[#D6D6D6] sm:border-r-0 text-[#111111] px-6 py-4 sm:px-8 sm:py-5 w-full focus:outline-none focus:border-[#111111] transition-colors disabled:opacity-50 placeholder:text-[#9CA3AF] text-sm"
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === "loading"}
                  className="bg-[#111111] text-white px-6 py-4 sm:px-8 sm:py-5 font-medium hover:bg-[#C9A84C] transition-colors duration-500 tracking-widest uppercase text-xs disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                >
                  {subscribeStatus === "loading" ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
              <h3 className="text-[#111111] uppercase tracking-[0.2em] text-xs mb-8 flex items-center gap-3">
                <span className="w-4 h-[1px] bg-[#C9A84C]" />
                Contact & Locations
              </h3>
              <ul className="space-y-6 text-[#4B5563] font-light text-sm">
                <li className="flex items-start gap-4 hover:text-[#111111] transition-colors">
                  <MapPin className="w-5 h-5 text-[#C9A84C] shrink-0 mt-1" />
                  <span className="leading-relaxed">
                    <strong className="text-[#111111] font-medium">New Delhi:</strong><br />
                    101/11 Rishi Nagar Rani Bagh,<br />
                    Pitampura, New Delhi - 110034 India
                  </span>
                </li>
                <li className="flex items-start gap-4 hover:text-[#111111] transition-colors">
                  <MapPin className="w-5 h-5 text-[#C9A84C] shrink-0 mt-1" />
                  <span className="leading-relaxed">
                    <strong className="text-[#111111] font-medium">Bihar:</strong><br />
                    NS3 P2 Industrial Area Airport Road,<br />
                    Raxaul, East Champaran, Bihar - 845305 India
                  </span>
                </li>
                <li className="flex items-center gap-4 hover:text-[#111111] transition-colors">
                  <Phone className="w-5 h-5 text-[#C9A84C] shrink-0" />
                  <span className="tracking-wide">+91 9122782023</span>
                </li>
                <li className="flex items-center gap-4 hover:text-[#111111] transition-colors">
                  <Mail className="w-5 h-5 text-[#C9A84C] shrink-0" />
                  <span className="tracking-wide">genialstoffa@gmail.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#111111] uppercase tracking-[0.2em] text-xs mb-8 flex items-center gap-3">
                <span className="w-4 h-[1px] bg-[#C9A84C]" />
                Hours
              </h3>
              <ul className="space-y-4 text-[#4B5563] font-light text-sm tracking-wide">
                <li>Monday – Sunday</li>
                <li className="text-[#111111] font-medium">11:00 AM – 8:00 PM</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer Bottom */}
        <div className="max-w-[1600px] mx-auto pt-10 border-t border-[#E5E5E5] flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: GS monogram + tagline */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border border-[#111111]/20 flex items-center justify-center">
              <span className="font-serif text-xs text-[#111111]">GS</span>
            </div>
            <div>
              <p className="text-xs text-[#4B5563] uppercase tracking-[0.2em]">© {new Date().getFullYear()} Genial Stoffa</p>
              <p className="text-[10px] text-[#C9A84C] uppercase tracking-[0.2em] mt-0.5">Crafted with Love in India</p>
            </div>
          </div>
          {/* Right: Social links */}
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/genialstoffa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#4B5563] border border-[#E5E5E5] px-4 py-2 hover:border-[#111111] hover:text-[#111111] transition-all duration-300"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Instagram
            </a>
            <a
              href="https://wa.me/919122782023"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#4B5563] border border-[#E5E5E5] px-4 py-2 hover:border-[#25D366] hover:text-[#25D366] transition-all duration-300"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
