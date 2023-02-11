import React from "react";
import { AppBar, Box, CssBaseline, FormControlLabel, ThemeProvider, Toolbar, Typography } from "@mui/material";
import Logout from "./Logout";
import WelcomePage from "./WelcomePage";
import GradesOverview from "./GradesOverview";
import CourseViewer from "./CourseViewer";
import { lightTheme, darkTheme } from "./Themes";
import { MaterialUISwitch } from "./ThemeSwitch";
import logoLight from "./2359LogoLight.svg";
import logoDark from "./2359LogoDark.svg";
import { isMobile } from "react-device-detect";
import Cookies from 'universal-cookie';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userDetails, setUserDetails] = React.useState({});
    const [lightMode, setLightMode] = React.useState(true);
    const [viewedCourse, setViewedCourse] = React.useState(null);

    React.useEffect(() => {
        const cookies = new Cookies();
        const detailsCookie = cookies.get('userDetails');
        if(detailsCookie){
            setUserDetails(detailsCookie);
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <ThemeProvider theme={!lightMode ? lightTheme : darkTheme}>
            <CssBaseline />
            <AppBar position="fixed" component="nav">
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

                    <Box sx={{visibility: "hidden", flexGrow: isMobile ? 0 : 0.86}} />
                    <Typography variant="h6" component="div">
                            { isLoggedIn ? userDetails.displayName + 
                                (isMobile ? "" : (userDetails.displayName[userDetails.displayName.length-1] === 's' ? "'" : "'s ") 
                                + (viewedCourse ? viewedCourse.code : "Overview")) : ""
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
            
            <Box sx={{mt: 8.5}}>
                {!isLoggedIn ? 
                    <WelcomePage
                        setIsLoggedIn={setIsLoggedIn}
                        setUserDetails={setUserDetails}
                    />
                : viewedCourse ? 
                    <CourseViewer courseData={viewedCourse} setViewedCourse={setViewedCourse} />
                :   <GradesOverview
                        userEmail={userDetails.email}
                        userName={userDetails.name}
                        setViewedCourse={setViewedCourse}
                    />
                }
            </Box>
        </ThemeProvider>
    );
};

export default App;
