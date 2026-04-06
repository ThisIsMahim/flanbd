import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../actions/userAction";
import { LanguageContext } from "../../utils/LanguageContext";
import { useSnackbar } from "notistack";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import GoldUserBadge from "../common/GoldUserBadge";

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
    { path: "/orders", tab: "orders", icon: <ShoppingBagOutlinedIcon />, label: t("My Orders", "আমার অর্ডার") },
    { path: "/account", tab: "profile", icon: <PersonOutlineOutlinedIcon />, label: t("Profile", "প্রোফাইল") },
    { path: "/wishlist", tab: "wishlist", icon: <FavoriteBorderIcon />, label: t("Wishlist", "ইচ্ছেতালিকা") },
    { path: "/password/update", tab: "password", icon: <LockOpenOutlinedIcon />, label: t("Password", "পাসওয়ার্ড") },
  ];

  return (
    <aside className="account-sidebar">
      {/* Profile Summary */}
      <div className="account-profile-summary">
        <div className="account-avatar">
          <img src={user.avatar?.url || "https://img.icons8.com/ios-filled/100/000000/user-male-circle.png"} alt="Avatar" />
        </div>
        <div className="account-name-box">
          <p>{t("Hello,", "হ্যালো,")}</p>
          <h2>{user.name}</h2>
          {user.isGoldUser && <GoldUserBadge size="small" />}
        </div>
      </div>

      {/* Nav */}
      <nav className="account-nav-card">
        {navItems.map((item) => (
          <Link
            key={item.tab}
            to={item.path}
            className={`account-nav-item ${activeTab === item.tab ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        <button className="btn-logout" onClick={handleLogout}>
          <PowerSettingsNewIcon />
          {t("Logout", "লগআউট")}
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
