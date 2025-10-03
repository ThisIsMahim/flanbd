import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Banner.css";

const BUTTON_TEXT = "BUY NOW";
const BUTTON_LINK = "/products";

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
        // Sort by 'order' if present, fallback to original order
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
    }, 6000); // 6 seconds interval
    return () => clearInterval(intervalRef.current);
  }, [sliders, isHovering]);

  // Reset active index if out of bounds after filtering
  useEffect(() => {
    if (active >= sliders.length) {
      setActive(0);
    }
  }, [sliders, active]);

  // Manual navigation
  const goTo = (idx) => setActive(idx);
  const goToPrev = () => setActive((prev) => (prev - 1 + sliders.length) % sliders.length);
  const goToNext = () => setActive((prev) => (prev + 1) % sliders.length);

  // Touch swipe handlers
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
      <section className="banner-carousel-modern" style={{ backgroundColor: '#ffffff' }}>
        <div className="banner-skeleton-bg skeleton" />
        <div className="banner-overlay" />
        <div className="banner-content centered">
          <div
            className="banner-title skeleton skeleton-text"
            style={{ width: "60%", height: 40, marginBottom: 16 }}
          />
          <div
            className="banner-subtitle skeleton skeleton-text"
            style={{ width: "40%", height: 24, marginBottom: 32 }}
          />
          <div
            className="banner-btn skeleton"
            style={{ width: 120, height: 40 }}
          />
        </div>
        <div className="banner-dots">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="banner-dot skeleton"
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                margin: "0 4px",
              }}
            />
          ))}
        </div>
      </section>
    );
  }

  if (error || !sliders.length) {
    return (
      <section className="banner-carousel-modern" style={{ backgroundColor: '#ffffff' }}>
        <div className="banner-content centered">
          <div className="banner-title">No banners available</div>
        </div>
      </section>
    );
  }

  const current = sliders[active];
  if (!current) {
    return (
      <section className="banner-carousel-modern" style={{ backgroundColor: '#ffffff' }}>
        <div className="banner-content centered">
          <div className="banner-title">No banners available</div>
        </div>
      </section>
    );
  }

  // Debug: Log sliders data
  console.log('Banner sliders:', sliders);
  console.log('Active slider:', current);

  return (
    <section 
      className="banner-carousel-modern"
      style={{ backgroundColor: '#ffffff' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images */}
      <div className="banner-images-container" style={{ backgroundColor: '#ffffff' }}>
        {sliders.map((slider, index) => {
          console.log(`Slider ${index}:`, slider);
          return (
            <img
              key={slider._id || index}
              src={slider.imageUrl}
              alt={slider.title || "Banner"}
              className={`banner-bg ${index === active ? 'active' : ''} ${slider.mobileContain ? 'banner-mobile-contain' : ''}`}
              draggable="false"
              onLoad={() => console.log(`Image ${index} loaded successfully`)}
              onError={(e) => console.error(`Image ${index} failed to load:`, e)}
            />
          );
        })}
      </div>

      {/* Overlay */}
      <div className="banner-overlay" />

      {/* Content */}
      <div className="banner-content centered">
        <div className="banner-title">{current.title}</div>
        <div className="banner-subtitle">{current.subtitle}</div>
        {/* Buy Now button removed per requirement */}
      </div>

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <button
            className="banner-nav-btn banner-nav-prev"
            onClick={goToPrev}
            aria-label="Previous banner"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="banner-nav-btn banner-nav-next"
            onClick={goToNext}
            aria-label="Next banner"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {/* Progress Bar */}
      <div className="banner-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((active + 1) / sliders.length) * 100}%`,
            }}
          />
        </div>
        <div className="progress-text">
          {active + 1} of {sliders.length}
        </div>
      </div>

      {/* Dots Navigation */}
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
