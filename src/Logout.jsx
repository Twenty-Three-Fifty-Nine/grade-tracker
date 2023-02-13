import React, { useCallback } from 'react';
import { Button, Typography } from '@mui/material';
import Cookies from 'universal-cookie';

const Logout = (props) => {
    const { setIsLoggedIn, setUserDetails, setSessionData, setViewedCourse } = props;

    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
        setUserDetails(null);
        setSessionData(null);
        setViewedCourse(null);
        new Cookies().remove('userDetails', { path: '/', sameSite: 'strict' });
    }, [setIsLoggedIn, setUserDetails, setSessionData, setViewedCourse]);

    return (
        <Button onClick={handleLogout} variant="text" color="inherit">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Logout</Typography>
        </Button>
    )
}

export default Logout;