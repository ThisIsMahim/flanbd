import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditIcon from "@mui/icons-material/Edit";
// import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { Box, Button, Paper, Typography, Avatar } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import { gsap } from "gsap";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { clearErrors, registerUser } from "../../actions/userAction";
import { LanguageContext } from "../../utils/LanguageContext";
import BackdropLoader from "../Layouts/BackdropLoader";
import MetaData from "../Layouts/MetaData";

    // Translation objects with eyewear specific content
const translations = {
  english: {
            metaTitle: "Register | Flan",
            sidebarTitle: "Fandom Merchandise, Express Yourself",
    sidebarContent: [
              "Premium anime merchandise",
      "Thoughtful design features",
      "Multiple layout options",
      "Eco-friendly production",
      "Custom printing services",
    ],
    nameLabel: "Full Name",
    emailLabel: "Email",
    genderLabel: "Your Gender",
    maleLabel: "Male",
    femaleLabel: "Female",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    avatarAlt: "Profile Image",
    uploadButton: "Upload Profile",
    signupButton: "Create Account",
    loginButton: "Already a customer? Login Here",
    passwordLengthError: "Password must be at least 8 characters",
    passwordMismatchError: "Passwords don't match",
    avatarRequired: "Please upload a profile image",
    registerTitle: "Join Our Writing Community",
    registerSubtitle:
        "Create your account to access exclusive fandom features",
  },
  bangla: {
    metaTitle: "নিবন্ধন | পেপার ম্যান",
    sidebarTitle: "প্রিমিয়াম নোটবুক, অনুপ্রাণিত লেখা",
    sidebarContent: [
      "উচ্চ-মানের কাগজের উপকরণ",
      "চিন্তাশীল ডিজাইন বৈশিষ্ট্য",
      "বহু লেআউট অপশন",
      "পরিবেশ-বান্ধব উৎপাদন",
      "কাস্টম প্রিন্টিং সেবা",
    ],
    nameLabel: "পুরো নাম",
    emailLabel: "ইমেইল",
    genderLabel: "আপনার লিঙ্গ",
    maleLabel: "পুরুষ",
    femaleLabel: "মহিলা",
    passwordLabel: "পাসওয়ার্ড",
    confirmPasswordLabel: "পাসওয়ার্ড নিশ্চিত করুন",
    avatarAlt: "প্রোফাইল ছবি",
    uploadButton: "প্রোফাইল আপলোড করুন",
    signupButton: "অ্যাকাউন্ট তৈরি করুন",
    loginButton: "ইতিমধ্যে গ্রাহক? লগইন করুন",
    passwordLengthError: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষর দীর্ঘ হতে হবে",
    passwordMismatchError: "পাসওয়ার্ড মেলে না",
    avatarRequired: "অনুগ্রহ করে একটি প্রোফাইল ছবি আপলোড করুন",
    registerTitle: "আমাদের লেখার সম্প্রদায়ে যোগ দিন",
    registerSubtitle:
      "এক্সক্লুসিভ নোটবুক ফিচার পেতে আপনার অ্যাকাউন্ট তৈরি করুন",
  },
};

