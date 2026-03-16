import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { useParallax } from '../../hooks/useScrollTrigger';
import './Hero.css';

const Hero = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);
    const parallaxRef = useParallax(0.3);

    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.3 });

        // Animate title words
        tl.from(titleRef.current.children, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
        })
            // Animate subtitle
            .from(subtitleRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.6,
            }, '-=0.4')
            // Animate CTA buttons
            .from(ctaRef.current.children, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.15,
            }, '-=0.3');

        // Floating animation for icons
        gsap.to('.floating-icon', {
            y: -15,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            stagger: {
                each: 0.3,
            },
        });
    }, []);

    return (
        <section className="hero">
            <div className="hero-bg">
                <div className="hero-gradient"></div>
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>

            <div className="container hero-content">
                <div className="hero-text">
                    <h1 ref={titleRef} className="hero-title">
                        <span>Discover</span>{' '}
                        <span className="text-gradient">Perfect</span>{' '}
                        <span>Gifts</span>
                    </h1>

                    <p ref={subtitleRef} className="hero-subtitle">
                        Curated with love, delivered with joy. Find the perfect gift for every occasion.
                    </p>

                    <div ref={ctaRef} className="hero-cta">
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Shop Now
                            <ArrowRight size={20} />
                        </Link>
                        <Link to="/collections" className="btn btn-outline btn-lg">
                            View Collections
                        </Link>
                    </div>

                    <div className="hero-features">
                        <div className="feature">
                            <Gift className="floating-icon" size={24} />
                            <span>Premium Quality</span>
                        </div>
                        <div className="feature">
                            <Sparkles className="floating-icon" size={24} />
                            <span>Curated Selection</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual" ref={parallaxRef}>
                    <div className="visual-card glass-card">
                        <div className="gift-box">
                            🎁
                        </div>
                    </div>
                </div>
            </div>

            <div className="scroll-indicator">
                <div className="mouse">
                    <div className="wheel"></div>
                </div>
                <span>Scroll to explore</span>
            </div>
        </section>
    );
};

export default Hero;
