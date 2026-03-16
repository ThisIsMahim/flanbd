import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors, loadUser, updatePassword } from "../../actions/userAction";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import { useSnackbar } from "notistack";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import "./Account.css";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      enqueueSnackbar("Password length must be at least 8 characters", { variant: "warning" });
      return;
    }
    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
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
      enqueueSnackbar("Password Updated Successfully", { variant: "success" });
      dispatch(loadUser());
      navigate("/account");
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  }, [dispatch, error, isUpdated, navigate, enqueueSnackbar]);

  return (
    <div className="account-page-wrapper bg-[var(--bg-primary)] min-h-screen py-12">
      <MetaData title="Update Password | Flan" />

      <div className="max-w-[600px] mx-auto px-6">
        <Link to="/account" className="flex items-center gap-2 text-muted hover:text-accent transition-colors mb-8 group">
          <ArrowBackIcon sx={{ fontSize: 18 }} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-wider">Back to Account</span>
        </Link>

        <main className="account-main-card">
          <header className="account-section-title">
            <div className="flex items-center gap-3">
              <SecurityIcon sx={{ color: 'var(--accent)' }} />
              <h1>Update Password</h1>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="account-field">
              <label>Current Password</label>
              <input
                className="auth-input"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className="account-field">
              <label>New Password</label>
              <input
                className="auth-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <p className="text-[10px] text-muted mt-1 uppercase font-bold tracking-widest">Min. 8 characters</p>
            </div>

            <div className="account-field">
              <label>Confirm New Password</label>
              <input
                className="auth-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-4 mt-8 pt-8 border-t">
              <button type="submit" className="btn-account-link primary flex-1" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
              <Link to="/account" className="btn-account-link outline flex-1 text-center">
                Cancel
              </Link>
            </div>
          </form>
        </main>
      </div>
      {loading && <BackdropLoader />}
    </div>
  );
};

export default UpdatePassword;
