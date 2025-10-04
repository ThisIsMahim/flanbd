import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Avatar, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearErrors, loadUser, updateProfile } from '../../actions/userAction';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';

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

    const handleUpdateDataChange = useCallback((e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            setAvatar("");
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }, []);

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

        // Cleanup function for when component unmounts
        return () => {
            // Cleanup any references/listeners if needed
        };
    }, [dispatch, error, user, isUpdated, navigate, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Update Profile | FlanBD" />

            {loading && <BackdropLoader />}
            <main className="w-full mt-12 sm:pt-20 sm:mt-0">

                <div className="flex justify-between items-center sm:w-3/4 sm:mt-4 m-auto mb-4">
                    <Link to="/account" className="flex items-center gap-2 text-primary-blue hover:text-primary-blue/80 transition">
                        <ArrowBackIcon sx={{ fontSize: 22 }} />
                        <span>Back to My Account</span>
                    </Link>
                </div>

                <div className="sm:w-3/4 sm:mt-2 m-auto mb-7 bg-white shadow-lg rounded-sm overflow-hidden">
                    <div className="flex flex-col overflow-hidden">
                        <div className="bg-primary-blue py-4 px-8">
                            <h2 className="text-2xl font-medium text-primary-blue-dark">Update Profile</h2>
                            <p className="text-primary-blue-medium text-sm mt-1">Update your personal information</p>
                        </div>

                        <form
                            onSubmit={updateProfileHandler}
                            encType="multipart/form-data"
                            className="p-5 sm:p-10"
                        >
                            <div className="flex flex-col gap-6 items-start">
                                <div className="flex flex-col md:flex-row gap-6 w-full">
                                    <div className="flex-1">
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            InputProps={{
                                                style: {
                                                    borderRadius: '0.125rem'
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            InputProps={{
                                                style: {
                                                    borderRadius: '0.125rem'
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 items-center">
                                    <h2 className="text-md">Your Gender:</h2>
                                    <div className="flex items-center gap-6">
                                        <RadioGroup
                                            row
                                            aria-labelledby="radio-buttons-group-label"
                                            name="radio-buttons-group"
                                        >
                                            <FormControlLabel
                                                name="gender"
                                                value="male"
                                                checked={gender === "male"}
                                                onChange={(e) => setGender(e.target.value)}
                                                control={<Radio required sx={{
                                                    '&.Mui-checked': {
                                                        color: '#2874f0',
                                                    },
                                                }} />}
                                                label="Male"
                                            />
                                            <FormControlLabel
                                                name="gender"
                                                value="female"
                                                checked={gender === "female"}
                                                onChange={(e) => setGender(e.target.value)}
                                                control={<Radio required sx={{
                                                    '&.Mui-checked': {
                                                        color: '#2874f0',
                                                    },
                                                }} />}
                                                label="Female"
                                            />
                                        </RadioGroup>
                                    </div>
                                </div>

                                <div className="flex flex-col w-full sm:flex-row sm:items-center gap-4 border-t border-b py-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar
                                            alt="Avatar Preview"
                                            src={avatarPreview}
                                            sx={{ width: 56, height: 56 }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">Profile Picture</span>
                                            <span className="text-xs text-gray-500">JPG, PNG files up to 2MB</span>
                                        </div>
                                    </div>
                                    <label className="rounded-sm cursor-pointer bg-blue-50 hover:bg-blue-100 text-primary-blue border border-primary-blue text-center py-2 px-4 transition w-full sm:w-auto">
                                        <input
                                            type="file"
                                            name="avatar"
                                            accept="image/*"
                                            onChange={handleUpdateDataChange}
                                            className="hidden"
                                        />
                                        Choose File
                                    </label>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                                    <button
                                        type="submit"
                                        className="text-black py-3 px-4 w-full sm:w-auto bg-primary-blue-dark font-medium rounded-sm shadow hover:shadow-lg transition min-w-[150px]"
                                    >
                                        Update Profile
                                    </button>
                                    <Link
                                        className="border border-primary-blue text-primary-blue py-3 px-4 rounded-sm w-full sm:w-auto text-center font-medium hover:bg-blue-50 transition min-w-[150px]"
                                        to="/account"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default UpdateProfile;