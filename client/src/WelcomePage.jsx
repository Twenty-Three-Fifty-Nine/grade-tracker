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
                        variant="h1"
                        component="div"
                        sx={{ flexGrow: 1, marginTop: 20, marginBottom: 1 }}
                    >
                        23:59
                    </Typography>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1, mb: 2 }}>
                        Your grade tracking tool.
                    </Typography>

                    <Box
                        display="flex"
                        flexDirection="row"
                        sx={{ flexGrow: 1, marginTop: 15, marginBottom: 20 }}
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
