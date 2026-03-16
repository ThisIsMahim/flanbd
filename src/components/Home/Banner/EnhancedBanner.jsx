import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Banner.css";

const EnhancedBanner = () => {
  const [sliders, setSliders] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef();
  const touchStartXRef = useRef(null);

  useEffect(() => {
    const fetchSliders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/sliders`
        );
        const sorted = (res.data.data || [])
          .filter((slider) => slider.isActive)
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setSliders(sorted);
      } catch (err) {
        setError("Failed to load banners");
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  // Auto-slide with pause on hover
  useEffect(() => {
    if (!sliders.length || isHovering) return;
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % sliders.length);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [sliders, isHovering]);

  useEffect(() => {
    if (active >= sliders.length) setActive(0);
  }, [sliders, active]);

  const goTo = (idx) => setActive(idx);
  const goToPrev = () => setActive((prev) => (prev - 1 + sliders.length) % sliders.length);
  const goToNext = () => setActive((prev) => (prev + 1) % sliders.length);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current == null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) goToPrev();
      else goToNext();
    }
    touchStartXRef.current = null;
  };

  if (loading) {
    return (
      <section className="banner-carousel-modern">
        <div className="banner-skeleton-bg skeleton" />
      </section>
    );
  }

  if (error || !sliders.length) {
    return (
      <section className="banner-carousel-modern">
        <div className="banner-content centered">
          <div className="banner-title">No banners available</div>
        </div>
      </section>
    );
  }

  const current = sliders[active];
  if (!current) return null;

  return (
    <section
      className="banner-carousel-modern"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div className="banner-slides">
        {sliders.map((slider, index) => (
          <div 
            key={slider._id || index} 
            className={`banner-slide ${index === active ? "active" : ""}`}
          >
            <img
              src={slider.imageUrl}
              alt={slider.title || "Banner"}
              className={`banner-bg ${slider.mobileContain ? "banner-mobile-contain" : ""}`}
              draggable="false"
            />
            <div className="banner-overlay" />
            <div className="banner-content">
              <h1 className="banner-title">{slider.title}</h1>
              <p className="banner-subtitle">{slider.subtitle}</p>
              {slider.link && (
                <a href={slider.link} className="btn btn-primary mt-8">
                  Shop Now
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <button className="banner-nav-btn banner-nav-prev" onClick={goToPrev} aria-label="Previous banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="banner-nav-btn banner-nav-next" onClick={goToNext} aria-label="Next banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {sliders.length > 1 && (
        <div className="banner-dots">
          {sliders.map((_, idx) => (
            <button
              key={idx}
              className={`banner-dot${active === idx ? " active" : ""}`}
              onClick={() => goTo(idx)}
              aria-label={`Go to banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default EnhancedBanner;
