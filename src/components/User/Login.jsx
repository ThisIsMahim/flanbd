import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditIcon from "@mui/icons-material/Edit";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { gsap } from "gsap";
import { useSnackbar } from "notistack";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearErrors, loginUser } from "../../actions/userAction";
import BackdropLoader from "../Layouts/BackdropLoader";
import MetaData from "../Layouts/MetaData";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasTriedLogin, setHasTriedLogin] = useState(false);
  const containerRef = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setHasError(false);
    setHasTriedLogin(true);
    dispatch(loginUser(email, password));
  };

  const redirect = location.search ? location.search.split("=")[1] : "/account";

  // GSAP animation for the form
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      );
    }
  }, [containerRef]);

  useEffect(() => {
    if (error && hasTriedLogin && !hasError) {
      enqueueSnackbar(error, {
        variant: "error",
        autoHideDuration: 3000,
        preventDuplicate: true,
      });
      setHasError(true);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [
    dispatch,
    error,
    isAuthenticated,
    redirect,
    navigate,
    enqueueSnackbar,
    hasError,
    hasTriedLogin,
  ]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        position: "relative",
        zIndex: 1,
        background: "linear-gradient(to bottom, #fefae0, #f6faff)",
      }}
    >
      <Paper
        elevation={16}
        sx={{
          width: "100%",
          maxWidth: 1000,
          display: "flex",
          overflow: "hidden",
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 15px 35px rgba(95, 111, 82, 0.18), 0 5px 15px rgba(0, 0, 0, 0.08)",
        }}
        ref={containerRef}
      >
        {/* Left Side - Branding */}
        <Box
          sx={{
            flex: 1,
            p: 6,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff",
            background: "#ffffff",
            color: "#0f172a",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "none",
            }}
          />

          <Avatar
            sx={{
              m: 2,
              bgcolor: "var(--brand-yellow)",
              color: "#0f172a",
              width: 80,
              height: 80,
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
            }}
          >
            <MenuBookIcon sx={{ fontSize: 50, color: "#0f172a" }} />
          </Avatar>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ textShadow: "0 2px 4px rgba(0,0,0,0.08)", color: "#0f172a" }}
          >
            Welcome to Flan
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 4, maxWidth: "80%", color: "#334155" }}>
            Fandom Merchandise, Express Yourself
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 400, color: "#0f172a" }}>
              • Premium anime merchandise
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 400, color: "#0f172a" }}>
              • Authentic fandom designs
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 400, color: "#0f172a" }}>
              • Products fans love
            </Typography>
          </Box>
        </Box>

        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, sm: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div className="section-header flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              <MenuBookIcon
                style={{ fontSize: 32, color: "var(--primary-blue-dark)" }}
              />
              <EditIcon
                style={{ fontSize: 26, color: "var(--primary-blue-light)" }}
              />
            </div>
            <Typography
              variant="h5"
              component="h2"
              fontWeight="bold"
              color="var(--primary-blue-dark)"
              sx={{ mb: 1 }}
            >
              Login to Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access your FlanBD dashboard
            </Typography>
          </div>

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setHasTriedLogin(false);
              }}
              required
              sx={{ mb: 3 }}
              InputProps={{
                sx: { borderRadius: 2, bgcolor: "white" },
              }}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setHasTriedLogin(false);
              }}
              required
              sx={{ mb: 3 }}
              InputProps={{
                sx: { borderRadius: 2, bgcolor: "white" },
                endAdornment: (
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                    sx={{ color: "var(--primary-blue-dark)" }}
                  >
                    {showPassword ? <EditIcon /> : <CollectionsBookmarkIcon />}
                  </IconButton>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="nav-button"
              sx={{
                mt: 2,
                mb: 3,
                py: 1.5,
                fontSize: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography variant="body2">
                  <Link
                    to="/password/forgot"
                    style={{
                      color: "var(--primary-blue-dark)",
                      textDecoration: "none",
                      fontWeight: 500,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  <Link
                    to="/register"
                    style={{
                      color: "var(--primary-blue-dark)",
                      textDecoration: "none",
                      fontWeight: 500,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Don't have an account? Sign Up
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
      {loading && <BackdropLoader />}
      <MetaData title="Login | FlanBD" />
    </Box>
  );
};

export default Login;


