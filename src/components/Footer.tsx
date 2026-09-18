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
  CreditCard,
  Lock,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Server,
  Activity,
  Award,
  Check,
} from 'lucide-react';

interface FooterProps {
  onOpenRfq: () => void;
  onOpenShippingCalc: () => void;
  onOpenTechPackStudio?: () => void;
  onOpenAiAssistant?: () => void;
  theme?: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRfq,
  onOpenShippingCalc,
  onOpenTechPackStudio,
  onOpenAiAssistant,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  return (
    <footer
      id="main-footer"
      className={`text-xs border-t mt-16 font-sans transition-colors ${
        isDark
          ? 'bg-[#0a0a0a] text-slate-300 border-white/10'
          : 'bg-white text-slate-700 border-slate-200'
      }`}
    >
      {/* 1. Value Protection Strip */}
      <div
        className={`border-b py-6 px-4 transition-colors ${
          isDark ? 'bg-[#0f0f0f] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#e11d48]/15 border border-[#e11d48]/30 flex items-center justify-center text-[#e11d48] shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
                50% JIT Escrow Protection
              </h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Guaranteed milestone disbursements under ICC Incoterms 2020 rules from lab-dip to Bill of Lading.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] shrink-0 mt-0.5">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
                Chattogram & Mongla Ports
              </h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Direct feeder vessel departures from CGP/MGL seaports with EPB automated green customs clearance.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#e11d48]/15 border border-[#e11d48]/30 flex items-center justify-center text-[#e11d48] shrink-0 mt-0.5">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
                LEED & ESG Verified Vault
              </h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Audited factory floor compliance covering LEED Platinum, OEKO-TEX Standard 100, and biological ETP.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
                RAWx Bot Trade Agent
              </h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                24/7 autonomous CAD spec generator, HS tariff classifier, and real-time mill capacity matching.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 4-Column Institutional Layout */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Trade Desk */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-[#e11d48]" />
              <h4 className={`font-black uppercase tracking-wider text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Trade Desk & Statutory
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official export facilitation and compliance gateway integrated with Bangladesh trade bodies.
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="http://epb.gov.bd"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#ff1e42] transition-colors flex items-center justify-between"
                >
                  <span>Export Promotion Bureau (EPB)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.bgmea.com.bd"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#ff1e42] transition-colors flex items-center justify-between"
                >
                  <span>BGMEA RMG Exporter Directory</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="http://bkmea.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#ff1e42] transition-colors flex items-center justify-between"
                >
                  <span>BKMEA Knitwear Association</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <span className="text-slate-400 flex items-center justify-between">
                  <span>Certificate of Origin Verification</span>
                  <span className="text-[10px] font-mono text-[#10b981]">EPB-DIGITAL</span>
                </span>
              </li>
              <li>
                <span className="text-slate-400 flex items-center justify-between">
                  <span>Duty-Free GSP & DFQF Hub</span>
                  <span className="text-[10px] font-mono text-[#10b981]">EU / UK / JP</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: Regional Hubs */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Globe2 className="w-4 h-4 text-[#10b981]" />
              <h4 className={`font-black uppercase tracking-wider text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Regional Manufacturing Hubs
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Industrial clusters hosting over 5,000+ bonded RMG, denim, textile, and artisan units.
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span>Gazipur Garment & Denim Cluster</span>
                <span className="text-[10px] text-slate-400 font-mono">1,840 Mills</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Savar & Ashulia Export Processing Zone</span>
                <span className="text-[10px] text-slate-400 font-mono">DEPZ Bonded</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Narayanganj Circular Knit City</span>
                <span className="text-[10px] text-slate-400 font-mono">920 Dyeing Units</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Chattogram Seaport & EPZ Gateway</span>
                <span className="text-[10px] text-slate-400 font-mono">Direct Feeder</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Hemayetpur Tannery & Footwear Park</span>
                <span className="text-[10px] text-slate-400 font-mono">LWG Certified</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Export Logistics & Finance */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-[#e11d48]" />
              <h4 className={`font-black uppercase tracking-wider text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Export Logistics & Finance
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bank-backed commercial settlement channels and global sea/air freight booking.
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span>50% Advance JIT Escrow Protection</span>
                <span className="text-[10px] font-mono text-[#10b981] font-bold">Standard</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Irrevocable Bank L/C at Sight</span>
                <span className="text-[10px] font-mono text-[#10b981]">Swift MT700</span>
              </li>
              <li className="flex items-center justify-between">
                <span>ICC Incoterms 2020 (FOB, CIF, DDP)</span>
                <span className="text-[10px] font-mono text-slate-400">Compliant</span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenShippingCalc}
                  className="hover:text-[#10b981] transition-colors flex items-center justify-between w-full text-left cursor-pointer"
                >
                  <span>Feeder Vessel Schedules (CGP-SIN-RTM)</span>
                  <ArrowRight className="w-3 h-3 text-[#10b981]" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenRfq}
                  className="hover:text-[#ff1e42] transition-colors flex items-center justify-between w-full text-left cursor-pointer"
                >
                  <span>Custom Tariff & HS Code Lookup</span>
                  <ArrowRight className="w-3 h-3 text-[#e11d48]" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Infrastructure & Tech */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-[#10b981]" />
              <h4 className={`font-black uppercase tracking-wider text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Infrastructure & Tech
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise REST API and real-time webhook pipeline synchronizing with central operations.
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span>REST/Webhook Sync Engine</span>
                <span className="text-[10px] font-mono text-[#10b981]">admin.handsandhead.com</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Security Encryption Protocol</span>
                <span className="text-[10px] font-mono text-white">TLS 1.3 / 256-bit SSL</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Data Vault & Compliance</span>
                <span className="text-[10px] font-mono text-[#10b981]">ISO 27001</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Automated CAD TechPack Parsing</span>
                <span className="text-[10px] font-mono text-white">Vector Engine</span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAiAssistant}
                  className="hover:text-[#ff1e42] transition-colors flex items-center space-x-1.5 cursor-pointer font-bold text-[#ff1e42]"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Launch RAWx Bot Trade Agent</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Strip: Copyright & System Status */}
      <div
        className={`border-t py-4 px-4 transition-colors ${
          isDark ? 'bg-[#060606] border-white/10' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-[#e11d48] text-white flex items-center justify-center font-black text-[10px]">
              BD
            </div>
            <span className="font-bold text-slate-300">Made in BD</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} Made in BD B2B Global Sourcing Platform. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center space-x-1 text-[#10b981]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="font-mono font-bold">99.99% Uptime</span>
            </span>

            <span className="text-slate-500">|</span>

            <span className="text-slate-400 font-mono">
              Live Sync: <strong className="text-white">admin.handsandhead.com</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
