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

      {/* Nav Card */}
      <nav className="account-nav-card">
        <Link to="/orders" className={`account-nav-item ${activeTab === 'orders' ? 'active' : ''}`}>
          <ShoppingBagOutlinedIcon />
          {t("My Orders", "আমার অর্ডার")}
        </Link>
        <Link to="/account" className={`account-nav-item ${activeTab === 'profile' ? 'active' : ''}`}>
          <PersonOutlineOutlinedIcon />
          {t("Profile Information", "প্রোফাইল তথ্য")}
        </Link>
        <Link to="/wishlist" className={`account-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}>
          <FavoriteBorderIcon />
          {t("Wishlist", "ইচ্ছেতালিকা")}
        </Link>
        <Link to="/password/update" className={`account-nav-item ${activeTab === 'password' ? 'active' : ''}`}>
          <LockOpenOutlinedIcon />
          {t("Change Password", "পাসওয়ার্ড পরিবর্তন")}
        </Link>

        <button className="btn-logout" onClick={handleLogout}>
          <PowerSettingsNewIcon />
          {t("Logout", "লগআউট")}
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
