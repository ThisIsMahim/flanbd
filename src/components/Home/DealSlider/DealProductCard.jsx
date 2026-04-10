import React, { useState } from "react";
import OptimizedImg from "../../common/OptimizedImg";

const DealProductCard = ({
  product,
  categoryName,
  onClick,
}) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const displayImage = selectedImageUrl || product.images?.[0]?.url || "/no-pictures.png";

  const hasDiscount = product.cuttedPrice && product.price < product.cuttedPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((product.cuttedPrice - product.price) / product.cuttedPrice) * 100)
    : 0;
  const savings = hasDiscount ? product.cuttedPrice - product.price : 0;

  return (
    <div
      className="group relative overflow-hidden rounded-xl cursor-pointer bg-[#0f0f0f] aspect-[3/4]"
      onClick={() => onClick?.(selectedImageUrl)}
    >
      {/* Full-bleed cover image */}
      <OptimizedImg
        src={displayImage}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Dark gradient overlay — stronger at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Discount badge — top left, premium style */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 right-3 z-10 flex flex-col items-center justify-center w-14 h-14 rounded-full bg-[#ff1837] shadow-[0_4px_16px_rgba(255,24,55,0.5)]">
          <span className="text-white font-black text-lg leading-none">-{discountPercentage}%</span>
          <span className="text-white font-bold text-[10px] leading-none">Off</span>
        </div>
      )}

      {/* Color swatches — top right */}
      {product.isDifferentColors && product.images?.length > 1 && (
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
          {product.images.slice(0, 4).map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setSelectedImageUrl(img.url); }}
              className={`w-5 h-5 rounded-full overflow-hidden border-2 transition-all duration-200 ${(selectedImageUrl === img.url || (!selectedImageUrl && idx === 0))
                  ? 'border-white scale-110'
                  : 'border-white/40 hover:border-white'
                }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Bottom content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        {/* Category */}
        {categoryName && (
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 block mb-1">
            {categoryName}
          </span>
        )}

        {/* Product name */}
        <h3 className="text-white font-extrabold text-[11px] uppercase tracking-tight leading-tight line-clamp-2 mb-2.5">
          {product.name}
        </h3>

        {/* Price row - emphasized deal pricing */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-[#ff1837] font-black text-xl leading-none">
              ৳{product.price?.toLocaleString()}
            </div>
            {hasDiscount && (
              <div className="text-white/50 font-semibold text-[11px] line-through mt-0.5">
                ৳{product.cuttedPrice?.toLocaleString()}
              </div>
            )}
          </div>
          {savings > 0 && (
            <div className="text-right">
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/60 block leading-none">Save</span>
              <span className="text-[#ff1837] font-black text-sm leading-snug">৳{savings.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealProductCard;
