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
    Button,
    CircularProgress,
    Divider,
    Stack,
} from "@mui/material";

import { isMobile } from "react-device-detect";

/** 
 * Has the return and save buttons for mobile as they are
 * used on the top and bottom of the screen. 
 */
const CourseViewerMobileActionButtons = (props) => {
    const {
        attemptClose,
        validChanges,
        changesMade,
        apiLoading,
        saveChanges,
        mb = 0,
    } = props;

    return (
        <Box>
            <Divider variant="middle" role="presentation" sx={{ borderBottomWidth: 5, borderColor:"primary.main", 
                mr: isMobile ? 3 : 10, ml: isMobile ? 3 : 10, mt: 2, mb : 2 }} 
            />

            <Stack direction="row" spacing={5} sx={{ alignItems:"center", justifyContent:"center", mb: mb }}>
                <Button sx={{ width: 150, fontSize:"medium" }} variant="contained" onClick={attemptClose}> Return </Button>
                <Box sx={{ position: "relative" }}>
                    <Button disabled={!validChanges || !changesMade || apiLoading} sx={{ width: 150, fontSize:"medium" }} variant="contained" onClick={() => saveChanges()}> Save </Button>
                    { apiLoading && <CircularProgress size={24} sx={{ position: "absolute", top: "50%", left: "50%", mt: "-12px", ml: "-12px" }} /> }
                </Box>
            </Stack>
        </Box>
    );
};

export default CourseViewerMobileActionButtons;