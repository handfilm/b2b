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
      className="bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
    >
      {/* Product Image Area */}
      <div className="relative aspect-4/3 bg-neutral-100 overflow-hidden cursor-pointer"
           onClick={() => onSelectProduct(product)}>
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className="bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded font-medium">
            HS {product.hsCode}
          </span>
          {product.ecoFriendly && (
            <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center space-x-1">
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
            className="w-7 h-7 rounded-full bg-white/90 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-white transition-colors"
            title="View Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Bar: Loading Port */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-neutral-950/80 to-transparent p-2 text-[11px] text-neutral-200 flex items-center justify-between">
          <span className="flex items-center space-x-1 truncate">
            <Anchor className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{product.portOfLoading}</span>
          </span>
          <span className="font-mono text-emerald-300 font-medium text-[10px] shrink-0 ml-1">
            {product.incoterms.join('/')}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Supplier Info */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <div className="flex items-center space-x-1 truncate">
              <span className="font-medium text-neutral-700 truncate hover:text-emerald-700 cursor-pointer"
                    onClick={() => onSelectProduct(product)}>
                {product.supplierName}
              </span>
              {product.supplierVerified && (
                <span title="Verified Exporter" className="inline-flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </span>
              )}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold flex items-center space-x-0.5">
              <span>★</span>
              <span>{product.supplierRating}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-bold text-neutral-900 text-sm line-clamp-2 leading-snug cursor-pointer group-hover:text-emerald-800 transition-colors"
          >
            {product.title}
          </h3>

          {/* Price Range & Tier Notice */}
          <div className="mt-2.5 flex items-baseline space-x-1.5">
            <span className="text-lg font-extrabold text-neutral-950 font-mono">
              {currency.symbol}{lowestConverted} - {currency.symbol}{highestConverted}
            </span>
            <span className="text-xs text-neutral-500">/ {product.unit.toLowerCase().replace(/s$/, '')}</span>
          </div>

          {/* Sourcing Parameters: MOQ & Lead Time */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs py-2 px-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
            <div>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Min. Order (MOQ)</span>
              <span className="font-bold text-neutral-800">{product.moq.toLocaleString()} {product.unit}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Lead Time</span>
              <span className="font-bold text-neutral-800 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-neutral-500" />
                <span>{product.leadTimeDays} Days</span>
              </span>
            </div>
          </div>

          {/* Certifications tags */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {product.certifications.slice(0, 3).map((cert, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded border border-neutral-200"
              >
                {cert}
              </span>
            ))}
            {product.certifications.length > 3 && (
              <span className="text-[10px] text-neutral-400 px-1 py-0.5 font-medium">
                +{product.certifications.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-2 border-t border-neutral-100 flex items-center space-x-2">
          <button
            id={`inquire-btn-${product.id}`}
            onClick={() => onInquire(product)}
            className="flex-1 py-2 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors cursor-pointer text-center"
          >
            Inquire Now
          </button>

          {product.sampleAvailable && (
            <button
              id={`sample-btn-${product.id}`}
              onClick={() => onRequestSample(product)}
              className="py-2 px-3 rounded-lg border border-neutral-300 hover:border-neutral-400 text-neutral-700 hover:bg-neutral-50 font-semibold text-xs transition-colors cursor-pointer"
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
