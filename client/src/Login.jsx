import React from 'react';
import { Button, Typography } from '@mui/material';
import LoginDialog from './LoginDialog';
import SignupDialog from './SignupDialog';

const Login = (props) => {
    const { onLogin } = props;
    const [loginOpen, setLoginOpen] = React.useState(false);
    const [signupOpen, setSignupOpen] = React.useState(false);

    const handleOpenLogin = () => {
        setLoginOpen(true);
    };

    const handleCloseLogin = () => {
        setLoginOpen(false);
    };

    const handleOpenLSignup = () => {
        setSignupOpen(true);
    };

    const handleCloseSignup = () => {
        setSignupOpen(false);
    };

    const handleLogin = () => {
        onLogin();
    };

    return (
        <>
        <Button onClick={handleOpenLogin} variant="text" color="inherit">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Login</Typography>
        </Button>
        <Button onClick={handleOpenLSignup} variant="text" color="inherit">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Signup</Typography>
        </Button>
        <LoginDialog open={loginOpen} onClose={handleCloseLogin} onLogin={handleLogin} />
        <SignupDialog open={signupOpen} onClose={handleCloseSignup} onLogin={handleLogin} />
        </>
    )
};

export default Login;