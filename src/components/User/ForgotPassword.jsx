import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { forgotPassword } from '../../actions/userAction';

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
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Forgot Password
            </Typography>
            <Typography variant="body1" gutterBottom>
                Enter your email address and we'll send you a link to reset your password.
            </Typography>
            
            <form onSubmit={submitHandler}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ 
                        mt: 2, 
                        bgcolor: 'black', 
                        color: 'white',
                        '&:hover': {
                            bgcolor: '#FF1837',
                        },
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        py: 1.5,
                        borderRadius: '8px'
                    }}
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Link href="/login" variant="body2">
                        Remember your password? Sign in
                    </Link>
                </Box>
            </form>
        </Box>
    );
};

export default ForgotPassword;