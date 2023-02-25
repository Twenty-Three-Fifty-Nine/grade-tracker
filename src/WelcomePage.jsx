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

import React from "react";
import {
    Box,
    Typography,
} from "@mui/material";

import Login from "./login/Login";

const WelcomePage = (props) => {
    const {
        activeTri,
        setEmailSent,
        setIsLoggedIn,
        setUserDetails,
    } = props;
    
    return (
        <Box>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Typography variant="h1" component="div" sx={{ flexGrow: 1, marginTop: 20, marginBottom: 1 }}>
                    23:59
                </Typography>

                <Typography variant="h5" component="div" sx={{ flexGrow: 1, mb: 2 }}>
                    Your grade tracking tool.
                </Typography>

                <Box display="flex" flexDirection="row" sx={{ flexGrow: 1, marginTop: 15, marginBottom: 20 }} color="primary.main">
                    <Login
                        setIsLoggedIn={setIsLoggedIn}
                        setUserDetails={setUserDetails}
                        activeTri={activeTri}
                        setEmailSent={setEmailSent}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default WelcomePage;
