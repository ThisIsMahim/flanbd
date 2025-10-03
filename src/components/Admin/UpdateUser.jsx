import Avatar from '@mui/material/Avatar';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { clearErrors, getUserDetails, updateUser } from '../../actions/userAction';
import { REMOVE_USER_DETAILS, UPDATE_USER_RESET } from '../../constants/userConstants';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import Loading from './Loading';

const UpdateUser = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const navigate = useNavigate();

    const { user, error, loading } = useSelector((state) => state.userDetails);
    const { isUpdated, error: updateError, loading: updateLoading } = useSelector((state) => state.profile);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");

    const userId = params.id;

    const updateUserSubmitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("gender", gender);
        formData.set("role", role);

        dispatch(updateUser(userId, formData));
    }

    useEffect(() => {
        if (user && user._id !== userId) {
            dispatch(getUserDetails(userId));
        } else {
            setName(user.name);
            setEmail(user.email);
            setGender(user.gender);
            setRole(user.role);
            setAvatarPreview(user.avatar.url);
        }
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (updateError) {
            enqueueSnackbar(updateError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isUpdated) {
            enqueueSnackbar("User Updates Successfully", { variant: "success" });
            dispatch({ type: UPDATE_USER_RESET });
            dispatch({ type: REMOVE_USER_DETAILS });
            navigate("/admin/users");
        }
    }, [dispatch, error, userId, user, navigate, isUpdated, updateError, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Admin: Update User | EyeGears" />

            {updateLoading && <BackdropLoader />}

            {loading ? <Loading /> : (
                <>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                        <h1 className="text-xl font-medium uppercase mb-4 text-gray-800">Update User</h1>
                        
                        <div className="flex flex-col bg-white shadow-lg rounded-lg mx-auto w-lg max-w-xl overflow-hidden">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-center text-xl font-medium text-gray-800">Update User Profile</h2>
                            </div>

                            <form
                                onSubmit={updateUserSubmitHandler}
                                className="p-5 sm:p-10"
                            >
                                <div className="flex flex-col gap-5 items-start">

                                    {/* <!-- input container column --> */}
                                    <div className="flex flex-col w-full justify-between sm:flex-col gap-4 items-center">
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#8A39E1',
                                                    },
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': {
                                                    color: '#8A39E1',
                                                },
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#8A39E1',
                                                    },
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': {
                                                    color: '#8A39E1',
                                                },
                                            }}
                                        />
                                    </div>
                                    {/* <!-- input container column --> */}

                                    {/* <!-- gender input --> */}
                                    <div className="flex gap-4 items-center">
                                        <h2 className="text-md text-gray-700">Your Gender :</h2>
                                        <div className="flex items-center gap-6" id="radioInput">
                                            <RadioGroup
                                                row
                                                aria-labelledby="radio-buttons-group-label"
                                                name="radio-buttons-group"
                                                sx={{
                                                    '& .MuiRadio-root': {
                                                        color: '#9333ea',
                                                        '&.Mui-checked': {
                                                            color: '#8A39E1',
                                                        },
                                                    },
                                                }}
                                            >
                                                <FormControlLabel name="gender" value="male" checked={gender === "male"} onChange={(e) => setGender(e.target.value)} control={<Radio required />} label="Male" />
                                                <FormControlLabel name="gender" value="female" checked={gender === "female"} onChange={(e) => setGender(e.target.value)} control={<Radio required />} label="Female" />
                                            </RadioGroup>
                                        </div>
                                    </div>
                                    {/* <!-- gender input --> */}

                                    <div className="flex flex-col w-full justify-between sm:flex-row gap-4 items-center">
                                        <Avatar
                                            alt="Avatar Preview"
                                            src={avatarPreview}
                                            sx={{ width: 56, height: 56, border: '2px solid #e5e7eb' }}
                                        />
                                        <TextField
                                            label="Role"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            required
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#8A39E1',
                                                    },
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': {
                                                    color: '#8A39E1',
                                                },
                                            }}
                                        >
                                            <MenuItem value={"user"}>User</MenuItem>
                                            <MenuItem value={"admin"}>Admin</MenuItem>
                                        </TextField>
                                    </div>
                                    
                                    <div className="flex gap-4 w-full mt-2">
                                        <button 
                                            type="submit" 
                                            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                            Update
                                        </button>
                                        <Link 
                                            className="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 text-center py-3 shadow-md hover:shadow-lg font-medium rounded-lg transition-all duration-200" 
                                            to="/admin/users"
                                        >
                                            Cancel
                                        </Link>
                                    </div>
                                </div>

                            </form>

                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default UpdateUser;
