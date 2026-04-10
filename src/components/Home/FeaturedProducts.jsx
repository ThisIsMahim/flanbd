import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStaggerAnimation } from '../../hooks/useScrollTrigger';
import ProductCard from './ProductSlider/components/ProductCard';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useStaggerAnimation('.product-card-wrapper', 0.15);

    useEffect(() => {
        // TODO: Fetch real products from API
        // For now, using dummy data
        const dummyProducts = [
            {
                _id: '1',
                name: 'Premium Gift Box',
                price: 2500,
                images: [{ url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400' }],
                ratings: 4.5,
                numOfReviews: 24,
            },
            {
                _id: '2',
                name: 'Luxury Watch',
                price: 8500,
                images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }],
                ratings: 5,
                numOfReviews: 42,
            },
            {
                _id: '3',
                name: 'Artisan Chocolates',
                price: 1200,
                images: [{ url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400' }],
                ratings: 4.8,
                numOfReviews: 18,
            },
            {
                _id: '4',
                name: 'Handcrafted Jewelry',
                price: 3800,
                images: [{ url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400' }],
                ratings: 4.7,
                numOfReviews: 31,
            },
        ];

        setTimeout(() => {
            setProducts(dummyProducts);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <section className="featured-products section" id="featured">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        Featured <span className="text-gradient">Gifts</span>
                    </h2>
                    <p className="section-subtitle">
                        Hand-picked treasures that make perfect gifts
                    </p>
                </div>

                <div ref={containerRef} className="products-grid">
                    {loading ? (
                        <>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="product-card-wrapper">
                                    <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }}></div>
                                </div>
                            ))}
                        </>
                    ) : (
                        products.map((product) => (
                            <div key={product._id} className="product-card-wrapper">
                                <ProductCard product={product} />
                            </div>
                        ))
                    )}
                </div>

                <div className="section-footer">
                    <Link to="/products" className="btn btn-primary">
                        View All Products
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
