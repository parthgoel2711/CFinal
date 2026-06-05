"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, Check, X, Clock, Search, User, Mail, 
  Scissors, RefreshCw, AlertCircle, ArrowLeft, ShieldAlert, Phone, ShoppingBag, Users, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
    email: string | null;
    phone: string | null;
    password?: string;
    cartItemCount: number;
  }
  const [customers, setCustomers] = useState<CustomerEntry[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState<string | null>(null);

  // Subscribers
  interface SubscriberEntry {
    email: string;
    subscribedAt: string;
  }
  const [subscribers, setSubscribers] = useState<SubscriberEntry[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  
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
  const [isDeletingBooking, setIsDeletingBooking] = useState<string | null>(null);
  const [isDeletingSubscriber, setIsDeletingSubscriber] = useState<string | null>(null);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changePasswordStatus, setChangePasswordStatus] = useState({ error: "", success: "", loading: false });

  // Authenticate Admin
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin") {
      setIsAuthenticated(true);
      setAuthError("");
      return;
    }
    
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        const data = await res.json();
        setAuthError(data.error || "Invalid access token.");
      }
    } catch {
      setAuthError("Failed to authenticate. Check server connection.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordStatus({ error: "", success: "", loading: true });
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setChangePasswordStatus({ error: "", success: "Password changed successfully!", loading: false });
        setTimeout(() => {
          setIsChangePasswordOpen(false);
          setCurrentPassword("");
          setNewPassword("");
          setChangePasswordStatus({ error: "", success: "", loading: false });
        }, 2000);
      } else {
        setChangePasswordStatus({ error: data.error || "Failed to change password", success: "", loading: false });
      }
    } catch {
      setChangePasswordStatus({ error: "Server error", success: "", loading: false });
    }
  };

  useEffect(() => {
    // Intentionally left blank: Admin portal defaults to locked on refresh
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

  // Fetch subscribers
  const fetchSubscribers = async () => {
    setSubscribersLoading(true);
    try {
      const res = await fetch("/api/admin/subscribers");
      if (!res.ok) throw new Error("Failed to fetch subscribers.");
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch {
      // silently fail
    } finally {
      setSubscribersLoading(false);
    }
  };

  const handleRefreshAll = () => {
    fetchConsultations();
    fetchCustomers();
    fetchSubscribers();
  };

  const handleDeleteSubscriber = async (email: string) => {
    if (!window.confirm(`Are you sure you want to remove '${email}' from the subscriber list?`)) return;
    setIsDeletingSubscriber(email);
    try {
      const res = await fetch(`/api/admin/subscribers/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete subscriber");
      }
      setSubscribers(prev => prev.filter(s => s.email !== email));
    } catch (err: any) {
      alert(err.message || "Error deleting subscriber.");
    } finally {
      setIsDeletingSubscriber(null);
    }
  };

  const handleDeleteCustomer = async (username: string) => {
    if (!window.confirm(`Are you sure you want to completely remove the customer '${username}'?`)) return;
    setIsDeletingUser(username);
    try {
      const res = await fetch(`/api/admin/customers/${encodeURIComponent(username)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete customer");
      }
      setCustomers(prev => prev.filter(c => c.username !== username));
    } catch (err: any) {
      alert(err.message || "Error deleting customer.");
    } finally {
      setIsDeletingUser(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchConsultations();
      fetchCustomers();
      fetchSubscribers();
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

  const handleDeleteConsultation = async (id: string) => {
    if (!window.confirm("Are you sure you want to completely delete this booking record? This action cannot be undone.")) return;
    setIsDeletingBooking(id);
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete booking.");
      }
      setConsultations(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Error deleting booking.");
    } finally {
      setIsDeletingBooking(null);
    }
  };

  // Log Out Admin
  const handleLogout = () => {
    setIsAuthenticated(false);
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
    <div className="min-h-screen bg-[#F3F4F6] text-zinc-100 font-sans selection:bg-[#111111] selection:text-white">
      {/* Admin Navbar */}
      <div className="bg-white border-b border-[#E5E5E5] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-4 hover:opacity-70 transition-opacity">
          <ShieldAlert className="w-6 h-6 text-[#111111]" />
          <span className="text-xl font-serif text-[#111111] tracking-wide">Genial Stoffa Admin</span>
        </Link>
        
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="text-xs uppercase tracking-widest text-[#4B5563] hover:text-[#111111] transition-colors font-semibold"
            >
              Change Password
            </button>
            <div className="w-10 h-10 bg-[#111111] rounded-full flex items-center justify-center text-white cursor-pointer" title="Admin Profile">
              <User className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isChangePasswordOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111111]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-8 max-w-md w-full relative shadow-2xl rounded-sm"
            >
              <button onClick={() => setIsChangePasswordOpen(false)} className="absolute top-4 right-4 text-[#4B5563] hover:text-[#111111]">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-serif text-[#111111] mb-6 tracking-wide">Change Admin Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#4B5563] mb-2 font-medium">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#F3F4F6] border border-[#E5E5E5] focus:border-[#111111] text-[#111111] px-4 py-3 focus:outline-none transition-colors text-sm rounded-sm tracking-widest"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#4B5563] mb-2 font-medium">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#F3F4F6] border border-[#E5E5E5] focus:border-[#111111] text-[#111111] px-4 py-3 focus:outline-none transition-colors text-sm rounded-sm tracking-widest"
                  />
                </div>
                {changePasswordStatus.error && <p className="text-red-500 text-xs">{changePasswordStatus.error}</p>}
                {changePasswordStatus.success && <p className="text-emerald-500 text-xs">{changePasswordStatus.success}</p>}
                <button
                  type="submit"
                  disabled={changePasswordStatus.loading}
                  className="w-full bg-[#111111] hover:bg-[#111111] text-white font-semibold py-3.5 uppercase tracking-widest text-xs transition-colors rounded-sm mt-2 disabled:opacity-70"
                >
                  {changePasswordStatus.loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="py-12 px-4 sm:px-6 max-w-[1600px] mx-auto text-[#111111]">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            /* Secure Access Gate Screen */
            <motion.div
              key="auth-gate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto mt-16 bg-[#FAFAFA] border border-[#E5E5E5] p-8 rounded-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#111111] to-transparent" />
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#F3F4F6] border border-[#111111]/20 flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-8 h-8 text-[#111111]" />
                </div>
                <h2 className="text-2xl font-serif text-[#111111] tracking-wide">Sartorial Owner Portal</h2>
                <p className="text-[#6B7280] text-xs mt-2 uppercase tracking-widest font-light">
                  Restricted Website Administration
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div>
                  <label htmlFor="passcode" className="block text-[10px] uppercase tracking-widest text-[#4B5563] mb-2 font-medium">
                    Access Token / Passcode
                  </label>
                  <input
                    type="password"
                    id="passcode"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter owner passcode"
                    className="w-full bg-[#F3F4F6] border border-[#E5E5E5] focus:border-[#111111] text-[#111111] px-4 py-3 focus:outline-none transition-colors text-sm rounded-sm text-center tracking-widest"
                  />
                  {authError && (
                    <p className="text-red-500 text-xs mt-2 text-center">{authError}</p>
                  )}

                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full bg-[#111111] hover:bg-[#111111] text-white font-semibold py-3.5 uppercase tracking-widest text-xs transition-colors rounded-sm cursor-pointer"
                  >
                    Authenticate
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-[#E5E5E5]">
                <div>
                  <div className="flex items-center gap-3 text-[#6B7280] text-xs uppercase tracking-[0.2em] mb-2 font-medium">
                    <Scissors className="w-4 h-4 text-[#111111]" />
                    <span>Control Room</span>
                  </div>
                  <h1 className="text-4xl font-serif text-[#111111] tracking-wide">
                    Bespoke Consultation Bookings
                  </h1>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleRefreshAll}
                    disabled={isLoading || customersLoading || subscribersLoading}
                    className="border border-[#E5E5E5] bg-[#FAFAFA] hover:bg-[#F3F4F6] hover:border-[#CCCCCC] text-[#4B5563] hover:text-[#111111] px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#111111]" : ""}`} />
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
                <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-6 rounded-sm shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-medium">Total Inquiries</span>
                    <h3 className="text-3xl font-serif text-[#111111] mt-1.5">{stats.total}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-zinc-200 border border-[#D6D6D6] flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#4B5563]" />
                  </div>
                </div>

                {/* Pending */}
                <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-6 rounded-sm shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-medium">Pending Review</span>
                    <h3 className="text-3xl font-serif text-amber-500 mt-1.5">{stats.pending}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-amber-950/10 border border-amber-950/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                </div>

                {/* Confirmed */}
                <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-6 rounded-sm shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-medium">Confirmed Dates</span>
                    <h3 className="text-3xl font-serif text-emerald-500 mt-1.5">{stats.confirmed}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-emerald-950/10 border border-emerald-950/30 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>

                {/* Cancelled */}
                <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-6 rounded-sm shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-medium">Cancelled / Archives</span>
                    <h3 className="text-3xl font-serif text-[#6B7280] mt-1.5">{stats.cancelled}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                    <X className="w-5 h-5 text-[#6B7280]" />
                  </div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
                {/* Search */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by client name, email, occasion..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] focus:border-[#111111] text-[#111111] pl-10 pr-4 py-3.5 focus:outline-none transition-colors text-sm rounded-sm"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#6B7280] font-medium shrink-0">Filter Status</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#FAFAFA] border border-[#E5E5E5] focus:border-[#111111] text-[#111111] px-4 py-3.5 focus:outline-none transition-colors text-sm rounded-sm uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-md overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E5E5E5]/60">
                {isLoading ? (
                  /* Loading State */
                  <div className="flex flex-col items-center justify-center py-20 text-[#6B7280]">
                    <RefreshCw className="w-10 h-10 animate-spin text-[#111111] mb-4" />
                    <p className="text-xs uppercase tracking-widest">Loading bookings database...</p>
                  </div>
                ) : error ? (
                  /* Error State */
                  <div className="flex flex-col items-center justify-center py-20 text-[#6B7280] text-center px-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h4 className="text-[#111111] font-medium text-lg mb-2">Failed to load consultations</h4>
                    <p className="text-xs text-[#4B5563] max-w-sm mb-6">{error}</p>
                    <button
                      onClick={fetchConsultations}
                      className="bg-[#111111] text-white font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-sm hover:bg-[#111111] transition-colors cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                ) : filteredConsultations.length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-20 text-[#6B7280] text-center px-4">
                    <Calendar className="w-12 h-12 text-zinc-300 mb-4" />
                    <h4 className="text-[#111111] font-medium text-lg mb-1">No bookings match criteria</h4>
                    <p className="text-xs text-[#6B7280] max-w-xs">
                      Try adjusting search terms or status filters.
                    </p>
                  </div>
                ) : (
                  /* Table Grid */
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm text-[#4B5563]">
                      <thead>
                        <tr className="bg-white border-b border-[#E5E5E5]/80">
                          <th className="py-5 px-6 font-semibold text-[#111111] uppercase tracking-[0.15em] text-[10px]">Customer</th>
                          <th className="py-5 px-6 font-semibold text-[#111111] uppercase tracking-[0.15em] text-[10px]">Preferred Date</th>
                          <th className="py-5 px-6 font-semibold text-[#111111] uppercase tracking-[0.15em] text-[10px]">Occasion / Suit</th>
                          <th className="py-5 px-6 font-semibold text-[#111111] uppercase tracking-[0.15em] text-[10px]">Booking Date</th>
                          <th className="py-5 px-6 font-semibold text-[#111111] uppercase tracking-[0.15em] text-[10px]">Status</th>
                          <th className="py-5 px-6 font-semibold text-[#111111] uppercase tracking-[0.15em] text-[10px] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E5]/50">
                        {filteredConsultations.map((booking) => (
                          <tr key={booking.id} className="hover:bg-[#FAFAFA] transition-colors group">
                            {/* Customer details */}
                            <td className="py-5 px-6">
                              <div className="font-medium text-[#111111] flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-[#111111]" />
                                {booking.name}
                              </div>
                              <div className="text-xs text-[#6B7280] flex items-center gap-2 mt-1 hover:text-[#111111] transition-colors">
                                <Mail className="w-3 h-3 text-[#4B5563]" />
                                <a href={`mailto:${booking.email}`}>{booking.email}</a>
                              </div>
                              {booking.phone && (
                                <div className="text-xs text-[#6B7280] flex items-center gap-2 mt-1 hover:text-[#111111] transition-colors">
                                  <Phone className="w-3.5 h-3.5 text-[#4B5563]" />
                                  <a href={`tel:${booking.phone}`}>{booking.phone}</a>
                                </div>
                              )}
                            </td>
                            {/* Preferred Date */}
                            <td className="py-5 px-6 text-[#111111] font-medium">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
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
                              <span className="px-3 py-1 bg-[#F3F4F6] border border-[#E5E5E5] text-[#111111] rounded-sm text-[10px] uppercase tracking-widest font-semibold">
                                {booking.occasion}
                              </span>
                            </td>
                            {/* Booking Creation Date */}
                            <td className="py-5 px-6 text-[#6B7280] text-xs">
                              {new Date(booking.createdAt).toLocaleString(undefined, {
                                dateStyle: "short",
                                timeStyle: "short"
                              })}
                            </td>
                            {/* Status Badge */}
                            <td className="py-5 px-6">
                              {booking.status === "pending" && (
                                <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-sm text-[10px] font-semibold uppercase tracking-widest">
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                  Pending
                                </span>
                              )}
                              {booking.status === "confirmed" && (
                                <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-sm text-[10px] font-semibold uppercase tracking-widest">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                  Confirmed
                                </span>
                              )}
                              {booking.status === "cancelled" && (
                                <span className="inline-flex items-center gap-1.5 text-[#6B7280] bg-[#F3F4F6] border border-[#E5E5E5] px-3 py-1 rounded-sm text-[10px] font-semibold uppercase tracking-widest">
                                  Cancelled
                                </span>
                              )}
                            </td>
                            {/* Action Buttons */}
                            <td className="py-5 px-6 text-right">
                              <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                <AnimatePresence mode="wait">
                                  {booking.status === "pending" && (
                                    <>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleStatusChange(booking.id, "confirmed")}
                                        disabled={updatingId !== null}
                                        className="bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-600 p-2 rounded-sm text-xs font-semibold uppercase transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                                        title="Confirm Booking"
                                      >
                                        <Check className="w-4 h-4" />
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleStatusChange(booking.id, "cancelled")}
                                        disabled={updatingId !== null}
                                        className="bg-white border border-[#E5E5E5] text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111111] p-2 rounded-sm text-xs font-semibold uppercase transition-all disabled:opacity-50 cursor-pointer shadow-sm"
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
                                      className="bg-white border border-[#E5E5E5] text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111111] p-2 rounded-sm text-xs font-semibold uppercase transition-all disabled:opacity-50 cursor-pointer shadow-sm"
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
                                      className="bg-white border border-[#E5E5E5] text-[#4B5563] hover:text-[#111111] hover:border-[#111111] p-2 rounded-sm text-xs font-semibold uppercase transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                                      title="Restore to Pending"
                                    >
                                      <Clock className="w-4 h-4" />
                                    </motion.button>
                                  )}

                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDeleteConsultation(booking.id)}
                                    disabled={isDeletingBooking === booking.id}
                                    className="bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 hover:text-red-700 hover:border-red-200 p-2 rounded-sm text-xs font-semibold uppercase transition-all disabled:opacity-50 cursor-pointer shadow-sm ml-1"
                                    title="Delete Booking Permanently"
                                  >
                                    {isDeletingBooking === booking.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                  </motion.button>
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
                    <div className="w-8 h-8 rounded-full bg-[#F3F4F6] border border-[#111111]/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-[#111111]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif text-[#111111] tracking-wide">Registered Customers</h2>
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-widest">{customers.length} account{customers.length !== 1 ? 's' : ''} found</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRefreshAll}
                    disabled={isLoading || customersLoading || subscribersLoading}
                    className="border border-[#E5E5E5] bg-[#FAFAFA] hover:bg-[#F3F4F6] hover:border-[#CCCCCC] text-[#4B5563] hover:text-[#111111] px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${customersLoading ? "animate-spin text-[#111111]" : ""}`} />
                    Refresh
                  </button>
                </div>

                <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-sm overflow-hidden shadow-lg">
                  {customersLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[#6B7280]">
                      <RefreshCw className="w-8 h-8 animate-spin text-[#111111] mb-3" />
                      <p className="text-xs uppercase tracking-widest">Loading customer records...</p>
                    </div>
                  ) : customers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[#6B7280]">
                      <Users className="w-10 h-10 text-zinc-700 mb-3" />
                      <p className="text-xs uppercase tracking-widest">No registered customers yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm text-[#4B5563]">
                        <thead>
                          <tr className="bg-[#F3F4F6] border-b border-[#E5E5E5]">
                            <th className="py-4 px-6 font-medium text-[#111111] uppercase tracking-wider text-xs">Account & Name</th>
                            <th className="py-4 px-6 font-medium text-[#111111] uppercase tracking-wider text-xs">Contact Details</th>
                            <th className="py-4 px-6 font-medium text-[#111111] uppercase tracking-wider text-xs">Password</th>
                            <th className="py-4 px-6 font-medium text-[#111111] uppercase tracking-wider text-xs">Cart Items</th>
                            <th className="py-4 px-6 font-medium text-[#111111] uppercase tracking-wider text-xs text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5]">
                          {customers.map((customer) => (
                            <tr key={customer.username} className="hover:bg-[#F3F4F6]/60 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-[#111111]/10 border border-[#111111]/20 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-[#111111]" />
                                  </div>
                                  <div>
                                    <span className="font-mono text-sm block text-[#111111]">{customer.username}</span>
                                    <span className="text-xs text-[#4B5563]">{customer.name || 'No name set'}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm text-[#111111] flex items-center gap-2">
                                    <Mail className="w-3 h-3 text-[#4B5563]"/> {customer.email || '-'}
                                  </span>
                                  <span className="text-sm text-[#111111] flex items-center gap-2">
                                    <Phone className="w-3 h-3 text-[#4B5563]"/> {customer.phone || '-'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="font-mono text-sm bg-white border border-[#E5E5E5] px-2 py-1 rounded text-[#111111]">
                                  {customer.password || 'Oauth / External'}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                {customer.cartItemCount > 0 ? (
                                  <span className="inline-flex items-center gap-1.5 bg-[#111111]/10 border border-[#111111]/20 text-[#111111] px-3 py-1 rounded-full text-xs font-semibold">
                                    <ShoppingBag className="w-3 h-3" />
                                    {customer.cartItemCount} item{customer.cartItemCount !== 1 ? 's' : ''} in cart
                                  </span>
                                ) : (
                                  <span className="text-[#4B5563] text-xs">Empty cart</span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => handleDeleteCustomer(customer.username)}
                                  disabled={isDeletingUser === customer.username}
                                  className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-sm disabled:opacity-50 transition-colors inline-flex justify-center items-center"
                                  title="Remove Customer"
                                >
                                  {isDeletingUser === customer.username ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <X className="w-4 h-4" />
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Newsletter Subscribers Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F3F4F6] border border-[#111111]/20 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-[#111111]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif text-[#111111] tracking-wide">Newsletter Subscribers</h2>
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-widest">{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRefreshAll}
                    disabled={isLoading || customersLoading || subscribersLoading}
                    className="border border-[#E5E5E5] bg-[#FAFAFA] hover:bg-[#F3F4F6] hover:border-[#CCCCCC] text-[#4B5563] hover:text-[#111111] px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${subscribersLoading ? "animate-spin text-[#111111]" : ""}`} />
                    Refresh
                  </button>
                </div>

                <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-sm overflow-hidden shadow-lg">
                  {subscribersLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[#6B7280]">
                      <RefreshCw className="w-8 h-8 animate-spin text-[#111111] mb-3" />
                      <p className="text-xs uppercase tracking-widest">Loading subscribers...</p>
                    </div>
                  ) : subscribers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[#6B7280]">
                      <Mail className="w-10 h-10 text-zinc-700 mb-3" />
                      <p className="text-xs uppercase tracking-widest">No subscribers yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm text-[#4B5563]">
                        <thead>
                          <tr className="bg-[#F3F4F6] border-b border-[#E5E5E5]">
                            <th className="py-4 px-6 font-medium text-[#111111] uppercase tracking-wider text-xs">Email Address</th>
                            <th className="py-4 px-6 font-medium text-[#111111] uppercase tracking-wider text-xs text-right">Subscribed Date</th>
                            <th className="py-4 px-6 font-medium text-[#111111] uppercase tracking-wider text-xs text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5]">
                          {subscribers.map((subscriber, index) => (
                            <tr key={index} className="hover:bg-[#F3F4F6]/50 transition-colors">
                              <td className="py-4 px-6 text-[#111111] font-medium">{subscriber.email}</td>
                              <td className="py-4 px-6 text-zinc-500 text-right">
                                {new Date(subscriber.subscribedAt).toLocaleString()}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDeleteSubscriber(subscriber.email)}
                                  disabled={isDeletingSubscriber === subscriber.email}
                                  className="bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 hover:text-red-700 hover:border-red-200 p-2 rounded-sm text-xs font-semibold uppercase transition-all disabled:opacity-50 cursor-pointer shadow-sm ml-auto flex"
                                  title="Delete Subscriber"
                                >
                                  {isDeletingSubscriber === subscriber.email ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </motion.button>
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
              <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#4B5563] uppercase tracking-widest pt-6 border-t border-[#111]">
                <p>Genial Stoffa Private Administration</p>
                <div className="flex gap-4 mt-2 sm:mt-0">
                  <Link href="/" className="hover:text-[#111111] transition-colors flex items-center gap-1">
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
