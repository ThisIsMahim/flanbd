import { useEffect } from "react";
import MetaData from "../Layouts/MetaData";
import Banner from "./Banner/Banner";
import Categories from "./Categories/Categories";
import CompanySlider from "./CompanySlider/CompanySlider";
import DealSlider from "./DealSlider/DealSlider";
import "./Home.css";
import ProductSlider from "./ProductSlider/ProductSlider";

const MainPage = () => {
  // Add water background effect when the component mounts
  useEffect(() => {
    // Create a water ripple canvas in the background
    const createWaterBackground = () => {
      const rippleCount = 8;
      const rippleContainer = document.createElement("div");
      rippleContainer.className = "water-background-container";
      rippleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: -1;
      `;

      // Create ripple elements
      for (let i = 0; i < rippleCount; i++) {
        const ripple = document.createElement("div");
        ripple.className = "water-background-ripple";

        // Randomize position and delay
        const size = Math.random() * 150 + 50; // 50-200px
        const posX = Math.random() * 100; // 0-100%
        const posY = Math.random() * 100; // 0-100%
        const delay = Math.random() * 10; // 0-10s
        const duration = Math.random() * 10 + 15; // 15-25s

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${posX}%;
          top: ${posY}%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(37, 164, 227, 0.03) 0%,
            rgba(255, 255, 255, 0) 70%
          );
          transform: scale(0);
          opacity: 0;
          animation: rippleEffect ${duration}s ease-out ${delay}s infinite;
        `;

        rippleContainer.appendChild(ripple);
      }

      // Add the water wave pattern
      const waterPattern = document.createElement("div");
      waterPattern.className = "water-pattern";
      waterPattern.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: 
          radial-gradient(circle at 25% 25%, rgba(37, 164, 227, 0.02) 1%, transparent 8%),
          radial-gradient(circle at 75% 75%, rgba(37, 164, 227, 0.03) 1%, transparent 8%),
          radial-gradient(circle at 60% 20%, rgba(17, 114, 192, 0.02) 1%, transparent 10%),
          radial-gradient(circle at 10% 80%, rgba(17, 114, 192, 0.03) 1%, transparent 6%);
        background-size: 250px 250px;
        background-position: 0 0;
        opacity: 0.5;
        z-index: -1;
      `;

      rippleContainer.appendChild(waterPattern);

      // Add keyframes for the ripple animation
      const rippleStyle = document.createElement("style");
      rippleStyle.textContent = `
        @keyframes rippleEffect {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          25% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.2;
          }
          75% {
            opacity: 0.1;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(rippleStyle);

      // Append to the document
      document.body.appendChild(rippleContainer);

      // Clean up function
      return () => {
        document.body.removeChild(rippleContainer);
        document.head.removeChild(rippleStyle);
      };
    };

    const cleanup = createWaterBackground();
    return cleanup;
  }, []);

  return (
    <>
      <MetaData title="FlanBD - Premium Anime Merchandise Giftshop" />
      <div className="page-water-bg">
        <Banner />
        <main className="flex flex-col gap-3 px-2 mt-16 sm:mt-2">
          <Categories />
          <DealSlider title={"Today's Deals"} />
          <ProductSlider />
          <CompanySlider />
        </main>
      </div>
    </>
  );
};

export default MainPage;
