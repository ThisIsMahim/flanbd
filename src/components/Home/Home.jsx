import { useSnackbar } from "notistack";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { clearErrors, getSliderProducts } from "../../actions/productAction";
import MetaData from "../Layouts/MetaData";
import ServiceBookingModal from "../Layouts/servicesPage/ServiceBookingModal";
import SimpleBanner from "./Banner/EnhancedBanner";
import Categories from "./Categories";
import DealSlider from "./DealSlider/DealSlider";
import "./home.css";
import ReviewScreenshotsCarousel from "./ReviewScreenshotsCarousel";
import TrustedCompaniesCarousel from "./TrustedCompaniesCarousel";
import ProductShowcase from "./ProductShowcase";
import GoldUserAnimation from "../common/GoldUserAnimation";
import GoldUserBadge from "../common/GoldUserBadge";
import gsap from "gsap";
import useScrollReveal from "./hooks/useScrollReveal";

// Lazy load heavy components

const Testimonials = lazy(() => import("./Testimonial"));

const HomeContactSection = lazy(() => import("./HomeContactSection"));

const ProductSlider = lazy(() => import("./ProductSlider/ProductSlider"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="animate-pulse h-64 rounded-lg my-4" style={{ backgroundColor: 'var(--section-bg)' }}></div>
);

const Home = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [showGoldAnimation, setShowGoldAnimation] = useState(false);

  const { user } = useSelector((state) => state.user);

  const { error, loading } = useSelector((state) => state.products);

  // Animation refs (still used for layout, not for GSAP)
  const bannerRef = useRef(null);
  const missionRef = useRef(null);
  const missionTitleRef = useRef(null);
  const missionTextRef = useRef(null);
  const trustedCompaniesRef = useRef(null);
  const reviewCarouselRef = useRef(null);
  const testimonialsRef = useRef(null);
  const categoriesRef = useRef(null);
  const productSliderRef = useRef(null);
  const dealSliderRef = useRef(null);
  const contactSectionRef = useRef(null);

  // Use scroll-triggered animation for mission title and text
  useScrollReveal(missionTitleRef);
  useScrollReveal(missionTextRef, { delay: 0.15 });

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getSliderProducts());
  }, [dispatch, error, enqueueSnackbar]);

  const handleOpenServiceModal = () => {
    setIsServiceModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
  };

  // Check if user just became Gold User
  useEffect(() => {
    if (user?.isGoldUser && user?.goldUserSince) {
      const goldUserDate = new Date(user.goldUserSince);
      const now = new Date();
      const timeDiff = now - goldUserDate;

      // Show animation if user became Gold User within the last 24 hours
      if (timeDiff < 24 * 60 * 60 * 1000) {
        setShowGoldAnimation(true);
      }
    }
  }, [user]);

  const handleGoldAnimationComplete = () => {
    setShowGoldAnimation(false);
  };

  return (
    <>
      <MetaData title="FlanBD - The clan for the fans | Premium anime merchandise giftshop" />

      {/* Gold User Animation */}
      <GoldUserAnimation
        isVisible={showGoldAnimation}
        onComplete={handleGoldAnimationComplete}
      />

      <main className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--primary-bg)' }}>
        <div ref={bannerRef} style={{ backgroundColor: 'var(--primary-bg)' }}>
          <SimpleBanner />
        </div>
        {/* Gold Promo Strip */}
        {/* <section className="w-full flex items-center justify-center py-3 px-4" style={{ background: 'linear-gradient(90deg, var(--section-bg), var(--primary-bg))', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
          <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👑</span>
              <div className="text-sm md:text-base font-semibold" style={{ color: 'var(--text-light)' }}>
                Become a Gold Member and enjoy 10% additional discount on every order
              </div>
            </div>
            <button onClick={() => window.location.href = 'gold-details'} className="px-4 py-2 rounded-full font-bold shadow transition" style={{ backgroundColor: 'var(--primary-blue-dark)', color: 'var(--text-light)' }} onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-blue-light)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-blue-dark)'}>Learn more</button>
          </div>
        </section> */}

        {/* Mission statement and testimonials section */}
        <section ref={missionRef} className="home-mission-testimonial-wrapper">
          {/* <div className="home-mission-statement">
            <div ref={missionTitleRef} className="home-mission-title">
              Our mission:
            </div>
            <div ref={missionTextRef} className="home-mission-text">
              We build eyewear that lasts — to help
              <br />
              you think better, dream bigger, and stay
              <br />
              focused every day
            </div>
          </div> */}

          {/* Gold User Status Display */}
          {user?.isGoldUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-4 right-4 z-10"
            >
              <GoldUserBadge size="large" showAnimation={false} />
            </motion.div>
          )}
        </section>

        <div className="flex flex-col gap-5 px-0 md:px-12 py-8 rounded-t-3xl shadow-sm" style={{ backgroundColor: 'var(--section-bg)', opacity: 0.9 }}>
          {/* <div ref={categoriesRef}>
            <Categories />
          </div> */}
          {/* <ProductShowcase /> */}

          {!loading && (
            <div ref={productSliderRef} className="mt-3">
              <Suspense fallback={<LoadingFallback />}>
                <ProductSlider />
              </Suspense>
            </div>
          )}

          <div ref={reviewCarouselRef} className="w-full">
            <ReviewScreenshotsCarousel />
          </div>

          <div ref={dealSliderRef} className="mt-2">
            <DealSlider />
          </div>

          {/* <Suspense fallback={<LoadingFallback />}>
            <div ref={testimonialsRef} className="home-testimonial-outer">
              <Testimonials />
            </div>
          </Suspense> */}
          <div ref={trustedCompaniesRef} className="w-full">
            <TrustedCompaniesCarousel />
          </div>

          {/* <Suspense fallback={<LoadingFallback />}>
            <div ref={contactSectionRef} className="mt-4 mb-8">
              <HomeContactSection />
            </div>
          </Suspense> */}
        </div>

        <ServiceBookingModal
          isOpen={isServiceModalOpen}
          onClose={handleCloseServiceModal}
          modalTitle="Book a Maintenance Service"
          modalSubtitle="Fill in your details and we'll contact you to schedule your maintenance service"
          buttonText="Book Service"
          formSubject="Maintenance Service"
        />
      </main>
    </>
  );
};

export default Home;
