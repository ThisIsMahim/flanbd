import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";
import Sidebar from "./Sidebar";
import Loader from "../Layouts/Loader";
import { myOrdersSummary } from "../../actions/orderAction";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import "./Account.css";

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { language } = useContext(LanguageContext);
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const { summary } = useSelector((state) => state.myOrdersSummary) || {};

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(myOrdersSummary());
    }
  }, [dispatch, isAuthenticated]);

  if (loading || !user) return <Loader />;

  const t = (eng, ben) => (language === "english" ? eng : ben);

  const totalOrders = summary?.totalOrders || 0;
  const totalDelivered = summary?.totalDelivered || 0;
  const lifetimeTotal = summary?.lifetimeTotal || 0;

  return (
    <div className="account-page-wrapper">
      <MetaData title={t("My Profile | Flan", "আমার প্রোফাইল | Flan")} />

      <div className="account-page-container">
        <Sidebar activeTab="profile" />

        <main className="account-main-card">
          {/* Page Title */}
          <header className="account-section-title">
            <h1>{t("Profile", "প্রোফাইল")}</h1>
            <Link to="/account/update">
              {t("Edit", "পরিবর্তন")}
            </Link>
          </header>

          {/* Quick Stats */}
          {totalOrders > 0 && (
            <div className="account-stats-row">
              <div className="account-stat">
                <div className="account-stat-value">{totalOrders}</div>
                <div className="account-stat-label">{t("Orders", "অর্ডার")}</div>
              </div>
              <div className="account-stat">
                <div className="account-stat-value">{totalDelivered}</div>
                <div className="account-stat-label">{t("Delivered", "ডেলিভার")}</div>
              </div>
              <div className="account-stat">
                <div className="account-stat-value">৳{lifetimeTotal.toLocaleString()}</div>
                <div className="account-stat-label">{t("Lifetime Spent", "মোট ব্যয়")}</div>
              </div>
            </div>
          )}

          {/* Personal Information Grid */}
          <div className="account-info-grid">
            <div className="account-field">
              <label>{t("Full Name", "পুরো নাম")}</label>
              <div className="account-field-value">{user.name}</div>
            </div>

            <div className="account-field">
              <label>{t("Email Address", "ইমেইল")}</label>
              <div className="account-field-value">{user.email}</div>
            </div>

            <div className="account-field">
              <label>{t("Gender", "লিঙ্গ")}</label>
              <div className="account-field-value" style={{ textTransform: 'capitalize' }}>
                {user.gender || t("Not specified", "উল্লিখিত নেই")}
              </div>
            </div>

            <div className="account-field">
              <label>{t("Member Since", "সদস্য হয়েছেন")}</label>
              <div className="account-field-value">
                {new Date(user.createdAt).toLocaleDateString(language === 'english' ? 'en-US' : 'bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Account Security */}
          <section className="account-security-section">
            <h2 className="account-security-title">
              {t("Account Security", "অ্যাকাউন্ট নিরাপত্তা")}
            </h2>
            <p className="account-security-desc">
              {t(
                "Regularly updating your password helps keep your account secure. If you notice any unusual activity, please contact our support team.",
                "আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে নিয়মিত পাসওয়ার্ড পরিবর্তন করুন।"
              )}
            </p>

            <div className="account-security-actions">
              <Link to="/password/update" className="btn-account-link primary">
                <LockOutlinedIcon sx={{ fontSize: 14 }} />
                {t("Change Password", "পাসওয়ার্ড পরিবর্তন")}
              </Link>
              <Link to="/account/update" className="btn-account-link outline">
                <EditOutlinedIcon sx={{ fontSize: 14 }} />
                {t("Update Info", "তথ্য আপডেট")}
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Account;
