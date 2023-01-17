import React from 'react';
import { Button, Typography } from '@mui/material';

const Logout = (props) => {
    const { onLogout } = props;

    const handleLogout = () => {
        onLogout();
    };

    return (
        <Button onClick={handleLogout} variant="text" color="inherit">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Logout</Typography>
        </Button>
    )
}

export default Logout;