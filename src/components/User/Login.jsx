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
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <MetaData title="Login | Flan" />

      {/* Left Decoration Side */}
      <motion.div 
        initial={{ x: "100%", opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center overflow-hidden"
      >
        {/* Subtle patterned/gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-red-950 opacity-90 z-0" />
        
        {/* Decorative Circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full opacity-10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-white rounded-full opacity-5 blur-[100px] mix-blend-overlay" />

        <div className="relative z-10 w-full max-w-md px-12 text-white">
          <div className="mb-10 inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
             <img src="/logo12.png" alt="Flan" className="h-12 lg:h-10 object-contain" />
          </div>
          
          <h2 className="text-5xl font-extrabold mb-6 font-display tracking-tight leading-tight">
            Dive into the <br /> <span className="text-accent underline decoration-4 underline-offset-4">Premium</span> Experience
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
            Sign in to securely access your order tracking, exclusive member drops, and your curated wishlist.
          </p>
          
          <ul className="space-y-4">
            {['Fast & Priority Shipping', 'Exclusive Fan Community', 'Premium Collectibles'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-300">
                <div className="w-2 h-2 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Right Form Side */}
      <motion.div 
        initial={{ x: "-100%", opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-1/2 flex items-center justify-center p-5 sm:p-12 lg:p-20 bg-gradient-to-b from-white to-gray-50 relative min-h-screen"
      >
        <div className="w-full max-w-md relative z-10 bg-white lg:bg-transparent rounded-[2.5rem] p-8 lg:p-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 lg:border-none lg:shadow-none">
          
          {/* Mobile Logo Back Navigation & Branding */}
          <div className="lg:hidden mb-10 flex flex-col items-center justify-center w-full">
             <Link to="/" className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[1.25rem] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-50/50 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-500 group overflow-hidden">
               <img src="/logo12.png" alt="Flan" className="w-[75%] h-[75%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
             </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-[2rem] sm:text-4xl font-extrabold text-gray-900 mb-2.5 font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Welcome Back</h1>
            <p className="text-gray-500 font-medium text-sm sm:text-base px-2 lg:px-0">Please enter your credentials to proceed.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-1 ml-1">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 bg-[#f8fafc] text-gray-900 placeholder-gray-400/70 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/20 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] group-hover:bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1 pr-2">
                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Password</label>
                 <Link to="/password/forgot" className="text-[12px] font-bold text-gray-400 hover:text-red-500 transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-[#f8fafc] text-gray-900 placeholder-gray-400/50 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/20 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] group-hover:bg-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="group w-full py-4 px-6 mt-6 flex items-center justify-between text-white bg-gradient-to-r from-gray-900 to-black hover:from-[#FF1837] hover:to-[#d0102a] focus:outline-none focus:ring-4 focus:ring-red-500/30 rounded-2xl font-bold uppercase tracking-[0.15em] text-[13px] transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(255,24,55,0.4)] hover:-translate-y-0.5"
            >
              <span className="ml-2">{loading ? "Verifying..." : "Sign in securely"}</span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                 <ArrowRightAltIcon className="group-hover:translate-x-1 transition-transform duration-300 text-white" fontSize="small" />
              </div>
            </button>
            
          </form>

          {/* Create Account Link */}
          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-gray-400">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-[#FF1837] font-bold hover:underline underline-offset-4 decoration-2 transition-all">
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
