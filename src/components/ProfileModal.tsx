"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Save, Loader2, Edit2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      let initialFirstName = user.firstName || "";
      let initialLastName = user.lastName || "";

      if (!initialFirstName && !initialLastName && user.name) {
        const nameParts = user.name.split(" ");
        initialFirstName = nameParts[0];
        initialLastName = nameParts.slice(1).join(" ");
      }

      setFirstName(initialFirstName);
      setLastName(initialLastName);
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setError("");
      setSuccess(false);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await updateProfile({ firstName, lastName, email, phone });
      setSuccess(true);
      toast.success("Profile updated successfully");
      setTimeout(() => {
        setIsEditing(false);
        setSuccess(false);
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
            className="fixed inset-0 bg-[#050505]/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0 }}
            className="relative w-full max-w-lg bg-[#FAFAFA] border border-[#E5E5E5] p-10 md:p-12 rounded-sm shadow-2xl z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-10 pb-6 border-b border-[#E5E5E5]">
              <div>
                <h3 className="text-3xl font-serif text-[#111111] tracking-wide">Your Profile</h3>
                <p className="text-[#6B7280] text-[10px] uppercase tracking-[0.25em] mt-3 font-medium">
                  {isEditing ? "Update your details" : "Your bespoke account info"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[#6B7280] hover:text-[#111111] transition-colors p-2"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-[10px] tracking-widest uppercase text-center rounded-sm mb-6 font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 text-[10px] tracking-widest uppercase text-center rounded-sm mb-6 font-medium">
                Profile updated successfully!
              </div>
            )}

            {!isEditing ? (
              // View State
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="text-[#6B7280] text-[10px] uppercase tracking-[0.2em] block font-medium mb-3">First Name</span>
                    <p className="text-[#111111] text-xl font-serif">{firstName || "—"}</p>
                  </div>
                  <div>
                    <span className="text-[#6B7280] text-[10px] uppercase tracking-[0.2em] block font-medium mb-3">Last Name</span>
                    <p className="text-[#111111] text-xl font-serif">{lastName || "—"}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-[#6B7280] text-[10px] uppercase tracking-[0.2em] block font-medium mb-3">Email Address</span>
                  <p className="text-[#111111] text-xl font-serif break-all">{email || "—"}</p>
                </div>
                
                <div>
                  <span className="text-[#6B7280] text-[10px] uppercase tracking-[0.2em] block font-medium mb-3">Phone Number</span>
                  <p className="text-[#111111] text-xl font-serif">{phone || "—"}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-10 bg-transparent border border-[#111111] text-[#111111] py-4 uppercase tracking-[0.25em] font-medium text-xs hover:bg-[#111111] hover:text-white transition-all duration-500 rounded-sm flex items-center justify-center gap-3"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
              </motion.div>
            ) : (
              // Edit State
              <motion.form 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-8">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-[#6B7280] text-[10px] uppercase tracking-[0.2em] block font-medium mb-2">First Name</label>
                    <div className="relative">
                      <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full bg-transparent border-b border-[#E5E5E5] focus:border-[#111111] text-[#111111] pl-8 py-2 text-sm focus:outline-none transition-colors font-light placeholder:text-[#9CA3AF]"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-[#6B7280] text-[10px] uppercase tracking-[0.2em] block font-medium mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                      <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full bg-transparent border-b border-[#E5E5E5] focus:border-[#111111] text-[#111111] pl-8 py-2 text-sm focus:outline-none transition-colors font-light placeholder:text-[#9CA3AF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Email ID */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[#6B7280] text-[10px] uppercase tracking-[0.2em] block font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="johndoe@example.com"
                      className="w-full bg-transparent border-b border-[#E5E5E5] focus:border-[#111111] text-[#111111] pl-8 py-2 text-sm focus:outline-none transition-colors font-light placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-[#6B7280] text-[10px] uppercase tracking-[0.2em] block font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-transparent border-b border-[#E5E5E5] focus:border-[#111111] text-[#111111] pl-8 py-2 text-sm focus:outline-none transition-colors font-light placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      // reset fields to original values
                      if (user) {
                        setFirstName(user.firstName || "");
                        setLastName(user.lastName || "");
                        setEmail(user.email || "");
                        setPhone(user.phone || "");
                      }
                    }}
                    className="flex-1 bg-transparent border border-[#E5E5E5] text-[#4B5563] py-4 uppercase tracking-[0.2em] font-medium text-[10px] hover:border-[#111111] hover:text-[#111111] transition-all duration-300 rounded-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#111111] disabled:bg-zinc-700 text-white py-4 uppercase tracking-[0.2em] font-medium text-[10px] hover:bg-black transition-all duration-300 flex items-center justify-center gap-2 rounded-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> Saving
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
