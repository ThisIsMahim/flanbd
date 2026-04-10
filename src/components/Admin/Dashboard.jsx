import MenuIcon from "@mui/icons-material/Menu";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import { LanguageContext } from "../../utils/LanguageContext";

const Dashboard = () => {
  const { language } = useContext(LanguageContext);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ticking = useRef(false);
  const location = useLocation();

  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return 0;
    if (path.includes("/admin/orders") || path.includes("/admin/order/"))
      return 1;
    if (path.includes("/admin/categories")) return 2;
    if (path.includes("/admin/products")) return 3;
    if (path.includes("/admin/new_product") || path.includes("/admin/product/"))
      return 4;
    if (path.includes("/admin/users") || path.includes("/admin/user/"))
      return 5;
    if (path.includes("/admin/reviews")) return 6;
    if (path.includes("/admin/review-screenshots")) return 7;
    if (path.includes("/admin/testimonials")) return 8;
    if (path.includes("/admin/coupons")) return 9;
    if (path.includes("/admin/trusted-companies")) return 8;
    if (path.includes("/admin/usermessage")) return 11;
    if (path.includes("/admin/blogs")) return 12;
    if (path.includes("/admin/videogallery")) return 13;
    if (path.includes("/admin/brands")) return 14;
    if (path.includes("/admin/sliders")) return 15;
    if (path.includes("/admin/banner-text")) return 16;
    return 0;
  }, [location.pathname]);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 10;
        if (isScrolled !== scrolled) {
          setScrolled(isScrolled);
        }
        ticking.current = false;
      });
    }
  }, [scrolled]);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Minimum loading time to prevent flickering

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const sidebarComponent = useMemo(
    () => (
      <Sidebar
        activeTab={activeTab}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
      />
    ),
    [activeTab, isMobile, sidebarOpen]
  );

  const sidebarTopPosition = "0px";

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50">
      {/* Header spacer - dynamically adjust based on scrolled state */}


      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - unchanged scrolling behavior */}
        <div
          className={`
            fixed left-0 bottom-0 z-50
            w-64 transform
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            ${!isMobile && "translate-x-0"}
            transition-all duration-300 ease-in-out
            will-change-transform
          `}
          style={{
            top: sidebarTopPosition,
          }}
        >
          {sidebarComponent}
        </div>

        {/* Main content area - only change margin-top here */}
        <div
          className={`
            flex-1 min-w-0 
            ${!isMobile && sidebarOpen ? "ml-64" : "ml-0"}
            overflow-y-auto
            transition-all duration-300 ease-in-out
          `}
        >
          <div className="sm:px-6">
            {/* Mobile menu button */}
            {isMobile && (
              <div className="flex items-center justify-between mb-4 mr-4">
                <button
                  onClick={handleSidebarToggle}
                  className="lg:hidden bg-white p-2 rounded-md shadow-sm hover:bg-gray-100 ml-4 mt-4"
                  aria-label="Open menu"
                >
                  <MenuIcon className="text-gray-600" />
                </button>
                <Link
                  to="/"
                  className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg shadow-sm font-semibold text-sm hover:bg-blue-50 transition-all active:scale-95 border border-blue-100"
                >
                  {language === "english" ? "Back to Website" : "ওয়েবসাইটে ফিরে যান"}
                </Link>
              </div>
            )}
            <div className="overflow-x-hidden relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
