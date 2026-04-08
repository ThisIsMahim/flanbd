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
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <MetaData title={t("Register | Flan", "নিবন্ধন | Flan")} />

      {/* Left Form Side */}
      <motion.div 
        initial={{ x: "100%", opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-7/12 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-white relative"
      >
        <div className="w-full max-w-lg relative z-10">
          
          {/* Mobile Logo Fallback */}
          <div className="lg:hidden mb-4 text-center">
             <Link to="/">
               <img src="/logo12.png" alt="Flan" className="h-10 mx-auto object-contain mix-blend-multiply" />
             </Link>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 font-display tracking-tight">Create Account</h1>
            <p className="text-gray-500 font-medium text-xs sm:text-sm">Join Flan and level up your shopping experience.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] pl-1">{t("Full Name", "পুরো নাম")}</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-50 text-xs sm:text-sm text-gray-900 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all duration-300"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] pl-1">{t("Email Address", "ইমেইল")}</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-gray-50 text-xs sm:text-sm text-gray-900 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] pl-1">{t("Password", "পাসওয়ার্ড")}</label>
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 text-xs sm:text-sm text-gray-900 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all duration-300"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] pl-1">{t("Confirm Password", "পাসওয়ার্ড নিশ্চিত করুন")}</label>
                 <input
                  type="password"
                  name="cpassword"
                  value={user.cpassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 text-xs sm:text-sm text-gray-900 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all duration-300"
                />
              </div>
            </div>

            {/* Avatar Selection */}
            <div className="pt-1 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] pl-1">{t("Choose Your Identity", "প্রোফাইল ছবি বেছে নিন")}</label>
              <div className="flex flex-wrap gap-2.5 p-1">
                {notebookAvatars.map((url) => (
                  <button
                    type="button"
                    key={url}
                    onClick={() => setSelectedAvatar(url)}
                    className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden transition-all duration-300 group/avatar ${
                      selectedAvatar === url 
                        ? 'ring-2 ring-accent ring-offset-2 scale-105 shadow-md z-10' 
                        : 'hover:scale-105 hover:shadow-sm grayscale hover:grayscale-0 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 transition-colors ${selectedAvatar === url ? 'from-accent/5 to-accent/10' : ''}`} />
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
              className="group w-full py-3 px-6 mt-3 flex items-center justify-center gap-2 text-white bg-black hover:bg-[#FF1837] focus:ring-4 focus:ring-red-500/20 rounded-lg font-bold uppercase tracking-wider text-xs transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-[0_8px_20px_-8px_rgba(255,24,55,0.4)]"
            >
              <span>{loading ? "Creating..." : t("Create Account", "অ্যাকাউন্ট তৈরি করুন")}</span>
              <ArrowRightAltIcon className="group-hover:translate-x-1 transition-transform duration-300 text-sm" />
            </button>
            
          </form>

          {/* Login Link */}
          <div className="mt-5 text-center">
             <p className="text-xs font-medium text-gray-500">
               Already a customer?{' '}
               <Link to="/login" className="text-accent font-bold hover:underline underline-offset-4 decoration-2 transition-all">
                 Login Here
               </Link>
             </p>
          </div>

        </div>
      </motion.div>

      {/* Right Decoration Side */}
      <motion.div 
        initial={{ x: "-100%", opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex lg:w-5/12 relative bg-black items-center justify-center overflow-hidden"
      >
        {/* Subtle patterned/gradient background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-gray-900 to-red-950 opacity-90 z-0" />
        
        {/* Decorative Circles */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent rounded-full opacity-10 blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full opacity-5 blur-[80px] mix-blend-overlay" />

        <div className="relative z-10 w-full max-w-sm px-8 text-white">
          <div className="mb-10 inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
             <img src="/logo.png" alt="Flan" className="h-8 object-contain" />
          </div>
          
          <h2 className="text-4xl font-extrabold mb-6 font-display tracking-tight leading-tight">
            Join the <br /> <span className="text-accent underline decoration-4 underline-offset-4">Community</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
            Create an account to track orders, save favorites, and get the latest fandom updates instantly.
          </p>
          
          <ul className="space-y-4">
            {['Track Orders Instantly', 'Early Access to Deals', 'Save Your Favorites'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-300">
                 <div className="w-2 h-2 rounded-full bg-accent" />
                 {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>



      {loading && <BackdropLoader />}
    </div>
  );
};

export default Register;
