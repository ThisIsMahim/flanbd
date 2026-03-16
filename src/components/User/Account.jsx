import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";
import Sidebar from "./Sidebar";
import Loader from "../Layouts/Loader";
import { myOrdersSummary } from "../../actions/orderAction";
import "./Account.css";

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { language } = useContext(LanguageContext);
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

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

  return (
    <div className="account-page-wrapper bg-[var(--bg-primary)] min-h-screen">
      <MetaData title={t("My Profile | Flan", "আমার প্রোফাইল | Flan")} />

      <div className="account-page-container">
        <Sidebar activeTab="profile" />

        <main className="account-main-card">
          <header className="account-section-title">
            <h1>{t("Personal Information", "ব্যক্তিগত তথ্য")}</h1>
            <Link to="/account/update" className="text-accent text-sm font-bold uppercase hover:underline">
              {t("Edit Profile", "এডিট করুন")}
            </Link>
          </header>

          <div className="account-info-grid">
            <div className="account-field">
              <label>{t("Full Name", "পুরো নাম")}</label>
              <div className="account-field-value">{user.name}</div>
            </div>

            <div className="account-field">
              <label>{t("Email Address", "ইমেইল ঠিকানা")}</label>
              <div className="account-field-value">{user.email}</div>
            </div>

            <div className="account-field">
              <label>{t("Gender", "লিঙ্গ")}</label>
              <div className="account-field-value" style={{ textTransform: 'capitalize' }}>
                {user.gender || t("Not specified", "উল্লিখিত নেই")}
              </div>
            </div>

            <div className="account-field">
              <label>{t("Member Since", "সদস্য হয়েছেন")}</label>
              <div className="account-field-value">
                {new Date(user.createdAt).toLocaleDateString(language === 'english' ? 'en-US' : 'bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          <section className="account-actions-box border-t pt-8 mt-12">
            <div className="w-full">
              <h2 className="text-lg font-bold mb-4">{t("Account Security", "অ্যাকাউন্ট নিরাপত্তা")}</h2>
              <p className="text-secondary text-sm mb-6 max-w-xl">
                {t(
                  "Regularly updating your password helps keep your account secure. If you notice any unusual activity, please contact our support team.",
                  "আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে নিয়মিত পাসওয়ার্ড পরিবর্তন করুন। কোনো অস্বাভাবিক কার্যকলাপ লক্ষ্য করলে আমাদের সাথে যোগাযোগ করুন।"
                )}
              </p>

              <div className="flex gap-4">
                <Link to="/password/update" className="btn-account-link primary">
                  {t("Change Password", "পাসওয়ার্ড পরিবর্তন")}
                </Link>
                <Link to="/account/update" className="btn-account-link outline">
                  {t("Update Personal Info", "তথ্য আপডেট করুন")}
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Account;
