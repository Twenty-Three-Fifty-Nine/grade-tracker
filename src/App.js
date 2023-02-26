/**
 * Twenty Three Fifty Nine - Grade tracking tool
 * Copyright (C) 2023  Abdulrahman Asfari and Christopher E Sa
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

import React, { useMemo } from "react";
import {
    Alert,
    AppBar,
    Box,
    CssBaseline,
    FormControlLabel,
    ThemeProvider,
    Toolbar,
    Typography,
    Snackbar,
    Stack,
} from "@mui/material";

import AccountMenu from "./account-menu/AccountMenu";
import Axios from "axios";
import Cookies from "universal-cookie";
import CourseViewer from "./course-viewer/CourseViewer";
import darkTheme from "./themes/DarkTheme";
import GradesOverview from "./overview/GradesOverview";
import { isMobile } from "react-device-detect";
import lightTheme from "./themes/LightTheme";
import PasswordResetDialog from "./login/PasswordResetDialog";
import ThemeSwitch from "./themes/ThemeSwitch";
import { useLocation } from "react-router-dom";
import WelcomePage from "./WelcomePage";

import logoLight from "./images/2359LogoLight.svg";
import logoDark from "./images/2359LogoDark.svg";

/**
 * This controls what is displayed on the screen based on whether 
 * theyre logged in, viewing a course.
 */
const App = () => {
    // Tracks whether or not the user is logged in.
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    // Tracks whether or not the user is in light mode.
    const [lightMode, setLightMode] = React.useState(true);

    // Stores information about the currently logged in user, their courses, and currently available actions.
    const [userDetails, setUserDetails] = React.useState({});
    const [viewedCourse, setViewedCourse] = React.useState(null);
    const [sessionData, setSessionData] = React.useState(null);
    const [courseList, setCourseList] = React.useState(null);

    // Email verification/reset related states.
    const location = useLocation();
    const [resetData, setResetData] = React.useState(null);
    const [emailSent, setEmailSent] = React.useState(false);
    const [emailVerified, setEmailVerified] = React.useState(false);
    const [verifying, setVerifying] = React.useState(false);

    // Tells both the client and the API what the currently active trimester is.
    const activeTri = useMemo(() => {
        return { year: 2023, tri: 1 };
    }, []);


    /**
     * Verifies the user email using the verification token
     * and updates the details state and their login cookie.
     * 
     * @param email - User email. 
     * @param token - User verification token.
     */
    const verifyUser = async (email, token) => {
        setVerifying(true);

        await Axios.post("https://api.twentythreefiftynine.com/users/" + email + "/verify", {
            token: token,
        }).then((response) => {
            if (response.status === 200) {
                setEmailVerified(true);
                new Cookies().set("userDetails", response.data, {
                    path: "/",
                    sameSite: "strict",
                });
                setUserDetails(response.data);
            }
        });

        setVerifying(false);
    };

    /**
     * Checks if the user has a login cookie and logs them in
     * if they do. Additionally verifies their email or resets their 
     * password based on the path.
     */
    React.useEffect(() => {
        const cookies = new Cookies();
        const detailsCookie = cookies.get("userDetails");
        if (detailsCookie) {
            if (location.pathname !== "/verify") setUserDetails(detailsCookie);
            setIsLoggedIn(true);
        }

        const query = new URLSearchParams(location.search);
        const path = location.pathname;
        const email = query.get("email");
        const token = query.get("token");
        query.delete("email");
        query.delete("token");
        window.history.replaceState({}, "", `/`);
        if (token && email) {
            if (path === "/reset-password") {
                setResetData({ email, token });
            } else if (path === "/verify") {
                verifyUser(email, token);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <ThemeProvider theme={!lightMode ? lightTheme : darkTheme}>
            <CssBaseline />
            <AppBar position="fixed" component="nav">
                <Toolbar>
                    <Stack direction={"row"} sx={{ position: isMobile ? "relative" : "fixed" }}>
                        <Box component="img" src={!lightMode ? logoLight : logoDark}
                            sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50 }}
                        />

                        <Box sx={{ ml: 2, mt: 1 }}>
                            {!isMobile && (
                                <Typography variant="h6" component="div">
                                    Twenty Three Fifty Nine
                                </Typography>
                            )}
                        </Box>
                    </Stack>

                    <Typography variant="h6" component="div" sx={{ textAlign: "center", m: isMobile ? 0 : "auto" }}>
                        {   isLoggedIn && !verifying
                            ? isMobile && viewedCourse
                                ? viewedCourse.code
                                : userDetails.displayName +
                                  (isMobile
                                      ? ""
                                      : (userDetails.displayName[
                                            userDetails.displayName.length - 1
                                        ] === "s"
                                            ? "' "
                                            : "'s ") +
                                        (viewedCourse
                                            ? viewedCourse.code
                                            : "Overview"))
                            : ""}
                    </Typography>

                    <Stack direction={"row"} sx={{ position: "fixed", right: isMobile ? 10 : 0 }}>
                        {   isLoggedIn ? (
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
                                    <ThemeSwitch sx={{ ml: isMobile ? 1 : 4, mr: isMobile ? -3 : 0 }}
                                        checked={lightMode} onChange={() => setLightMode(!lightMode)}
                                    />
                                }
                            />
                        )}
                    </Stack>
                </Toolbar>
            </AppBar>

            <Box sx={{ mt: isMobile && !isLoggedIn ? 0 : 8.5 }}>
                {!isLoggedIn ? (
                    <WelcomePage
                        setIsLoggedIn={setIsLoggedIn}
                        setUserDetails={setUserDetails}
                        activeTri={activeTri}
                        setEmailSent={setEmailSent}
                    />
                ) : viewedCourse ? (
                    <CourseViewer
                        courseData={viewedCourse}
                        setViewedCourse={setViewedCourse}
                        userDetails={userDetails}
                        setSessionData={setSessionData}
                        sessionData={sessionData}
                        setCourseList={setCourseList}
                    />
                ) : !verifying ? (
                    <GradesOverview
                        userEmail={userDetails.email}
                        userName={userDetails.name}
                        verifiedEmail={userDetails.verifiedEmail}
                        setViewedCourse={setViewedCourse}
                        sessionData={sessionData}
                        setSessionData={setSessionData}
                        courseList={courseList}
                        setCourseList={setCourseList}
                        activeTri={activeTri}
                    />
                ) : null}
            </Box>

            <PasswordResetDialog resetData={resetData} onClose={() => setResetData(null)} setIsLoggedIn={setIsLoggedIn}
                setUserDetails={setUserDetails} activeTri={activeTri} 
            />
            
            <Snackbar open={emailSent} autoHideDuration={4000} onClose={() => setEmailSent(false)} 
                anchorOrigin={{ vertical: "bottom", horizontal: isMobile ? "center" : "left" }}
            >
                <Alert onClose={() => setEmailSent(false)} severity="success" sx={{ width: isMobile ? "75%" : "100%", mb: isMobile ? 9 : 0 }}>
                    Signup successful. Please check your email to verify your account.
                </Alert>
            </Snackbar>
            <Snackbar open={emailVerified} autoHideDuration={4000} onClose={() => setEmailVerified(false)} 
                anchorOrigin={{ vertical: "bottom", horizontal: isMobile ? "center" : "left" }}
            >
                <Alert onClose={() => setEmailVerified(false)} severity="success" sx={{ width: isMobile ? "75%" : "100%", mb: isMobile ? 9 : 0 }}>
                    Email verified!
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
};

export default App;
