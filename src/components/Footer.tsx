import React from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../context/I18nContext';
import {
  ShieldCheck,
  Globe2,
  Anchor,
  Building2,
  ExternalLink,
  Sparkles,
  CreditCard,
  Server,
  Award,
  ArrowRight,
  Cpu,
  Layers,
  CheckCircle2,
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
  const { t, toDigits, lang } = useI18n();
  const isBn = lang === 'BN';
  const isDark = theme === 'dark';

  const valueGuarantees = [
    {
      icon: ShieldCheck,
      color: 'text-[#e11d48]',
      bg: 'bg-[#e11d48]/10 border-[#e11d48]/25',
      title: isBn ? '৫০% জেআইটি এসক্রো' : '50% JIT Escrow',
      tag: 'ICC INCOTERMS 2020',
      tagColor: 'text-[#e11d48] bg-[#e11d48]/10 border-[#e11d48]/20',
      desc: isBn ? 'জাহাজের বি/এল এবং তৃতীয় পক্ষের কিউসি পাসের পর অর্থ অবমুক্ত।' : 'Milestone disbursements released on B/L and third-party QC pass.',
    },
    {
      icon: Anchor,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/25',
      title: isBn ? 'চট্টগ্রাম ও মোংলা সমুদ্রবন্দর' : 'CGP & MGL Seaports',
      tag: isBn ? 'গ্রিন কাস্টমস' : 'GREEN CUSTOMS',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      desc: isBn ? 'সরাসরি ফিডার জাহাজ চলাচল ও ইপিবি ডিজিটাল কাস্টমস ছাড়পত্র।' : 'Direct feeder departures with automated EPB export clearances.',
    },
    {
      icon: Award,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/25',
      title: isBn ? 'লিড প্ল্যাটিনাম কারখানা' : 'LEED Platinum Vault',
      tag: 'ESG AUDITED',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      desc: isBn ? 'ওইকো-টেক্স ১০০, বায়োলজিক্যাল ইটিপি এবং অ্যাকর্ড/আরএসসি সার্টিফাইড।' : 'OEKO-TEX 100, biological ETP, and Accord/RSC structural certs.',
    },
    {
      icon: Cpu,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/25',
      title: isBn ? 'র-এক্স এআই ইঞ্জিন' : 'RAWx Bot Engine',
      tag: isBn ? 'এআই রাউটার' : 'AI ROUTER',
      tagColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      desc: isBn ? '২৪/৭ ক্যাড স্পেকস, এইচএস ট্যারিফ ম্যাপিং এবং ফ্যাক্টরি বণ্টন।' : '24/7 vector CAD specs, HS tariff mapping, and factory allocation.',
    },
  ];

  return (
    <footer
      id="main-footer"
      className={`text-xs border-t mt-16 font-sans transition-colors ${
        isDark
          ? 'bg-[#0a0a0a] text-slate-300 border-white/10'
          : 'bg-white text-slate-700 border-slate-200'
      }`}
    >
      {/* 1. Value Protection Strip: Dynamic Interactive Tiles with Sleek Hover Animation */}
      <div
        className={`border-b py-4 px-4 transition-colors ${
          isDark ? 'bg-[#0f0f0f] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {valueGuarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                className={`group p-3 rounded-xl border flex items-start space-x-3 transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#141414] border-white/10 hover:border-white/20 hover:shadow-lg'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${item.bg} ${item.color} group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4
                      className={`font-black text-xs sm:text-[13px] truncate ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold uppercase ${item.tagColor}`}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-snug line-clamp-1 group-hover:line-clamp-none transition-all">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. Main 4-Column Institutional Layout: Minimalist, Fast, Pro Hover Tiles */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Column 1: Trade Desk & Statutory */}
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-[#e11d48]" />
              <h4
                className={`font-black uppercase tracking-wider text-xs ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {isBn ? 'বাণিজ্য ডেস্ক ও আইনি সংস্থা' : 'Trade Desk & Statutory'}
              </h4>
            </div>

            <div className="space-y-1.5">
              <a
                href="http://epb.gov.bd"
                target="_blank"
                rel="noreferrer"
                className={`group flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15 text-slate-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="truncate group-hover:text-[#ff1e42] transition-colors">
                  {isBn ? 'রপ্তানি উন্নয়ন ব্যুরো (ইপিবি)' : 'Export Promotion Bureau (EPB)'}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-[#ff1e42] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </a>

              <a
                href="https://www.bgmea.com.bd"
                target="_blank"
                rel="noreferrer"
                className={`group flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15 text-slate-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="truncate group-hover:text-[#ff1e42] transition-colors">
                  {isBn ? 'বিজিএমইএ তৈরি পোশাক ডিরেক্টরি' : 'BGMEA RMG Exporter Directory'}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-[#ff1e42] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </a>

              <a
                href="http://bkmea.com"
                target="_blank"
                rel="noreferrer"
                className={`group flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15 text-slate-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="truncate group-hover:text-[#ff1e42] transition-colors">
                  {isBn ? 'বিকেএমইএ নিটওয়্যার সমিতি' : 'BKMEA Knitwear Association'}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-[#ff1e42] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </a>

              <div
                className={`flex items-center justify-between p-2 rounded-lg border text-[11px] ${
                  isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-slate-400">{isBn ? 'শুল্কমুক্ত জিএসপি ও ডিএফকিউএফ' : 'Duty-Free GSP & DFQF Hub'}</span>
                <span className="font-mono font-bold text-emerald-400 text-[10px]">
                  EU / UK / JP
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Regional Manufacturing Hubs */}
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <h4
                className={`font-black uppercase tracking-wider text-xs ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {isBn ? 'আঞ্চলিক কারখানা হাব' : 'Regional Factory Hubs'}
              </h4>
            </div>

            <div className="space-y-1.5">
              {[
                { name: isBn ? 'গাজীপুর পোশাক ও ডেনিম' : 'Gazipur Garment & Denim', count: isBn ? `${toDigits(1840)} মিলস` : '1,840 Mills' },
                { name: isBn ? 'সাভার ও আশুলিয়া ডিইপিজেড' : 'Savar & Ashulia DEPZ', count: isBn ? 'বন্ডেড ইপিজেড' : 'Bonded EPZ' },
                { name: isBn ? 'নারায়ণগঞ্জ নিট সিটি' : 'Narayanganj Knit City', count: isBn ? `${toDigits(920)} কারখানা` : '920 Units' },
                { name: isBn ? 'চট্টগ্রাম সমুদ্রবন্দর ইপিজেড' : 'Chattogram Seaport EPZ', count: isBn ? 'সরাসরি ফিডার' : 'Direct Feeder' },
              ].map((hub, i) => (
                <div
                  key={i}
                  className={`group flex items-center justify-between p-2 rounded-lg border transition-all hover:translate-x-0.5 ${
                    isDark
                      ? 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="truncate">{hub.name}</span>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-1">
                    {hub.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Logistics & Commercial Escrow */}
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-[#e11d48]" />
              <h4
                className={`font-black uppercase tracking-wider text-xs ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {isBn ? 'লজিস্টিকস ও এসক্রো' : 'Logistics & Escrow'}
              </h4>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={onOpenShippingCalc}
                className={`w-full group flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer text-left ${
                  isDark
                    ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15 text-slate-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="group-hover:text-emerald-400 transition-colors">
                  {isBn ? 'ফিডার সূচি (চট্টগ্রাম-সিঙ্গাপুর-রটারড্যাম)' : 'Feeder Schedules (CGP-SIN-RTM)'}
                </span>
                <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={onOpenRfq}
                className={`w-full group flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer text-left ${
                  isDark
                    ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15 text-slate-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="group-hover:text-[#ff1e42] transition-colors">
                  {isBn ? 'কাস্টমস শুল্ক ও এইচএস কোড সার্চ' : 'Custom Tariff & HS Code Lookup'}
                </span>
                <ArrowRight className="w-3 h-3 text-[#e11d48] group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
              </button>

              <div
                className={`flex items-center justify-between p-2 rounded-lg border text-[11px] ${
                  isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-slate-400">{isBn ? 'সুইফট এমটি৭০০ এল/সি' : 'Swift MT700 L/C at Sight'}</span>
                <span className="font-mono font-bold text-emerald-400 text-[10px]">{isBn ? 'সক্রিয়' : 'Active'}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Infrastructure & Master Hub Sync */}
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <h4
                className={`font-black uppercase tracking-wider text-xs ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {isBn ? 'অবকাঠামো ও সিঙ্ক' : 'Infrastructure & Sync'}
              </h4>
            </div>

            <div className="space-y-1.5">
              <a
                href="https://handsandhead.ai.studio"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-2 rounded-lg bg-[#e11d48]/10 hover:bg-[#e11d48]/20 border border-[#e11d48]/30 transition-all text-[#e11d48]"
              >
                <span className="font-bold truncate">handsandhead.ai.studio</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
              </a>

              <div
                className={`flex items-center justify-between p-2 rounded-lg border text-[11px] ${
                  isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-slate-400">{isBn ? 'নিরাপত্তা ও এনক্রিপশন' : 'Security & Encryption'}</span>
                <span className="font-mono text-white text-[10px]">TLS 1.3 / 256-bit</span>
              </div>

              {onOpenAiAssistant && (
                <button
                  type="button"
                  onClick={onOpenAiAssistant}
                  className="w-full group flex items-center justify-center space-x-1.5 p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold transition-all cursor-pointer text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isBn ? 'র-এক্স এআই বট চালু করুন' : 'Launch RAWx Bot Agent'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Strip: Pro Fast Look & System Status Bar */}
      <div
        id="footer-bottom-strip"
        className={`border-t py-3.5 px-4 pb-[calc(var(--mobile-dock-height,84px)+env(safe-area-inset-bottom,0px)+1.25rem)] lg:pb-3.5 transition-colors ${
          isDark ? 'bg-[#060606] border-white/10' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-[#e11d48] text-white flex items-center justify-center font-black text-[10px]">
              BD
            </div>
            <span className="font-bold text-slate-300">{isBn ? 'মেড ইন বাংলাদেশ' : 'Made in BD'}</span>
            <span>•</span>
            <span className="truncate">
              © {new Date().getFullYear()} {isBn ? 'বি২বি হোলসেল গেটওয়ে • ফেডারেটেড ট্রেড ম্যাট্রিক্স' : 'B2B Wholesale Gateway • Federated Trade Matrix'}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono font-bold">{toDigits('99.99%')} {isBn ? 'আপটাইম' : 'Uptime'}</span>
            </span>

            <span className="text-slate-600">|</span>

            <a
              href="https://handsandhead.ai.studio"
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 hover:text-white font-mono flex items-center space-x-1 transition-colors"
            >
              <span>{isBn ? 'মাস্টার হাব:' : 'Master Hub:'}</span>
              <strong className="text-emerald-400">handsandhead.ai.studio</strong>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
