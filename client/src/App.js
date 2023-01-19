import React, { useCallback } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import Logout from "./Logout";
import Login from "./Login";
import WelcomePage from "./WelcomePage";
import GradesOverview from "./GradesOverview";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    const login = useCallback(() => {
        setIsLoggedIn(true);
    }, []);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
    }, []);

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
                    {isLoggedIn ? (
                        <Logout loggedIn={logout} />
                    ) : (
                        <Login loggedIn={login} />
                    )}
                </Toolbar>
            </AppBar>

            {isLoggedIn ? <GradesOverview /> : <WelcomePage />}
        </>
    );
};

export default App;
