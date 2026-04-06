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
import "./Account.css";

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

    if (score <= 1) return { level: 1, label: t('Weak', 'দুর্বল'), color: '#e53e3e' };
    if (score <= 2) return { level: 2, label: t('Fair', 'মোটামুটি'), color: '#dd6b20' };
    if (score <= 3) return { level: 3, label: t('Good', 'ভালো'), color: '#d69e2e' };
    if (score <= 4) return { level: 4, label: t('Strong', 'শক্তিশালী'), color: '#38a169' };
    return { level: 5, label: t('Very Strong', 'অনেক শক্তিশালী'), color: '#276749' };
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
    <div className="account-page-wrapper">
      <MetaData title={t("Update Password | Flan", "পাসওয়ার্ড আপডেট | Flan")} />

      <div className="update-profile-container">
        {/* Back Link */}
        <Link to="/account" className="update-back-link">
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          <span>{t("Back to Profile", "প্রোফাইলে ফিরুন")}</span>
        </Link>

        <div className="update-profile-card">
          {/* Header */}
          <div className="pwd-header">
            <div className="pwd-header-icon">
              <LockOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <h1 className="pwd-header-title">{t("Change Password", "পাসওয়ার্ড পরিবর্তন")}</h1>
              <p className="pwd-header-desc">
                {t("Choose a strong, unique password to protect your account", "আপনার অ্যাকাউন্ট সুরক্ষিত করতে একটি শক্তিশালী পাসওয়ার্ড বেছে নিন")}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="pwd-form">
            {/* Current Password */}
            <div className="update-field">
              <label>{t("Current Password", "বর্তমান পাসওয়ার্ড")}</label>
              <div className="pwd-input-wrapper">
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button type="button" className="pwd-toggle" onClick={() => setShowOld(!showOld)}>
                  {showOld ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                </button>
              </div>
            </div>

            <div className="pwd-divider" />

            {/* New Password */}
            <div className="update-field">
              <label>{t("New Password", "নতুন পাসওয়ার্ড")}</label>
              <div className="pwd-input-wrapper">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("Min. 8 characters", "কমপক্ষে ৮ অক্ষর")}
                  required
                />
                <button type="button" className="pwd-toggle" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                </button>
              </div>

              {/* Strength Meter */}
              {newPassword && (
                <div className="pwd-strength">
                  <div className="pwd-strength-bar">
                    {[1, 2, 3, 4, 5].map((seg) => (
                      <div
                        key={seg}
                        className="pwd-strength-seg"
                        style={{
                          background: seg <= strength.level ? strength.color : 'var(--bg-subtle)',
                        }}
                      />
                    ))}
                  </div>
                  <span className="pwd-strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="update-field">
              <label>{t("Confirm New Password", "নতুন পাসওয়ার্ড নিশ্চিত করুন")}</label>
              <div className="pwd-input-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("Re-enter password", "আবার পাসওয়ার্ড দিন")}
                  required
                />
                <button type="button" className="pwd-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                </button>
              </div>
              {passwordsMatch && (
                <div className="pwd-match-indicator">
                  <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
                  {t("Passwords match", "পাসওয়ার্ড মিলেছে")}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="update-actions">
              <button type="submit" className="btn-account-link primary" disabled={loading}>
                {loading ? t("Updating...", "আপডেট হচ্ছে...") : t("Update Password", "পাসওয়ার্ড আপডেট")}
              </button>
              <Link to="/account" className="btn-account-link outline">
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
