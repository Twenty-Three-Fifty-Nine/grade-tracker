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
    Stack,
    Snackbar,
} from "@mui/material";
import WelcomePage from "./WelcomePage";
import GradesOverview from "./GradesOverview";
import CourseViewer from "./CourseViewer";
import { lightTheme, darkTheme } from "./Themes";
import ThemeSwitch from "./ThemeSwitch";
import logoLight from "./2359LogoLight.svg";
import logoDark from "./2359LogoDark.svg";
import { isMobile } from "react-device-detect";
import Cookies from "universal-cookie";
import AccountMenu from "./AccountMenu";
import { useLocation } from "react-router-dom";
import PasswordResetDialog from "./PasswordResetDialog";
import Axios from "axios";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userDetails, setUserDetails] = React.useState({});
    const [lightMode, setLightMode] = React.useState(true);
    const [viewedCourse, setViewedCourse] = React.useState(null);

    const [sessionData, setSessionData] = React.useState(null);
    const [courseList, setCourseList] = React.useState(null);

    const location = useLocation();
    const [resetData, setResetData] = React.useState(null);
    const [emailSent, setEmailSent] = React.useState(false);
    const [emailVerified, setEmailVerified] = React.useState(false);
    const [verifying, setVerifying] = React.useState(false);

    const activeTri = useMemo(() => {
        return { year: 2023, tri: 1 };
    }, []);

    const verifyUser = async (email, token) => {
        setVerifying(true);
        await Axios.post("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/" + email + "/verify", {
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
        })
        setVerifying(false);
    };

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
                    <Stack
                        direction={"row"}
                        sx={{ position: isMobile ? "relative" : "fixed" }}
                    >
                        <Box
                            component="img"
                            src={!lightMode ? logoLight : logoDark}
                            sx={{
                                width: isMobile ? 40 : 50,
                                height: isMobile ? 40 : 50,
                            }}
                        />

                        <Box sx={{ ml: 2, mt: 1 }}>
                            {!isMobile && (
                                <Typography variant="h6" component="div">
                                    Twenty Three Fifty Nine
                                </Typography>
                            )}
                        </Box>
                    </Stack>

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ textAlign: "center", m: isMobile ? 0 : "auto" }}
                    >
                        {isLoggedIn && !verifying
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

                    <Stack
                        direction={"row"}
                        sx={{ position: "fixed", right: isMobile ? 10 : 0 }}
                    >
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
                                        sx={{
                                            ml: isMobile ? 1 : 4,
                                            mr: isMobile ? -3 : 0,
                                        }}
                                        checked={lightMode}
                                        onChange={() =>
                                            setLightMode(!lightMode)
                                        }
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
                        setUserDetails={setUserDetails}
                activeTri={activeTri} />
            
            <Snackbar open={emailSent} autoHideDuration={4000} onClose={() => setEmailSent(false)} anchorOrigin={{ vertical: "bottom", horizontal: isMobile ? "center" : "left" }}>
                <Alert onClose={() => setEmailSent(false)} severity="success"  sx={{ width: isMobile ? '75%' : '100%', mb: isMobile ? 9 : 0 }}>
                    Signup successful. Please check your email to verify your account.
                </Alert>
            </Snackbar>
            <Snackbar open={emailVerified} autoHideDuration={4000} onClose={() => setEmailVerified(false)} anchorOrigin={{ vertical: "bottom", horizontal: isMobile ? "center" : "left" }}>
                <Alert onClose={() => setEmailVerified(false)} severity="success"  sx={{ width: isMobile ? '75%' : '100%', mb: isMobile ? 9 : 0 }}>
                    Email verified!
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
};

export default App;
