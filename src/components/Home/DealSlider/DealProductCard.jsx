import React, { useState } from "react";
import "./dealslider.css";
import OptimizedImg from "../../common/OptimizedImg";

const DealProductCard = ({
  image,
  images = [],
  isDifferentColors = false,
  name,
  category,
  price,
  cuttedPrice,
  discountPercentage,
  onClick,
}) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const displayImage = selectedImageUrl || image;
  return (
    <div className="deal-minimal-card white-theme" onClick={() => onClick?.(selectedImageUrl)}>
      <div className="deal-minimal-image-container">
        <OptimizedImg
          src={displayImage}
          alt={name}
          className="deal-minimal-image"
          quality="80"
          format="auto"
          placeholder="blur"
        />
        {discountPercentage > 0 && (
          <span className="deal-discount-badge">-{discountPercentage}%</span>
        )}
        {category === 'Polarized' && (
          <div className="deal-polarized-badge">
            <img 
              src="/polarized.JPG" 
              alt="Polarized" 
              className="w-8 h-8 object-contain"
            />
          </div>
        )}
      </div>
      <div className="deal-minimal-info">
        <div className="w-full">
          {/* Only show category if not different colors */}
          {category && !isDifferentColors && <span className="deal-minimal-category">{category}</span>}
          <div className="deal-minimal-title">{name}</div>
          <div className="deal-minimal-price-row">
            <div className="flex items-center gap-1">
              <span className="deal-minimal-price">
                ৳{price?.toLocaleString() || 0}
              </span>
              {cuttedPrice && price < cuttedPrice && (
                <span className="deal-minimal-cutted">
                  ৳{cuttedPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          {/* Color Variations - Separate row when multiple colors available */}
          {isDifferentColors && images?.length > 1 && (
            <div className="deal-color-variants-row">
              <div className="flex items-center justify-center gap-2 overflow-x-auto deal-color-variations-scroll pb-1" style={{scrollbarWidth: 'thin', msOverflowStyle: 'scrollbar', maxWidth: '100%'}}>
                {images.map((url, idx) => (
                  <div key={idx} className="relative group flex-shrink-0">
                    <button
                      onClick={(e)=>{ e.stopPropagation(); setSelectedImageUrl(url); }}
                      className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden transition-all duration-200 ${
                        selectedImageUrl===url 
                          ? 'ring-2 ring-[var(--brand-yellow)] shadow-md' 
                          : 'ring-1 ring-gray-200 hover:ring-[var(--primary-blue-light)]'
                      }`}
                      aria-label={`Color ${idx+1}`}
                    >
                      <img src={url} alt={`Color ${idx+1}`} className="w-full h-full object-cover rounded-full" />
                    </button>
                    {/* Tiny indicator for selected state */}
                    {selectedImageUrl===url && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--brand-yellow)] rounded-full border border-white shadow-sm"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealProductCard;
