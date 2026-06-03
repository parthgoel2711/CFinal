"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Lock, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setError("");
      setSuccess(false);
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await updateProfile({ firstName, lastName, email, phone });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-gradient-to-b from-[#0F0F0F] to-[#050505] border border-[#222] p-8 rounded-sm shadow-2xl z-10 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#C6A87C]/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#222]">
              <div>
                <h3 className="text-2xl font-serif text-white tracking-wider uppercase">Edit Profile</h3>
                <p className="text-zinc-500 text-[11px] uppercase tracking-widest mt-1.5 font-light">Customize your bespoke account info</p>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-white transition-colors p-1.5"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-950/40 border border-red-900/50 text-red-200 px-4 py-3 text-xs tracking-wider uppercase text-center rounded-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-950/40 border border-green-900/50 text-green-200 px-4 py-3 text-xs tracking-wider uppercase text-center rounded-sm">
                  Profile updated successfully!
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-zinc-500 text-[10px] uppercase tracking-widest block font-medium">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full bg-[#111] border border-[#222] focus:border-[#C6A87C] text-white px-10 py-3.5 text-sm focus:outline-none transition-colors rounded-sm font-light"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-zinc-500 text-[10px] uppercase tracking-widest block font-medium">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full bg-[#111] border border-[#222] focus:border-[#C6A87C] text-white px-10 py-3.5 text-sm focus:outline-none transition-colors rounded-sm font-light"
                    />
                  </div>
                </div>
              </div>

              {/* Email ID */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-zinc-500 text-[10px] uppercase tracking-widest block font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johndoe@example.com"
                    className="w-full bg-[#111] border border-[#222] focus:border-[#C6A87C] text-white px-10 py-3.5 text-sm focus:outline-none transition-colors rounded-sm font-light"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-zinc-500 text-[10px] uppercase tracking-widest block font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[#111] border border-[#222] focus:border-[#C6A87C] text-white px-10 py-3.5 text-sm focus:outline-none transition-colors rounded-sm font-light"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C6A87C] disabled:bg-zinc-700 text-black py-4 uppercase tracking-[0.2em] font-semibold text-xs hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-4 rounded-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Profile
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