// Preloaded black and white human avatar URLs (Icons8, PNG, 100x100)
const notebookAvatars = [
  // Classic male and female
  "https://img.icons8.com/ios-filled/100/000000/user-male-circle.png",
  "https://img.icons8.com/ios-filled/100/000000/user-female-circle.png",
  "https://img.icons8.com/ios-filled/100/000000/astronaut.png", // Astronaut
  "https://img.icons8.com/ios-filled/100/000000/cat-profile.png", // Cat
  "https://img.icons8.com/ios-filled/100/000000/robot-2.png", // Robot
  "https://img.icons8.com/ios-filled/100/000000/reading.png", // Bookworm
];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { language } = useContext(LanguageContext);
  const containerRef = useRef(null);

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    cpassword: "",
  });

  const { name, email, gender, password, cpassword } = user;

  // Remove avatar state and preview, use selectedAvatar instead
  const [selectedAvatar, setSelectedAvatar] = useState(notebookAvatars[0]);

  // Get translations for current language
  const t = translations[language] || translations.english;

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

  const handleRegister = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      enqueueSnackbar(t.passwordLengthError, { variant: "warning" });
      return;
    }
    if (password !== cpassword) {
      enqueueSnackbar(t.passwordMismatchError, { variant: "error" });
      return;
    }
    // No avatar required check, always send selectedAvatar
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("gender", gender);
    formData.set("password", password);
    formData.set("avatar", selectedAvatar);
    dispatch(registerUser(formData));
  };

  const handleDataChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
  };

  useEffect(() => {
    // Check for redirect param in URL
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");
    // Suppress login-required error on register page
    if (
      error &&
      !(
        error.toLowerCase().includes("login to access") ||
        error.toLowerCase().includes("please log in to access")
      )
    ) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    } else if (
      error &&
      (error.toLowerCase().includes("login to access") ||
        error.toLowerCase().includes("please log in to access"))
    ) {
      // Just clear the error, don't show toast
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate("/account");
    }
  }, [
    dispatch,
    error,
    isAuthenticated,
    navigate,
    enqueueSnackbar,
    location.search,
  ]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1, sm: 3 },
        position: "relative",
        zIndex: 1,
        background: "linear-gradient(to bottom,rgb(255, 255, 255),rgb(249, 222, 222))",
      }}
    >
      <MetaData title={t.metaTitle} />
      <Paper
        elevation={16}
        sx={{
          width: "100%",
          maxWidth: 1100,
          display: { xs: "block", md: "flex" },
          flexDirection: { xs: "column", md: "row" },
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
            p: { xs: 2, md: 6 },
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
            sx={{ textShadow: "0 2px 4px rgba(0,0,0,0.08)" }}
          >
            {t.sidebarTitle}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4, maxWidth: "80%" }}>
            {t.sidebarContent[0]}
          </Typography>
          <Box sx={{ mt: 4 }}>
            {t.sidebarContent.slice(1).map((item, idx) => (
              <Typography
                key={idx}
                variant="body1"
                sx={{ mb: 2, fontWeight: 400 }}
              >
                • {item}
              </Typography>
            ))}
          </Box>
        </Box>
        {/* Right Side - Registration Form */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 4, md: 5 },
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
              {t.registerTitle}
            </Typography>
            <Typography variant="body2" color="var(--text-secondary)">
              {t.registerSubtitle}
            </Typography>
          </div>
          <Box component="form" onSubmit={handleRegister}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                fullWidth
                label={t.nameLabel}
                name="name"
                value={name}
                onChange={handleDataChange}
                required
                variant="outlined"
                size="small"
                InputProps={{
                  sx: { borderRadius: 2, bgcolor: "white" },
                }}
              />
              <TextField
                fullWidth
                label={t.emailLabel}
                type="email"
                name="email"
                value={email}
                onChange={handleDataChange}
                required
                variant="outlined"
                size="small"
                InputProps={{
                  sx: { borderRadius: 2, bgcolor: "white" },
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                fontWeight="medium"
                color="var(--text-secondary)"
                mb={0.5}
              >
                {t.genderLabel}
              </Typography>
              <RadioGroup
                row
                name="gender"
                value={gender}
                onChange={handleDataChange}
                sx={{ ml: 0.5 }}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio required size="small" />}
                  label={t.maleLabel}
                />
                <FormControlLabel
                  value="female"
                  control={<Radio required size="small" />}
                  label={t.femaleLabel}
                />
              </RadioGroup>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                fullWidth
                label={t.passwordLabel}
                type="password"
                name="password"
                value={password}
                onChange={handleDataChange}
                required
                variant="outlined"
                size="small"
                InputProps={{
                  sx: { borderRadius: 2, bgcolor: "white" },
                }}
              />
              <TextField
                fullWidth
                label={t.confirmPasswordLabel}
                type="password"
                name="cpassword"
                value={cpassword}
                onChange={handleDataChange}
                required
                variant="outlined"
                size="small"
                InputProps={{
                  sx: { borderRadius: 2, bgcolor: "white" },
                }}
              />
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="body2"
                mb={0.75}
                color="var(--text-secondary)"
                fontSize="0.85rem"
              >
                Select your profile avatar
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  justifyContent: {
                    xs: "flex-start",
                    sm: "flex-start",
                    md: "flex-start",
                  },
                }}
              >
                {notebookAvatars.map((url, idx) => (
                  <Avatar
                    key={url}
                    src={url}
                    alt={`Avatar ${idx + 1}`}
                    sx={{
                      width: 48,
                      height: 48,
                      border:
                        selectedAvatar === url
                          ? "3px solid var(--primary-blue-dark)"
                          : "2px solid #ccc",
                      cursor: "pointer",
                      transition: "border 0.2s",
                      boxShadow:
                        selectedAvatar === url ? "0 0 8px #bde0fe" : "none",
                      mb: { xs: 1, sm: 0 },
                    }}
                    onClick={() => handleAvatarSelect(url)}
                  />
                ))}
              </Box>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="nav-button"
              sx={{
                py: 1,
                fontSize: { xs: "0.95rem", sm: "1rem" },
                mb: 1.5,
                mt: { xs: 1, sm: 0 },
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {t.signupButton}
            </Button>
            <Typography variant="body2" align="center">
              <Link
                to="/login"
                style={{
                  color: "var(--primary-blue-dark)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {t.loginButton}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
      {loading && <BackdropLoader />}
    </Box>
  );
};

export default Register;

