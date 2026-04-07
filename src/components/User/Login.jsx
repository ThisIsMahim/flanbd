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
             <img src="/logo.png" alt="Flan" className="h-8 object-contain" />
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
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white relative"
      >
        <div className="w-full max-w-md relative z-10">
          
          {/* Mobile Logo Fallback */}
          <div className="lg:hidden mb-10 text-center">
             <Link to="/">
               <img src="/logo.png" alt="Flan" className="h-10 mx-auto object-contain" />
             </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3 font-display tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 font-medium text-sm sm:text-base">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1 pr-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                 <Link to="/password/forgot" className="text-xs font-semibold text-gray-400 hover:text-accent transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="group w-full py-4 px-6 mt-4 flex items-center justify-between text-white bg-black hover:bg-[#FF1837] focus:ring-4 focus:ring-red-500/20 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-[0_10px_30px_-10px_rgba(255,24,55,0.4)]"
            >
              <span>{loading ? "Verifying..." : "Sign in securely"}</span>
              <ArrowRightAltIcon className="group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            
          </form>

          {/* Create Account Link */}
          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-gray-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-accent font-bold hover:underline underline-offset-4 decoration-2 transition-all">
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
