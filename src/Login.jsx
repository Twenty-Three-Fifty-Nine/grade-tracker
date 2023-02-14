import React, { useCallback } from 'react';
import { Button, Typography } from '@mui/material';
import LoginDialog from './LoginDialog';
import SignupDialog from './SignupDialog';

const Login = (props) => {
    const { setIsLoggedIn, setUserDetails, activeTri } = props;
    const [loginOpen, setLoginOpen] = React.useState(false);
    const [signupOpen, setSignupOpen] = React.useState(false);

    const handleOpenLogin = useCallback(() => {
        setLoginOpen(true);
    }, []);

    const handleCloseLogin = useCallback(() => {
        setLoginOpen(false);
    }, []);

    const handleOpenLSignup = useCallback(() => {
        setSignupOpen(true);
    }, []);

    const handleCloseSignup = useCallback(() => {
        setSignupOpen(false);
    }, []);

    return (
        <>
        <Button onClick={handleOpenLogin} variant="text" color="inherit">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Login</Typography>
        </Button>
        <Button onClick={handleOpenLSignup} variant="text" color="inherit">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Sign Up</Typography>
        </Button>
        <LoginDialog open={loginOpen} onClose={handleCloseLogin} setIsLoggedIn={setIsLoggedIn} setUserDetails={setUserDetails} activeTri={activeTri} />
        <SignupDialog open={signupOpen} onClose={handleCloseSignup} setIsLoggedIn={setIsLoggedIn} setUserDetails={setUserDetails} activeTri={activeTri} />
        </>
    )
};

export default Login;