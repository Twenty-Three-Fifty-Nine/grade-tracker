import React, { useCallback } from 'react';
import { Button, Typography } from '@mui/material';
import Cookies from 'universal-cookie';

const Logout = (props) => {
    const { setIsLoggedIn, setUserDetails } = props;

    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
        setUserDetails(null);
        new Cookies().remove('userDetails', { path: '/' });
    }, [setIsLoggedIn, setUserDetails]);

    return (
        <Button onClick={handleLogout} variant="text" color="inherit">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Logout</Typography>
        </Button>
    )
}

export default Logout;