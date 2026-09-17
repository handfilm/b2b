import React, { useState } from 'react';
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
} from 'lucide-react';
import { CategoryId, RfqSubmission } from '../types';
import { CATEGORIES } from '../data/mockData';

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
    specNotes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productRequirement || !formData.email || !formData.companyName) return;

    const newRfq: RfqSubmission = {
      id: `rfq-${Date.now()}`,
      buyerName: formData.buyerName || 'International Buyer',
      companyName: formData.companyName,
      email: formData.email,
      buyerCountry: formData.buyerCountry,
      categoryId: formData.categoryId as CategoryId,
      productRequirement: formData.productRequirement,
      targetQuantity: Number(formData.targetQuantity),
      targetUnitPriceUSD: Number(formData.targetUnitPriceUSD),
      incoterms: formData.incoterms,
      destinationPort: formData.destinationPort,
      specNotes: formData.specNotes,
      status: 'Dispatched to 5 Factories',
      createdAt: new Date().toLocaleDateString(),
    };

    onSubmitRfq(newRfq);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
      <div
        id="rfq-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-900 text-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Post Sourcing RFQ (Request for Quotation)</h3>
              <p className="text-xs text-neutral-400">
                Directly dispatched to verified Bangladesh exporters & certified mills
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-neutral-900">
              RFQ Dispatched Successfully!
            </h4>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Your inquiry for <strong className="text-neutral-900">{formData.productRequirement}</strong> ({formData.targetQuantity.toLocaleString()} units) has been routed to 5 verified manufacturers matching your criteria.
            </p>
            <div className="p-3 bg-neutral-50 rounded-xl border text-xs text-neutral-600 max-w-sm mx-auto text-left space-y-1 font-mono">
              <div>Reference ID: RFQ-BD-{Math.floor(100000 + Math.random() * 900000)}</div>
              <div>Destination: {formData.destinationPort}</div>
              <div>Estimated Factory Responses: 2 - 6 Hours</div>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold cursor-pointer shadow-xs"
            >
              Done & View Sourcing Track
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {/* Sector Category */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Target Industry / Product Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value as CategoryId })}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-medium text-neutral-800 focus:outline-none focus:border-emerald-600"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Title / Requirement */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Product Name & Key Specifications *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 100% Organic Cotton Heavyweight Hoodies 380 GSM or Food-Grade Jute Sacks"
                value={formData.productRequirement}
                onChange={(e) => setFormData({ ...formData, productRequirement: e.target.value })}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Quantity & Target Unit Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Target Sourcing Quantity *
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  step={100}
                  value={formData.targetQuantity}
                  onChange={(e) => setFormData({ ...formData, targetQuantity: Number(e.target.value) })}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Target Unit Price (USD $)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={formData.targetUnitPriceUSD}
                  onChange={(e) => setFormData({ ...formData, targetUnitPriceUSD: Number(e.target.value) })}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Incoterms & Destination Port */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Requested Incoterms
                </label>
                <select
                  value={formData.incoterms}
                  onChange={(e) => setFormData({ ...formData, incoterms: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-medium text-neutral-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="FOB Chattogram Port">FOB Chattogram (Chittagong) Seaport</option>
                  <option value="FOB Mongla Port">FOB Mongla Seaport</option>
                  <option value="FOB Dhaka Air Cargo">FOB Hazrat Shahjalal International Airport (DAC)</option>
                  <option value="CIF Destination Port">CIF (Cost, Insurance & Freight)</option>
                  <option value="EXW Factory">EXW (Ex-Works Factory Floor)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Destination Port / Country
                </label>
                <input
                  type="text"
                  value={formData.destinationPort}
                  onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                  placeholder="e.g. Rotterdam, Hamburg, Newark, Felixstowe"
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Buyer Company & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marcus Vance"
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nordic Retail Group"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="sourcing@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Custom Notes / Tech Pack Specs */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Detailed Tech Pack Specs, Pantones, or Certifications Required
              </label>
              <textarea
                rows={3}
                placeholder="Include fabric composition, GSM, washing treatments, custom packaging, OEKO-TEX or GOTS organic certificates needed..."
                value={formData.specNotes}
                onChange={(e) => setFormData({ ...formData, specNotes: e.target.value })}
                className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-xs text-neutral-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Trust Assurance Notice */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start space-x-2 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Trade Protected:</strong> Quotes are issued under Bangladesh Export Promotion Bureau (EPB) guidelines with standard LC 60-day terms and pre-shipment SGS inspection options.
              </span>
            </div>

            {/* Modal Submit */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit & Dispatch RFQ</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
