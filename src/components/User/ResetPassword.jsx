import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { clearErrors, resetPassword } from "../../actions/userAction";
import BackdropLoader from "../Layouts/BackdropLoader";
import MetaData from "../Layouts/MetaData";

// Inline Water Drop SVG Icon (Heroicons outline)
const WaterDropIcon = ({ className = "", size = 40 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
    width={size}
    height={size}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3.25c.41 0 .81.16 1.11.46 1.7 1.7 6.14 7.13 6.14 10.54A7.25 7.25 0 0 1 12 21.5a7.25 7.25 0 0 1-7.25-7.25c0-3.41 4.44-8.84 6.14-10.54.3-.3.7-.46 1.11-.46z"
    />
  </svg>
);

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const mounted = useRef(true);

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      enqueueSnackbar("Password length must be at least 8 characters", {
        variant: "warning",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      enqueueSnackbar("Passwords don't match", { variant: "error" });
      return;
    }
    setPasswordError("");

    const formData = new FormData();
    formData.set("password", newPassword);
    formData.set("confirmPassword", confirmPassword);
    dispatch(resetPassword(params.token, formData));
  };

  useEffect(() => {
    mounted.current = true;

    if (error && mounted.current) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success && mounted.current) {
      enqueueSnackbar("Password updated successfully!", { variant: "success" });
      navigate("/login");
    }

    return () => {
      mounted.current = false;
    };
  }, [dispatch, error, success, navigate, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Reset Password | FlanBD" />

      {loading && <BackdropLoader />}
      <main className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4 sm:p-8 mt-20">
        <div className="w-full max-w-md">
          <Link
            to="/login"
            className="flex items-center gap-2 text-primary-blue hover:text-blue-800 transition mb-6"
          >
            {/* Use a left arrow unicode for simplicity */}
            <span className="text-lg">←</span>
            <span className="text-sm font-medium">Back to Login</span>
          </Link>

          <div className="bg-white rounded shadow-lg overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-blue to-blue-800 py-6 px-8 text-center">
              <h2 className="text-2xl font-bold text-white">
                Reset Your Password
              </h2>
              <p className="text-blue-100 mt-1 text-sm">
                Create a new secure password for your account
              </p>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3 border border-blue-100">
                  <div className="mt-0.5">
                    <WaterDropIcon className="text-primary-blue" size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-primary-blue">
                      Password Requirements
                    </h4>
                    <ul className="text-xs text-gray-600 mt-1 list-disc list-inside space-y-0.5">
                      <li>Minimum 8 characters</li>
                      <li>Include numbers and special characters</li>
                      <li>Not easy to guess</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    error={!!passwordError}
                    helperText={passwordError}
                    InputProps={{
                      style: {
                        borderRadius: "4px",
                        backgroundColor: "#f8fafc",
                      },
                    }}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    InputProps={{
                      style: {
                        borderRadius: "4px",
                        backgroundColor: "#f8fafc",
                      },
                    }}
                    variant="outlined"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white hover:bg-orange-600 text-black border py-3 px-4 rounded-sm font-medium shadow hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2"
                >
                  Reset Password
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm text-primary-blue hover:text-blue-800 font-medium hover:underline"
                >
                  Remember your password? Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm text-primary-blue hover:text-blue-800 font-medium hover:underline"
                >
                  Create new account
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} FlanBD. All rights reserved.
          </div>
        </div>
      </main>
    </>
  );
};

export default ResetPassword;
