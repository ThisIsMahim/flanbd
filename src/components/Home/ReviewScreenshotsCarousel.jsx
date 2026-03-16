import React, { useEffect, useRef, useState } from "react";
import "./ReviewScreenshotsCarousel.css";
import Loader from "../Layouts/Loader";
import useScrollReveal from "./hooks/useScrollReveal";

const AUTO_SCROLL_INTERVAL_MS = 20; // tick speed
const AUTO_SCROLL_PIXELS_PER_TICK_DESKTOP = 1.2;
const AUTO_SCROLL_PIXELS_PER_TICK_MOBILE = 1.8;

const ReviewScreenshotsCarousel = () => {
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [viewportKey, setViewportKey] = useState(0);

  const titleRef = useRef(null);
  useScrollReveal(titleRef);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
      setViewportKey((k) => k + 1);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/review-screenshots`)
      .then((res) => res.json())
      .then((data) => setScreenshots(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  // JS auto-scroll loop with seamless wrap
  useEffect(() => {
    if (!trackRef.current || screenshots.length === 0) return;

    const track = trackRef.current;

    let rafId;
    let lastTick = 0;

    const step = (time) => {
      if (isSwiping) {
        rafId = requestAnimationFrame(step);
        return;
      }
      if (!lastTick) lastTick = time;
      const delta = time - lastTick;
      if (delta >= AUTO_SCROLL_INTERVAL_MS) {
        const amount = (isMobile ? AUTO_SCROLL_PIXELS_PER_TICK_MOBILE : AUTO_SCROLL_PIXELS_PER_TICK_DESKTOP) * (delta / AUTO_SCROLL_INTERVAL_MS);
        const scrollable = Math.max(1, track.scrollWidth - track.clientWidth); // total scrollable distance
        const next = (track.scrollLeft + amount) % scrollable; // modulo ensures infinite wrap
        track.scrollLeft = next;
        lastTick = time;
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [screenshots, isSwiping, isMobile, viewportKey]);

  // Touch/Swipe handlers
  const handleTouchStart = (e) => {
    setIsSwiping(true);
    if (!trackRef.current) return;
    setStartX(e.touches[0].pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };
  const handleTouchMove = (e) => {
    if (!isSwiping || !trackRef.current) return;
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 2.1; // swipe sensitivity
    trackRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleTouchEnd = () => setIsSwiping(false);

  if (loading) return <Loader title="Loading Reviews..." />;

  // Repeat items multiple times so there is always enough width to scroll
  const repeats = 4;
  const display = Array.from({ length: repeats }).flatMap(() => screenshots);

  return (
    <>
      {modalImage && (
        <div className="ss-modal-overlay" onClick={() => setModalImage(null)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-accent transition-colors text-4xl"
              aria-label="Close"
            >
              &times;
            </button>
            <img src={modalImage} alt="Full Review Screenshot" className="w-full h-auto rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
      <section className="review-screenshots-section">
        <div className="home-section-header" ref={titleRef}>
          <span className="section-subtitle">Testimonials</span>
          <h2 className="section-title">What Our Clients Say</h2>
        </div>
        
        <div className="review-carousel-outer">

          <div className="carousel-fade carousel-fade-left"></div>
          <div className="carousel-fade carousel-fade-right"></div>
          <div
            className="review-carousel-track"
            ref={trackRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {display.map((shot, idx) => (
              <div className="review-carousel-card" key={`${shot.url}-${idx}`}>
                <img
                  src={shot.url}
                  alt={`Review Screenshot ${idx + 1}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setModalImage(shot.url)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewScreenshotsCarousel;
