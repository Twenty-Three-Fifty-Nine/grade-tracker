import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import Logout from './Logout';
import Login from './Login';
import WelcomePage from './WelcomePage';
import GradesOverview from './GradesOverview';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    return (
        <>
            <AppBar position="static" component="nav">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Temp Grade Tracker Thingy Thing
                    </Typography>
                    <Login />
                        <Login onLogin={() => setIsLoggedIn(true)} />
                </Toolbar>
            </AppBar>

            <WelcomePage />
        </>
    );
}

export default App;
