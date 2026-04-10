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
        <div className="min-h-screen bg-gray-50 pt-44 md:pt-48 pb-16">
            <MetaData title={t("Update Profile | Flan", "প্রোফাইল আপডেট | Flan")} />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link to="/account" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors duration-200">
                    <ArrowBackIcon fontSize="small" />
                    <span>{t("Back to Profile", "প্রোফাইলে ফিরুন")}</span>
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <header className="px-6 py-8 sm:px-8 bg-black text-white">
                        <h1 className="text-2xl font-black tracking-tight mb-2">{t("Update Profile", "প্রোফাইল আপডেট")}</h1>
                        <p className="text-sm font-medium text-gray-400">{t("Manage your personal information", "আপনার ব্যক্তিগত তথ্য পরিচালনা করুন")}</p>
                    </header>

                    <form onSubmit={updateProfileHandler} className="p-6 sm:p-8 flex flex-col gap-8">
                        {/* Avatar Upload */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 cursor-pointer group bg-white shadow-sm ring-4 ring-white">
                                <img
                                    src={avatarPreview || "https://img.icons8.com/ios-filled/100/000000/user-male-circle.png"}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                                    <PhotoCameraOutlinedIcon fontSize="small" />
                                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                </label>
                            </div>
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                <span className="text-sm font-bold text-gray-900">{t("Profile Photo", "প্রোফাইল ছবি")}</span>
                                <span className="text-xs font-medium text-gray-500 mt-1">{t("Click photo to change", "পরিবর্তন করতে ছবিতে ক্লিক করুন")}</span>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("Full Name", "পুরো নাম")}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t("Enter your name", "আপনার নাম")}
                                    required
                                    className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("Email Address", "ইমেইল")}</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("your@email.com", "আপনার ইমেইল")}
                                    required
                                    className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("Gender", "লিঙ্গ")}</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <label className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 cursor-pointer transition-all duration-200 flex-1 ${gender === 'male' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={gender === "male"}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded-full"
                                    />
                                    <span className="text-sm font-bold">{t("Male", "পুরুষ")}</span>
                                </label>
                                <label className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 cursor-pointer transition-all duration-200 flex-1 ${gender === 'female' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={gender === "female"}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded-full"
                                    />
                                    <span className="text-sm font-bold">{t("Female", "মহিলা")}</span>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-100 mt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-black hover:bg-[#FF1837] text-white py-4 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm disabled:opacity-70"
                            >
                                {loading ? t("Updating...", "আপডেট হচ্ছে...") : t("Save Changes", "পরিবর্তন সংরক্ষণ")}
                            </button>
                            <Link
                                to="/account"
                                className="flex-1 flex justify-center items-center bg-white hover:bg-gray-50 text-black border-2 border-gray-200 py-4 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300"
                            >
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