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

interface CategoryBarProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid className="w-4 h-4" />,
  Shirt: <Shirt className="w-4 h-4" />,
  Leaf: <Leaf className="w-4 h-4" />,
  Footprints: <Footprints className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Fish: <Fish className="w-4 h-4" />,
  Pill: <Pill className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`category-pill-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-neutral-500'}>
                  {iconMap[cat.iconName] || <LayoutGrid className="w-4 h-4" />}
                </span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {cat.itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
