import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishlist } from '../../actions/wishlistAction';
import { getDiscount } from '../../utils/functions';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StarIcon from '@mui/icons-material/Star';

const Product = ({ product, name, price, cuttedPrice, image, ratings, reviews }) => {
    const dispatch = useDispatch();

    const deleteHandler = () => {
        dispatch(removeFromWishlist(product));
    };

    return (
        <div className="wishlist-item">
            <div className="wishlist-item-image">
                <Link to={`/product/${product}`}>
                    <img src={image} alt={name} />
                </Link>
            </div>

            <div className="wishlist-item-info">
                <h3>
                    <Link to={`/product/${product}`} className="hover:text-accent transition-colors">
                        {name}
                    </Link>
                </h3>

                <div className="wishlist-item-rating">
                    <span className="rating-badge">
                        {ratings} <StarIcon sx={{ fontSize: 12 }} />
                    </span>
                    <span>({reviews?.toLocaleString() || 0} reviews)</span>
                </div>

                <div className="wishlist-item-price">
                    <span className="wish-price-current">৳{price?.toLocaleString()}</span>
                    {cuttedPrice > price && (
                        <>
                            <span className="wish-price-original">৳{cuttedPrice.toLocaleString()}</span>
                            <span className="qv-discount-badge">{getDiscount(price, cuttedPrice)}% OFF</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center">
                <button onClick={deleteHandler} className="btn-remove-wish" title="Remove from Wishlist">
                    <DeleteOutlineIcon />
                </button>
            </div>
        </div>
    );
};

export default Product;
