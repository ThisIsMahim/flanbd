import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { clearErrors, resetPassword } from "../../actions/userAction";
import BackdropLoader from "../Layouts/BackdropLoader";
import MetaData from "../Layouts/MetaData";
import LockResetIcon from '@mui/icons-material/LockReset';
import SecurityIcon from '@mui/icons-material/Security';

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
      <main className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4 sm:p-8 mt-20">
        <div className="w-full max-w-md">
          <Link
            to="/login"
            className="flex items-center gap-2 text-gray-500 hover:text-black transition mb-6 w-fit"
          >
            {/* Use a left arrow unicode for simplicity */}
            <span className="text-lg font-bold">←</span>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Login</span>
          </Link>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-black py-8 px-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <LockResetIcon fontSize="medium" className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Reset Password
                </h2>
                <p className="text-gray-400 mt-1 text-sm font-medium">
                  Create a new secure password
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-4 border border-gray-200">
                  <div className="mt-0.5">
                    <SecurityIcon className="text-gray-400" fontSize="small" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1">
                      Password Requirements
                    </h4>
                    <ul className="text-xs font-medium text-gray-500 mt-1 list-disc list-inside space-y-0.5">
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
                        borderRadius: "8px",
                        backgroundColor: "#f8fafc",
                        fontWeight: "600",
                        fontSize: "14px"
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
                        borderRadius: "8px",
                        backgroundColor: "#f8fafc",
                        fontWeight: "600",
                        fontSize: "14px"
                      },
                    }}
                    variant="outlined"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-[#FF1837] text-white py-4 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-[0_8px_16px_-6px_rgba(255,24,55,0.4)] disabled:opacity-70 flex justify-center items-center"
                >
                  Reset Password
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-wider text-black hover:text-[#FF1837] transition-colors"
                >
                  Remember password?
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold uppercase tracking-wider text-black hover:text-[#FF1837] transition-colors"
                >
                  Create new account
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs font-bold tracking-widest uppercase text-gray-400">
            © {new Date().getFullYear()} FlanBD.
          </div>
        </div>
      </main>
    </>
  );
};

export default ResetPassword;
