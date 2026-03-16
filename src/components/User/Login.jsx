import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearErrors, loginUser } from "../../actions/userAction";
import { useSnackbar } from "notistack";
import MetaData from "../Layouts/MetaData";
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import BackdropLoader from "../Layouts/BackdropLoader";
import "./Auth.css";

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
    <div className="auth-page-wrapper">
      <MetaData title="Login | Flan" />

      <div className="auth-card">
        {/* Sidebar */}
        <aside className="auth-sidebar">
          <div className="auth-sidebar-icon">
            <LocalLibraryIcon sx={{ fontSize: 40 }} />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your orders, wishlist, and exclusive member features.</p>

          <div style={{ marginTop: '3rem', opacity: 0.8 }}>
            <p>• Premium Anime Merch</p>
            <p>• Fast Shipping</p>
            <p>• Fan Community</p>
          </div>
        </aside>

        {/* Form Content */}
        <main className="auth-content">
          <div className="auth-header">
            <h1>Login</h1>
            <p>Enter your credentials to access your account.</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-input-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
                autoFocus
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
            </div>

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login to Account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register" className="auth-link">Create Account</Link>
            </p>
            <Link to="/password/forgot" className="auth-link" style={{ fontSize: '12px', display: 'block', marginTop: '1rem', opacity: 0.6 }}>
              Forgot Password?
            </Link>
          </div>
        </main>
      </div>

      {loading && <BackdropLoader />}
    </div>
  );
};

export default Login;
