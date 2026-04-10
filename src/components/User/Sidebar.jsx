import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../actions/userAction";
import { LanguageContext } from "../../utils/LanguageContext";
import { useSnackbar } from "notistack";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import GoldUserBadge from "../common/GoldUserBadge";

export const OrdersCTACard = ({ className = "" }) => {
  const { language } = useContext(LanguageContext);
  const t = (eng, ben) => (language === "english" ? eng : ben);

  return (
    <div className={`rounded-xl border border-gray-200 bg-gray-50 shadow-sm p-5 text-center ${className}`}>
      <div className="flex justify-center mb-2 text-black">
        <ShoppingBagOutlinedIcon fontSize="medium" />
      </div>
      <h3 className="text-sm font-bold text-gray-900 mb-1">{t("Track Orders", "অর্ডার ট্র্যাক")}</h3>
      <p className="text-xs font-medium text-gray-500 mb-4 px-2 leading-relaxed">
        {t("Check out all your orders and track their delivery status in real-time.", "আপনার সমস্ত অর্ডার চেক করুন এবং রিয়েল-টাইমে ট্র্যাক করুন।")}
      </p>
      <Link
        to="/orders"
        className="block w-full py-2.5 px-4 bg-black hover:bg-[#FF1837] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 shadow-sm hover:shadow-[0_8px_16px_-6px_rgba(255,24,55,0.4)]"
      >
        {t("My Orders", "আমার অর্ডার")}
      </Link>
    </div>
  );
};

const Sidebar = ({ activeTab }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state.user);
  const { language } = useContext(LanguageContext);

  const t = (eng, ben) => (language === "english" ? eng : ben);

  const handleLogout = () => {
    dispatch(logoutUser());
    enqueueSnackbar(t("Logged out successfully", "সফলভাবে লগআউট হয়েছে"), { variant: "info" });
    navigate("/login");
  };

  const navItems = [
    { path: "/account", tab: "profile", icon: <PersonOutlineOutlinedIcon fontSize="small" />, label: t("Profile", "প্রোফাইল") },
    { path: "/wishlist", tab: "wishlist", icon: <FavoriteBorderIcon fontSize="small" />, label: t("Wishlist", "ইচ্ছেতালিকা") }
  ];

  return (
    <aside className="sticky top-28 flex flex-col gap-4 w-full md:w-64 shrink-0">
      {/* Profile Summary */}
      <div className="p-4 md:p-5 flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 bg-gray-100 ring-2 ring-gray-100">
            <img src={user.avatar?.url || "https://img.icons8.com/ios-filled/100/000000/user-male-circle.png"} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">{t("Hello,", "হ্যালো,")}</p>
            <h2 className="text-sm font-bold text-gray-900 leading-tight">{user.name}</h2>
            {user.isGoldUser && <div className="mt-1"><GoldUserBadge size="small" /></div>}
          </div>
        </div>
        {/* Mobile Logout Button */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-sm"
          onClick={handleLogout}
          title={t("Logout", "লগআউট")}
        >
          <PowerSettingsNewIcon fontSize="small" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-row md:flex-col overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm p-2 gap-2">
        {navItems.map((item) => (
          <Link
            key={item.tab}
            to={item.path}
            className={`flex items-center justify-center md:justify-start gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-1 md:flex-none ${activeTab === item.tab
                ? 'bg-black text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              }`}
          >
            <span className="md:hidden">{item.icon}</span>
            <span className="hidden md:inline">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div className="hidden md:block h-px bg-gray-100 my-1 mx-2"></div>

        <button
          className="hidden md:flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-[#FF1837] transition-all duration-200 text-left"
          onClick={handleLogout}
        >
          <PowerSettingsNewIcon fontSize="small" />
          {t("Logout", "লগআউট")}
        </button>
      </nav>

      {/* Orders CTA Card - Desktop Only */}
      <OrdersCTACard className="hidden md:block mt-auto md:mt-2" />
    </aside>
  );
};

export default Sidebar;
