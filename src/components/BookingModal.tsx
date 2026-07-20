"use client";

import React, { useState } from "react";
import { X, CheckCircle, CalendarDays, User, Mail, Scissors, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";

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
      toast.success("Consultation booked successfully");
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#111111]/50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
            className="relative w-full max-w-5xl bg-white border border-[#E5E5E5] rounded-lg overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.9)]"
          >
            {/* Left side Image */}
            <div className="hidden md:block w-2/5 relative overflow-hidden bg-[#111111]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
              <Image
                src="/images/process_stitching.png"
                alt="Genial Stoffa master tailor handcrafting bespoke clothing for private fitting consultations"
                fill
                className="object-cover opacity-70"
                sizes="(max-width: 768px) 0vw, 40vw"
              />
              <div className="absolute bottom-10 left-10 z-20 pr-10">
                <span className="text-zinc-300 text-[10px] uppercase tracking-[0.3em] mb-2 block drop-shadow-md">Private Fitting</span>
                <h3 className="text-3xl font-serif text-white mb-2 leading-tight drop-shadow-md">The Art of <br/>Measurement</h3>
                <p className="text-zinc-300 text-xs font-light drop-shadow-md">
                  Your journey to sartorial excellence begins with a private consultation. Let our master tailors craft your perfect silhouette.
                </p>
              </div>
            </div>

            {/* Right side Form */}
            <div className="w-full md:w-3/5 p-8 md:p-12 relative">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-[#6B7280] hover:text-[#111111] transition-colors bg-[#F3F4F6]/50 p-2 rounded-full hover:bg-zinc-100"
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
                    <h2 className="text-2xl font-serif text-[#111111] mb-2">Book a Consultation</h2>
                    <p className="text-[#4B5563] mb-8 text-xs font-light">
                      Select your preferences and provide your details below.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Interactive Selection */}
                      <div>
                        <label className="block text-[10px] font-medium text-[#4B5563] uppercase tracking-wider mb-4">
                          Occasion / Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {suitTypes.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setSelectedType(type)}
                              className={`px-4 py-3 text-[10px] uppercase tracking-wider transition-all duration-300 border text-left ${
                                selectedType === type
                                  ? "bg-[#111111] text-white border-[#111111]"
                                  : "bg-transparent text-[#4B5563] border-[#E5E5E5] hover:border-[#111111] hover:text-[#111111]"
                              }`}
                            >
                              <span className="block font-semibold mb-0.5">{type}</span>
                              <span className="text-[9px] opacity-60 normal-case tracking-normal">
                                {type === 'Business' && 'Corporate & formal wear'}
                                {type === 'Wedding' && 'Sherwani, bandhgala, suit'}
                                {type === 'Tuxedo' && 'Formal evening wear'}
                                {type === 'Casual Bespoke' && 'Everyday luxury'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Input Fields */}
                      <div className="grid md:grid-cols-2 gap-6">
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
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              onFocus={() => setFocusedField('name')}
                              onBlur={() => setFocusedField(null)}
                              className="w-full bg-transparent border-b border-[#E5E5E5] text-[#111111] pl-10 pr-4 py-3 focus:outline-none transition-colors"
                              placeholder="John Doe"
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-[1px] bg-[#111111]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === 'name' ? '100%' : 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>

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
                              onFocus={() => setFocusedField('email')}
                              onBlur={() => setFocusedField(null)}
                              className="w-full bg-transparent border-b border-[#E5E5E5] text-[#111111] pl-10 pr-4 py-3 focus:outline-none transition-colors"
                              placeholder="john@example.com"
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-[1px] bg-[#111111]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === 'email' ? '100%' : 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>

                        <div className="relative group">
                          <label htmlFor="phone" className="block text-[10px] font-medium text-[#4B5563] uppercase tracking-wider mb-1">
                            Phone Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] group-focus-within:text-[#111111] transition-colors">
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
                              className="w-full bg-transparent border-b border-[#E5E5E5] text-[#111111] pl-10 pr-4 py-3 focus:outline-none transition-colors"
                              placeholder="+91 98765 43210"
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-[1px] bg-[#111111]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === 'phone' ? '100%' : 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>

                        <div className="relative group">
                          <label htmlFor="date" className="block text-[10px] font-medium text-[#4B5563] uppercase tracking-wider mb-1">
                            Preferred Date
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280] group-focus-within:text-[#111111] transition-colors">
                              <CalendarDays className="w-4 h-4" />
                            </div>
                            <input
                              type="date"
                              id="date"
                              required
                              min={new Date().toISOString().split("T")[0]}
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              onFocus={() => setFocusedField('date')}
                              onBlur={() => setFocusedField(null)}
                              className="w-full bg-transparent border-b border-[#E5E5E5] text-[#111111] pl-10 pr-4 py-3 focus:outline-none transition-colors"
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-[1px] bg-[#111111]"
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
                        className="w-full bg-[#111111] text-white font-semibold py-4 px-6 mt-4 rounded-sm hover:bg-[#111111] transition-colors uppercase tracking-widest text-xs flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Processing..." : "Confirm Booking"}
                      </motion.button>

                      {/* WhatsApp Alternative */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex-1 h-[1px] bg-[#E5E5E5]" />
                        <span className="text-[#9CA3AF] text-[9px] uppercase tracking-[0.2em]">or</span>
                        <div className="flex-1 h-[1px] bg-[#E5E5E5]" />
                      </div>
                      <a
                        href={`https://wa.me/919122782023?text=${encodeURIComponent(`Hello, I'd like to book a free consultation for ${selectedType} bespoke attire. Please let me know your available slots. Thank you!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#1ebd5a] transition-colors rounded-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Prefer WhatsApp
                      </a>
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
                      <CheckCircle className="w-20 h-20 text-[#111111] mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
                    </motion.div>
                    <h2 className="text-3xl font-serif text-[#111111] mb-3">Request Received</h2>
                    <p className="text-[#4B5563] text-base max-w-sm">
                      Thank you. Our master tailors will contact you shortly to confirm your appointment for your <span className="text-[#111111] font-medium">{selectedType.toLowerCase()}</span> consultation.
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
