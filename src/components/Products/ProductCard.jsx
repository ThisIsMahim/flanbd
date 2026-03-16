import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const [isLiked, setIsLiked] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        console.log('Added to cart:', product._id);
    };

    const handleToggleLike = (e) => {
        e.preventDefault();
        setIsLiked(!isLiked);
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product._id}`} className="product-link">
                <div className="product-image-wrapper">
                    <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                    />
                    <button
                        className={`wishlist-btn ${isLiked ? 'liked' : ''}`}
                        onClick={handleToggleLike}
                        aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                </div>

                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={12}
                                    fill={i < product.ratings ? 'currentColor' : 'none'}
                                    className={i < product.ratings ? 'filled' : ''}
                                />
                            ))}
                        </div>
                        <span className="review-count">({product.numOfReviews})</span>
                    </div>

                    <div className="product-footer">
                        <span className="product-price">৳{product.price.toLocaleString()}</span>
                        <button className="add-to-cart-btn" onClick={handleAddToCart} aria-label="Add to cart">
                            <ShoppingCart size={16} />
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
