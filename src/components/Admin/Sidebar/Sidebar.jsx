import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import GroupIcon from "@mui/icons-material/Group";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import ReviewsIcon from "@mui/icons-material/Reviews";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Avatar from "@mui/material/Avatar";
import { useSnackbar } from "notistack";
import { memo, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../actions/userAction";
import { LanguageContext } from "../../../utils/LanguageContext";

const Sidebar = memo(({ activeTab, setSidebarOpen, isMobile, sidebarOpen }) => {
  const { language } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state.user);

  const navMenu = useMemo(
    () => [
      {
        icon: <EqualizerIcon />,
        label: language === "english" ? "Dashboard" : "ড্যাশবোর্ড",
        ref: "/admin/dashboard",
        tabIndex: 0,
      },
      {
        icon: <ShoppingBagIcon />,
        label: language === "english" ? "Orders" : "অর্ডারসমূহ",
        ref: "/admin/orders",
        tabIndex: 1,
      },
      {
        icon: <ShoppingBagIcon />,
        label: language === "english" ? "Categories" : "ক্যাটাগরি",
        ref: "/admin/categories",
        tabIndex: 2,
      },
      {
        icon: <InventoryIcon />,
        label: language === "english" ? "Products" : "পণ্যসমূহ",
        ref: "/admin/products",
        tabIndex: 3,
      },
      {
        icon: <AddBoxIcon />,
        label: language === "english" ? "Add Product" : "পণ্য যোগ করুন",
        ref: "/admin/new_product",
        tabIndex: 4,
      },
      {
        icon: <GroupIcon />,
        label: language === "english" ? "Users" : "ব্যবহারকারীগণ",
        ref: "/admin/users",
        tabIndex: 5,
      },
      {
        icon: <ReviewsIcon />,
        label: language === "english" ? "Reviews" : "রিভিউসমূহ",
        ref: "/admin/reviews",
        tabIndex: 6,
      },
      {
        icon: <ReviewsIcon />,
        label:
          language === "english" ? "Review Screenshots" : "রিভিউ স্ক্রিনশট",
        ref: "/admin/review-screenshots",
        tabIndex: 7,
      },
      {
        icon: <ReviewsIcon />,
        label: language === "english" ? "Testimonials" : "টেস্টিমোনিয়াল",
        ref: "/admin/testimonials",
        tabIndex: 8,
      },
      {
        icon: <LocalOfferIcon />,
        label: language === "english" ? "Coupons" : "কুপন",
        ref: "/admin/coupons",
        tabIndex: 9,
      },
      {
        icon: <ReviewsIcon />,
        label:
          language === "english" ? "Trusted Companies" : "বিশ্বস্ত কোম্পানি",
        ref: "/admin/trusted-companies",
        tabIndex: 10,
      },
      {
        icon: <AccountBoxIcon />,
        label: language === "english" ? "User Messages" : "ইউজার মেসেজ",
        ref: "/admin/usermessage",
        tabIndex: 11,
      },
      {
        icon: <AccountBoxIcon />,
        label: language === "english" ? "Blogs" : "পোস্ট",
        ref: "/admin/blogs",
        tabIndex: 12,
      },
      {
        icon: <AccountBoxIcon />,
        label: language === "english" ? "Video Gallery" : "ভিডিও",
        ref: "/admin/videogallery",
        tabIndex: 13,
      },
      {
        icon: <AccountBoxIcon />,
        label: language === "english" ? "Brands" : "ব্র্যান্ড",
        ref: "/admin/brands",
        tabIndex: 14,
      },
      {
        icon: <AccountBoxIcon />,
        label: language === "english" ? "Sliders" : "Sliders",
        ref: "/admin/sliders",
        tabIndex: 15,
      },
      {
        icon: <AccountBoxIcon />,
        label: language === "english" ? "Banner Text" : "ব্যানার টেক্সট",
        ref: "/admin/banner-text",
        tabIndex: 16,
      },
      {
        icon: <LogoutIcon />,
        label: language === "english" ? "Logout" : "লগআউট",
        tabIndex: 17,
      },
    ],
    [language]
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    enqueueSnackbar(
      language === "english" ? "Logout Successfully" : "সফলভাবে লগআউট হয়েছে",
      { variant: "success" }
    );
    navigate("/login");
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const userProfileSection = useMemo(
    () => (
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <Avatar
            alt="User Avatar"
            src={user?.avatar?.url}
            className="w-10 h-10 border-2 border-blue-300"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium truncate text-gray-800">
              {user?.name}
            </span>
            <span className="text-blue-700 text-sm truncate">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    ),
    [user?.name, user?.email, user?.avatar?.url]
  );

  return (
    <div
      className="flex flex-col h-full shadow-2xl rounded-r-2xl transition-all duration-300 min-w-[260px]"
      style={{ background: "var(--bg-surface, #ffffff)" }}
    >
      {/* Fixed Profile Section */}
      <div className="flex-shrink-0 relative">
        <div
          className="p-6 border-b rounded-tr-2xl"
          style={{
            background: "var(--bg-subtle, #f9fafb)",
            borderColor: "var(--border, #e5e7eb)",
          }}
        >
          <div className="flex items-center gap-4">
            <Avatar
              alt="User Avatar"
              src={user?.avatar?.url}
              className="w-12 h-12 shadow-md rounded-full"
              style={{ border: "4px solid var(--primary-blue-light)" }}
            />
            <div className="flex flex-col overflow-hidden">
              <span
                style={{ color: "var(--accent, #FF1837)" }}
              >
                {user?.name}
              </span>
              <span
                className="text-sm truncate font-medium"
                style={{ color: "var(--text-secondary, #4A4A4A)" }}
              >
                {user?.email}
              </span>
            </div>
          </div>
        </div>
        {/* Close Button for Mobile */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full shadow transition-colors z-10"
            style={{ background: "var(--glass-bg)" }}
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="var(--primary-blue-dark)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Scrollable Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <nav className="space-y-1">
          {navMenu.map((item, index) => (
            <div key={index} className="">
              {item.label === (language === "english" ? "Logout" : "লগআউট") ? (
                <button
                  onClick={handleLogout}
                  className={`
                    w-full text-left flex gap-3 items-center py-3 px-5 rounded-xl
                    transition-all duration-200 shadow-sm
                  `}
                  style={
                    activeTab === item.tabIndex
                      ? {
                        background: "var(--accent-subtle, #fff1f2)",
                        color: "var(--accent, #FF1837)",
                        fontWeight: 600,
                        boxShadow: "0 2px 8px rgba(255, 24, 55, 0.08)",
                      }
                      : {
                        color: "var(--text-primary, #0A0A0A)",
                        background: "transparent",
                      }
                  }
                >
                  <span
                    className="text-xl"
                    style={{
                      color:
                        activeTab === item.tabIndex
                          ? "var(--accent, #FF1837)"
                          : "var(--text-muted, #8E8E8E)",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-base">{item.label}</span>
                </button>
              ) : (
                <Link
                  to={item.ref}
                  onClick={handleLinkClick}
                  className={`
                    w-full flex gap-3 items-center py-3 px-5 rounded-xl
                    transition-all duration-200 shadow-sm
                  `}
                  style={
                    activeTab === item.tabIndex
                      ? {
                        background: "var(--accent-subtle, #fff1f2)",
                        color: "var(--accent, #FF1837)",
                        fontWeight: 600,
                        boxShadow: "0 2px 8px rgba(255, 24, 55, 0.08)",
                      }
                      : {
                        color: "var(--text-primary, #0A0A0A)",
                        background: "transparent",
                      }
                  }
                >
                  <span
                    className="text-xl"
                    style={{
                      color:
                        activeTab === item.tabIndex
                          ? "var(--accent, #FF1837)"
                          : "var(--text-muted, #8E8E8E)",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-base">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Desktop Footer - Back to Website */}
      {!isMobile && (
        <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-gray-50 rounded-br-2xl">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white text-blue-600 rounded-xl shadow-sm font-semibold text-sm hover:bg-blue-50 transition-all active:scale-95 border border-blue-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {language === "english" ? "Back to Website" : "ওয়েবসাইটে ফিরে যান"}
          </Link>
        </div>
      )}
    </div>
  );
});

export default Sidebar;
