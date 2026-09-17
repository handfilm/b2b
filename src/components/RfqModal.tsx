import React, { useState, useRef } from 'react';
import {
  X,
  FileCheck,
  Send,
  Building2,
  Ship,
  Globe2,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  Clock,
  Trash2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { CategoryId, RfqSubmission, TechPackAttachment } from '../types';
import { CATEGORIES } from '../data/mockData';
import { nexusApi } from '../services/nexusApi';

interface RfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRfq: (rfq: RfqSubmission) => void;
  defaultCategoryId?: CategoryId;
}

export const RfqModal: React.FC<RfqModalProps> = ({
  isOpen,
  onClose,
  onSubmitRfq,
  defaultCategoryId = 'rmg-apparel',
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<{
    buyerName: string;
    companyName: string;
    email: string;
    buyerCountry: string;
    categoryId: CategoryId;
    productRequirement: string;
    targetQuantity: number;
    targetUnitPriceUSD: number;
    incoterms: string;
    destinationPort: string;
    targetTimelineDays: number;
    specNotes: string;
  }>({
    buyerName: '',
    companyName: '',
    email: '',
    buyerCountry: 'Germany',
    categoryId: defaultCategoryId === 'all' ? 'rmg-apparel' : defaultCategoryId,
    productRequirement: '',
    targetQuantity: 2500,
    targetUnitPriceUSD: 3.5,
    incoterms: 'FOB Chattogram Port',
    destinationPort: 'Hamburg Port, Germany',
    targetTimelineDays: 45,
    specNotes: '',
  });

  const [techPack, setTechPack] = useState<TechPackAttachment | null>({
    name: 'Sample_TechPack_Specs_v2.pdf',
    size: '2.4 MB',
    type: 'application/pdf',
    uploadedAt: 'Just now',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    trackingId: string;
    source: 'live' | 'fallback';
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    setTechPack({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type || 'application/pdf',
      uploadedAt: 'Just now',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productRequirement || !formData.email || !formData.companyName) return;

    setIsSubmitting(true);

    try {
      const response = await nexusApi.submitRFQ({
        buyerName: formData.buyerName || 'International Buyer',
        companyName: formData.companyName,
        email: formData.email,
        buyerCountry: formData.buyerCountry,
        categoryId: formData.categoryId,
        productRequirement: formData.productRequirement,
        targetQuantity: Number(formData.targetQuantity),
        targetUnitPriceUSD: Number(formData.targetUnitPriceUSD),
        incoterms: formData.incoterms,
        destinationPort: formData.destinationPort,
        targetTimelineDays: Number(formData.targetTimelineDays),
        specNotes: formData.specNotes,
        techPackFile: techPack || undefined,
      });

      onSubmitRfq(response.rfq);
      setSubmissionResult({
        trackingId: response.trackingId,
        source: response.source,
        message: response.message,
      });
    } catch (err) {
      console.error('RFQ submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="rfq-modal-container"
        className="relative w-full max-w-2xl bg-[#0e0e0e] text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Obsidian Glass Header with Electric Orange Accent */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141414]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold tracking-tight text-white">
                  Post Commercial Sourcing RFQ
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff5500]/20 text-[#ff5500] border border-[#ff5500]/30">
                  Nexus JIT Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Directly broadcasted to verified EPB bonded manufacturers with guaranteed 24-hr bids
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submissionResult ? (
          <div className="p-8 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#ff5500]/20 border border-[#ff5500]/40 text-[#ff5500] mx-auto flex items-center justify-center shadow-lg shadow-[#ff5500]/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-black tracking-tight text-white">
                RFQ Broadcast Successful!
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your requirement for <strong className="text-white">{formData.productRequirement}</strong> has been transmitted to certified factories with matching capacity.
              </p>
            </div>

            {/* Tracking ID Badge */}
            <div className="p-4 bg-[#141414] rounded-xl border border-white/10 max-w-md mx-auto text-left space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-slate-400">Tracking Reference:</span>
                <span className="font-black text-sm text-[#ff5500] bg-[#ff5500]/10 px-2.5 py-1 rounded-md border border-[#ff5500]/30">
                  {submissionResult.trackingId}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Target Volume:</span>
                <span className="text-white font-bold">{formData.targetQuantity.toLocaleString()} Units</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Target Unit Price:</span>
                <span className="text-white font-bold">${formData.targetUnitPriceUSD} FOB</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Delivery Port:</span>
                <span className="text-white font-bold">{formData.destinationPort}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-sans text-slate-400">
                <span className="flex items-center space-x-1 text-emerald-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Factory bids arriving within 24 hours</span>
                </span>
                <span className="text-slate-500">Nexus Data: {submissionResult.source}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setSubmissionResult(null);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-bold shadow-lg shadow-[#ff5500]/25 cursor-pointer"
              >
                Close & Monitor in Trade Desk
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            {/* Category & Buyer Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Target Product Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value as CategoryId })}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#121212] text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Your Company / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nordic Retail Group AB"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>

            {/* Product Title / Requirement */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Product Specification & Requirement *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 240 GSM Combed Ringspun Organic Cotton Oversized Tees"
                value={formData.productRequirement}
                onChange={(e) => setFormData({ ...formData, productRequirement: e.target.value })}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5500]"
              />
            </div>

            {/* Target Volume, Unit Price, Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Order Volume (MOQ) *
                </label>
                <input
                  type="number"
                  min={100}
                  step={50}
                  required
                  value={formData.targetQuantity}
                  onChange={(e) => setFormData({ ...formData, targetQuantity: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Target Price (USD/pc) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    min={0.1}
                    step={0.05}
                    required
                    value={formData.targetUnitPriceUSD}
                    onChange={(e) => setFormData({ ...formData, targetUnitPriceUSD: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl pl-7 pr-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Target Lead Time *
                </label>
                <select
                  value={formData.targetTimelineDays}
                  onChange={(e) => setFormData({ ...formData, targetTimelineDays: parseInt(e.target.value) || 45 })}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value={30} className="bg-[#141414]">30 Days (Urgent)</option>
                  <option value={45} className="bg-[#141414]">45 Days (Standard)</option>
                  <option value={60} className="bg-[#141414]">60 Days (Bulk Run)</option>
                  <option value={90} className="bg-[#141414]">90 Days (Pre-Season)</option>
                </select>
              </div>
            </div>

            {/* Incoterms & Destination Port */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Trade Incoterms 2020
                </label>
                <select
                  value={formData.incoterms}
                  onChange={(e) => setFormData({ ...formData, incoterms: e.target.value })}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value="FOB Chattogram Port" className="bg-[#141414]">FOB Chattogram Port (Most Popular)</option>
                  <option value="CIF Destination Port" className="bg-[#141414]">CIF Destination Port (Insured Freight)</option>
                  <option value="CFR Destination Port" className="bg-[#141414]">CFR Cost & Freight</option>
                  <option value="EXW Dhaka Factory" className="bg-[#141414]">EXW Factory Floor</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Destination Seaport / Airport *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotterdam, Hamburg, Newark, Felixstowe"
                  value={formData.destinationPort}
                  onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>

            {/* Tech-Pack Drag-and-Drop Attachment Section */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Tech-Pack / Design Spec Sheet (PDF, AI, CAD, ZIP)</span>
                <span className="text-[11px] text-[#ff5500] font-normal">Accelerates Factory Quotes</span>
              </label>

              {techPack ? (
                <div className="p-3 bg-[#171717] rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#ff5500]/20 text-[#ff5500] flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{techPack.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {techPack.size} • Attached Tech-Pack
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTechPack(null)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
                  }}
                  className="p-4 rounded-xl border-2 border-dashed border-white/15 hover:border-[#ff5500]/50 bg-[#121212] hover:bg-[#161616] text-center cursor-pointer transition-all space-y-1.5"
                >
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
                  <div className="text-xs text-slate-300 font-semibold">
                    Click to browse or drag & drop Tech-Pack PDF / Spec
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Supports PDF, AI, DXF, Techpack spreadsheets up to 25MB
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Email & Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Business Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="sourcing.director@apparel.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Henrik Larsson"
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Specific Fabric, GSM, Pantone, or Lab-Dip Instructions
              </label>
              <textarea
                rows={2}
                placeholder="Include GSM, custom Pantone TCX codes, OEKO-TEX or GOTS certification mandates..."
                value={formData.specNotes}
                onChange={(e) => setFormData({ ...formData, specNotes: e.target.value })}
                className="w-full bg-[#141414] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5500]"
              />
            </div>

            {/* Value Safeguard Notice */}
            <div className="p-3 bg-[#ff5500]/10 border border-[#ff5500]/25 rounded-xl flex items-start space-x-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#ff5500] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Guaranteed Response Protocol:</span> Your RFQ is cryptographically signed and submitted into the Nexus B2B Trade clearinghouse. All matching certified mills are bound to reply with formal FOB quotes within 24 hours.
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-bold shadow-lg shadow-[#ff5500]/25 hover:shadow-[#ff5500]/40 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Broadcasting to Nexus...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Broadcast RFQ to 5 Factories</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
