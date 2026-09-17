import React, { useState, useId } from 'react';
import {
  X,
  Layers,
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Download,
  Send,
  Palette,
  Sparkles,
  Info,
  Check,
  FileCode,
  FileCheck,
  Calculator,
} from 'lucide-react';
import { TechPackSpec, TechPackAttachment, CategoryId } from '../types';

interface TechPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTechPack: (spec: TechPackSpec) => void;
  initialCategory?: CategoryId;
}

const PRODUCT_TYPES = [
  { id: 'tshirt', name: 'Heavyweight Streetwear T-Shirt (Oversized / Drop-Shoulder)', category: 'rmg-apparel' as CategoryId, defaultGsm: '240 GSM Combed Cotton' },
  { id: 'hoodie', name: 'French Terry Pullover Hoodie (Double-Layered Hood)', category: 'rmg-apparel' as CategoryId, defaultGsm: '380 GSM Heavy French Terry' },
  { id: 'denim', name: 'Raw Selvedge Denim Jeans (5-Pocket Western)', category: 'rmg-apparel' as CategoryId, defaultGsm: '13.5 oz Ringspun Indigo Denim' },
  { id: 'workwear', name: 'High-Visibility Flame-Retardant Industrial Parka', category: 'rmg-apparel' as CategoryId, defaultGsm: '280 GSM Poly-Cotton Ripstop w/ PU Coat' },
  { id: 'leather-bag', name: 'Full-Grain Veg-Tan Leather Weekender Duffel', category: 'leather-footwear' as CategoryId, defaultGsm: '1.8mm Full-Grain Cowhide Leather' },
  { id: 'footwear', name: 'Blake-Stitched Leather Oxford Shoes', category: 'leather-footwear' as CategoryId, defaultGsm: 'Calfskin Upper + Vibram Rubber Lug Sole' },
  { id: 'jute-tote', name: 'Reinforced Biodegradable Hessian Shopping Tote', category: 'jute-eco' as CategoryId, defaultGsm: '320 GSM Laminated Natural Jute' },
  { id: 'polo', name: 'Mercerized Pima Cotton Interlock Polo', category: 'rmg-apparel' as CategoryId, defaultGsm: '210 GSM Combed Pima Interlock' },
];

const FABRIC_WEIGHT_OPTIONS = [
  '180 GSM Single Jersey 100% Combed Cotton',
  '240 GSM Heavyweight Organic Single Jersey',
  '320 GSM Diagonal French Terry Cotton',
  '380 GSM 100% Cotton Loopback Terry',
  '450 GSM Heavy Fleece (Brushed Interior)',
  '11.5 oz Comfort-Stretch Ring Denim',
  '13.5 oz Rigid Selvedge Indigo Denim',
  '1.8mm Savar Veg-Tan Full-Grain Leather',
  '300 GSM Heavy Bleached Jute Canvas',
  '220 GSM EN ISO 20471 Hi-Vis Ripstop',
];

const PANTONE_PRESETS = [
  { tcx: '19-4052 TCX', name: 'Classic Blue', hex: '#0f4c81' },
  { tcx: '19-0303 TCX', name: 'Jet Black', hex: '#1d1d1b' },
  { tcx: '11-0601 TCX', name: 'Bright White', hex: '#f4f5f0' },
  { tcx: '17-1564 TCX', name: 'Chili Pepper Red', hex: '#9b1b30' },
  { tcx: '18-0527 TCX', name: 'Military Olive Green', hex: '#635f48' },
  { tcx: '14-4115 TCX', name: 'Cerulean Blue', hex: '#98b2d1' },
  { tcx: '16-1340 TCX', name: 'Tuscan Sun Ochre', hex: '#d9a04b' },
  { tcx: '19-1220 TCX', name: 'Espresso Bean Brown', hex: '#362b28' },
];

