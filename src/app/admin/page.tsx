"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, Check, X, Clock, Search, User, Mail, 
  Scissors, RefreshCw, AlertCircle, ArrowLeft, ShieldAlert, Phone, ShoppingBag, Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Consultation } from "@/lib/db";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Customers section
  interface CustomerEntry {
    username: string;
    name: string | null;
    cartItemCount: number;
  }
  const [customers, setCustomers] = useState<CustomerEntry[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0
  });

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Authenticate Admin
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "stoffa2026" || passcode === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("stoffa_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Invalid access token. Please check credentials.");
    }
  };

  useEffect(() => {
    const cachedAuth = localStorage.getItem("stoffa_admin_auth");
    if (cachedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch consultations
  const fetchConsultations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/consultations");
      if (!res.ok) {
        throw new Error("Failed to fetch consultations list.");
      }
      const data = await res.json();
      setConsultations(data.consultations || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading consultations.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    setCustomersLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      if (!res.ok) throw new Error("Failed to fetch customers.");
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch {
      // silently fail – customers are bonus data
    } finally {
      setCustomersLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchConsultations();
      fetchCustomers();
    }
  }, [isAuthenticated]);

  // Recalculate stats when consultations change
  useEffect(() => {
    const total = consultations.length;
    const pending = consultations.filter(c => c.status === "pending").length;
    const confirmed = consultations.filter(c => c.status === "confirmed").length;
    const cancelled = consultations.filter(c => c.status === "cancelled").length;
    setStats({ total, pending, confirmed, cancelled });
  }, [consultations]);

  // Handle status update
  const handleStatusChange = async (id: string, newStatus: "pending" | "confirmed" | "cancelled") => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update booking status.");
      }

      // Update locally
      setConsultations(prev => 
        prev.map(c => c.id === id ? { ...c, status: newStatus } : c)
      );
    } catch (err: any) {
      alert(err.message || "Error updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Log Out Admin
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("stoffa_admin_auth");
    setPasscode("");
  };

  // Filter consultations
  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.occasion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#C6A87C] selection:text-black">
      <Navbar />

      <div className="pt-32 pb-24 px-4 sm:px-6 max-w-[1600px] mx-auto">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            /* Secure Access Gate Screen */
            <motion.div
              key="auth-gate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto mt-16 bg-[#0A0A0A] border border-[#222] p-8 rounded-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C6A87C] to-transparent" />
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#111] border border-[#C6A87C]/20 flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-8 h-8 text-[#C6A87C]" />
                </div>
                <h2 className="text-2xl font-serif text-white tracking-wide">Sartorial Owner Portal</h2>
                <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-light">
                  Restricted Website Administration
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div>
                  <label htmlFor="passcode" className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-medium">
                    Access Token / Passcode
                  </label>
                  <input
                    type="password"
                    id="passcode"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter owner passcode"
                    className="w-full bg-[#111] border border-[#222] focus:border-[#C6A87C] text-white px-4 py-3 focus:outline-none transition-colors text-sm rounded-sm text-center tracking-widest"
                  />
                  {authError && (
                    <p className="text-red-500 text-xs mt-2 text-center">{authError}</p>
                  )}
                  <p className="text-zinc-600 text-[10px] mt-3 text-center italic">
                    Hint: Enter &quot;stoffa2026&quot; or click Demo Bypass below.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full bg-[#C6A87C] hover:bg-white text-black font-semibold py-3.5 uppercase tracking-widest text-xs transition-colors rounded-sm cursor-pointer"
                  >
                    Authenticate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthenticated(true);
                      localStorage.setItem("stoffa_admin_auth", "true");
                    }}
                    className="w-full bg-transparent border border-[#333] hover:border-[#666] text-zinc-400 hover:text-white py-3.5 uppercase tracking-widest text-[10px] font-semibold transition-all rounded-sm cursor-pointer"
                  >
                    Demo Bypass (Quick Test)
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            /* Main Dashboard Panel */
            <motion.div
              key="dashboard-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-[#222]">
                <div>
                  <div className="flex items-center gap-3 text-zinc-500 text-xs uppercase tracking-[0.2em] mb-2 font-medium">
                    <Scissors className="w-4 h-4 text-[#C6A87C]" />
                    <span>Control Room</span>
                  </div>
                  <h1 className="text-4xl font-serif text-white tracking-wide">
                    Bespoke Consultation Bookings
                  </h1>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={fetchConsultations}
                    disabled={isLoading}
                    className="border border-[#222] bg-[#0A0A0A] hover:bg-[#111] hover:border-[#444] text-zinc-400 hover:text-white px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#C6A87C]" : ""}`} />
                    Refresh
                  </button>
                  <button
                    onClick={handleLogout}
                    className="border border-red-950/50 bg-red-950/10 hover:bg-red-950/30 text-red-400 hover:text-red-300 px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
                  >
                    Lock Portal
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Total Bookings */}
                <div className="bg-[#0A0A0A] border border-[#222] p-6 rounded-sm shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Total Inquiries</span>
                    <h3 className="text-3xl font-serif text-white mt-1.5">{stats.total}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-[#333] flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-zinc-400" />
                  </div>
                </div>

                {/* Pending */}
                <div className="bg-[#0A0A0A] border border-[#222] p-6 rounded-sm shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Pending Review</span>
                    <h3 className="text-3xl font-serif text-amber-500 mt-1.5">{stats.pending}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-amber-950/10 border border-amber-950/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                </div>

                {/* Confirmed */}
                <div className="bg-[#0A0A0A] border border-[#222] p-6 rounded-sm shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Confirmed Dates</span>
                    <h3 className="text-3xl font-serif text-emerald-500 mt-1.5">{stats.confirmed}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-emerald-950/10 border border-emerald-950/30 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>

                {/* Cancelled */}
                <div className="bg-[#0A0A0A] border border-[#222] p-6 rounded-sm shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Cancelled / Archives</span>
                    <h3 className="text-3xl font-serif text-zinc-500 mt-1.5">{stats.cancelled}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                    <X className="w-5 h-5 text-zinc-500" />
                  </div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
                {/* Search */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by client name, email, occasion..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#222] focus:border-[#C6A87C] text-white pl-10 pr-4 py-3.5 focus:outline-none transition-colors text-sm rounded-sm"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium shrink-0">Filter Status</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#0A0A0A] border border-[#222] focus:border-[#C6A87C] text-white px-4 py-3.5 focus:outline-none transition-colors text-sm rounded-sm uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-[#0A0A0A] border border-[#222] rounded-sm overflow-hidden shadow-lg">
                {isLoading ? (
                  /* Loading State */
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                    <RefreshCw className="w-10 h-10 animate-spin text-[#C6A87C] mb-4" />
                    <p className="text-xs uppercase tracking-widest">Loading bookings database...</p>
                  </div>
                ) : error ? (
                  /* Error State */
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-500 text-center px-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h4 className="text-white font-medium text-lg mb-2">Failed to load consultations</h4>
                    <p className="text-xs text-zinc-400 max-w-sm mb-6">{error}</p>
                    <button
                      onClick={fetchConsultations}
                      className="bg-[#C6A87C] text-black font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-sm hover:bg-white transition-colors cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                ) : filteredConsultations.length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-500 text-center px-4">
                    <Calendar className="w-12 h-12 text-zinc-700 mb-4" />
                    <h4 className="text-white font-medium text-lg mb-1">No bookings match criteria</h4>
                    <p className="text-xs text-zinc-500 max-w-xs">
                      Try adjusting search terms or status filters.
                    </p>
                  </div>
                ) : (
                  /* Table Grid */
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm text-zinc-400">
                      <thead>
                        <tr className="bg-[#111] border-b border-[#222]">
                          <th className="py-4 px-6 font-medium text-white uppercase tracking-wider text-xs">Customer</th>
                          <th className="py-4 px-6 font-medium text-white uppercase tracking-wider text-xs">Preferred Date</th>
                          <th className="py-4 px-6 font-medium text-white uppercase tracking-wider text-xs">Occasion / Suit</th>
                          <th className="py-4 px-6 font-medium text-white uppercase tracking-wider text-xs">Booking Date</th>
                          <th className="py-4 px-6 font-medium text-white uppercase tracking-wider text-xs">Status</th>
                          <th className="py-4 px-6 font-medium text-white uppercase tracking-wider text-xs text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222]">
                        {filteredConsultations.map((booking) => (
                          <tr key={booking.id} className="hover:bg-[#111]/30 transition-colors">
                            {/* Customer details */}
                            <td className="py-5 px-6">
                              <div className="font-medium text-white flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-[#C6A87C]" />
                                {booking.name}
                              </div>
                              <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1 hover:text-[#C6A87C] transition-colors">
                                <Mail className="w-3 h-3 text-zinc-600" />
                                <a href={`mailto:${booking.email}`}>{booking.email}</a>
                              </div>
                              {booking.phone && (
                                <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1 hover:text-[#C6A87C] transition-colors">
                                  <Phone className="w-3.5 h-3.5 text-zinc-600" />
                                  <a href={`tel:${booking.phone}`}>{booking.phone}</a>
                                </div>
                              )}
                            </td>
                            {/* Preferred Date */}
                            <td className="py-5 px-6 text-white font-medium">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                {new Date(booking.date).toLocaleDateString(undefined, {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </td>
                            {/* Occasion / Suit Type */}
                            <td className="py-5 px-6">
                              <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-full text-xs uppercase tracking-wide font-medium">
                                {booking.occasion}
                              </span>
                            </td>
                            {/* Booking Creation Date */}
                            <td className="py-5 px-6 text-zinc-500 text-xs">
                              {new Date(booking.createdAt).toLocaleString(undefined, {
                                dateStyle: "short",
                                timeStyle: "short"
                              })}
                            </td>
                            {/* Status Badge */}
                            <td className="py-5 px-6">
                              {booking.status === "pending" && (
                                <span className="inline-flex items-center gap-1.5 text-amber-500 bg-amber-950/10 border border-amber-900/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                  Pending
                                </span>
                              )}
                              {booking.status === "confirmed" && (
                                <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/10 border border-emerald-900/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                  Confirmed
                                </span>
                              )}
                              {booking.status === "cancelled" && (
                                <span className="inline-flex items-center gap-1.5 text-zinc-500 bg-zinc-950 border border-zinc-900 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                  Cancelled
                                </span>
                              )}
                            </td>
                            {/* Action Buttons */}
                            <td className="py-5 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <AnimatePresence mode="wait">
                                  {booking.status === "pending" && (
                                    <>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleStatusChange(booking.id, "confirmed")}
                                        disabled={updatingId !== null}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-black p-2 rounded-sm text-xs font-semibold uppercase transition-colors disabled:opacity-50 cursor-pointer"
                                        title="Confirm Booking"
                                      >
                                        <Check className="w-4 h-4" />
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleStatusChange(booking.id, "cancelled")}
                                        disabled={updatingId !== null}
                                        className="bg-red-950/20 border border-red-900/40 text-red-400 hover:bg-red-900 hover:text-white p-2 rounded-sm text-xs font-semibold uppercase transition-all disabled:opacity-50 cursor-pointer"
                                        title="Cancel Booking"
                                      >
                                        <X className="w-4 h-4" />
                                      </motion.button>
                                    </>
                                  )}
                                  
                                  {booking.status === "confirmed" && (
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleStatusChange(booking.id, "cancelled")}
                                      disabled={updatingId !== null}
                                      className="bg-red-950/20 border border-red-900/40 text-red-400 hover:bg-red-900 hover:text-white p-2 rounded-sm text-xs font-semibold uppercase transition-all disabled:opacity-50 cursor-pointer"
                                      title="Cancel Booking"
                                    >
                                      <X className="w-4 h-4" />
                                    </motion.button>
                                  )}

                                  {booking.status === "cancelled" && (
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleStatusChange(booking.id, "pending")}
                                      disabled={updatingId !== null}
                                      className="bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-zinc-500 p-2 rounded-sm text-xs font-semibold uppercase transition-all disabled:opacity-50 cursor-pointer"
                                      title="Restore to Pending"
                                    >
                                      <Clock className="w-4 h-4" />
                                    </motion.button>
                                  )}
                                </AnimatePresence>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Registered Customers Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#111] border border-[#C6A87C]/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-[#C6A87C]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif text-white tracking-wide">Registered Customers</h2>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{customers.length} account{customers.length !== 1 ? 's' : ''} found</p>
                    </div>
                  </div>
                  <button
                    onClick={fetchCustomers}
                    disabled={customersLoading}
                    className="border border-[#222] bg-[#0A0A0A] hover:bg-[#111] hover:border-[#444] text-zinc-400 hover:text-white px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${customersLoading ? "animate-spin text-[#C6A87C]" : ""}`} />
                    Refresh
                  </button>
                </div>

                <div className="bg-[#0A0A0A] border border-[#222] rounded-sm overflow-hidden shadow-lg">
                  {customersLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                      <RefreshCw className="w-8 h-8 animate-spin text-[#C6A87C] mb-3" />
                      <p className="text-xs uppercase tracking-widest">Loading customer records...</p>
                    </div>
                  ) : customers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                      <Users className="w-10 h-10 text-zinc-700 mb-3" />
                      <p className="text-xs uppercase tracking-widest">No registered customers yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm text-zinc-400">
                        <thead>
                          <tr className="bg-[#111] border-b border-[#222]">
                            <th className="py-4 px-6 font-medium text-white uppercase tracking-wider text-xs">Account</th>
                            <th className="py-4 px-6 font-medium text-white uppercase tracking-wider text-xs">Display Name</th>
                            <th className="py-4 px-6 font-medium text-white uppercase tracking-wider text-xs">Cart Items</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222]">
                          {customers.map((customer) => (
                            <tr key={customer.username} className="hover:bg-[#111]/30 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2 font-medium text-white">
                                  <div className="w-8 h-8 rounded-full bg-[#C6A87C]/10 border border-[#C6A87C]/20 flex items-center justify-center shrink-0">
                                    <User className="w-3.5 h-3.5 text-[#C6A87C]" />
                                  </div>
                                  <span className="font-mono text-sm">{customer.username}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-zinc-300">
                                {customer.name || <span className="text-zinc-600 italic text-xs">Not provided</span>}
                              </td>
                              <td className="py-4 px-6">
                                {customer.cartItemCount > 0 ? (
                                  <span className="inline-flex items-center gap-1.5 bg-[#C6A87C]/10 border border-[#C6A87C]/20 text-[#C6A87C] px-3 py-1 rounded-full text-xs font-semibold">
                                    <ShoppingBag className="w-3 h-3" />
                                    {customer.cartItemCount} item{customer.cartItemCount !== 1 ? 's' : ''} in cart
                                  </span>
                                ) : (
                                  <span className="text-zinc-600 text-xs">Empty cart</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Portal Footer Info */}
              <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-600 uppercase tracking-widest pt-6 border-t border-[#111]">
                <p>Genial Stoffa Private Administration</p>
                <div className="flex gap-4 mt-2 sm:mt-0">
                  <Link href="/" className="hover:text-[#C6A87C] transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back to Storefront
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
