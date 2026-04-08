import axios from "axios";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import WebFont from "webfontloader";
import BlogTable from "./Blogs/BlogTable";
import BlogDetail from "./Blogs/ShowBlogs/BlogDetails";
import ShowBlogs from "./Blogs/ShowBlogs/ShowBlogs";
import ProtectedRoute from "./Routes/ProtectedRoute";
import { loadUser } from "./actions/userAction";
import BannerTextAdmin from "./components/Admin/BannerTextAdmin";
import BrandPageAdmin from "./components/Admin/BrandPageAdmin";
import CategoryAdminPage from "./components/Admin/CategoryAdminPage";
import Dashboard from "./components/Admin/Dashboard";
import MainData from "./components/Admin/MainData";
import NewProduct from "./components/Admin/NewProduct";
import OrderTable from "./components/Admin/OrderTable";
import ProductTable from "./components/Admin/ProductTable";
import ReviewScreenshotsAdmin from "./components/Admin/ReviewScreenshots/ReviewScreenshotsAdmin";
import ReviewsTable from "./components/Admin/ReviewsTable";
import CouponAdmin from "./components/Admin/CouponAdmin";
import SliderManagement from "./components/Admin/SliderManagement";
import TrustedCompaniesAdmin from "./components/Admin/TrustedCompanies/TrustedCompaniesAdmin";
import TestimonialTable from "./components/Admin/TestimonialTable";
import UpdateOrder from "./components/Admin/UpdateOrder";
import UpdateProduct from "./components/Admin/UpdateProduct";
import UpdateUser from "./components/Admin/UpdateUser";
import UserMessagesPage from "./components/Admin/UserMessagesPage";
import UserTable from "./components/Admin/UserTable";
import VideoGallery from "./components/Admin/VideoGallery";
import Cart from "./components/Cart/Cart";
import OrderConfirm from "./components/Cart/OrderConfirm";
import OrderStatus from "./components/Cart/OrderStatus";
import OrderSuccess from "./components/Cart/OrderSuccess";
import Payment from "./components/Cart/Payment";
import GuestCheckout from "./components/Cart/GuestCheckout";
import GuestOrderTracking from "./components/Cart/GuestOrderTracking";

import Home from "./components/Home/Home";
import Footer from "./components/Layouts/Footer/Footer";
import Header from "./components/Layouts/Header/Header";
import AboutUs from "./components/Layouts/aboutUsPage/AboutUs";
import ContactUs from "./components/Layouts/contactUsPage/ContactUs";
import ExplorePage from "./components/Layouts/explorePage/ExplorePage";
import ServicesPage from "./components/Layouts/servicesPage/ServicesPage";
import NotFound from "./components/NotFound";
import MyOrders from "./components/Order/MyOrders";
import OrderDetails from "./components/Order/OrderDetails";
import OrderHistory from "./components/User/OrderHistory";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import Products from "./components/Products/Products";
import Account from "./components/User/Account";
import ForgotPassword from "./components/User/ForgotPassword";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import ResetPassword from "./components/User/ResetPassword";
import UpdatePassword from "./components/User/UpdatePassword";
import UpdateProfile from "./components/User/UpdateProfile";
import Wishlist from "./components/Wishlist/Wishlist";
import GoldDetails from "./components/Layouts/Gold/GoldDetails";
import { LanguageProvider } from "./utils/LanguageContext";
import Shipping from "./components/Cart/Shipping";
import CancellationReturn from "./components/Layouts/Footer/CancellationReturn";
import TermsConditions from "./components/Layouts/Footer/TermsConditions";
import ShippingPolicies from "./components/Layouts/Footer/Shipping";
import HomeBlogSection from "./components/Home/HomeBlogSection";
import MobileBottomNav from "./components/Layouts/Header/MobileBottomNav";

// Configure axios defaults
axios.defaults.withCredentials = true;
// Use backend URL from env if provided, otherwise default to local backend in dev
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// Enhanced inspection prevention
// const disableInspection = (e) => {
//   // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
//   if (
//     e.keyCode === 123 || // F12
//     (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
//     (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
//     (e.ctrlKey && e.keyCode === 85) // Ctrl+U
//   ) {
//     e.preventDefault();
//     return false;
//   }

//   // Block right-click
//   if (e.button === 2) {
//     e.preventDefault();
//     return false;
//   }
// };

// Prevent all context menus
// const disableContextMenu = (e) => {
//   e.preventDefault();
// };

// Frame busting to prevent domain search inspection
// const preventFrameBusting = () => {
//   if (window.top !== window.self) {
//     window.top.location = window.self.location;
//   }
// };

// Anti-inspect protection
// const antiInspectProtection = () => {
//   // Block console opening
//   Object.defineProperty(window, 'console', {
//     value: console,
//     writable: false,
//     configurable: false
//   });

//   // Block debugger statements
//   setInterval(() => {
//     if (window.devtools && window.devtools.open) {
//       window.location.reload();
//     }
//   }, 1000);
// };

