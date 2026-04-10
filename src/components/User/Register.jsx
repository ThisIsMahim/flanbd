import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors, registerUser } from "../../actions/userAction";
import { LanguageContext } from "../../utils/LanguageContext";
import { useSnackbar } from "notistack";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

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
    <div className="min-h-screen bg-gray-50 lg:bg-white flex flex-col lg:flex-row overflow-hidden font-sans relative mt-24">
      <MetaData title={t("Register | Flan", "নিবন্ধন | Flan")} />

      {/* Mobile Subtle Background */}
      <div className="absolute inset-0 z-0 lg:hidden pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-gray-200/60 to-transparent blur-3xl opacity-50" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-gray-200/60 to-transparent blur-3xl opacity-50" />
      </div>

      {/* Left Form Side (Swapped to Left) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:p-12 lg:p-20 bg-transparent lg:bg-white relative flex-1 min-h-screen lg:min-h-full z-10"
      >
        <div className="w-full max-w-[460px] relative z-20 bg-white/80 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-8 sm:p-0 rounded-3xl lg:rounded-none shadow-2xl sm:shadow-none border border-white/50 lg:border-none mx-auto flex flex-col justify-center overflow-y-auto max-h-screen hide-scrollbar pt-6 lg:pt-12 pb-6">

          <div className="mb-8 mt-4 lg:mt-0 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 tracking-tight">Create Account</h1>
            <p className="text-gray-500 font-medium text-sm">Join Flan and level up your shopping experience.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] ml-1">{t("Full Name", "পুরো নাম")}</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-5 py-3.5 bg-gray-50/80 text-gray-900 font-medium text-sm placeholder-gray-400 border border-gray-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#ff1837]/10 focus:border-[#ff1837]/40 transition-all duration-300 shadow-sm"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] ml-1">{t("Email Address", "ইমেইল")}</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full px-5 py-3.5 bg-gray-50/80 text-gray-900 font-medium text-sm placeholder-gray-400 border border-gray-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#ff1837]/10 focus:border-[#ff1837]/40 transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] ml-1">{t("Password", "পাসওয়ার্ড")}</label>
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-gray-50/80 text-gray-900 font-black tracking-[0.2em] text-sm placeholder-gray-300 border border-gray-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#ff1837]/10 focus:border-[#ff1837]/40 transition-all duration-300 shadow-sm"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] ml-1">{t("Confirm", "পাসওয়ার্ড নিশ্চিত করুন")}</label>
                <input
                  type="password"
                  name="cpassword"
                  value={user.cpassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-gray-50/80 text-gray-900 font-black tracking-[0.2em] text-sm placeholder-gray-300 border border-gray-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#ff1837]/10 focus:border-[#ff1837]/40 transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            {/* Avatar Selection */}
            <div className="pt-3 space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] ml-1">{t("Choose Your Identity", "প্রোফাইল ছবি বেছে নিন")}</label>
              <div className="flex flex-wrap gap-3 p-1">
                {notebookAvatars.map((url) => (
                  <button
                    type="button"
                    key={url}
                    onClick={() => setSelectedAvatar(url)}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden transition-all duration-300 group/avatar ${selectedAvatar === url
                      ? 'ring-2 ring-gray-900 scale-105 shadow-md z-10'
                      : 'hover:scale-105 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 bg-gray-50 border border-gray-200/80'
                      }`}
                  >
                    <div className={`absolute inset-0 bg-gray-50 transition-colors ${selectedAvatar === url ? 'bg-gray-100' : ''}`} />
                    <img
                      src={url}
                      alt="Avatar"
                      className={`relative w-full h-full object-contain p-2 transition-transform duration-300 ${selectedAvatar === url ? 'scale-110' : 'group-hover/avatar:scale-110'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 px-6 mt-6 flex items-center justify-center gap-3 text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-900/20 rounded-xl font-bold uppercase tracking-[0.15em] text-xs transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5"
            >
              <span className="tracking-[0.15em]">{loading ? "CREATING..." : t("CREATE ACCOUNT", "অ্যাকাউন্ট তৈরি করুন")}</span>
              <ArrowRightAltIcon className="group-hover:translate-x-1 transition-transform duration-300" fontSize="small" />
            </button>

          </form>

          {/* Login Link */}
          <div className="mt-8 text-center sm:text-left">
            <p className="text-sm font-medium text-gray-500">
              Already a customer?{' '}
              <Link to="/login" className="text-[#ff1837] font-bold hover:underline underline-offset-4 decoration-2 transition-all">
                Login Here
              </Link>
            </p>
          </div>

        </div>
      </motion.div>

      {/* Right Decoration Side (Swapped to Right) */}
      <motion.div
        initial={{ x: "100%", opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex lg:w-1/2 relative bg-[#0f0f0f] items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#0f0f0f] z-0" />

        {/* Decorative Light Circles */}
        <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-black/40 rounded-full opacity-60 blur-[120px] mix-blend-screen" />

        <div className="relative z-10 w-full max-w-md px-12 text-white mt-8">
          <h2 className="text-[32px] sm:text-[40px] font-extrabold mb-5 tracking-tight leading-[1.1]">
            Join the <br /> <span className="text-[#ff1837]">Community</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-10 leading-relaxed font-normal pr-4">
            Create an account to track orders, save favorites, and get the latest catalog drops instantly.
          </p>

          <ul className="space-y-4">
            {['Track Orders Instantly', 'Early Access to Deals', 'Curated Favorites Board'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-wide text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff1837]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {loading && <BackdropLoader />}
      {/* Required for hide-scrollbar style in React Native/Tailwind cross-compat if needed, though standard CSS scrollbar hiding works */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Register;
