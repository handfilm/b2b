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
  Printer,
  HardDrive,
  ExternalLink,
} from 'lucide-react';
import { TechPackSpec, TechPackAttachment, CategoryId } from '../types';
import { uploadTextFileToDrive, GoogleDriveFile } from '../services/googleDriveService';
import { ensureGoogleDriveToken } from '../firebase';

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

  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [driveSavedFile, setDriveSavedFile] = useState<GoogleDriveFile | null>(null);
  const [driveError, setDriveError] = useState<string | null>(null);

  const handleSaveToDrive = async () => {
    setIsSavingToDrive(true);
    setDriveError(null);
    setDriveSavedFile(null);
    try {
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
        platform: 'RAWx Bangladesh B2B Wholesale Marketplace',
        dossierType: 'CAD Graded Spec & Manufacturing Routing Dossier',
        generatedTimestamp: new Date().toISOString(),
      };

      const token = await ensureGoogleDriveToken();
      const fileName = `TechPack_${selectedProduct.id}_${selectedProduct.name.replace(/\s+/g, '_').slice(0, 30)}_${Date.now()}.json`;
      const uploaded = await uploadTextFileToDrive(token, {
        name: fileName,
        content: JSON.stringify(exportPayload, null, 2),
        mimeType: 'application/json',
        description: `B2B Garment TechPack Specification for ${selectedProduct.name} exported from RAWx`,
      });

      setDriveSavedFile(uploaded);
    } catch (err: any) {
      console.error('Save to Drive error:', err);
      setDriveError(err?.message || 'Failed to save TechPack to Google Drive.');
    } finally {
      setIsSavingToDrive(false);
    }
  };

  const handleExportPdf = () => {
    const activeColor = isCustomColor
      ? { tcx: customPantoneTcx || 'Custom TCX', name: 'Custom Shade', hex: customColorHex }
      : selectedPantone;

    const specId = `TP-${Math.floor(10000 + Math.random() * 90000)}`;
    const printDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TechPack Specification - ${specId} - ${selectedProduct.name}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; line-height: 1.4; padding: 20px; font-size: 13px; }
    .header { border-bottom: 2px solid #ff5500; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .brand { font-size: 22px; font-weight: 900; color: #111; letter-spacing: -0.5px; }
    .brand span { color: #ff5500; }
    .meta { text-align: right; font-size: 11px; color: #555; }
    .title-box { background: #fdf5f0; border-left: 4px solid #ff5500; padding: 12px 16px; margin-bottom: 20px; }
    .title-box h1 { margin: 0 0 4px 0; font-size: 18px; color: #111; }
    .title-box p { margin: 0; font-size: 12px; color: #666; font-weight: 500; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; }
    th { background: #f7f7f7; font-weight: 700; color: #333; }
    .size-table th, .size-table td { text-align: center; }
    .swatch { display: inline-block; width: 22px; height: 22px; border-radius: 4px; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px; }
    .notes-box { background: #f9f9f9; border: 1px solid #eee; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 11px; margin-bottom: 20px; white-space: pre-wrap; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; background: #ff5500; color: #fff; font-weight: bold; font-size: 10px; }
    .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 12px; font-size: 10px; color: #777; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">HANDS & HEAD <span>B2B TECHPACK STUDIO</span></div>
      <div style="font-size: 11px; color: #777; margin-top: 2px;">Export Promotion Bureau & BGMEA Production Specification</div>
    </div>
    <div class="meta">
      <div><strong>Dossier ID:</strong> ${specId}</div>
      <div><strong>Generated:</strong> ${printDate}</div>
      <div><strong>Status:</strong> Approved for Factory Line Allocation</div>
    </div>
  </div>

  <div class="title-box">
    <h1>${selectedProduct.name}</h1>
    <p>Target Category: ${selectedProduct.category.toUpperCase()} | Incoterms: ${incoterms} | Target Ex-Factory: ${targetDate || 'Standard SLA (45 Days)'}</p>
  </div>

  <h3>1. Fabric & Color Engineering Specifications</h3>
  <table>
    <tr>
      <th style="width: 25%;">Fabric / Material Weight</th>
      <td style="width: 25%;"><strong>${customFabric || fabricWeight}</strong></td>
      <th style="width: 25%;">Target Incoterms</th>
      <td style="width: 25%;">${incoterms} Chattogram / Dhaka Port</td>
    </tr>
    <tr>
      <th>Color Standard (Pantone / TCX)</th>
      <td>
        <span class="swatch" style="background-color: ${activeColor.hex};"></span>
        <strong>${activeColor.tcx}</strong> - ${activeColor.name}
      </td>
      <th>Color Hex Code</th>
      <td><span style="font-family: monospace;">${activeColor.hex.toUpperCase()}</span></td>
    </tr>
  </table>

  <h3>2. Graded Size Distribution & Unit Allocation</h3>
  <table class="size-table">
    <thead>
      <tr>
        <th>Size</th>
        <th>XS</th>
        <th>S</th>
        <th>M</th>
        <th>L</th>
        <th>XL</th>
        <th>XXL</th>
        <th>TOTAL ORDER</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Units (Pcs)</strong></td>
        <td>${sizes.XS}</td>
        <td>${sizes.S}</td>
        <td>${sizes.M}</td>
        <td>${sizes.L}</td>
        <td>${sizes.XL}</td>
        <td>${sizes.XXL}</td>
        <td><strong style="color: #ff5500; font-size: 14px;">${totalPieces.toLocaleString()} Pcs</strong></td>
      </tr>
      <tr>
        <td><strong>Ratio</strong></td>
        <td>${totalPieces > 0 ? Math.round((sizes.XS / totalPieces) * 100) : 0}%</td>
        <td>${totalPieces > 0 ? Math.round((sizes.S / totalPieces) * 100) : 0}%</td>
        <td>${totalPieces > 0 ? Math.round((sizes.M / totalPieces) * 100) : 0}%</td>
        <td>${totalPieces > 0 ? Math.round((sizes.L / totalPieces) * 100) : 0}%</td>
        <td>${totalPieces > 0 ? Math.round((sizes.XL / totalPieces) * 100) : 0}%</td>
        <td>${totalPieces > 0 ? Math.round((sizes.XXL / totalPieces) * 100) : 0}%</td>
        <td>100%</td>
      </tr>
    </tbody>
  </table>

  <h3>3. Technical Stitching, Construction & Tolerance Notes</h3>
  <div class="notes-box">${stitchingNotes || 'Standard AQL 1.5 Export Tolerance. Double needle chainstitch hem. Bartack stress points.'}</div>

  <h3>4. CAD Pattern & Artwork Manifest</h3>
  <table>
    <tr>
      <th style="width: 40%;">Attached Files</th>
      <th>Specification Type</th>
      <th>Routing Destination</th>
    </tr>
    ${attachments.length > 0 ? attachments.map(a => `
      <tr>
        <td><strong>${a.name}</strong> (${a.size})</td>
        <td>${a.type || 'CAD Spec / Pattern File'}</td>
        <td>Certified CAD Room & Plotter Station</td>
      </tr>
    `).join('') : `
      <tr>
        <td colspan="3" style="text-align: center; color: #888;">Standard factory CAD grading table applied. No external CAD overlays provided.</td>
      </tr>
    `}
  </table>

  <div class="footer">
    <div>Authorized by Bangladesh Export Trade Desk • b2b.handsandhead.com</div>
    <div>Page 1 of 1 • Escrow & SLA Guaranteed</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      // If popup blocked, download HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TechPack_${specId}_Printable.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
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
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExportPdf}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer border border-white/10"
              title="Generate printable PDF techpack dossier"
            >
              <Printer className="w-4 h-4 text-[#ff5500]" />
              <span>Export PDF Dossier</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadSpec}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center justify-center space-x-2 cursor-pointer border border-white/5"
              title="Download CAD machine-readable JSON specification"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>JSON CAD</span>
            </button>

            {/* Google Drive Save Action */}
            <button
              type="button"
              id="techpack-save-to-drive-btn"
              onClick={handleSaveToDrive}
              disabled={isSavingToDrive}
              className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer border ${
                driveSavedFile
                  ? 'bg-[#10b981]/20 border-[#10b981]/40 text-[#10b981]'
                  : 'bg-[#4285F4]/15 hover:bg-[#4285F4]/25 border-[#4285F4]/30 text-[#60a5fa] hover:text-white'
              }`}
              title="Save TechPack directly to Google Drive"
            >
              {isSavingToDrive ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin" />
                  <span>Saving to Drive...</span>
                </>
              ) : driveSavedFile ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Saved to Drive</span>
                  {driveSavedFile.webViewLink && (
                    <a
                      href={driveSavedFile.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="ml-1 hover:text-white inline-flex items-center"
                      title="View in Google Drive"
                    >
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                </>
              ) : (
                <>
                  <HardDrive className="w-3.5 h-3.5 text-[#4285F4]" />
                  <span>Save to Drive</span>
                </>
              )}
            </button>
          </div>

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
