import React from "react";
import { AppBar, CssBaseline, createTheme, ThemeProvider, Toolbar, Typography } from "@mui/material";
import Logout from "./Logout";
import Login from "./Login";
import WelcomePage from "./WelcomePage";
import GradesOverview from "./GradesOverview";

const lightTheme = createTheme({
    palette: {
        type: "light",
        background: {
            default: "#f4ede3",
            paper: "#EDE1CF",
        },
        primary: {
            main: "#7E7F34",
        },
        secondary: {
            main: "rgba(215, 64, 0, .8)",
        },
        success: {
            main: "rgba(50, 150, 10, .8)",
        },
        error: {
            main: "rgb(200, 0, 0)",
        },
        warning: {
            main: "#8e2613",
        },
        info: {
            main: "#247c72",
        },
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                standardInfo: {
                    backgroundColor: "rgba(50, 168, 155, 0.3)",
                    color: "#000000",
                },
                standardSuccess: {
                    backgroundColor: "rgba(0, 255, 0, 0.3)",
                    color: "#000000",
                },
                standardWarning: {
                    backgroundColor: "rgba(234, 71, 42, 0.2)",
                    color: "#000000",
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: "#c4c389",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: "rgba(100, 100, 100, 0.8)",
                    color: "#ffffff",
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#1e1e1e",
            paper: "#2e2e2e",
        },
    }
});

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userDetails, setUserDetails] = React.useState({});
    const [lightMode, setLightMode] = React.useState(true);

    return (
        <ThemeProvider theme={lightMode ? lightTheme : darkTheme}>
            <CssBaseline />
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
        </ThemeProvider>
    );
};

export default App;