function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    // Initialize all security measures
    // document.addEventListener('keydown', disableInspection);
    // document.addEventListener('contextmenu', disableContextMenu);
    // document.addEventListener('mousedown', disableInspection);
    // window.addEventListener('load', preventFrameBusting);
    // window.addEventListener('focus', preventFrameBusting);
    // window.addEventListener('blur', preventFrameBusting);
    // antiInspectProtection();

    WebFont.load({
      google: {
        families: [
          "Lato:100,200,300,400,500,600,700,800,900",
        ],
      },
    });

    // Cleanup
    return () => {
      // document.removeEventListener('keydown', disableInspection);
      // document.removeEventListener('contextmenu', disableContextMenu);
      // document.removeEventListener('mousedown', disableInspection);
      // window.removeEventListener('load', preventFrameBusting);
      // window.removeEventListener('focus', preventFrameBusting);
      // window.removeEventListener('blur', preventFrameBusting);
    };
  }, []);

  useEffect(() => {
    // Prevent domain search by blurring window on focus
    // const preventDomainSearch = () => {
    //   if (window.top !== window.self) {
    //     window.top.location.href = window.self.location.href;
    //   }
    // };
    // window.addEventListener('focus', preventDomainSearch);
    // return () => window.removeEventListener('focus', preventDomainSearch);
  }, []);

  useEffect(() => {
    // Load user only on app initialization
    const loadUserData = async () => {
      try {
        await dispatch(loadUser());
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    loadUserData();
  }, [dispatch]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  useEffect(() => {
    // const excludedRoutes = ["/admin"];
    // const isProductDetails = /^\/product\/[^/]+$/.test(pathname);
    // const shouldShowTawk =
    //   !excludedRoutes.some((route) => pathname.startsWith(route)) &&
    //   !isProductDetails;

    // Add Tawk.to script
    // const addTawkScript = () => {
    //   if (!document.getElementById("tawkto-script")) {
    //     const s1 = document.createElement("script");
    //     s1.id = "tawkto-script";
    //     s1.async = true;
    //     s1.src = "https://embed.tawk.to/68615c8970c874190ff57223/1iuu52v6q";
    //     s1.charset = "UTF-8";
    //     s1.setAttribute("crossorigin", "*");
    //     document.body.appendChild(s1);
    //   }
    // };

    // if (shouldShowTawk) {
    //   addTawkScript();
 
    //   const showInterval = setInterval(() => {
    //     if (
    //       window.Tawk_API &&
    //       typeof window.Tawk_API.showWidget === "function"
    //     ) {
    //       window.Tawk_API.showWidget();
    //       clearInterval(showInterval);
    //     }
    //   }, 200);
    //   return () => clearInterval(showInterval);
    // } else {

    //   const hideInterval = setInterval(() => {
    //     if (
    //       window.Tawk_API &&
    //       typeof window.Tawk_API.hideWidget === "function"
    //     ) {
    //       window.Tawk_API.hideWidget();
    //       clearInterval(hideInterval);
    //     }
    //   }, 200);
    //   return () => clearInterval(hideInterval);
    // }
  }, [pathname]);

  return (
    <HelmetProvider>
      <LanguageProvider>
        {!pathname.startsWith("/admin") && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />

          <Route path="/cart" element={<Cart />} />

          {/* Guest Routes */}
          <Route path="/guest-checkout" element={<GuestCheckout />} />
          <Route path="/guest-order-tracking" element={<GuestOrderTracking />} />

          {/* Protected Routes */}
          <Route
            path="/shipping"
            element={
              <ProtectedRoute>
                <Shipping/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/order/confirm"
            element={
              <ProtectedRoute>
                <OrderConfirm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/process/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/success"
            element={<OrderSuccess success={true} />}
          />
          <Route
            path="/orders/failed"
            element={<OrderSuccess success={false} />}
          />

          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderStatus />
              </ProtectedRoute>
            }
          />

          <Route path="/about" element={<AboutUs />} />
          {/* <Route path="/explore" element={<ExplorePage />} /> */}
          <Route path="/services" element={<ServicesPage />} />
          
          {/* New Navigation Routes */}

          {/* <Route path="/showblogs" element={<ShowBlogs />} /> */}
          <Route path="/stories" element={<ShowBlogs />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/shipping-policies" element={<ShippingPolicies />} />
          <Route path="/cancellation-return" element={<CancellationReturn />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-history"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order_details/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account/update"
            element={
              <ProtectedRoute>
                <UpdateProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/password/update"
            element={
              <ProtectedRoute>
                <UpdatePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/password/forgot"
            element={<ForgotPassword />}
          />

          <Route
            path="/password/reset/:token"
            element={<ResetPassword />}
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route path="/gold-details" element={<GoldDetails />} />
          {/* <Route path="gold-details" element={<GoldDetails />} /> */}

          <Route path="/contact" element={<ContactUs />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<MainData />} />
            <Route path="orders" element={<OrderTable />} />
            <Route path="order/:id" element={<UpdateOrder />} />
            <Route path="categories" element={<CategoryAdminPage />} />
            <Route path="products" element={<ProductTable />} />
            <Route path="new_product" element={<NewProduct />} />
            <Route path="product/:id" element={<UpdateProduct />} />
            <Route path="brands" element={<BrandPageAdmin />} />
            <Route path="users" element={<UserTable />} />
            <Route path="user/:id" element={<UpdateUser />} />
            <Route path="reviews" element={<ReviewsTable />} />
            <Route path="coupons" element={<CouponAdmin />} />
            <Route
              path="review-screenshots"
              element={<ReviewScreenshotsAdmin />}
            />
            <Route path="usermessage" element={<UserMessagesPage />} />
            <Route path="blogs" element={<BlogTable />} />
            <Route path="videogallery" element={<VideoGallery />} />
            <Route path="sliders" element={<SliderManagement />} />
            <Route path="banner-text" element={<BannerTextAdmin />} />
            <Route
              path="trusted-companies"
              element={<TrustedCompaniesAdmin />}
            />
            <Route path="testimonials" element={<TestimonialTable />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <ChatButton /> */}
        {pathname !== "/login" && pathname !== "/register" && <MobileBottomNav />}
        {!pathname.startsWith("/admin") && pathname !== "/login" && pathname !== "/register" && <Footer />}
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
