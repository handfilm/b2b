import React from 'react';
import {
  ShieldCheck,
  Globe2,
  Anchor,
  Building2,
  Mail,
  FileText,
  ExternalLink,
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
    <footer className="bg-neutral-900 text-neutral-300 text-xs border-t border-neutral-800 mt-16">
      {/* Top Value Strip */}
      <div className="border-b border-neutral-800 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm">Chamber & Government Verified</h4>
              <p className="text-neutral-400 text-xs mt-1">
                All listed manufacturers are verified members of BGMEA, BKMEA, or BJMA with verified export tax identification numbers (BIN).
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Anchor className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm">Direct Seaport Logistics</h4>
              <p className="text-neutral-400 text-xs mt-1">
                Streamlined container dispatch from Chattogram (Chittagong) Seaport and Mongla Port with pre-cleared customs documentation.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FileText className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm">Trade Assurance & LC Protection</h4>
              <p className="text-neutral-400 text-xs mt-1">
                Standard international trade security under ICC Incoterms 2020 and Irrevocable Letters of Credit guaranteed by Bangladesh Bank.
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                BD
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                Made in BD
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Global B2B wholesale marketplace connecting verified Bangladesh manufacturers, green textile mills, and export suppliers with international commercial buyers.
            </p>
            <div className="text-xs text-neutral-400 font-mono">
              Domain: <strong className="text-emerald-400">b2b.handsandhead.com</strong>
            </div>
          </div>

          {/* Sourcing Sectors */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider">
              Export Sectors
            </div>
            <ul className="space-y-1.5 text-neutral-400">
              <li className="hover:text-white cursor-pointer">RMG & Knitwear</li>
              <li className="hover:text-white cursor-pointer">Sustainable Denim</li>
              <li className="hover:text-white cursor-pointer">Golden Jute & Twine</li>
              <li className="hover:text-white cursor-pointer">Savar Crust Leather</li>
              <li className="hover:text-white cursor-pointer">Fine Bone China</li>
              <li className="hover:text-white cursor-pointer">Black Tiger Shrimp</li>
            </ul>
          </div>

          {/* Buyer Services */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider">
              Buyer Services
            </div>
            <ul className="space-y-1.5 text-neutral-400">
              <li onClick={onOpenRfq} className="hover:text-emerald-400 cursor-pointer">
                Submit Custom RFQ
              </li>
              <li onClick={onOpenShippingCalc} className="hover:text-emerald-400 cursor-pointer">
                Ocean Freight Transit Matrix
              </li>
              <li className="hover:text-white cursor-pointer">Request Lab Dips & Samples</li>
              <li className="hover:text-white cursor-pointer">Inspection (SGS / Intertek)</li>
              <li className="hover:text-white cursor-pointer">Letter of Credit (LC) Terms</li>
            </ul>
          </div>

          {/* Official Bodies */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider">
              Affiliations
            </div>
            <ul className="space-y-1.5 text-neutral-400">
              <li>EPB Bangladesh</li>
              <li>BGMEA (Garments)</li>
              <li>BKMEA (Knitwear)</li>
              <li>BJMA (Jute Mills)</li>
              <li>LFMEAB (Leather Footwear)</li>
              <li>Chattogram Port Authority</li>
            </ul>
          </div>
        </div>

        {/* Copyright & Subfooter */}
        <div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-400 text-xs">
          <div>
            © {new Date().getFullYear()} Made in BD Global Market Place (b2b.handsandhead.com). All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-neutral-200 cursor-pointer">Export Regulations</span>
            <span>•</span>
            <span className="hover:text-neutral-200 cursor-pointer">Privacy Notice</span>
            <span>•</span>
            <span className="hover:text-neutral-200 cursor-pointer">Contact Trade Desk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
