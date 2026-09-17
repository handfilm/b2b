import React from 'react';
import {
  ShieldCheck,
  Globe2,
  Anchor,
  Building2,
  Mail,
  FileText,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  onOpenRfq: () => void;
  onOpenShippingCalc: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRfq,
  onOpenShippingCalc,
}) => {
  return (
    <footer className="bg-[#080808] text-slate-300 text-xs border-t border-white/10 mt-16">
      {/* Top Value Strip */}
      <div className="border-b border-white/10 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500] shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Chamber & EPB Bonded Verified</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                All listed manufacturers maintain valid EPB bonded warehouse licenses, BGMEA/BKMEA/BJMA accreditation, and government export BINs.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500] shrink-0 mt-0.5">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Chattogram & Mongla Seaports</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Streamlined direct container line dispatch from Chattogram (CGP) and Mongla (MGL) Ports with automated custom clearing documentation.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500] shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">50% Advance JIT Escrow</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Protected under ICC Incoterms 2020 rules with 50% milestone escrow upon lab-dip signoff and 50% upon verified Bill of Lading departure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff5500] to-[#b83800] flex items-center justify-center text-white font-black text-base shadow-lg shadow-[#ff5500]/20">
                BD
              </div>
              <span className="font-black text-white text-lg tracking-tight">
                Made in BD
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Headless global wholesale B2B client connecting international retail chains and private labels directly with verified Bangladeshi green factories.
            </p>
            <div className="text-xs text-slate-400 font-mono">
              Portal: <strong className="text-[#ff5500]">b2b.handsandhead.com</strong>
            </div>

            {/* Discrete Ecosystem Cross-Routing */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Hands & Head B2B Ecosystem:
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <a
                  href="https://admin.handsandhead.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-md bg-[#141414] border border-white/10 hover:border-[#ff5500]/50 text-slate-300 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <span>Admin Nexus</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#ff5500]" />
                </a>
                <a
                  href="https://arutemika.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-md bg-[#141414] border border-white/10 hover:border-[#ff5500]/50 text-slate-300 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <span>RAWx & ARUTEMIKA</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#ff5500]" />
                </a>
                <a
                  href="https://rmg.handsandhead.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-md bg-[#141414] border border-white/10 hover:border-[#ff5500]/50 text-slate-300 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <span>RMG Hub</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#ff5500]" />
                </a>
              </div>
            </div>
          </div>

          {/* Sourcing Sectors */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider">
              Export Sectors
            </div>
            <ul className="space-y-1.5 text-slate-400">
              <li className="hover:text-white cursor-pointer">RMG & Circular Knitwear</li>
              <li className="hover:text-white cursor-pointer">Sustainable Denim Mills</li>
              <li className="hover:text-white cursor-pointer">Golden Jute & Geo-textiles</li>
              <li className="hover:text-white cursor-pointer">Savar Crust Leathercraft</li>
              <li className="hover:text-white cursor-pointer">Fine Bone China & Ceramics</li>
              <li className="hover:text-white cursor-pointer">Black Tiger Sea Prawns</li>
            </ul>
          </div>

          {/* Buyer Services */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider">
              Buyer Trade Desk
            </div>
            <ul className="space-y-1.5 text-slate-400">
              <li onClick={onOpenRfq} className="hover:text-[#ff5500] cursor-pointer">
                Post Commercial RFQ
              </li>
              <li onClick={onOpenShippingCalc} className="hover:text-[#ff5500] cursor-pointer">
                Ocean Freight Transit Matrix
              </li>
              <li className="hover:text-white cursor-pointer">Courier Lab Dips & Swatches</li>
              <li className="hover:text-white cursor-pointer">Pre-Shipment SGS / Intertek</li>
              <li className="hover:text-white cursor-pointer">50% Advance JIT Escrow</li>
            </ul>
          </div>

          {/* Affiliations */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider">
              Verified Compliance
            </div>
            <ul className="space-y-1.5 text-slate-400">
              <li>EPB Bonded Clearance</li>
              <li>BGMEA (Garments)</li>
              <li>BKMEA (Knitwear)</li>
              <li>USGBC LEED Certified</li>
              <li>LFMEAB (Leather Footwear)</li>
              <li>Chattogram Port Authority</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs">
          <div>
            © {new Date().getFullYear()} Made in BD Global B2B Client (b2b.handsandhead.com).
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">Bonded Customs Compliance</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Incoterms 2020 Protocol</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Global Trade Desk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
