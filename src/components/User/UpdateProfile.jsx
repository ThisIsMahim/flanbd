import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearErrors, loadUser, updateProfile } from '../../actions/userAction';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import "./Account.css";

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { user } = useSelector((state) => state.user);
    const { error, isUpdated, loading } = useSelector((state) => state.profile);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");

    const updateProfileHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("gender", gender);
        formData.set("avatar", avatar);
        dispatch(updateProfile(formData));
    }

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setGender(user.gender || "");
            setAvatarPreview(user.avatar?.url || "");
        }
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isUpdated) {
            enqueueSnackbar("Profile Updated Successfully", { variant: "success" });
            dispatch(loadUser());
            navigate('/account');
            dispatch({ type: UPDATE_PROFILE_RESET });
        }
    }, [dispatch, error, user, isUpdated, navigate, enqueueSnackbar]);

    return (
        <div className="account-page-wrapper bg-[var(--bg-primary)] min-h-screen py-12">
            <MetaData title="Update Profile | Flan" />

            <div className="max-w-[700px] mx-auto px-6">
                <Link to="/account" className="flex items-center gap-2 text-muted hover:text-accent transition-colors mb-8 group">
                    <ArrowBackIcon sx={{ fontSize: 18 }} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-wider">Back to Account</span>
                </Link>

                <main className="account-main-card">
                    <header className="account-section-title">
                        <h1>Update Profile</h1>
                    </header>

                    <form onSubmit={updateProfileHandler} className="flex flex-col gap-8">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-4 py-6 bg-subtle rounded-3xl border border-dashed border-subtle">
                            <div className="relative group cursor-pointer">
                                <img
                                    src={avatarPreview}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-surface shadow-lg"
                                    alt="Preview"
                                />
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                    <PhotoCameraIcon />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </label>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold">Profile Picture</p>
                                <p className="text-xs text-muted">Click to update your avatar</p>
                            </div>
                        </div>

                        <div className="account-info-grid">
                            <div className="account-field">
                                <label>Full Name</label>
                                <input
                                    className="auth-input font-semibold"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="account-field">
                                <label>Email Address</label>
                                <input
                                    className="auth-input font-semibold"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="account-field">
                            <label>Gender</label>
                            <div className="flex gap-8 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        className="accent-accent w-4 h-4"
                                        name="gender"
                                        value="male"
                                        checked={gender === "male"}
                                        onChange={(e) => setGender(e.target.value)}
                                    />
                                    <span className="text-sm font-semibold group-hover:text-accent transition-colors">Male</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        className="accent-accent w-4 h-4"
                                        name="gender"
                                        value="female"
                                        checked={gender === "female"}
                                        onChange={(e) => setGender(e.target.value)}
                                    />
                                    <span className="text-sm font-semibold group-hover:text-accent transition-colors">Female</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8 pt-8 border-t">
                            <button type="submit" className="btn-account-link primary flex-1" disabled={loading}>
                                {loading ? "Updating..." : "Save Changes"}
                            </button>
                            <Link to="/account" className="btn-account-link outline flex-1 text-center">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </main>
            </div>
            {loading && <BackdropLoader />}
        </div>
    );
};

export default UpdateProfile;