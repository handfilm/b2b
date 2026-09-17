import React from 'react';
import {
  ShieldCheck,
  Check,
  Clock,
  Anchor,
  Leaf,
  Layers,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { Product, CurrencyConfig } from '../types';

interface ProductCardProps {
  product: Product;
  currency: CurrencyConfig;
  onSelectProduct: (product: Product) => void;
  onRequestSample: (product: Product) => void;
  onInquire: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelectProduct,
  onRequestSample,
  onInquire,
}) => {
  // Calculate price range
  const lowestPriceUSD = product.priceTiers[product.priceTiers.length - 1].priceUSD;
  const highestPriceUSD = product.priceTiers[0].priceUSD;

  const lowestConverted = (lowestPriceUSD * currency.rate).toFixed(2);
  const highestConverted = (highestPriceUSD * currency.rate).toFixed(2);

  return (
    <div
      id={`product-card-${product.id}`}
      className="glass-card-interactive rounded-2xl overflow-hidden flex flex-col group border border-white/10"
    >
      {/* Product Image Area */}
      <div
        className="relative aspect-4/3 bg-[#171717] overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-md font-bold border border-white/10">
            HS {product.hsCode}
          </span>
          {product.ecoFriendly && (
            <span className="bg-[#ff5500]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-xs">
              <Leaf className="w-2.5 h-2.5 mr-0.5" />
              <span>Eco-Green</span>
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="w-7 h-7 rounded-xl bg-black/70 text-white flex items-center justify-center border border-white/15 hover:border-[#ff5500] hover:text-[#ff5500] transition-colors cursor-pointer"
            title="View Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Bar: Loading Port */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-2.5 text-[11px] text-slate-300 flex items-center justify-between">
          <span className="flex items-center space-x-1 truncate">
            <Anchor className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
            <span className="truncate">{product.portOfLoading}</span>
          </span>
          <span className="font-mono text-[#ff5500] font-bold text-[10px] shrink-0 ml-1">
            {product.incoterms.join('/')}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Supplier Info */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center space-x-1 truncate">
              <span
                className="font-medium text-slate-300 truncate hover:text-[#ff5500] cursor-pointer transition-colors"
                onClick={() => onSelectProduct(product)}
              >
                {product.supplierName}
              </span>
              {product.supplierVerified && (
                <span title="Verified Exporter" className="inline-flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#ff5500] font-bold flex items-center space-x-0.5 font-mono">
              <span>★</span>
              <span>{product.supplierRating}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-extrabold text-white text-sm line-clamp-2 leading-snug cursor-pointer group-hover:text-[#ff5500] transition-colors"
          >
            {product.title}
          </h3>

          {/* Price Range */}
          <div className="mt-2.5 flex items-baseline space-x-1.5">
            <span className="text-lg font-black text-white font-mono">
              {currency.symbol}{lowestConverted} - {currency.symbol}{highestConverted}
            </span>
            <span className="text-xs text-slate-400">/ {product.unit.toLowerCase().replace(/s$/, '')}</span>
          </div>

          {/* Sourcing Parameters: MOQ & Lead Time */}
          <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs py-2 px-2.5 bg-[#141414] rounded-xl border border-white/5">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">Min. Order (MOQ)</span>
              <span className="font-bold text-white font-mono">{product.moq.toLocaleString()} {product.unit}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">Lead Time</span>
              <span className="font-bold text-white flex items-center space-x-1 font-mono">
                <Clock className="w-3 h-3 text-[#ff5500]" />
                <span>{product.leadTimeDays} Days</span>
              </span>
            </div>
          </div>

          {/* Certifications tags */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {product.certifications.slice(0, 3).map((cert, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold bg-[#171717] text-slate-300 px-2 py-0.5 rounded-md border border-white/5"
              >
                {cert}
              </span>
            ))}
            {product.certifications.length > 3 && (
              <span className="text-[10px] text-slate-500 px-1 py-0.5 font-mono">
                +{product.certifications.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-3 border-t border-white/10 flex items-center space-x-2">
          <button
            id={`inquire-btn-${product.id}`}
            onClick={() => onInquire(product)}
            className="flex-1 py-2 px-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-bold text-xs shadow-md shadow-[#ff5500]/20 transition-all cursor-pointer text-center"
          >
            Inquire Now
          </button>

          {product.sampleAvailable && (
            <button
              id={`sample-btn-${product.id}`}
              onClick={() => onRequestSample(product)}
              className="py-2 px-3 rounded-xl border border-white/10 hover:border-[#ff5500]/50 text-slate-300 hover:text-white bg-[#141414] hover:bg-[#1a1a1a] font-bold text-xs transition-colors cursor-pointer"
              title={`Request Sample (${currency.symbol}${(product.samplePriceUSD * currency.rate).toFixed(2)})`}
            >
              Sample
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
