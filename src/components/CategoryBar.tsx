import React from 'react';
import {
  LayoutGrid,
  Shirt,
  Leaf,
  Footprints,
  Home,
  Coffee,
  Fish,
  Pill,
  Sparkles,
} from 'lucide-react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/mockData';
import { useI18n } from '../context/I18nContext';

interface CategoryBarProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
}

const categoryTranslationsBn: Record<string, string> = {
  all: 'সব ক্যাটাগরি',
  'rmg-apparel': 'পোশাক ও আরএমজি',
  'jute-eco': 'পাট ও পরিবেশবান্ধব',
  'leather-footwear': 'চামড়া ও পাদুকা',
  'home-textiles': 'হোম টেক্সটাইল',
  'ceramics-tableware': 'সিরামিক ও টেবিলওয়্যার',
  'agro-seafood': 'কৃষি ও হিমায়িত সিফুড',
  pharmaceuticals: 'ফার্মাসিউটিক্যালস ও স্বাস্থ্য',
  'handicrafts-brass': 'হস্তশিল্প ও ঐতিহ্য',
};

const iconMap: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid className="w-3.5 h-3.5" />,
  Shirt: <Shirt className="w-3.5 h-3.5" />,
  Leaf: <Leaf className="w-3.5 h-3.5" />,
  Footprints: <Footprints className="w-3.5 h-3.5" />,
  Home: <Home className="w-3.5 h-3.5" />,
  Coffee: <Coffee className="w-3.5 h-3.5" />,
  Fish: <Fish className="w-3.5 h-3.5" />,
  Pill: <Pill className="w-3.5 h-3.5" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { toDigits, lang } = useI18n();
  const isBn = lang === 'BN';

  return (
    <div className="bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const displayName = isBn && categoryTranslationsBn[cat.id] ? categoryTranslationsBn[cat.id] : cat.name;
            return (
              <button
                key={cat.id}
                id={`category-pill-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#ff5500] text-white shadow-lg shadow-[#ff5500]/25'
                    : 'bg-[#141414] text-slate-300 hover:text-white hover:bg-[#202020] border border-white/5'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-slate-400'}>
                  {iconMap[cat.iconName] || <LayoutGrid className="w-3.5 h-3.5" />}
                </span>
                <span>{displayName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-black/30 text-white'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {toDigits(cat.itemCount)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
