import React from "react";
import { Box, Typography } from "@mui/material";
import Login from "./Login";

const WelcomePage = (props) => {
    return (
        <>
            <Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography
                        variant="h2"
                        component="div"
                        sx={{ flexGrow: 1, marginTop: 20, marginBottom: 10 }}
                    >
                        Welcome to Grade Tracker!
                    </Typography>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Grade Tracker is a website that allows you to keep track
                        of your grades.
                    </Typography>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Click the Login tab to login to your account or the Sign
                        Up tab to sign up for a new account.
                    </Typography>

                    <Box
                        display="flex"
                        flexDirection="row"
                        sx={{ flexGrow: 1, marginTop: 20, marginBottom: 20 }}
                        color="primary.main"
                    >
                        <Login
                            setIsLoggedIn={props.setIsLoggedIn}
                            setUserDetails={props.setUserDetails}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default WelcomePage;
