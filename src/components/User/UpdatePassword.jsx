import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  clearErrors,
  loadUser,
  updatePassword,
} from "../../actions/userAction";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import BackdropLoader from "../Layouts/BackdropLoader";
import MetaData from "../Layouts/MetaData";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordSubmitHandler = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      enqueueSnackbar("Password length must be atleast 8 characters", {
        variant: "warning",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Password Doesn't Match", { variant: "error" });
      return;
    }

    const formData = new FormData();
    formData.set("oldPassword", oldPassword);
    formData.set("newPassword", newPassword);
    formData.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(formData));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isUpdated) {
      enqueueSnackbar("Password Updated Successfully", { variant: "success" });
      dispatch(loadUser());
      navigate("/account");

      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  }, [dispatch, error, isUpdated, navigate, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Password Update | FlanBD" />

      {loading && <BackdropLoader />}
      <main className="w-full min-h-screen bg-gradient-to-br from-primary-blue-light/5 via-white to-primary-blue-light/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Water-themed header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-primary-blue-dark mb-2">
                Update Your Password
              </h1>
              <p className="text-gray-600">
                Keep your account secure with a strong password
              </p>
            </div>

            {/* Main form container */}
            <div className="glass-card p-8">
              <form
                onSubmit={updatePasswordSubmitHandler}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    name="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    variant="outlined"
                    className="bg-white/50 backdrop-blur-sm"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#25A4E3",
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    variant="outlined"
                    className="bg-white/50 backdrop-blur-sm"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#25A4E3",
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    variant="outlined"
                    className="bg-white/50 backdrop-blur-sm"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#25A4E3",
                        },
                      },
                    }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-blue-dark hover:bg-white text-black py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    Update Password
                  </button>
                  <Link
                    to="/account"
                    className="flex-1 text-center border-2 border-primary-blue-light text-primary-blue-dark hover:bg-primary-blue-light/10 py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>

            {/* Password requirements */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Password must be at least 8 characters long</p>
              <p>
                For security, use a combination of letters, numbers, and special
                characters
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default UpdatePassword;