export const TechPackModal: React.FC<TechPackModalProps> = ({
  isOpen,
  onClose,
  onSubmitTechPack,
  initialCategory = 'rmg-apparel',
}) => {
  const fileInputId = useId();
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_TYPES[0]);
  const [fabricWeight, setFabricWeight] = useState(PRODUCT_TYPES[0].defaultGsm);
  const [customFabric, setCustomFabric] = useState('');
  const [selectedPantone, setSelectedPantone] = useState(PANTONE_PRESETS[1]);
  const [customPantoneTcx, setCustomPantoneTcx] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#1d1d1b');
  const [isCustomColor, setIsCustomColor] = useState(false);

  // Size Grid Breakdown
  const [sizes, setSizes] = useState({
    XS: 100,
    S: 250,
    M: 400,
    L: 350,
    XL: 150,
    XXL: 50,
  });

  const [stitchingNotes, setStitchingNotes] = useState(
    'Twin-needle coverstitch on hem and cuffs. 1x1 cotton/spandex rib neckband (2.5 cm height). Reinforced shoulder-to-shoulder herringbone taping. Garment bio-polish enzyme wash finish.'
  );
  const [incoterms, setIncoterms] = useState<'FOB' | 'CIF' | 'EXW' | 'CFR'>('FOB');
  const [targetDate, setTargetDate] = useState('2026-10-30');

  // File dropzone state
  const [attachments, setAttachments] = useState<TechPackAttachment[]>([
    {
      name: 'Oversized_Crewneck_Graded_SpecSheet_v2.pdf',
      size: '2.4 MB',
      type: 'application/pdf',
      uploadedAt: 'Today',
    },
    {
      name: 'Graded_Patterns_CAD_DXF.zip',
      size: '5.1 MB',
      type: 'application/zip',
      uploadedAt: 'Today',
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalPieces = Object.values(sizes).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

  const handleSizeChange = (key: keyof typeof sizes, val: string) => {
    const num = parseInt(val, 10) || 0;
    setSizes((prev) => ({ ...prev, [key]: Math.max(0, num) }));
  };

  const handleProductSelect = (prod: (typeof PRODUCT_TYPES)[0]) => {
    setSelectedProduct(prod);
    setFabricWeight(prod.defaultGsm);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: TechPackAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const sizeMb = (f.size / (1024 * 1024)).toFixed(1);
      newItems.push({
        name: f.name,
        size: `${sizeMb} MB`,
        type: f.type || 'application/octet-stream',
        uploadedAt: 'Just now',
      });
    }
    setAttachments((prev) => [...prev, ...newItems]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDownloadSpec = () => {
    const activeColor = isCustomColor
      ? { tcx: customPantoneTcx || 'Custom TCX', name: 'Custom Shade', hex: customColorHex }
      : selectedPantone;

    const exportPayload = {
      specTitle: selectedProduct.name,
      category: selectedProduct.category,
      fabricWeight: customFabric || fabricWeight,
      colorSpecification: activeColor,
      sizeBreakdown: sizes,
      totalQuantity: totalPieces,
      incoterms,
      targetExFactoryDate: targetDate,
      technicalConstructionNotes: stitchingNotes,
      attachedFiles: attachments.map((a) => a.name),
      generatedBy: 'Hands & Head B2B TechPack Studio',
      generatedTimestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TechPack_Spec_${selectedProduct.id}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const activeColor = isCustomColor
      ? { tcx: customPantoneTcx || 'Custom TCX', name: 'Custom Shade', hex: customColorHex }
      : selectedPantone;

    const spec: TechPackSpec = {
      id: `TP-${Math.floor(10000 + Math.random() * 90000)}`,
      productType: selectedProduct.name,
      productCategory: selectedProduct.category,
      fabricWeight: customFabric || fabricWeight,
      colorTcx: activeColor.tcx,
      colorName: activeColor.name,
      colorHex: activeColor.hex,
      sizes,
      totalPieces,
      stitchingNotes,
      incoterms,
      targetDate,
      attachedFiles: attachments,
      submittedAt: new Date().toISOString().split('T')[0],
    };

    setSubmittedMessage('TechPack successfully verified and broadcast to certified LEED Platinum & Gold production lines.');
    onSubmitTechPack(spec);

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="techpack-modal-dialog"
        className="relative w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-[#141414] via-[#111111] to-[#141414] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Interactive TechPack Studio
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#ff5500]/20 text-[#ff5500] border border-[#ff5500]/30">
                  CAD / Spec Builder
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Assemble manufacturing requirements, Pantone TCX swatches, size splits & direct factory routing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          {submittedMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{submittedMessage}</span>
            </div>
          )}

          {/* Section 1: Garment / Product Type */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              1. Garment / Product Silhouette
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PRODUCT_TYPES.map((prod) => {
                const isSelected = selectedProduct.id === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleProductSelect(prod)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#ff5500] bg-[#ff5500]/10 ring-1 ring-[#ff5500]'
                        : 'border-white/10 bg-[#141414] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">{prod.category}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#ff5500]" />}
                    </div>
                    <p className="text-xs font-bold text-white leading-snug">{prod.name}</p>
                    <span className="text-[11px] text-[#ff5500] mt-1 font-mono">{prod.defaultGsm}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Fabric & Material Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                2. Fabric / Material Weight (GSM / Oz)
              </label>
              <select
                value={fabricWeight}
                onChange={(e) => {
                  setFabricWeight(e.target.value);
                  setCustomFabric('');
                }}
                className="w-full px-3 py-2.5 text-xs text-white rounded-xl bg-[#141414] border border-white/10 focus:outline-none focus:border-[#ff5500] cursor-pointer"
              >
                {FABRIC_WEIGHT_OPTIONS.map((fw) => (
                  <option key={fw} value={fw} className="bg-[#121212] text-white">
                    {fw}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Or Custom Yarn / Density Spec
              </label>
              <input
                type="text"
                value={customFabric}
                onChange={(e) => setCustomFabric(e.target.value)}
                placeholder="e.g. 260 GSM French Terry 80/20 Organic/Recycled"
                className="w-full px-3 py-2 text-xs text-white rounded-xl bg-[#141414] border border-white/10 focus:outline-none focus:border-[#ff5500]"
              />
            </div>
          </div>

          {/* Section 3: Color Specifications (Pantone / TCX) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <Palette className="w-3.5 h-3.5 text-[#ff5500]" />
                <span>3. Color Specification (Pantone / TCX Codes)</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomColor(!isCustomColor)}
                className="text-[11px] text-[#ff5500] hover:underline cursor-pointer"
              >
                {isCustomColor ? 'Use Standard TCX Palette' : 'Enter Custom Hex / TCX'}
              </button>
            </div>

            {!isCustomColor ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PANTONE_PRESETS.map((color) => {
                  const isSelected = selectedPantone.tcx === color.tcx;
                  return (
                    <button
                      key={color.tcx}
                      type="button"
                      onClick={() => setSelectedPantone(color)}
                      className={`p-2.5 rounded-xl border flex items-center space-x-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#ff5500] bg-[#ff5500]/10 ring-1 ring-[#ff5500]'
                          : 'border-white/10 bg-[#141414] hover:border-white/20'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg border border-white/20 shrink-0 shadow-xs"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-left min-w-0">
                        <p className="text-xs font-bold text-white truncate">{color.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{color.tcx}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#141414] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Pantone TCX Code</label>
                  <input
                    type="text"
                    value={customPantoneTcx}
                    onChange={(e) => setCustomPantoneTcx(e.target.value)}
                    placeholder="e.g. 19-4052 TCX"
                    className="w-full px-3 py-1.5 text-xs text-white rounded-lg bg-[#1e1e1e] border border-white/15 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Color Hex Preview</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={customColorHex}
                      onChange={(e) => setCustomColorHex(e.target.value)}
                      className="w-8 h-8 rounded border border-white/20 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={customColorHex}
                      onChange={(e) => setCustomColorHex(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs font-mono text-white rounded-lg bg-[#1e1e1e] border border-white/15"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-4 sm:pt-0">
                  <div
                    className="w-9 h-9 rounded-lg border border-white/20 shrink-0"
                    style={{ backgroundColor: customColorHex }}
                  />
                  <span className="text-xs text-slate-300 font-bold">Live TCX Lab Swatch</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Size Breakdown Grid */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <Calculator className="w-3.5 h-3.5 text-[#ff5500]" />
                <span>4. Size Breakdown Grid (Units per Size)</span>
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-bold">Total Order Volume:</span>
                <span className="text-sm font-black text-[#ff5500] font-mono px-2 py-0.5 rounded-md bg-[#ff5500]/15 border border-[#ff5500]/30">
                  {totalPieces.toLocaleString()} Pcs
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                <div key={sz} className="p-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-center">
                  <span className="text-xs font-black text-slate-300 block mb-1">{sz}</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={sizes[sz]}
                    onChange={(e) => handleSizeChange(sz, e.target.value)}
                    className="w-full text-center py-1 text-xs font-mono font-bold text-white bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff5500]"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {totalPieces > 0 ? Math.round((sizes[sz] / totalPieces) * 100) : 0}% ratio
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Technical Stitching Notes & Incoterms */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                5. Stitching, Construction & Tolerance Notes
              </label>
              <textarea
                rows={3}
                value={stitchingNotes}
                onChange={(e) => setStitchingNotes(e.target.value)}
                className="w-full p-2.5 text-xs text-white rounded-xl bg-[#141414] border border-white/10 focus:outline-none focus:border-[#ff5500]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Target Incoterms & Date
              </label>
              <div className="space-y-2">
                <select
                  value={incoterms}
                  onChange={(e) => setIncoterms(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs text-white rounded-xl bg-[#141414] border border-white/10 focus:outline-none focus:border-[#ff5500]"
                >
                  <option value="FOB">FOB Chattogram / Dhaka Port</option>
                  <option value="CIF">CIF Destination Port</option>
                  <option value="CFR">CFR Cost and Freight</option>
                  <option value="EXW">EXW Factory Gate</option>
                </select>

                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs text-white rounded-xl bg-[#141414] border border-white/10 focus:outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>
          </div>

          {/* Section 6: File Dropzone (CAD .DXF, PDFs, Spec Sheets) */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              6. Technical Attachments Dropzone (CAD .DXF, PDFs, Graded Pattern Rulers)
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all ${
                isDragging
                  ? 'border-[#ff5500] bg-[#ff5500]/10'
                  : 'border-white/15 bg-[#141414]/80 hover:border-white/30'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-[#ff5500] mx-auto mb-2" />
              <p className="text-xs font-bold text-white mb-1">
                Drag & Drop CAD Files (.dxf, .dwg), TechPack PDFs, or High-Res Artwork
              </p>
              <p className="text-[11px] text-slate-400 mb-3">
                Max 50 MB per file. Direct encrypted transmission to factory CAD pattern rooms.
              </p>
              <input
                type="file"
                id={fileInputId}
                multiple
                accept=".pdf,.dxf,.dwg,.zip,.png,.jpg,.ai"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <label
                htmlFor={fileInputId}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer border border-white/15"
              >
                Browse Files from Device
              </label>
            </div>

            {/* Uploaded File List */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#141414] border border-white/10 text-xs"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <FileCheck className="w-4 h-4 text-[#ff5500] shrink-0" />
                      <span className="font-bold text-white truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">({file.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#121212] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDownloadSpec}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer border border-white/10"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span>Export Spec Sheet (.JSON / Spec)</span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-extrabold shadow-lg shadow-[#ff5500]/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast TechPack as Verified RFQ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
