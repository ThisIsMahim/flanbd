import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors, registerUser } from "../../actions/userAction";
import { LanguageContext } from "../../utils/LanguageContext";
import { useSnackbar } from "notistack";
import MetaData from "../Layouts/MetaData";
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import BackdropLoader from "../Layouts/BackdropLoader";
import "./Auth.css";

const notebookAvatars = [
  "https://img.icons8.com/ios-filled/100/000000/user-male-circle.png",
  "https://img.icons8.com/ios-filled/100/000000/user-female-circle.png",
  "https://img.icons8.com/ios-filled/100/000000/astronaut.png",
  "https://img.icons8.com/ios-filled/100/000000/cat-profile.png",
  "https://img.icons8.com/ios-filled/100/000000/robot-2.png",
  "https://img.icons8.com/ios-filled/100/000000/reading.png",
];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { language } = useContext(LanguageContext);

  const { loading, isAuthenticated, error } = useSelector((state) => state.user);

  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "male",
    password: "",
    cpassword: "",
  });

  const [selectedAvatar, setSelectedAvatar] = useState(notebookAvatars[0]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (user.password.length < 8) {
      enqueueSnackbar(language === "english" ? "Password must be 8+ chars" : "পাসওয়ার্ড অন্তত ৮ অক্ষর হতে হবে", { variant: "warning" });
      return;
    }
    if (user.password !== user.cpassword) {
      enqueueSnackbar(language === "english" ? "Passwords don't match" : "পাসওয়ার্ড মেলেনি", { variant: "error" });
      return;
    }

    const formData = new FormData();
    formData.set("name", user.name);
    formData.set("email", user.email);
    formData.set("gender", user.gender);
    formData.set("password", user.password);
    formData.set("avatar", selectedAvatar);
    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate("/account");
    }
  }, [dispatch, error, isAuthenticated, navigate, enqueueSnackbar]);

  const t = (eng, ben) => (language === "english" ? eng : ben);

  return (
    <div className="auth-page-wrapper">
      <MetaData title={t("Register | Flan", "নিবন্ধন | Flan")} />

      <div className="auth-card">
        {/* Sidebar */}
        <aside className="auth-sidebar">
          <div className="auth-sidebar-icon">
            <LocalLibraryIcon sx={{ fontSize: 40 }} />
          </div>
          <h2>Join the Community</h2>
          <p>Create an account to track orders, save favorites, and get the latest fandom updates.</p>
        </aside>

        {/* Form Content */}
        <main className="auth-content">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Fill in your details to get started.</p>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-input-group">
              <label>{t("Full Name", "পুরো নাম")}</label>
              <input type="text" name="name" value={user.name} onChange={handleChange} required className="auth-input" />
            </div>

            <div className="auth-input-group">
              <label>{t("Email Address", "ইমেইল")}</label>
              <input type="email" name="email" value={user.email} onChange={handleChange} required className="auth-input" />
            </div>

            <div className="auth-input-group">
              <label>{t("Password", "পাসওয়ার্ড")}</label>
              <input type="password" name="password" value={user.password} onChange={handleChange} required className="auth-input" />
            </div>

            <div className="auth-input-group">
              <label>{t("Confirm Password", "পাসওয়ার্ড নিশ্চিত করুন")}</label>
              <input type="password" name="cpassword" value={user.cpassword} onChange={handleChange} required className="auth-input" />
            </div>

            <div className="auth-input-group">
              <label>{t("Select Avatar", "প্রোফাইল ছবি")}</label>
              <div className="avatar-grid">
                {notebookAvatars.map((url) => (
                  <div
                    key={url}
                    className={`avatar-option ${selectedAvatar === url ? 'selected' : ''}`}
                    onClick={() => setSelectedAvatar(url)}
                  >
                    <img src={url} alt="Avatar" />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? "Creating..." : t("Create Account", "অ্যাকাউন্ট তৈরি করুন")}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already a customer? <Link to="/login" className="auth-link">Login Here</Link>
            </p>
          </div>
        </main>
      </div>

      {loading && <BackdropLoader />}
    </div>
  );
};

export default Register;
