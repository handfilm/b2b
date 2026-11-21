import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ECOSYSTEM_HOME_URL } from '../config/wings';

interface EcosystemOsBadgeProps {
  variant?: 'floating' | 'inline';
  className?: string;
}

export const EcosystemOsBadge: React.FC<EcosystemOsBadgeProps> = ({
  variant = 'inline',
  className = '',
}) => {
  if (variant === 'floating') {
    return (
      <a
        href={ECOSYSTEM_HOME_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Engineered by HANDS & HEAD OS — Visit handsandhead.com"
        className={`hidden lg:inline-flex fixed left-4 bottom-4 z-40 items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14161A]/95 backdrop-blur-md border border-[#C9A24B]/35 hover:border-[#C9A24B]/80 text-[11px] font-medium text-zinc-300 hover:text-white shadow-lg shadow-black/60 transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] ${className}`}
      >
        <span className="whitespace-nowrap tracking-tight">
          Engineered by <strong className="font-bold text-[#E2C275]">HANDS &amp; HEAD OS</strong>
        </span>
        <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A24B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
      </a>
    );
  }

  return (
    <a
      href={ECOSYSTEM_HOME_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Engineered by HANDS & HEAD OS — Visit handsandhead.com"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14161A] border border-[#C9A24B]/35 hover:border-[#C9A24B]/80 text-[11px] font-medium text-zinc-300 hover:text-white transition-all duration-200 group whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] ${className}`}
    >
      <span>
        Engineered by <strong className="font-bold text-[#E2C275]">HANDS &amp; HEAD OS</strong>
      </span>
      <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A24B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
    </a>
  );
};
