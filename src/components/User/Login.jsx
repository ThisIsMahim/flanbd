import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearErrors, loginUser } from "../../actions/userAction";
import { useSnackbar } from "notistack";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser(email, password));
  };

  const redirect = location.search ? location.search.split("=")[1] : "/account";

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [dispatch, error, isAuthenticated, navigate, redirect, enqueueSnackbar]);

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-white flex flex-col lg:flex-row overflow-hidden font-sans relative">
      <MetaData title="Login | Flan" />

      {/* Mobile Subtle Background */}
      <div className="absolute inset-0 z-0 lg:hidden pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-gray-200/60 to-transparent blur-3xl opacity-50" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-gray-200/60 to-transparent blur-3xl opacity-50" />
      </div>

      {/* Left Decoration Side */}
      <motion.div
        initial={{ x: "-100%", opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex lg:w-1/2 relative bg-[#0f0f0f] items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#0f0f0f] z-0" />

        {/* Decorative Light Circles */}
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-black/40 rounded-full opacity-60 blur-[120px] mix-blend-screen" />

        <div className="relative z-10 w-full max-w-md px-12 text-white mt-12">
          <h2 className="text-[32px] sm:text-[40px] font-extrabold mb-5 tracking-tight leading-[1.1]">
            Dive into the <br /> <span className="text-[#ff1837]">Premium</span> Experience
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-10 leading-relaxed font-normal pr-4">
            Sign in to securely access your order tracking, exclusive member drops, and your curated wishlist.
          </p>

          <ul className="space-y-4">
            {['Fast & Priority Shipping', 'Exclusive Fan Community', 'Premium Collectibles'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-wide text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff1837]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Right Form Side */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:p-12 lg:p-20 bg-transparent lg:bg-white relative flex-1 min-h-screen lg:min-h-full z-10"
      >
        <div className="w-full max-w-[420px] relative z-20 bg-white/80 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-8 sm:p-0 rounded-3xl lg:rounded-none shadow-2xl sm:shadow-none border border-white/50 lg:border-none mx-auto flex flex-col justify-center">
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 font-medium text-sm">Please enter your credentials to proceed.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full px-5 py-3.5 bg-gray-50/80 text-gray-900 font-medium text-sm placeholder-gray-400 border border-gray-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#ff1837]/10 focus:border-[#ff1837]/40 transition-all duration-300 shadow-sm"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em]">Password</label>
                <Link to="/password/forgot" className="text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-[#ff1837] transition-colors">Forgot?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-gray-50/80 text-gray-900 font-black tracking-[0.2em] text-sm placeholder-gray-300 border border-gray-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#ff1837]/10 focus:border-[#ff1837]/40 transition-all duration-300 shadow-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 px-6 mt-6 flex items-center justify-between text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-900/20 rounded-xl font-bold uppercase tracking-[0.15em] text-xs transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5"
            >
              <span className="ml-1 tracking-[0.15em]">{loading ? "VERIFYING..." : "SIGN IN"}</span>
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                <ArrowRightAltIcon className="group-hover:translate-x-1 transition-transform duration-300 rounded-full" fontSize="small" />
              </div>
            </button>

          </form>

          {/* Create Account Link */}
          <div className="mt-8 text-center sm:text-left">
            <p className="text-sm font-medium text-gray-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-[#ff1837] font-bold hover:underline underline-offset-4 decoration-2 transition-all">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </motion.div>

      {loading && <BackdropLoader />}
    </div>
  );
};

export default Login;
