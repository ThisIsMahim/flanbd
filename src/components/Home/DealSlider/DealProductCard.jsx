import React, { useState } from "react";
import "./dealslider.css";
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

  return (
    <div className="deal-minimal-card group" onClick={() => onClick?.(selectedImageUrl)}>
      <div className="deal-minimal-image-container">
        <OptimizedImg
          src={displayImage}
          alt={product.name}
          className="deal-minimal-image"
        />
        {discountPercentage > 0 && (
          <span className="deal-discount-badge">-{discountPercentage}%</span>
        )}
      </div>
      
      <div className="deal-minimal-info">
        <div className="flex flex-col gap-1">
          {categoryName && (
            <span className="deal-minimal-category">{categoryName}</span>
          )}
          <h3 className="deal-minimal-title group-hover:text-accent transition-colors duration-300">
            {product.name}
          </h3>
        </div>

        <div className="deal-minimal-price-row">
          <span className="deal-minimal-price">
            ৳{product.price?.toLocaleString() || 0}
          </span>
          {hasDiscount && (
            <span className="deal-minimal-cutted">
              ৳{product.cuttedPrice.toLocaleString()}
            </span>
          )}
        </div>
        
        {/* Color Variations */}
        {product.isDifferentColors && product.images?.length > 1 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedImageUrl(img.url); 
                  }}
                  className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                    (selectedImageUrl === img.url || (!selectedImageUrl && idx === 0))
                      ? 'border-accent scale-110 shadow-md' 
                      : 'border-transparent hover:border-border'
                  }`}
                  aria-label={`Color ${idx + 1}`}
                >
                  <img src={img.url} alt={`Color ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealProductCard;
