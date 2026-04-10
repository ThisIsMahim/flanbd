import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import VerifiedIcon from "@mui/icons-material/Verified";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useSelector } from "react-redux";
import "./Home.css";

// Fallback seed reviews
const reviews = [
  {
    name: "Akash Ghosh",
    role: "Founder of SoftEngineLab",
    image: "https://i.ibb.co/spSTz4rr/akash.jpg",
    rating: 5,
    verified: true,
    product: "eyegears - Premium Eyewear & Optical Solutions",
    review:
      "We're revolutionizing eyewear and optical solutions with eyegears, ensuring a seamless user experience that exceeds expectations.",
    recommend: true,
    location: "SoftEngineLab",
    time: "Co-CEO",
  },
  {
    name: "Dr. Pial Ghosh",
    role: "Researcher & Advisor",
    image: "/Piyal.PNG",
    rating: 5,
    verified: true,
    product: "eyegears - Premium Eyewear & Optical Solutions",
    review:
      "eyegears is a game-changer for eyewear and optical solutions. The quality and innovation are truly exceptional!",
    recommend: true,
    location: "Boric Universe",
    time: "Advisor",
  },
  {
    name: "Sagar Ghosh",
    role: "Founder of SoftEngineLab",
    image: "https://i.ibb.co/Z1d4Cjf1/sagar-ghosh.png",
    rating: 5,
    verified: true,
    product: "eyegears - Premium Eyewear & Optical Solutions",
    review:
      "eyegears reflects our commitment to innovative and excellent optical solutions that make a real difference in people's lives.",
    recommend: true,
    location: "SoftEngineLab",
    time: "Co-CEO",
  },
  {
    name: "Md Sojibul Islam Rana",
    role: "CTO of SoftEngineLab",
    image:
      "https://i.ibb.co/ksVxJqtT/351522133-106028882517023-5257417765060920261-n.jpg",
    rating: 5,
    verified: true,
    product: "eyegears - Premium Eyewear & Optical Solutions",
    review:
      "As CTO, I ensure eyegears is robust, scalable, and secure for all users. The technology behind it is cutting-edge.",
    recommend: true,
    location: "SoftEngineLab",
    time: "CTO",
  },
  {
    name: "C. M Mahim Masrafi",
    role: "Designer and Frontend Developer SoftEngineLab",
    image:
      "https://i.ibb.co/dZ9R5Yw/487558084-2648658821998427-4760036966159547830-n.jpg",
    rating: 5,
    verified: true,
    product: "eyegears - Premium Eyewear & Optical Solutions",
    review:
      "I focus on making eyegears intuitive and visually appealing for a great user experience that delights customers.",
    recommend: true,
    location: "SoftEngineLab",
    time: "Designer & Frontend Developer",
  },
];

