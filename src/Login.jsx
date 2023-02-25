/**
 * Twenty Three Fifty Nine - Grade tracking tool
 * Copyright (C) 2023  Abdulrahman Asfari and Christopher E Sa
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

import React, { useCallback } from 'react';
import {
    Button,
    Typography,
} from '@mui/material';

import LoginDialog from './LoginDialog';
import SignupDialog from './SignupDialog';

const Login = (props) => {
    const {
        activeTri,
        setEmailSent,
        setIsLoggedIn,
        setUserDetails,
    } = props;

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
        <SignupDialog open={signupOpen} onClose={handleCloseSignup} setIsLoggedIn={setIsLoggedIn} setUserDetails={setUserDetails} activeTri={activeTri} setEmailSent={setEmailSent} />
        </>
    )
};

export default Login;