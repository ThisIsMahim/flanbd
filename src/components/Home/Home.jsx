import { useSnackbar } from "notistack";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getSliderProducts } from "../../actions/productAction";
import MetaData from "../Layouts/MetaData";
import SimpleBanner from "./Banner/EnhancedBanner";
import DealSlider from "./DealSlider/DealSlider.jsx";
import "./Home.css";
import ReviewScreenshotsCarousel from "./ReviewScreenshotsCarousel";
import TrustedCompaniesCarousel from "./TrustedCompaniesCarousel";
import GoldUserAnimation from "../common/GoldUserAnimation";
import GoldUserBadge from "../common/GoldUserBadge";
import HomeBlogSection from "./HomeBlogSection";
import HomeContactSection from "./HomeContactSection";

// Lazy load heavy components
const ProductSlider = lazy(() => import("./ProductSlider/ProductSlider.jsx"));

// Loading fallback
const LoadingFallback = () => (
  <div className="loading-placeholder" />
);

const Home = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [showGoldAnimation, setShowGoldAnimation] = useState(false);

  const { user } = useSelector((state) => state.user);
  const { error, loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getSliderProducts());
  }, [dispatch, error, enqueueSnackbar]);

  // Check if user just became Gold User
  useEffect(() => {
    if (user?.isGoldUser && user?.goldUserSince) {
      const goldUserDate = new Date(user.goldUserSince);
      const now = new Date();
      const timeDiff = now - goldUserDate;
      if (timeDiff < 24 * 60 * 60 * 1000) {
        setShowGoldAnimation(true);
      }
    }
  }, [user]);

  return (
    <>
      <MetaData title="FlanBD - The clan for the fans | Premium anime merchandise giftshop" />



      <main className="home-main">
        {/* Hero Banner */}
        <SimpleBanner />

        {/* Content Sections */}
        <div className="home-content">
          {/* Products */}
          {!loading && (
            <section className="home-section">
              <Suspense fallback={<LoadingFallback />}>
                <ProductSlider />
              </Suspense>
            </section>
          )}

          {/* Client Reviews */}
          <section className="home-section">
            <ReviewScreenshotsCarousel />
          </section>

          {/* Hot Deals */}
          <section className="home-section">
            <DealSlider />
          </section>

          {/* Trusted Brands */}
          <section className="home-section">
            <TrustedCompaniesCarousel />
          </section>

          <section className="home-section">
            <HomeBlogSection />
          </section>

          <section className="home-section">
            <HomeContactSection />
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
