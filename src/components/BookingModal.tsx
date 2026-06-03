"use client";

import React, { useState } from "react";
import { X, CheckCircle, CalendarDays, User, Mail, Scissors, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const suitTypes = ["Business", "Wedding", "Tuxedo", "Casual Bespoke"];

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedType, setSelectedType] = useState(suitTypes[0]);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          date,
          occasion: selectedType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to book consultation.");
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setDate("");

      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            className="relative w-full max-w-5xl bg-[#050505] border border-[#333] rounded-lg overflow-hidden flex flex-col md:flex-row shadow-[0_0_40px_rgba(0,0,0,0.8)]"
          >
            {/* Left side Image */}
            <div className="hidden md:block w-2/5 relative overflow-hidden bg-[#111111]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
              <Image
                src="/images/process_stitching.png"
                alt="Craftsmanship"
                fill
                className="object-cover opacity-70"
                sizes="(max-width: 768px) 0vw, 40vw"
              />
              <div className="absolute bottom-10 left-10 z-20 pr-10">
                <Scissors className="w-8 h-8 text-[#C6A87C] mb-4" />
                <h3 className="text-3xl font-serif text-white mb-2 leading-tight">The Art of <br/>Measurement</h3>
                <p className="text-zinc-400 text-sm font-light">
                  Your journey to sartorial excellence begins with a private consultation. Let our master tailors craft your perfect silhouette.
                </p>
              </div>
            </div>

            {/* Right side Form */}
            <div className="w-full md:w-3/5 p-8 md:p-12 relative">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors bg-[#111111]/50 p-2 rounded-full hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col justify-center"
                  >
                    <h2 className="text-3xl font-serif text-white mb-2">Book a Consultation</h2>
                    <p className="text-zinc-400 mb-8 text-sm">
                      Select your preferences and provide your details below.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Interactive Selection */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
                          Occasion / Type
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {suitTypes.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setSelectedType(type)}
                              className={`px-4 py-2 text-sm rounded-full transition-all duration-300 border ${
                                selectedType === type
                                  ? "bg-[#C6A87C] text-black border-[#C6A87C] font-medium"
                                  : "bg-[#111] text-zinc-400 border-[#333] hover:border-[#666] hover:text-white"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Input Fields */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative group">
                          <label htmlFor="name" className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                            Full Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#C6A87C] transition-colors">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              id="name"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              onFocus={() => setFocusedField('name')}
                              onBlur={() => setFocusedField(null)}
                              className="w-full bg-[#111] border-b border-[#333] text-white pl-10 pr-4 py-3 focus:outline-none transition-colors bg-transparent"
                              placeholder="John Doe"
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-[1px] bg-[#C6A87C]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === 'name' ? '100%' : 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>

                        <div className="relative group">
                          <label htmlFor="email" className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#C6A87C] transition-colors">
                              <Mail className="w-4 h-4" />
                            </div>
                            <input
                              type="email"
                              id="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onFocus={() => setFocusedField('email')}
                              onBlur={() => setFocusedField(null)}
                              className="w-full bg-[#111] border-b border-[#333] text-white pl-10 pr-4 py-3 focus:outline-none transition-colors bg-transparent"
                              placeholder="john@example.com"
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-[1px] bg-[#C6A87C]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === 'email' ? '100%' : 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>

                        <div className="relative group">
                          <label htmlFor="phone" className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                            Phone Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#C6A87C] transition-colors">
                              <Phone className="w-4 h-4" />
                            </div>
                            <input
                              type="tel"
                              id="phone"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              onFocus={() => setFocusedField('phone')}
                              onBlur={() => setFocusedField(null)}
                              className="w-full bg-[#111] border-b border-[#333] text-white pl-10 pr-4 py-3 focus:outline-none transition-colors bg-transparent"
                              placeholder="+91 98765 43210"
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-[1px] bg-[#C6A87C]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === 'phone' ? '100%' : 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>

                        <div className="relative group">
                          <label htmlFor="date" className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                            Preferred Date
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#C6A87C] transition-colors">
                              <CalendarDays className="w-4 h-4" />
                            </div>
                            <input
                              type="date"
                              id="date"
                              required
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              onFocus={() => setFocusedField('date')}
                              onBlur={() => setFocusedField(null)}
                              className="w-full bg-[#111] border-b border-[#333] text-white pl-10 pr-4 py-3 focus:outline-none transition-colors bg-transparent [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-[1px] bg-[#C6A87C]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === 'date' ? '100%' : 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      </div>

                      {error && (
                        <p className="text-red-500 text-xs tracking-wide">
                          {error}
                        </p>
                      )}

                      <motion.button
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#C6A87C] text-black font-semibold py-4 px-6 mt-4 rounded-sm hover:bg-white transition-colors uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Processing..." : "Confirm Booking"}
                      </motion.button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="h-full flex flex-col items-center justify-center py-16 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <CheckCircle className="w-20 h-20 text-[#C6A87C] mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
                    </motion.div>
                    <h2 className="text-3xl font-serif text-white mb-3">Request Received</h2>
                    <p className="text-zinc-400 text-base max-w-sm">
                      Thank you. Our master tailors will contact you shortly to confirm your appointment for your <span className="text-white font-medium">{selectedType.toLowerCase()}</span> consultation.
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
