import React, { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors, loadUser, updatePassword } from "../../actions/userAction";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import { LanguageContext } from "../../utils/LanguageContext";
import { useSnackbar } from "notistack";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { language } = useContext(LanguageContext);

  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const t = (eng, ben) => (language === "english" ? eng : ben);

  // Password strength
  const strength = useMemo(() => {
    if (!newPassword) return { level: 0, label: '', color: '' };
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (newPassword.length >= 12) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    if (score <= 1) return { level: 1, label: t('Weak', 'দুর্বল'), color: '#ef4444' };
    if (score <= 2) return { level: 2, label: t('Fair', 'মোটামুটি'), color: '#f97316' };
    if (score <= 3) return { level: 3, label: t('Good', 'ভালো'), color: '#eab308' };
    if (score <= 4) return { level: 4, label: t('Strong', 'শক্তিশালী'), color: '#22c55e' };
    return { level: 5, label: t('Very Strong', 'অনেক শক্তিশালী'), color: '#15803d' };
  }, [newPassword, language]);

  const passwordsMatch = confirmPassword && newPassword === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      enqueueSnackbar(t("Password must be at least 8 characters", "পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে"), { variant: "warning" });
      return;
    }
    if (newPassword !== confirmPassword) {
      enqueueSnackbar(t("Passwords do not match", "পাসওয়ার্ড মিলছে না"), { variant: "error" });
      return;
    }

    const formData = new FormData();
    formData.set("oldPassword", oldPassword);
    formData.set("newPassword", newPassword);
    formData.set("confirmPassword", confirmPassword);
    dispatch(updatePassword(formData));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isUpdated) {
      enqueueSnackbar(t("Password Updated Successfully", "পাসওয়ার্ড সফলভাবে আপডেট হয়েছে"), { variant: "success" });
      dispatch(loadUser());
      navigate("/account");
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  }, [dispatch, error, isUpdated, navigate, enqueueSnackbar]);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <MetaData title={t("Update Password | Flan", "পাসওয়ার্ড আপডেট | Flan")} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link to="/account" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors duration-200">
          <ArrowBackIcon fontSize="small" />
          <span>{t("Back to Profile", "প্রোফাইলে ফিরুন")}</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-8 sm:px-8 bg-black text-white">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <LockOutlinedIcon fontSize="medium" className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight mb-1">{t("Change Password", "পাসওয়ার্ড পরিবর্তন")}</h1>
              <p className="text-sm font-medium text-gray-400">
                {t("Choose a strong, unique password to protect your account", "আপনার অ্যাকাউন্ট সুরক্ষিত করতে একটি শক্তিশালী পাসওয়ার্ড বেছে নিন")}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex flex-col gap-6">
            {/* Current Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("Current Password", "বর্তমান পাসওয়ার্ড")}</label>
              <div className="relative flex items-center">
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                />
                <button type="button" className="absolute right-3 text-gray-400 hover:text-gray-900" onClick={() => setShowOld(!showOld)}>
                  {showOld ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                </button>
              </div>
            </div>

            <div className="h-px bg-gray-100 my-2" />

            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("New Password", "নতুন পাসওয়ার্ড")}</label>
              <div className="relative flex items-center">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("Min. 8 characters", "কমপক্ষে ৮ অক্ষর")}
                  required
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                />
                <button type="button" className="absolute right-3 text-gray-400 hover:text-gray-900" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                </button>
              </div>

              {/* Strength Meter */}
              {newPassword && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex flex-1 gap-1 h-1.5">
                    {[1, 2, 3, 4, 5].map((seg) => (
                      <div
                        key={seg}
                        className="flex-1 rounded-full transition-all duration-300"
                        style={{ background: seg <= strength.level ? strength.color : '#e5e7eb' }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("Confirm New Password", "নতুন পাসওয়ার্ড নিশ্চিত করুন")}</label>
              <div className="relative flex items-center">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("Re-enter password", "আবার পাসওয়ার্ড দিন")}
                  required
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                />
                <button type="button" className="absolute right-3 text-gray-400 hover:text-gray-900" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                </button>
              </div>
              {passwordsMatch && (
                <div className="flex items-center gap-1.5 mt-2 text-green-600 text-xs font-bold">
                  <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
                  {t("Passwords match", "পাসওয়ার্ড মিলেছে")}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-100 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black hover:bg-[#FF1837] text-white py-4 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm disabled:opacity-70"
              >
                {loading ? t("Updating...", "আপডেট হচ্ছে...") : t("Update Password", "পাসওয়ার্ড আপডেট")}
              </button>
              <Link
                to="/account"
                className="flex-1 flex justify-center items-center bg-white hover:bg-gray-50 text-black border-2 border-gray-200 py-4 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300"
              >
                {t("Cancel", "বাতিল")}
              </Link>
            </div>
          </form>
        </div>
      </div>
      {loading && <BackdropLoader />}
    </div>
  );
};

export default UpdatePassword;