const Testimonial = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const autoSlideInterval = 6000; // 6 seconds
  const isHoveringRef = useRef(false);
  const touchStartXRef = useRef(null);
  const { products } = useSelector((state) => state.products);
  const [approved, setApproved] = useState([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rating: 5, message: "", imageUrl: "", role: "" });
  const placeholderAvatar = "/logo192.png";

  // Calculate overall statistics from all products
  const { averageRating, reviewCount } = useMemo(() => {
    if (!products || products.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }
    const totalRating = products.reduce(
      (sum, product) => sum + (product.ratings || 0),
      0
    );
    const totalReviews = products.reduce(
      (sum, product) => sum + (product.numOfReviews || 0),
      0
    );
    const avgRating = totalRating / products.length;
    return {
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: totalReviews,
    };
  }, [products]);

  // Fetch approved testimonials with graceful fallback to local seeds
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get("/api/v1/testimonials");
        if (!cancelled) {
          const list = Array.isArray(data?.testimonials) ? data.testimonials : [];
          setApproved(list.length > 0 ? list : reviews);
        }
      } catch (e) {
        if (!cancelled) setApproved(reviews);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Auto-slide logic (pauses on hover)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHoveringRef.current) {
        const len = approved.length || 1;
        setCurrent((prev) => (prev + 1) % len);
      }
    }, autoSlideInterval);
    return () => clearInterval(timer);
  }, [approved.length]);

  const handlePrev = () => {
    const len = approved.length || 1;
    setCurrent((prev) => (prev - 1 + len) % len);
  };

  const handleNext = () => {
    const len = approved.length || 1;
    setCurrent((prev) => (prev + 1) % len);
  };

  // Touch swipe handlers (mobile)
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current == null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) handlePrev();
      else handleNext();
    }
    touchStartXRef.current = null;
  };

  // Helper to render stars
  const renderStars = (value) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (value >= i)
        stars.push(<StarIcon key={i} className="testimonial-star filled" />);
      else if (value > i - 1 && value < i)
        stars.push(
          <StarHalfIcon key={i} className="testimonial-star filled" />
        );
      else stars.push(<StarBorderIcon key={i} className="testimonial-star" />);
    }
    return stars;
  };

  return (
    <section
      className="testimonial-section-modern"
      onMouseEnter={() => (isHoveringRef.current = true)}
      onMouseLeave={() => (isHoveringRef.current = false)}
    >
      {/* Header Section */}
      <div className="testimonial-header">
        <div className="testimonial-header-content">
          <h2 className="testimonial-title">Testimonials</h2>
          <p className="testimonial-subtitle">
            Trusted by thousands of satisfied customers worldwide
          </p>
          <div className="mt-3">
            <button className="nav-button px-4 py-2 rounded" onClick={() => setOpen(true)}>Write a Review</button>
          </div>
          {reviewCount > 0 && (
            <div className="testimonial-stats">
              <div className="testimonial-rating">
                <span className="rating-number">{averageRating}</span>
                <div className="rating-stars">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="rating-text">out of 5</span>
              </div>
              <div className="testimonial-count">
                Based on {reviewCount.toLocaleString()} reviews
              </div>
              <button className="nav-button px-4 py-2 rounded" onClick={() => setOpen(true)}>
                Write a Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Carousel Section */}
      <div
        className="testimonial-carousel-modern"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Arrows */}
        <button
          className="testimonial-nav-btn testimonial-nav-prev"
          onClick={handlePrev}
          aria-label="Previous testimonial"
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
          className="testimonial-nav-btn testimonial-nav-next"
          onClick={handleNext}
          aria-label="Next testimonial"
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

        {/* Testimonial Cards Container */}
        <div className="testimonial-cards-container">
          {approved.map((review, index) => {
            const isActive = index === current;
            const len = approved.length || 1;
            const isPrev = index === (current - 1 + len) % len;
            const isNext = index === (current + 1) % len;

            return (
              <div
                key={index}
                className={`testimonial-card-modern ${isActive ? "active" : isPrev ? "prev" : isNext ? "next" : "hidden"
                  }`}
                style={{
                  transform: isActive
                    ? "translateX(0) scale(1)"
                    : isPrev
                      ? "translateX(-100%) scale(0.9)"
                      : isNext
                        ? "translateX(100%) scale(0.9)"
                        : "translateX(0) scale(0.8)",
                  opacity: isActive ? 1 : isPrev || isNext ? 0.6 : 0,
                }}
              >
                {/* Quote Icon */}
                <div className="testimonial-quote-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                {/* Review Content */}
                <div className="testimonial-content">
                  <p className="testimonial-text">{review.review || review.message}</p>
                </div>

                {/* Author Section */}
                <div className="testimonial-author">
                  <div className="testimonial-author-avatar">
                    <img
                      src={review.image || review.imageUrl || placeholderAvatar}
                      alt={review.name}
                      className="author-image"
                    />
                    {review.verified && (
                      <div className="verified-badge">
                        <VerifiedIcon fontSize="small" />
                      </div>
                    )}
                  </div>
                  <div className="testimonial-author-info">
                    <h4 className="author-name">{review.name}</h4>
                    <p className="author-role">{review.role || "Verified Customer"}</p>
                    <div className="author-rating">
                      {renderStars(review.rating)}
                    </div>
                    <p className="author-location">
                      {review.location} • {review.time}
                    </p>
                  </div>
                </div>

                {/* Product Info */}
                <div className="testimonial-product">
                  {review.product && <p className="product-name">{review.product}</p>}
                  {review.recommend && (
                    <div className="recommend-badge">
                      <FavoriteBorderIcon fontSize="small" />
                      <span>Recommended</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="testimonial-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((current + 1) / (approved.length || 1)) * 100}%`,
              }}
            />
          </div>
          <div className="progress-text">
            {current + 1} of {approved.length || 1}
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="testimonial-dots-modern">
        {approved.map((_, index) => (
          <button
            key={index}
            className={`testimonial-dot-modern ${index === current ? "active" : ""
              }`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Enhanced Modal for submission */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
          <div className="w-11/12 max-w-lg rounded-xl shadow-2xl overflow-hidden my-8" style={{ background: '#ffffff', maxHeight: '85vh' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#e2e8f0' }}>
              <h3 className="text-xl font-semibold" style={{ color: '#1e293b' }}>Share your experience</h3>
              <button aria-label="Close" className="p-2 rounded hover:bg-gray-100" onClick={() => setOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="px-5 py-4 grid grid-cols-1 gap-3 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 160px)' }}>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium" style={{ color: '#334155' }}>Full Name</label>
                <input className="border rounded px-3 py-2 focus:outline-none focus:ring" style={{ borderColor: '#e2e8f0' }} placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium" style={{ color: '#334155' }}>Email</label>
                <input className="border rounded px-3 py-2 focus:outline-none focus:ring" style={{ borderColor: '#e2e8f0' }} placeholder="you@example.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium" style={{ color: '#334155' }}>Designation (optional)</label>
                <input className="border rounded px-3 py-2 focus:outline-none focus:ring" style={{ borderColor: '#e2e8f0' }} placeholder="e.g., Researcher & Advisor" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium" style={{ color: '#334155' }}>Rating (1-5)</label>
                <input className="border rounded px-3 py-2 focus:outline-none focus:ring" style={{ borderColor: '#e2e8f0' }} placeholder="5" type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) || 5 })} />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium" style={{ color: '#334155' }}>Your Review</label>
                <textarea className="border rounded px-3 py-2 focus:outline-none focus:ring" style={{ borderColor: '#e2e8f0' }} placeholder="Write a few words about your experience" rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>

              {/* Internal Image Uploader with preview */}
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium" style={{ color: '#334155' }}>Avatar (optional)</label>
                <div className="flex items-center gap-3">
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="preview" className="w-12 h-12 rounded-full object-cover border" style={{ borderColor: '#e2e8f0' }} />
                  ) : (
                    <div className="w-12 h-12 rounded-full border flex items-center justify-center" style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
                        <path d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
                      </svg>
                    </div>
                  )}
                  <label className="px-3 py-2 border rounded cursor-pointer text-sm" style={{ borderColor: '#cbd5e1', color: '#1e293b', background: '#f8fafc' }}>
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      const fd = new FormData();
                      fd.append('image', file);
                      setUploading(true);
                      try {
                        const { data } = await axios.post('/api/v1/testimonial/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                        if (data?.url) { setForm(prev => ({ ...prev, imageUrl: data.url })); }
                      } catch (err) { } finally { setUploading(false); }
                    }} />
                    {uploading ? 'Uploading…' : 'Upload Image'}
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex items-center justify-end gap-2 px-5 py-4 border-t bg-white" style={{ borderColor: '#e2e8f0' }}>
              <button
                className="px-4 py-2 rounded-full border text-sm shadow-sm hover:shadow transition-all"
                style={{ borderColor: '#cbd5e1', color: '#334155', background: '#ffffff' }}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${(submitting || uploading) ? 'opacity-60 cursor-not-allowed' : 'shadow-sm hover:shadow'}`}
                style={{ background: 'var(--brand-yellow)', color: '#ffffff' }}
                disabled={submitting || uploading}
                onClick={async () => {
                  if (!form.name || !form.email || !form.message) return;
                  setSubmitting(true);
                  try {
                    await axios.post('/api/v1/testimonial', form, { headers: { 'Content-Type': 'application/json' } });
                    setOpen(false);
                    setForm({ name: '', email: '', rating: 5, message: '', imageUrl: '', role: '' });
                    // Do not refresh approved list now; new review is pending. Keep current UI unchanged.
                    enqueueSnackbar('Thank you! Your review was submitted.', { variant: 'success' });
                  } catch (e) {
                    enqueueSnackbar(e?.response?.data?.message || 'Failed to submit review', { variant: 'error' });
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {uploading ? 'Uploading…' : (submitting ? 'Submitting…' : 'Submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonial;

