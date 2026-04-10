import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishlist } from '../../actions/wishlistAction';
import { getDiscount } from '../../utils/functions';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StarIcon from '@mui/icons-material/Star';

const Product = ({ product, name, price, cuttedPrice, image, ratings, reviews }) => {
    const dispatch = useDispatch();

    const deleteHandler = (e) => {
        e.preventDefault();
        dispatch(removeFromWishlist(product));
    };

    const hasDiscount = cuttedPrice > price;

    return (
        <div className="flex items-center gap-3 sm:gap-5 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors px-2 sm:px-4">
            {/* Image */}
            <Link to={`/product/${product}`} className="flex-shrink-0">
                <img
                    src={image}
                    alt={name}
                    className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] object-cover rounded-md border border-gray-200 bg-white shadow-sm"
                />
            </Link>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
                <Link to={`/product/${product}`} className="group block mb-1">
                    <h3 className="text-[11px] sm:text-xs font-bold text-gray-900 leading-snug line-clamp-2 uppercase tracking-tight group-hover:text-[#ff1837] transition-colors">
                        {name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="flex items-center gap-0.5 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm tracking-wider shadow-sm">
                        {ratings} <StarIcon sx={{ fontSize: 10 }} />
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                        ({reviews?.toLocaleString() || 0} reviews)
                    </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <span className="text-xs sm:text-[13px] font-black tracking-wider text-[#ff1837]">৳{price?.toLocaleString()}</span>
                    {hasDiscount && (
                        <>
                            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 line-through tracking-wider">৳{cuttedPrice.toLocaleString()}</span>
                            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#ff1837] bg-red-50 border border-red-100 px-1.5 py-0.5 rounded flex items-center shadow-[0_1px_2px_rgba(255,24,55,0.1)] whitespace-nowrap">
                                {getDiscount(price, cuttedPrice)}% OFF
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Actions */}
            <button
                onClick={deleteHandler}
                className="flex-shrink-0 self-center sm:self-center ml-2 p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-[#ff1837] hover:bg-red-50 hover:border-red-200 transition-all shadow-sm active:scale-95"
                title="Remove from Wishlist"
            >
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </button>
        </div>
    );
};

export default Product;
