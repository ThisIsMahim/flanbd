import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../actions/userAction";
import { useEffect, useContext } from "react";
import { LanguageContext } from "../../utils/LanguageContext";

const Sidebar = ({ activeTab, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { orders = [] } = useSelector((state) => state.myOrders);
  const { language } = useContext(LanguageContext);

  // Translations
  const translations = {
    english: {
      myAccount: "My Account",
      hello: "Hello,",
      myOrders: "MY ORDERS",
      profileInformation: "PROFILE INFORMATION",
      myWishlist: "MY WISHLIST",
      changePassword: "CHANGE PASSWORD",
      logout: "LOGOUT",
      frequentlyVisited: "Frequently Visited:",
      trackOrder: "Track Order",
      helpCenter: "Help Center",
      logoutSuccess: "Logout Successfully",
    },
    bangla: {
      myAccount: "আমার অ্যাকাউন্ট",
      hello: "হ্যালো,",
      myOrders: "আমার অর্ডার",
      profileInformation: "প্রোফাইল তথ্য",
      myWishlist: "আমার ইচ্ছেতালিকা",
      changePassword: "পাসওয়ার্ড পরিবর্তন করুন",
      logout: "লগআউট",
      frequentlyVisited: "প্রায়শই পরিদর্শিত:",
      trackOrder: "অর্ডার ট্র্যাক করুন",
      helpCenter: "সহায়তা কেন্দ্র",
      logoutSuccess: "সফলভাবে লগআউট হয়েছে",
    },
  };

  const t = translations[language];

  // Prevent body scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success(t.logoutSuccess);
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar for desktop and mobile */}
      <div
        className={`${
          isOpen
            ? "fixed left-0 top-0 h-full z-50 w-3/4 overflow-y-auto pb-20"
            : "hidden"
        } sm:static sm:flex sm:flex-col sm:gap-4 sm:w-1/4 sm:px-1 sm:pb-0 bg-white`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b sm:hidden sticky top-0 bg-white z-10 shadow-sm">
          <h2 className="font-medium">{t.myAccount}</h2>
          <button onClick={onClose} className="text-gray-500">
            <CloseIcon />
          </button>
        </div>

        {/* profile card */}
        <div className="flex items-center gap-4 p-3 bg-white rounded-sm shadow mt-1 sm:mt-0">
          <div className="w-12 h-12 rounded-full">
            <img
              draggable="false"
              className="h-full w-full object-cover rounded-full"
              src={user.avatar.url}
              alt="Avatar"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs">{t.hello}</p>
            <h2 className="font-medium">{user.name}</h2>
          </div>
        </div>

        {/* nav tiles */}
        <div className="flex flex-col bg-white rounded-sm shadow">
          {/* my orders tab */}
          <Link
            to="/orders"
            className={`flex items-center gap-5 px-4 py-4 border-b ${
              activeTab === "orders"
                ? "bg-blue-50 text-primary-blue"
                : "text-gray-500 hover:text-primary-blue hover:bg-blue-50"
            }`}
            onClick={() => isOpen && onClose()}
          >
            <span className="text-primary-blue">
              <FolderIcon />
            </span>
            <span className="flex-1 font-medium">{t.myOrders}</span>
            {orders.length > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-primary-blue text-white">
                {orders.length}
              </span>
            )}
            <ChevronRightIcon />
          </Link>

          {/* profile information */}
          <Link
            to="/account"
            className={`flex items-center gap-5 px-4 py-4 border-b ${
              activeTab === "profile"
                ? "bg-blue-50 text-primary-blue"
                : "text-gray-500 hover:text-primary-blue hover:bg-blue-50"
            }`}
            onClick={() => isOpen && onClose()}
          >
            <span className="text-primary-blue">
              <PersonIcon />
            </span>
            <span className="flex-1 font-medium">{t.profileInformation}</span>
            <ChevronRightIcon />
          </Link>

          {/* wishlist tab */}
          <Link
            to="/wishlist"
            className={`flex items-center gap-5 px-4 py-4 border-b ${
              activeTab === "wishlist"
                ? "bg-blue-50 text-primary-blue"
                : "text-gray-500 hover:text-primary-blue hover:bg-blue-50"
            }`}
            onClick={() => isOpen && onClose()}
          >
            <span className="text-primary-blue">
              <FavoriteIcon />
            </span>
            <span className="flex-1 font-medium">{t.myWishlist}</span>
            {wishlistItems.length > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-primary-blue text-white">
                {wishlistItems.length}
              </span>
            )}
            <ChevronRightIcon />
          </Link>

          {/* change password tab */}
          <Link
            to="/password/update"
            className={`flex items-center gap-5 px-4 py-4 border-b ${
              activeTab === "password"
                ? "bg-blue-50 text-primary-blue"
                : "text-gray-500 hover:text-primary-blue hover:bg-blue-50"
            }`}
            onClick={() => isOpen && onClose()}
          >
            <span className="text-primary-blue">
              <PersonIcon />
            </span>
            <span className="flex-1 font-medium">{t.changePassword}</span>
            <ChevronRightIcon />
          </Link>

          {/* logout tab */}
          <button
            onClick={() => {
              handleLogout();
              isOpen && onClose();
            }}
            className="w-full flex items-center gap-5 px-4 py-4 text-white hover:text-primary-blue hover:bg-blue-50"
          >
            <span className="text-primary-blue">
              <PowerSettingsNewIcon />
            </span>
            <span className="flex-1 font-medium text-left">{t.logout}</span>
            <ChevronRightIcon />
          </button>
        </div>

        {/* frequently visited tab */}
        <div className="flex flex-col items-start gap-2 p-4 bg-white rounded-sm shadow">
          <span className="text-xs font-medium">{t.frequentlyVisited}:</span>
          <div className="flex gap-2.5 text-xs text-gray-500">
            <Link
              to="/password/update"
              className="hover:text-primary-blue"
              onClick={() => isOpen && onClose()}
            >
              {t.changePassword}
            </Link>
            <Link
              to="/orders"
              className="hover:text-primary-blue"
              onClick={() => isOpen && onClose()}
            >
              {t.trackOrder}
            </Link>
            <Link
              to="/"
              className="hover:text-primary-blue"
              onClick={() => isOpen && onClose()}
            >
              {t.helpCenter}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
