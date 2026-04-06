import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearErrors, loadUser, updateProfile } from '../../actions/userAction';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import { LanguageContext } from '../../utils/LanguageContext';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import "./Account.css";

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { language } = useContext(LanguageContext);

    const { user } = useSelector((state) => state.user);
    const { error, isUpdated, loading } = useSelector((state) => state.profile);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");

    const t = (eng, ben) => (language === "english" ? eng : ben);

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
            enqueueSnackbar(t("Profile Updated Successfully", "প্রোফাইল সফলভাবে আপডেট হয়েছে"), { variant: "success" });
            dispatch(loadUser());
            navigate('/account');
            dispatch({ type: UPDATE_PROFILE_RESET });
        }
    }, [dispatch, error, user, isUpdated, navigate, enqueueSnackbar]);

    return (
        <div className="account-page-wrapper">
            <MetaData title={t("Update Profile | Flan", "প্রোফাইল আপডেট | Flan")} />

            <div className="update-profile-container">
                {/* Back Link */}
                <Link to="/account" className="update-back-link">
                    <ArrowBackIcon sx={{ fontSize: 16 }} />
                    <span>{t("Back to Profile", "প্রোফাইলে ফিরুন")}</span>
                </Link>

                <div className="update-profile-card">
                    <header className="update-profile-header">
                        <h1>{t("Update Profile", "প্রোফাইল আপডেট")}</h1>
                        <p>{t("Manage your personal information", "আপনার ব্যক্তিগত তথ্য পরিচালনা করুন")}</p>
                    </header>

                    <form onSubmit={updateProfileHandler} className="update-profile-form">
                        {/* Avatar Upload */}
                        <div className="update-avatar-section">
                            <div className="update-avatar-wrapper">
                                <img
                                    src={avatarPreview || "https://img.icons8.com/ios-filled/100/000000/user-male-circle.png"}
                                    alt="Preview"
                                    className="update-avatar-img"
                                />
                                <label className="update-avatar-overlay">
                                    <PhotoCameraOutlinedIcon sx={{ fontSize: 20 }} />
                                    <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                                </label>
                            </div>
                            <div className="update-avatar-text">
                                <span className="update-avatar-label">{t("Profile Photo", "প্রোফাইল ছবি")}</span>
                                <span className="update-avatar-hint">{t("Click photo to change", "পরিবর্তন করতে ছবিতে ক্লিক করুন")}</span>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="update-fields-grid">
                            <div className="update-field">
                                <label>{t("Full Name", "পুরো নাম")}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t("Enter your name", "আপনার নাম")}
                                    required
                                />
                            </div>

                            <div className="update-field">
                                <label>{t("Email Address", "ইমেইল")}</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("your@email.com", "আপনার ইমেইল")}
                                    required
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="update-field">
                            <label>{t("Gender", "লিঙ্গ")}</label>
                            <div className="update-gender-options">
                                <label className={`update-gender-option ${gender === 'male' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={gender === "male"}
                                        onChange={(e) => setGender(e.target.value)}
                                    />
                                    <span>{t("Male", "পুরুষ")}</span>
                                </label>
                                <label className={`update-gender-option ${gender === 'female' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={gender === "female"}
                                        onChange={(e) => setGender(e.target.value)}
                                    />
                                    <span>{t("Female", "মহিলা")}</span>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="update-actions">
                            <button type="submit" className="btn-account-link primary" disabled={loading}>
                                {loading ? t("Updating...", "আপডেট হচ্ছে...") : t("Save Changes", "পরিবর্তন সংরক্ষণ")}
                            </button>
                            <Link to="/account" className="btn-account-link outline">
                                {t("Cancel", "বাতিল")}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            {loading && <BackdropLoader />}
        </div>
    );
};

export default UpdateProfile;