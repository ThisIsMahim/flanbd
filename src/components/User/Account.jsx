import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";
import Sidebar, { OrdersCTACard } from "./Sidebar";
import Loader from "../Layouts/Loader";
import { myOrdersSummary } from "../../actions/orderAction";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// Remove Account.css import

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
    <div className="min-h-screen bg-gray-50 pb-16">
      <MetaData title={t("My Profile | Flan", "আমার প্রোফাইল | Flan")} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        <Sidebar activeTab="profile" />

        <main className="flex-1 w-full flex flex-col gap-6">
          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <header className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t("Profile", "প্রোফাইল")}</h1>
              <Link
                to="/account/update"
                className="text-xs font-bold uppercase tracking-wider text-black border-2 border-black py-2 px-4 rounded-md hover:bg-black hover:text-white transition-colors duration-200"
              >
                {t("Edit", "পরিবর্তন")}
              </Link>
            </header>

            {/* Quick Stats */}
            {totalOrders > 0 && (
              <div className="grid grid-cols-3 gap-0 border border-gray-200 rounded-xl overflow-hidden mb-8">
                <div className="p-3 sm:p-5 text-center border-r border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                  <div className="text-xl sm:text-2xl font-black text-gray-900 mb-1">{totalOrders}</div>
                  <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("Orders", "অর্ডার")}</div>
                </div>
                <div className="p-3 sm:p-5 text-center border-r border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                  <div className="text-xl sm:text-2xl font-black text-gray-900 mb-1">{totalDelivered}</div>
                  <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("Delivered", "ডেলিভার")}</div>
                </div>
                <div className="p-3 sm:p-5 text-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                  <div className="text-xl sm:text-2xl font-black text-gray-900 mb-1">৳{lifetimeTotal.toLocaleString()}</div>
                  <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("Lifetime Spent", "মোট ব্যয়")}</div>
                </div>
              </div>
            )}

            {/* Personal Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-gray-200 rounded-xl overflow-hidden mb-8">
              <div className="p-5 border-b sm:border-r border-gray-200 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("Full Name", "পুরো নাম")}</label>
                <div className="text-sm font-bold text-gray-900">{user.name}</div>
              </div>

              <div className="p-5 border-b border-gray-200 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("Email Address", "ইমেইল")}</label>
                <div className="text-sm font-bold text-gray-900">{user.email}</div>
              </div>

              <div className="p-5 border-b sm:border-b-0 sm:border-r border-gray-200 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("Gender", "লিঙ্গ")}</label>
                <div className="text-sm font-bold text-gray-900 capitalize">
                  {user.gender || t("Not specified", "উল্লিখিত নেই")}
                </div>
              </div>

              <div className="p-5 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("Member Since", "সদস্য হয়েছেন")}</label>
                <div className="text-sm font-bold text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString(language === 'english' ? 'en-US' : 'bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Account Security */}
            <section className="pt-6 border-t border-gray-100">
              <h2 className="text-lg font-black text-gray-900 mb-2">
                {t("Account Security", "অ্যাকাউন্ট নিরাপত্তা")}
              </h2>
              <p className="text-sm text-gray-600 mb-6 max-w-2xl leading-relaxed">
                {t(
                  "Regularly updating your password helps keep your account secure. If you notice any unusual activity, please contact our support team.",
                  "আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে নিয়মিত পাসওয়ার্ড পরিবর্তন করুন।"
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/password/update"
                  className="flex justify-center items-center gap-2 bg-black hover:bg-[#FF1837] text-white py-3 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-[0_8px_16px_-6px_rgba(255,24,55,0.4)]"
                >
                  <LockOutlinedIcon fontSize="small" />
                  {t("Change Password", "পাসওয়ার্ড পরিবর্তন")}
                </Link>
                <Link
                  to="/account/update"
                  className="flex justify-center items-center gap-2 bg-white hover:bg-gray-50 text-black border-2 border-gray-200 py-3 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300"
                >
                  <EditOutlinedIcon fontSize="small" />
                  {t("Update Info", "তথ্য আপডেট")}
                </Link>
              </div>
            </section>
          </div>

          <OrdersCTACard className="block md:hidden" />
        </main>
      </div>
    </div>
  );
};

export default Account;
