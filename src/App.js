import React, {useMemo} from "react";
import { AppBar, Box, CssBaseline, FormControlLabel, ThemeProvider, Toolbar, Typography, Stack } from "@mui/material";
import WelcomePage from "./WelcomePage";
import GradesOverview from "./GradesOverview";
import CourseViewer from "./CourseViewer";
import { lightTheme, darkTheme } from "./Themes";
import ThemeSwitch from "./ThemeSwitch";
import logoLight from "./2359LogoLight.svg";
import logoDark from "./2359LogoDark.svg";
import { isMobile } from "react-device-detect";
import Cookies from 'universal-cookie';
import AccountMenu from "./AccountMenu";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userDetails, setUserDetails] = React.useState({});
    const [lightMode, setLightMode] = React.useState(true);
    const [viewedCourse, setViewedCourse] = React.useState(null);

    const [sessionData, setSessionData] = React.useState(null);
    const [courseList, setCourseList] = React.useState(null);

    const activeTri = useMemo(() => { return {year: 2022, tri: 3} }, []);

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
                <Toolbar>
                    <Stack direction={"row"} sx={{position: isMobile ? "relative" : "fixed"}}>
                        <Box
                            component="img"
                            src={!lightMode ? logoLight : logoDark}
                            sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50 }}
                        />
                        
                        <Box sx={{ ml: 2, mt: 1}}>
                            {
                                !isMobile && 
                                <Typography variant="h6" component="div" >
                                    Twenty Three Fifty Nine 
                                </Typography>
                            }
                        </Box>
                    </Stack>

                    <Typography variant="h6" component="div" sx={{textAlign:"center", m: isMobile ? 0 : "auto"}}>
                            { isLoggedIn ? isMobile && viewedCourse ? viewedCourse.code  : userDetails.displayName + 
                                (isMobile ? "" : (userDetails.displayName[userDetails.displayName.length-1] === 's' ? "' " : "'s ") 
                                + (viewedCourse ? viewedCourse.code : "Overview")) : ""
                            }
                    </Typography>
                    
                    <Stack direction={"row"} sx={{position:"fixed", right: isMobile ? 10 : 0}}>
                        {isLoggedIn ? (
                            <AccountMenu
                                setIsLoggedIn={setIsLoggedIn}
                                userDetails={userDetails}
                                setUserDetails={setUserDetails}
                                sessionData={sessionData}
                                setSessionData={setSessionData}
                                setCourseList={setCourseList}
                                setViewedCourse={setViewedCourse}
                                toggleTheme={() => setLightMode(!lightMode)}
                                lightMode={lightMode}
                                inCourseViewer={viewedCourse}
                            />
                        ) : (
                            <FormControlLabel
                            control={
                                <ThemeSwitch
                                    sx={{ ml: isMobile ? 1 : 4, mr: isMobile ? -3 : 0 }}
                                    checked={lightMode}
                                    onChange={() => setLightMode(!lightMode)}
                                />
                            }
                        />
                        )}
                    </Stack>
                </Toolbar>
            </AppBar>
            
            <Box sx={{mt: 8.5}}>
                {!isLoggedIn ? 
                    <WelcomePage
                        setIsLoggedIn={setIsLoggedIn}
                        setUserDetails={setUserDetails}
                        activeTri={activeTri}
                    />
                : viewedCourse ? 
                    <CourseViewer courseData={viewedCourse} setViewedCourse={setViewedCourse} userDetails={userDetails} setSessionData={setSessionData} sessionData={sessionData} setCourseList={setCourseList} />
                :   <GradesOverview
                        userEmail={userDetails.email}
                        userName={userDetails.name}
                        setViewedCourse={setViewedCourse}
                        sessionData={sessionData}
                        setSessionData={setSessionData}
                        courseList={courseList}
                        setCourseList={setCourseList}
                        activeTri={activeTri}
                    />
                }
            </Box>
        </ThemeProvider>
    );
};

export default App;
