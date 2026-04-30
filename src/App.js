import axios from "axios";
import { lazy, Suspense, useEffect } from "react";
import "./styles/globals.css";
import { HelmetProvider } from "react-helmet-async";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import WebFont from "webfontloader";
import Loader from "./components/Layouts/Loader";
import { loadUser } from "./actions/userAction";
import { LanguageProvider } from "./utils/LanguageContext";
import HomeSkeleton from "./components/Home/HomeSkeleton";

// Feature components (Lazy loaded)
const BlogTable = lazy(() => import("./Blogs/BlogTable"));
const BlogDetail = lazy(() => import("./Blogs/ShowBlogs/BlogDetails"));
const ShowBlogs = lazy(() => import("./Blogs/ShowBlogs/ShowBlogs"));
const ProtectedRoute = lazy(() => import("./Routes/ProtectedRoute"));
const BannerTextAdmin = lazy(() => import("./components/Admin/BannerTextAdmin"));
const BrandPageAdmin = lazy(() => import("./components/Admin/BrandPageAdmin"));
const CategoryAdminPage = lazy(() => import("./components/Admin/CategoryAdminPage"));
const Dashboard = lazy(() => import("./components/Admin/Dashboard"));
const MainData = lazy(() => import("./components/Admin/MainData"));
const NewProduct = lazy(() => import("./components/Admin/NewProduct"));
const OrderTable = lazy(() => import("./components/Admin/OrderTable"));
const ProductTable = lazy(() => import("./components/Admin/ProductTable"));
const ReviewScreenshotsAdmin = lazy(() => import("./components/Admin/ReviewScreenshots/ReviewScreenshotsAdmin"));
const ReviewsTable = lazy(() => import("./components/Admin/ReviewsTable"));
const CouponAdmin = lazy(() => import("./components/Admin/CouponAdmin"));
const SliderManagement = lazy(() => import("./components/Admin/SliderManagement"));
const TrustedCompaniesAdmin = lazy(() => import("./components/Admin/TrustedCompanies/TrustedCompaniesAdmin"));
const TestimonialTable = lazy(() => import("./components/Admin/TestimonialTable"));
const UpdateOrder = lazy(() => import("./components/Admin/UpdateOrder"));
const UpdateProduct = lazy(() => import("./components/Admin/UpdateProduct"));
const UpdateUser = lazy(() => import("./components/Admin/UpdateUser"));
const UserMessagesPage = lazy(() => import("./components/Admin/UserMessagesPage"));
const UserTable = lazy(() => import("./components/Admin/UserTable"));
const VideoGallery = lazy(() => import("./components/Admin/VideoGallery"));
const Cart = lazy(() => import("./components/Cart/Cart"));
const OrderConfirm = lazy(() => import("./components/Cart/OrderConfirm"));
const OrderStatus = lazy(() => import("./components/Cart/OrderStatus"));
const OrderSuccess = lazy(() => import("./components/Cart/OrderSuccess"));
const Payment = lazy(() => import("./components/Cart/Payment"));
const GuestCheckout = lazy(() => import("./components/Cart/GuestCheckout"));
const GuestOrderTracking = lazy(() => import("./components/Cart/GuestOrderTracking"));

const Home = lazy(() => import("./components/Home/Home.jsx"));
const Footer = lazy(() => import("./components/Layouts/Footer/Footer"));
const Header = lazy(() => import("./components/Layouts/Header/Header"));
const AboutUs = lazy(() => import("./components/Layouts/aboutUsPage/AboutUs"));
const ContactUs = lazy(() => import("./components/Layouts/contactUsPage/ContactUs"));
const ExplorePage = lazy(() => import("./components/Layouts/explorePage/ExplorePage"));
const ServicesPage = lazy(() => import("./components/Layouts/servicesPage/ServicesPage"));
const NotFound = lazy(() => import("./components/NotFound"));
const MyOrders = lazy(() => import("./components/Order/MyOrders"));
const OrderDetails = lazy(() => import("./components/Order/OrderDetails"));
const OrderHistory = lazy(() => import("./components/User/OrderHistory"));
const ProductDetails = lazy(() => import("./components/ProductDetails/ProductDetails"));
const Products = lazy(() => import("./components/Products/Products.jsx"));
const Account = lazy(() => import("./components/User/Account"));
const ForgotPassword = lazy(() => import("./components/User/ForgotPassword"));
const Login = lazy(() => import("./components/User/Login"));
const Register = lazy(() => import("./components/User/Register"));
const ResetPassword = lazy(() => import("./components/User/ResetPassword"));
const UpdatePassword = lazy(() => import("./components/User/UpdatePassword"));
const UpdateProfile = lazy(() => import("./components/User/UpdateProfile"));
const Wishlist = lazy(() => import("./components/Wishlist/Wishlist"));
const GoldDetails = lazy(() => import("./components/Layouts/Gold/GoldDetails"));
const Shipping = lazy(() => import("./components/Cart/Shipping"));
const CancellationReturn = lazy(() => import("./components/Layouts/Footer/CancellationReturn"));
const TermsConditions = lazy(() => import("./components/Layouts/Footer/TermsConditions"));
const ShippingPolicies = lazy(() => import("./components/Layouts/Footer/Shipping"));
const HomeBlogSection = lazy(() => import("./components/Home/HomeBlogSection"));
const MobileBottomNav = lazy(() => import("./components/Layouts/Header/MobileBottomNav"));

// Configure axios defaults
axios.defaults.withCredentials = true;
// In production, we use the provided backend URL. In development, we fallback to localhost.
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || (process.env.NODE_ENV === 'production' ? "" : "http://localhost:5000");

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
          <Route path="/" element={
            <Suspense fallback={<HomeSkeleton />}>
              <Home />
            </Suspense>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route path="/product-category/:categoryName" element={<Products />} />
          <Route path="/product-category/:categoryName/:subCategoryName" element={<Products />} />

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
        <MobileBottomNav />
        {!pathname.startsWith("/admin") && pathname !== "/login" && pathname !== "/register" && <Footer />}
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
