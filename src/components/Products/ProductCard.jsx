import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, isProductInCart, addToCartHandler, goToCartHandler, handleQuickView }) => {
    const [isLiked, setIsLiked] = useState(false);

    const onCartClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isProductInCart && isProductInCart(product._id)) {
            goToCartHandler();
        } else {
            addToCartHandler(product._id);
        }
    };

    const handleToggleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    // Calculate discount
    const hasDiscount = product.cuttedPrice && product.price < product.cuttedPrice;
    const discountPercentage = hasDiscount
        ? Math.round(((product.cuttedPrice - product.price) / product.cuttedPrice) * 100)
        : 0;

    const isNew = product.createdAt && (new Date() - new Date(product.createdAt)) < 7 * 24 * 60 * 60 * 1000;

    // Get primary category for display
    const primaryCategory = product.categories?.[0];
    const categoryName = typeof primaryCategory === 'object' ? primaryCategory?.name : primaryCategory;

    return (
        <div className="group flex flex-col h-full bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300">
            {/* Image Container */}
            <Link to={`/product/${product._id}`} className="relative bg-[#f5f5f5] aspect-square overflow-hidden block">
                <img
                    src={product.images?.[0]?.url || "/no-pictures.png"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Badges Top Left */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {discountPercentage > 0 ? (
                        <span className="bg-[#ff1837] text-white text-[10px] font-extrabold px-2 py-0.5 tracking-wider">
                            -{discountPercentage}%
                        </span>
                    ) : isNew ? (
                        <span className="bg-[#ff1837] text-white text-[10px] font-extrabold px-2 py-0.5 tracking-wider">
                            NEW
                        </span>
                    ) : null}
                </div>

                {/* Wishlist Top Right */}
                <button
                    className={`absolute top-3 right-3 p-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm transition-transform duration-300 transform scale-0 group-hover:scale-100 focus:scale-100 active:scale-95 ${isLiked ? 'text-[#ff1837]' : 'text-gray-900'} z-20`}
                    onClick={handleToggleLike}
                    aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={isLiked ? 2 : 1.5} />
                </button>

                {/* Hover Cart Button */}
                <div className="absolute bottom-3 left-3 right-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block z-20">
                    <button
                        className="w-full bg-black/90 backdrop-blur-sm text-white text-[11px] font-bold py-2.5 uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 rounded-none"
                        onClick={onCartClick}
                    >
                        <ShoppingBag size={14} />
                        {isProductInCart && isProductInCart(product._id) ? "GO TO CART" : "ADD TO CART"}
                    </button>
                </div>
            </Link>

            {/* Info Container */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Category String */}
                {categoryName && (
                    <span className="text-[#ff1837] text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5 line-clamp-1">
                        {categoryName}
                    </span>
                )}

                {/* Title */}
                <Link to={`/product/${product._id}`} className="block mb-2 flex-grow">
                    <h3 className="text-[13px] font-semibold text-gray-900 leading-tight line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                {/* Price Row */}
                <div className="flex items-center gap-2 mt-auto">
                    <span className="text-[14px] font-extrabold text-black tracking-wide">
                        ৳{product.price?.toLocaleString()}
                    </span>
                    {hasDiscount && (
                        <span className="text-[12px] font-medium text-gray-400 line-through">
                            ৳{product.cuttedPrice?.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Mobile Cart Button (Only shows on mobile, sits below price) */}
                <button
                    className="w-full mt-3 bg-black text-white text-[10px] font-bold py-2.5 uppercase tracking-widest md:hidden flex items-center justify-center gap-2 active:bg-gray-800 transition-colors"
                    onClick={onCartClick}
                >
                    <ShoppingBag size={14} />
                    {isProductInCart && isProductInCart(product._id) ? "CART" : "ADD"}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
