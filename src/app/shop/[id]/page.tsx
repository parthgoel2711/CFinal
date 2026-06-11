"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShoppingBag, X, Ruler, Check, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import { useCart, CustomMeasurements } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { products } from "@/data/products";

const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const product = products.find((p) => p.id === id);
  const {} = useCart();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [mainImage, setMainImage] = useState<string>(product?.image || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Custom Sizing States
  const [sizingMode, setSizingMode] = useState<"standard" | "custom">("standard");
  const [customMeasurements, setCustomMeasurements] = useState<CustomMeasurements | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  // Sizing Modal Form States
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [topLength, setTopLength] = useState("");
  const [chest, setChest] = useState("");
  const [topTummy, setTopTummy] = useState("");
  const [topHip, setTopHip] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [sleeve, setSleeve] = useState("");

  const [bottomLength, setBottomLength] = useState("");
  const [bottomWaist, setBottomWaist] = useState("");
  const [bottomHip, setBottomHip] = useState("");
  const [bottomThigh, setBottomThigh] = useState("");

  const [notes, setNotes] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-zinc-100 flex items-center justify-center">
        <h1 className="text-2xl font-serif">Product Not Found</h1>
      </div>
    );
  }

  const includesBottom = product.includes.toLowerCase().includes("trouser") || 
                         product.includes.toLowerCase().includes("pajama") || 
                         product.includes.toLowerCase().includes("churidar") ||
                         product.includes.toLowerCase().includes("trousers") ||
                         product.includes.toLowerCase().includes("bottom");

  const includesTop = product.includes.toLowerCase().includes("sherwani") || 
                      product.includes.toLowerCase().includes("kurta") || 
                      product.includes.toLowerCase().includes("jacket") || 
                      product.includes.toLowerCase().includes("tuxedo") || 
                      product.includes.toLowerCase().includes("blazer") || 
                      product.includes.toLowerCase().includes("suit") ||
                      product.includes.toLowerCase().includes("top") ||
                      !includesBottom; // Default to Top if bottom is not found

  const isBottomOnly = includesBottom && !includesTop;
  const isTopOnly = includesTop && !includesBottom;
  const showTop = !isBottomOnly;
  const showBottom = !isTopOnly;

  const openModal = () => {
    if (customMeasurements) {
      setUnit(customMeasurements.unit);
      setTopLength(customMeasurements.top?.topLength?.toString() || "");
      setChest(customMeasurements.top?.chest?.toString() || "");
      setTopTummy(customMeasurements.top?.tummy?.toString() || "");
      setTopHip(customMeasurements.top?.hip?.toString() || "");
      setShoulder(customMeasurements.top?.shoulder?.toString() || "");
      setSleeve(customMeasurements.top?.sleeve?.toString() || "");

      setBottomLength(customMeasurements.bottom?.bottomLength?.toString() || "");
      setBottomWaist(customMeasurements.bottom?.waist?.toString() || "");
      setBottomHip(customMeasurements.bottom?.hip?.toString() || "");
      setBottomThigh(customMeasurements.bottom?.thigh?.toString() || "");

      setNotes(customMeasurements.notes || "");
    }
    setIsModalOpen(true);
  };


  return (
    <div className="min-h-screen bg-white text-zinc-100 font-sans selection:bg-[#111111] selection:text-white">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <Navbar />

      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative pt-20 md:pt-24 pb-24 px-4 sm:px-6 max-w-[1600px] mx-auto min-h-screen flex flex-col lg:flex-row gap-10 lg:gap-16 lg:items-start"
      >
        {/* Back to Collection Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-16 md:top-20 right-4 sm:right-6 text-[#4B5563] hover:text-[#111111] transition-colors p-2 z-30 bg-white/40 backdrop-blur-sm border border-[#E5E5E5] rounded-full hover:border-[#111111] flex items-center justify-center shadow-lg cursor-pointer"
          aria-label="Back to Collection"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images */}
        <div className="w-full lg:w-1/2 flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 lg:sticky lg:top-20">
          {/* Thumbnail Gallery */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:w-24 shrink-0 no-scrollbar pb-2 lg:pb-0">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setMainImage(img)}
                className={`relative w-24 h-36 shrink-0 lg:w-full bg-[#F3F4F6] overflow-hidden border transition-all ${
                  mainImage === img ? "border-[#111111]" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`${product.name} ${idx}`} fill className="object-contain" />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative w-full h-[550px] sm:h-[650px] lg:h-[85vh] lg:flex-1 bg-[#F3F4F6] overflow-hidden">
            <Image src={mainImage} alt={product.name} fill className="object-contain" />
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <span className="text-[#111111] text-sm uppercase tracking-[0.2em] mb-4 block">
            {product.category}
          </span>
          <h1 className="text-4xl lg:text-5xl font-serif text-[#111111] mb-4 leading-tight">
            {product.name}
          </h1>
          <button 
            onClick={() => {
              const WHATSAPP_NUMBER = "919122782023";
              const message = `Hello, I would like to quickly enquire about this product:\n\n*Product:* ${product.name}\n*Style Code:* ${product.styleCode || 'N/A'}\n\nCould you please provide more information? Thank you!`;
              const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

              if (!user) {
                const hasPoppedEnquiry = localStorage.getItem("hasClickedEnquiryAuth");
                if (!hasPoppedEnquiry) {
                  setIsAuthOpen(true);
                  localStorage.setItem("hasClickedEnquiryAuth", "true");
                  return;
                }
              }
              window.open(url, "_blank");
            }}
            className="text-xl font-medium text-[#111111] hover:text-[#4B5563] transition-colors mb-8 tracking-widest uppercase text-left cursor-pointer focus:outline-none"
          >
            Enquiry
          </button>

          {/* Sizing Mode Selection */}
          <div className="flex border-b border-[#E5E5E5] mb-6">
            <button
              onClick={() => setSizingMode("standard")}
              className={`flex-1 pb-3 text-sm uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
                sizingMode === "standard"
                  ? "border-[#111111] text-[#111111]"
                  : "border-transparent text-[#6B7280] hover:text-[#111111]"
              }`}
            >
              Standard Size
            </button>
            <button
              onClick={() => setSizingMode("custom")}
              className={`flex-1 pb-3 text-sm uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
                sizingMode === "custom"
                  ? "border-[#111111] text-[#111111]"
                  : "border-transparent text-[#6B7280] hover:text-[#111111]"
              }`}
            >
              Custom Sizing
            </button>
          </div>

          {/* Size Selector Content */}
          <div className="mb-8">
            {sizingMode === "standard" ? (
              <>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs uppercase tracking-widest text-[#4B5563] font-medium">Select Standard Size</span>
                  <button 
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-xs text-[#111111] uppercase tracking-wider underline cursor-pointer"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-14 h-14 text-sm font-medium border transition-colors flex items-center justify-center cursor-pointer ${
                        selectedSize === s
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-[#D6D6D6] text-[#111111] hover:border-[#111111] hover:text-[#111111] bg-[#F3F4F6]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-[#F9FAFB] border border-[#E5E5E5] p-6 rounded-sm transition-all duration-300 group/sizing">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[#111111] font-serif text-sm uppercase tracking-[0.1em] flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-[#111111] group-hover/sizing:rotate-12 transition-transform duration-500" /> Bespoke Size Profile
                    </h3>
                    <p className="text-[11px] text-[#6B7280] mt-1.5 font-light">
                      Provide dimensions for a master-crafted custom fit.
                    </p>
                  </div>
                  <button
                    onClick={openModal}
                    className="text-[10px] text-[#111111] font-bold uppercase tracking-[0.15em] border border-[#111111]/30 px-3.5 py-2 hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-300 cursor-pointer rounded-sm"
                  >
                    {customMeasurements ? "Edit Profile" : "Configure"}
                  </button>
                </div>

                {customMeasurements ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {customMeasurements.top && (
                        <div className="bg-white/60 border border-[#E5E5E5]/60 p-4 rounded-sm hover:border-[#111111]/15 transition-all duration-300">
                          <span className="text-[#111111] block mb-3 uppercase tracking-[0.2em] text-[9px] font-semibold border-b border-[#E5E5E5]/40 pb-2">Top Specifications</span>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                            {customMeasurements.top.topLength && (
                              <div className="flex flex-col bg-[#F3F4F6] px-3 py-1.5 border border-[#E5E5E5]/40 rounded-sm">
                                <span className="text-[#6B7280] text-[8px] uppercase tracking-wider">Top Length</span>
                                <span className="text-[#111111] font-medium mt-0.5">{customMeasurements.top.topLength}{customMeasurements.unit}</span>
                              </div>
                            )}
                            {customMeasurements.top.chest && (
                              <div className="flex flex-col bg-[#F3F4F6] px-3 py-1.5 border border-[#E5E5E5]/40 rounded-sm">
                                <span className="text-[#6B7280] text-[8px] uppercase tracking-wider">Chest</span>
                                <span className="text-[#111111] font-medium mt-0.5">{customMeasurements.top.chest}{customMeasurements.unit}</span>
                              </div>
                            )}
                            {customMeasurements.top.tummy && (
                              <div className="flex flex-col bg-[#F3F4F6] px-3 py-1.5 border border-[#E5E5E5]/40 rounded-sm">
                                <span className="text-[#6B7280] text-[8px] uppercase tracking-wider">Tummy</span>
                                <span className="text-[#111111] font-medium mt-0.5">{customMeasurements.top.tummy}{customMeasurements.unit}</span>
                              </div>
                            )}
                            {customMeasurements.top.hip && (
                              <div className="flex flex-col bg-[#F3F4F6] px-3 py-1.5 border border-[#E5E5E5]/40 rounded-sm">
                                <span className="text-[#6B7280] text-[8px] uppercase tracking-wider">Hip</span>
                                <span className="text-[#111111] font-medium mt-0.5">{customMeasurements.top.hip}{customMeasurements.unit}</span>
                              </div>
                            )}
                            {customMeasurements.top.shoulder && (
                              <div className="flex flex-col bg-[#F3F4F6] px-3 py-1.5 border border-[#E5E5E5]/40 rounded-sm">
                                <span className="text-[#6B7280] text-[8px] uppercase tracking-wider">Shoulder</span>
                                <span className="text-[#111111] font-medium mt-0.5">{customMeasurements.top.shoulder}{customMeasurements.unit}</span>
                              </div>
                            )}
                            {customMeasurements.top.sleeve && (
                              <div className="flex flex-col bg-[#F3F4F6] px-3 py-1.5 border border-[#E5E5E5]/40 rounded-sm">
                                <span className="text-[#6B7280] text-[8px] uppercase tracking-wider">Sleeve</span>
                                <span className="text-[#111111] font-medium mt-0.5">{customMeasurements.top.sleeve}{customMeasurements.unit}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {customMeasurements.bottom && (
                        <div className="bg-white/60 border border-[#E5E5E5]/60 p-4 rounded-sm hover:border-[#111111]/15 transition-all duration-300">
                          <span className="text-[#111111] block mb-3 uppercase tracking-[0.2em] text-[9px] font-semibold border-b border-[#E5E5E5]/40 pb-2">Bottom Specifications</span>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                            {customMeasurements.bottom.bottomLength && (
                              <div className="flex flex-col bg-[#F3F4F6] px-3 py-1.5 border border-[#E5E5E5]/40 rounded-sm">
                                <span className="text-[#6B7280] text-[8px] uppercase tracking-wider">Length</span>
                                <span className="text-[#111111] font-medium mt-0.5">{customMeasurements.bottom.bottomLength}{customMeasurements.unit}</span>
                              </div>
                            )}
                            {customMeasurements.bottom.waist && (
                              <div className="flex flex-col bg-[#F3F4F6] px-3 py-1.5 border border-[#E5E5E5]/40 rounded-sm">
                                <span className="text-[#6B7280] text-[8px] uppercase tracking-wider">Waist</span>
                                <span className="text-[#111111] font-medium mt-0.5">{customMeasurements.bottom.waist}{customMeasurements.unit}</span>
                              </div>
                            )}
                            {customMeasurements.bottom.hip && (
                              <div className="flex flex-col bg-[#F3F4F6] px-3 py-1.5 border border-[#E5E5E5]/40 rounded-sm">
                                <span className="text-[#6B7280] text-[8px] uppercase tracking-wider">Hip</span>
                                <span className="text-[#111111] font-medium mt-0.5">{customMeasurements.bottom.hip}{customMeasurements.unit}</span>
                              </div>
                            )}
                            {customMeasurements.bottom.thigh && (
                              <div className="flex flex-col bg-[#F3F4F6] px-3 py-1.5 border border-[#E5E5E5]/40 rounded-sm">
                                <span className="text-[#6B7280] text-[8px] uppercase tracking-wider">Thigh</span>
                                <span className="text-[#111111] font-medium mt-0.5">{customMeasurements.bottom.thigh}{customMeasurements.unit}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {customMeasurements.notes && (
                      <div className="border-t border-[#E5E5E5]/80 pt-3 text-[11px] bg-white/40 p-3.5 border border-[#E5E5E5]/60 rounded-sm">
                        <span className="text-[#6B7280] block mb-1 uppercase tracking-[0.2em] text-[8px] font-semibold">Special Fit Instructions</span>
                        <p className="text-[#4B5563] italic font-light leading-relaxed">{customMeasurements.notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 px-4 border border-[#E5E5E5]/60 rounded-sm bg-white mt-3 relative overflow-hidden group/empty">
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#111111]/5 rounded-full blur-2xl pointer-events-none transition-all duration-1000 group-hover/empty:scale-150" />
                    <div className="w-12 h-12 rounded-full bg-[#F3F4F6] border border-[#111111]/10 flex items-center justify-center mb-4 group-hover/empty:border-[#111111]/30 transition-colors duration-500">
                      <Ruler className="w-5 h-5 text-[#111111] opacity-80 group-hover/empty:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="text-xs text-[#4B5563] font-light mb-5 tracking-wide text-center max-w-xs leading-relaxed">
                      Receive a garment tailored exclusively to your proportions. Configure your sizing profile in seconds.
                    </p>
                    <button
                      onClick={openModal}
                      className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.15em] font-semibold text-white bg-[#111111] px-6 py-3.5 hover:bg-[#111111] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[#C6A87C]/10"
                    >
                      Start Customizing
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mb-12">
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-6 mb-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#111111] font-semibold">Quantity</span>
              <div className="flex items-center bg-white border border-[#111111] rounded-sm overflow-hidden h-12 w-36">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-12 h-full flex items-center justify-center text-[#111111] hover:bg-[#F3F4F6] transition-colors cursor-pointer text-lg focus:outline-none select-none active:bg-zinc-200"
                >
                  -
                </button>
                <span className="flex-1 text-center bg-transparent text-[#111111] font-medium text-sm select-none border-x border-[#E5E5E5] h-full flex items-center justify-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-12 h-full flex items-center justify-center text-[#111111] hover:bg-[#F3F4F6] transition-colors cursor-pointer text-lg focus:outline-none select-none active:bg-zinc-200"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                const WHATSAPP_NUMBER = "919122782023";

                // Build size / measurements text
                let sizeText = "";
                if (sizingMode === "standard") {
                  if (!selectedSize) {
                    alert("Please select a size before enquiring on WhatsApp.");
                    return;
                  }
                  sizeText = `Size: ${selectedSize}`;
                } else {
                  if (!customMeasurements) {
                    alert("Please configure your custom measurements first.");
                    openModal();
                    return;
                  }
                  const unit = customMeasurements.unit;
                  const lines: string[] = ["Size: Custom"];
                  if (customMeasurements.top) {
                    const t = customMeasurements.top;
                    lines.push("*Top Measurements:*");
                    if (t.topLength)  lines.push(`  • Top Length: ${t.topLength}${unit}`);
                    if (t.chest)      lines.push(`  • Chest: ${t.chest}${unit}`);
                    if (t.tummy)      lines.push(`  • Tummy: ${t.tummy}${unit}`);
                    if (t.hip)        lines.push(`  • Hip: ${t.hip}${unit}`);
                    if (t.shoulder)   lines.push(`  • Shoulder: ${t.shoulder}${unit}`);
                    if (t.sleeve)     lines.push(`  • Sleeve: ${t.sleeve}${unit}`);
                  }
                  if (customMeasurements.bottom) {
                    const b = customMeasurements.bottom;
                    lines.push("*Bottom Measurements:*");
                    if (b.bottomLength) lines.push(`  • Length: ${b.bottomLength}${unit}`);
                    if (b.waist)        lines.push(`  • Waist: ${b.waist}${unit}`);
                    if (b.hip)          lines.push(`  • Hip: ${b.hip}${unit}`);
                    if (b.thigh)        lines.push(`  • Thigh: ${b.thigh}${unit}`);
                  }
                  if (customMeasurements.notes) lines.push(`Notes: ${customMeasurements.notes}`);
                  sizeText = lines.join("\n");
                }

                const message =
                  `Hello, I would like to enquire about this product:\n\n` +
                  `*Product:* ${product.name}\n` +
                  `*Style Code:* ${product.styleCode || 'N/A'}\n` +
                  `*Quantity:* ${quantity}\n` +
                  `${sizeText}\n\n` +
                  `Could you please provide more information? Thank you!`;

                if (!user) {
                  const hasPoppedEnquiry = localStorage.getItem("hasClickedEnquiryAuth");
                  if (!hasPoppedEnquiry) {
                    setIsAuthOpen(true);
                    localStorage.setItem("hasClickedEnquiryAuth", "true");
                    return;
                  }
                }

                const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                window.open(url, "_blank");
              }}
              className="w-full bg-[#25D366] text-white py-4 uppercase tracking-[0.1em] font-bold text-sm hover:bg-[#1ebd5a] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Enquire on WhatsApp
            </button>
          </div>

          {/* Details */}
          <div className="border-t border-[#E5E5E5] pt-8 space-y-6 text-sm">
            <p className="text-[#4B5563] font-light leading-relaxed mb-8">
              <strong className="text-[#111111]">Description:</strong> {product.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-[#4B5563] font-light">
              <p><strong className="text-[#111111] font-medium">Collection Name:</strong> {product.collectionName}</p>
              <p><strong className="text-[#111111] font-medium">Work:</strong> {product.work}</p>
              <p><strong className="text-[#111111] font-medium">Fabric:</strong> {product.fabric}</p>
              <p><strong className="text-[#111111] font-medium">Color:</strong> {product.color}</p>
              <p><strong className="text-[#111111] font-medium">No. of Components:</strong> {product.components}</p>
              <p><strong className="text-[#111111] font-medium">Includes:</strong> {product.includes}</p>
              <p><strong className="text-[#111111] font-medium">Fit:</strong> {product.fit}</p>
              <p><strong className="text-[#111111] font-medium">Fabric Care:</strong> {product.fabricCare}</p>
              <p><strong className="text-[#111111] font-medium">Style Code:</strong> {product.styleCode}</p>
              <p><strong className="text-[#111111] font-medium">Availability:</strong> {product.availability}</p>
              <p><strong className="text-[#111111] font-medium">Delivery time:</strong> {product.deliveryTime}</p>
            </div>
          </div>

        </div>
      </motion.main>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#111111]/50 backdrop-blur-md"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl bg-[#FAFAFA] border border-[#E5E5E5] shadow-2xl rounded-sm overflow-hidden z-10 flex flex-col md:flex-row h-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111111] transition-colors z-20 p-2 hover:bg-[#F3F4F6] rounded-full cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Visual Guide */}
              <div className="hidden md:block w-1/3 relative bg-[#F3F4F6] border-r border-[#E5E5E5] min-h-[400px]">
                <Image 
                  src="/images/process_measurement.png" 
                  alt="Measurement Guide" 
                  fill 
                  className="object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <span className="text-[#111111] text-xs uppercase tracking-[0.2em] mb-2 block font-medium">Bespoke Fit Guide</span>
                  <h4 className="text-xl font-serif text-[#111111] mb-3">Tailored to You</h4>
                  <p className="text-xs text-[#4B5563] font-light leading-relaxed">
                    Provide your dimensions in {unit === "in" ? "inches" : "centimeters"}. Our master tailors will account for comfort ease, movement allowance, and draping features.
                  </p>
                </div>
              </div>

              {/* Right Column: Sizing Form */}
              <div className="flex-1 p-6 md:p-10 overflow-y-auto no-scrollbar flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-serif text-[#111111] tracking-wide">Custom Sizing Profile</h3>
                    {/* Unit Switcher */}
                    <div className="flex bg-[#F3F4F6] border border-[#E5E5E5] p-0.5 rounded-sm">
                      <button
                        type="button"
                        onClick={() => setUnit("in")}
                        className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                          unit === "in" 
                            ? "bg-[#111111] text-white" 
                            : "text-[#4B5563] hover:text-[#111111]"
                        }`}
                      >
                        Inches
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnit("cm")}
                        className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                          unit === "cm" 
                            ? "bg-[#111111] text-white" 
                            : "text-[#4B5563] hover:text-[#111111]"
                        }`}
                      >
                        CM
                      </button>
                    </div>
                  </div>

                  <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                    {/* Top Measurements */}
                    {showTop && (
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.25em] text-[#111111] border-b border-[#E5E5E5] pb-2 mb-4 font-semibold">
                          Top Measurements
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#4B5563] mb-1.5">Top Length ({unit})</label>
                            <input
                              type="number"
                              value={topLength}
                              onChange={(e) => setTopLength(e.target.value)}
                              placeholder={`e.g. ${unit === 'in' ? '30' : '76'}`}
                              className="w-full bg-[#F3F4F6] border border-[#E5E5E5] text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] transition-colors rounded-sm text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#4B5563] mb-1.5">Chest ({unit})</label>
                            <input
                              type="number"
                              value={chest}
                              onChange={(e) => setChest(e.target.value)}
                              placeholder={`e.g. ${unit === 'in' ? '40' : '101'}`}
                              className="w-full bg-[#F3F4F6] border border-[#E5E5E5] text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] transition-colors rounded-sm text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#4B5563] mb-1.5">Tummy ({unit})</label>
                            <input
                              type="number"
                              value={topTummy}
                              onChange={(e) => setTopTummy(e.target.value)}
                              placeholder={`e.g. ${unit === 'in' ? '36' : '91'}`}
                              className="w-full bg-[#F3F4F6] border border-[#E5E5E5] text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] transition-colors rounded-sm text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#4B5563] mb-1.5">Hip ({unit})</label>
                            <input
                              type="number"
                              value={topHip}
                              onChange={(e) => setTopHip(e.target.value)}
                              placeholder={`e.g. ${unit === 'in' ? '40' : '101'}`}
                              className="w-full bg-[#F3F4F6] border border-[#E5E5E5] text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] transition-colors rounded-sm text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#4B5563] mb-1.5">Shoulder ({unit})</label>
                            <input
                              type="number"
                              value={shoulder}
                              onChange={(e) => setShoulder(e.target.value)}
                              placeholder={`e.g. ${unit === 'in' ? '18' : '46'}`}
                              className="w-full bg-[#F3F4F6] border border-[#E5E5E5] text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] transition-colors rounded-sm text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#4B5563] mb-1.5">Sleeve ({unit})</label>
                            <input
                              type="number"
                              value={sleeve}
                              onChange={(e) => setSleeve(e.target.value)}
                              placeholder={`e.g. ${unit === 'in' ? '25' : '63'}`}
                              className="w-full bg-[#F3F4F6] border border-[#E5E5E5] text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] transition-colors rounded-sm text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bottom Measurements */}
                    {showBottom && (
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.25em] text-[#111111] border-b border-[#E5E5E5] pb-2 mb-4 font-semibold">
                          Bottom Measurements
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#4B5563] mb-1.5">Length ({unit})</label>
                            <input
                              type="number"
                              value={bottomLength}
                              onChange={(e) => setBottomLength(e.target.value)}
                              placeholder={`e.g. ${unit === 'in' ? '40' : '101'}`}
                              className="w-full bg-[#F3F4F6] border border-[#E5E5E5] text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] transition-colors rounded-sm text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#4B5563] mb-1.5">Waist ({unit})</label>
                            <input
                              type="number"
                              value={bottomWaist}
                              onChange={(e) => setBottomWaist(e.target.value)}
                              placeholder={`e.g. ${unit === 'in' ? '34' : '86'}`}
                              className="w-full bg-[#F3F4F6] border border-[#E5E5E5] text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] transition-colors rounded-sm text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#4B5563] mb-1.5">Hip ({unit})</label>
                            <input
                              type="number"
                              value={bottomHip}
                              onChange={(e) => setBottomHip(e.target.value)}
                              placeholder={`e.g. ${unit === 'in' ? '40' : '101'}`}
                              className="w-full bg-[#F3F4F6] border border-[#E5E5E5] text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] transition-colors rounded-sm text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#4B5563] mb-1.5">Thigh ({unit})</label>
                            <input
                              type="number"
                              value={bottomThigh}
                              onChange={(e) => setBottomThigh(e.target.value)}
                              placeholder={`e.g. ${unit === 'in' ? '24' : '61'}`}
                              className="w-full bg-[#F3F4F6] border border-[#E5E5E5] text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] transition-colors rounded-sm text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <h4 className="text-xs uppercase tracking-[0.25em] text-[#111111] border-b border-[#E5E5E5] pb-2 mb-4 font-semibold">
                        Additional Preferences
                      </h4>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#4B5563] mb-1.5">Fitting Notes / Posture Details</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={2}
                          placeholder="e.g. Prefer relaxed drape around chest, athletic build, slightly sloped shoulders..."
                          className="w-full bg-[#F3F4F6] border border-[#E5E5E5] text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] transition-colors rounded-sm text-sm font-light resize-none"
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="flex gap-4 mt-8 pt-4 border-t border-[#E5E5E5]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border border-[#D6D6D6] text-[#4B5563] py-3.5 uppercase tracking-wider font-semibold text-xs hover:border-[#111111] hover:text-[#111111] transition-all rounded-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const topMeasurementsObj = showTop ? {
                        topLength: topLength ? parseFloat(topLength) : undefined,
                        chest: chest ? parseFloat(chest) : undefined,
                        tummy: topTummy ? parseFloat(topTummy) : undefined,
                        hip: topHip ? parseFloat(topHip) : undefined,
                        shoulder: shoulder ? parseFloat(shoulder) : undefined,
                        sleeve: sleeve ? parseFloat(sleeve) : undefined,
                      } : undefined;

                      const bottomMeasurementsObj = showBottom ? {
                        bottomLength: bottomLength ? parseFloat(bottomLength) : undefined,
                        waist: bottomWaist ? parseFloat(bottomWaist) : undefined,
                        hip: bottomHip ? parseFloat(bottomHip) : undefined,
                        thigh: bottomThigh ? parseFloat(bottomThigh) : undefined,
                      } : undefined;

                      const hasTop = topMeasurementsObj && Object.values(topMeasurementsObj).some(v => v !== undefined);
                      const hasBottom = bottomMeasurementsObj && Object.values(bottomMeasurementsObj).some(v => v !== undefined);

                      if (!hasTop && !hasBottom && !notes) {
                        alert("Please fill in at least one measurement or add some fit notes.");
                        return;
                      }

                      setCustomMeasurements({
                        unit,
                        top: hasTop ? topMeasurementsObj : undefined,
                        bottom: hasBottom ? bottomMeasurementsObj : undefined,
                        notes: notes || undefined,
                      });
                      setIsModalOpen(false);
                    }}
                    className="flex-1 bg-[#111111] text-white py-3.5 uppercase tracking-wider font-bold text-xs hover:bg-[#111111] transition-all rounded-sm cursor-pointer"
                  >
                    Save Size Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isSizeChartOpen && (
          <div key="size-guide-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              key="size-guide-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute inset-0 bg-[#111111]/50 backdrop-blur-md"
            />
            
            {/* Modal Body */}
            <motion.div
              key="size-guide-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl bg-white border border-[#E5E5E5] shadow-2xl rounded-sm overflow-hidden z-10 p-6 md:p-10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsSizeChartOpen(false)}
                className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111111] transition-colors z-20 p-2 hover:bg-[#F3F4F6] rounded-full cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-3xl font-serif text-[#111111] mb-8 text-center uppercase tracking-wider">Size Guide</h2>

              {/* Size Chart Table */}
              <div className="space-y-12">
                <div>
                  <h3 className="text-lg font-serif text-[#111111] mb-4 uppercase text-center tracking-wide">TOP (Sherwani, Jacket, Kurta)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse border border-[#D6D6D6] text-sm text-[#4B5563]">
                      <thead>
                        <tr className="bg-[#F3F4F6]">
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider"></th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">S</th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">M</th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">L</th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">XL</th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">XXL</th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">XXXL</th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">Custom</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-[#D6D6D6] py-3 px-4 text-[#111111] font-medium uppercase tracking-wider">Top Length</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">28</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">29</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">30</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">31</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">32</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">33</td>
                          <td className="border border-[#D6D6D6] py-3 px-4" rowSpan={6}>
                            <Link href="/#contact" onClick={() => setIsSizeChartOpen(false)} className="text-[#111111] hover:text-[#111111] transition-colors underline uppercase tracking-wider text-xs font-semibold cursor-pointer">
                              Contact us
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-[#D6D6D6] py-3 px-4 text-[#111111] font-medium uppercase tracking-wider">Chest</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">36</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">38</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">40</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">42</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">44</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">46</td>
                        </tr>
                        <tr>
                          <td className="border border-[#D6D6D6] py-3 px-4 text-[#111111] font-medium uppercase tracking-wider">Tummy</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">32</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">34</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">36</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">38</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">40</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">42</td>
                        </tr>
                        <tr>
                          <td className="border border-[#D6D6D6] py-3 px-4 text-[#111111] font-medium uppercase tracking-wider">Hip</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">36</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">38</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">40</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">42</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">44</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">46</td>
                        </tr>
                        <tr>
                          <td className="border border-[#D6D6D6] py-3 px-4 text-[#111111] font-medium uppercase tracking-wider">Shoulder</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">16</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">17</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">18</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">19</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">20</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">21</td>
                        </tr>
                        <tr>
                          <td className="border border-[#D6D6D6] py-3 px-4 text-[#111111] font-medium uppercase tracking-wider">Sleeve</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">24</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">24.5</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">25</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">25.5</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">26</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">26.5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif text-[#111111] mb-4 uppercase text-center tracking-wide">BOTTOM (Trouser, Churidar)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse border border-[#D6D6D6] text-sm text-[#4B5563]">
                      <thead>
                        <tr className="bg-[#F3F4F6]">
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider"></th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">S</th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">M</th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">L</th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">XL</th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">XXL</th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">XXXL</th>
                          <th className="border border-[#D6D6D6] py-3 px-4 font-medium text-[#111111] uppercase tracking-wider">Custom</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-[#D6D6D6] py-3 px-4 text-[#111111] font-medium uppercase tracking-wider">Length</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">38</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">39</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">40</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">41</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">42</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">43</td>
                          <td className="border border-[#D6D6D6] py-3 px-4" rowSpan={4}>
                            <Link href="/#contact" onClick={() => setIsSizeChartOpen(false)} className="text-[#111111] hover:text-[#111111] transition-colors underline uppercase tracking-wider text-xs font-semibold cursor-pointer">
                              Contact us
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-[#D6D6D6] py-3 px-4 text-[#111111] font-medium uppercase tracking-wider">Waist</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">32</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">34</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">36</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">38</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">40</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">42</td>
                        </tr>
                        <tr>
                          <td className="border border-[#D6D6D6] py-3 px-4 text-[#111111] font-medium uppercase tracking-wider">Hip</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">36</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">38</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">40</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">42</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">44</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">46</td>
                        </tr>
                        <tr>
                          <td className="border border-[#D6D6D6] py-3 px-4 text-[#111111] font-medium uppercase tracking-wider">Thigh</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">22</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">23</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">24</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">25</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">26</td>
                          <td className="border border-[#D6D6D6] py-3 px-4">27</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
