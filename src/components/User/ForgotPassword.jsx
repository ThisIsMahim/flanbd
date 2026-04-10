import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../actions/userAction';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockResetIcon from '@mui/icons-material/LockReset';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { loading, error, message } = useSelector(state => state.forgotPassword);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!email) {
            enqueueSnackbar('Please enter your email', { variant: 'error' });
            return;
        }
        dispatch(forgotPassword({ email }));
    };

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: 'error' });
        }
        if (message) {
            enqueueSnackbar(message, { variant: 'success' });
        }
    }, [error, message, enqueueSnackbar]);

    return (
        <main className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4 sm:p-8 mt-20">
            <div className="w-full max-w-md">
                <Link
                    to="/login"
                    className="flex items-center gap-2 text-gray-500 hover:text-black transition mb-6 w-fit"
                >
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
                                Forgot Password
                            </h2>
                            <p className="text-gray-400 mt-1 text-sm font-medium">
                                We'll send you a link to reset your password.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6 sm:p-8">
                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-4 border border-gray-200">
                                <AlternateEmailIcon className="text-gray-400 mt-0.5" fontSize="small" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1">
                                        Email Verification
                                    </h4>
                                    <p className="text-xs font-medium text-gray-500">
                                        Enter the email address associated with your account.
                                    </p>
                                </div>
                            </div>

                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black hover:bg-[#FF1837] text-white py-4 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-[0_8px_16px_-6px_rgba(255,24,55,0.4)] disabled:opacity-70 mt-2 flex justify-center items-center"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
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
    );
};

export default ForgotPassword;