import React from "react";
import { AppBar, Box, CssBaseline, FormControlLabel, ThemeProvider, Toolbar, Typography } from "@mui/material";
import Logout from "./Logout";
import WelcomePage from "./WelcomePage";
import GradesOverview from "./GradesOverview";
import { lightTheme, darkTheme } from "./Themes";
import { MaterialUISwitch } from "./ThemeSwitch";
import logoLight from "./2359LogoLight.svg";
import logoDark from "./2359LogoDark.svg";
import { isMobile } from "react-device-detect";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userDetails, setUserDetails] = React.useState({});
    const [lightMode, setLightMode] = React.useState(true);

    return (
        <ThemeProvider theme={!lightMode ? lightTheme : darkTheme}>
            <CssBaseline />
            <AppBar position="static" component="nav">
                <Toolbar sx={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <Box
                        component="img"
                        src={!lightMode ? logoLight : logoDark}
                        sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50 }}
                    />
                    
                    <Box sx={{ ml: 2 }}>
                        {
                            !isMobile && 
                            <Typography variant="h6" component="div" >
                                Twenty Three Fifty Nine 
                            </Typography>
                        }
                    </Box>

                    <Box sx={{visibility: "hidden", flexGrow: isMobile ? 0 : 0.85}} />
                    <Typography variant="h6" component="div">
                            { isLoggedIn ? userDetails.displayName + 
                                (isMobile ? "" : (userDetails.displayName[userDetails.displayName.length-1] === 's' ? "'" : "'s") 
                                + " Overview") : ""
                            }
                    </Typography>
                    <Box sx={{visibility: "hidden", flexGrow: 1}} />
                    
                    {isLoggedIn && (
                        <Logout
                            setIsLoggedIn={setIsLoggedIn}
                            setUserDetails={setUserDetails}
                        />
                    )}
                    <FormControlLabel
                        control={
                            <MaterialUISwitch
                                sx={{ ml: 4, mr: isMobile ? -3 : 0 }}
                                defaultChecked
                                onChange={() => setLightMode(!lightMode)}
                            />
                        }
                    />
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
        </ThemeProvider>
    );
};

export default App;
