import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import Logout from "./Logout";
import Login from "./Login";
import WelcomePage from "./WelcomePage";
import GradesOverview from "./GradesOverview";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userDetails, setUserDetails] = React.useState({});

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
                        <Logout
                            setIsLoggedIn={setIsLoggedIn}
                            setUserDetails={setUserDetails}
                        />
                    ) : (
                        <Login
                            setIsLoggedIn={setIsLoggedIn}
                            setUserDetails={setUserDetails}
                        />
                    )}
                </Toolbar>
            </AppBar>

            {isLoggedIn ? (
                <GradesOverview
                    userEmail={userDetails.email}
                    userName={userDetails.name}
                />
            ) : (
                <WelcomePage
                    setIsLoggedIn={setIsLoggedIn}
                    setUserDetails={setUserDetails}
                />
            )}
        </>
    );
};

export default App;
