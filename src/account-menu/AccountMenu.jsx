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

import React, { useCallback } from "react";
import {
    Alert,
    Box,
    Divider,
    FormControlLabel,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Snackbar,
    Typography,
} from "@mui/material";

import AccountEditDialog from "./AccountEditDialog";
import Cookies from "universal-cookie";
import DeleteAccountDialog from "./DeleteAccountDialog";
import FeedbackDialog from "./FeedbackDialog";
import { isMobile } from "react-device-detect";
import ThemeSwitch from "../themes/ThemeSwitch";

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LogoutIcon from "@mui/icons-material/Logout";
import TagFacesRoundedIcon from "@mui/icons-material/TagFacesRounded";

const AccountMenu = (props) => {
    const {
        inCourseViewer,
        lightMode,
        sessionData,
        setCourseList,
        setIsLoggedIn,
        setSessionData,
        setUserDetails,
        setViewedCourse,
        toggleTheme,
        userDetails,
    } = props;

    const [profileDialogOpen, setProfileDialogOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);
    const [confirmDeleteAccount, setConfirmDeleteAccount] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState(null);

    const [feedbackDialogOpen, setFeedbackDialogOpen] = React.useState(false);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, [setAnchorEl]);

    const handleProfileDialogClose = useCallback(() => {
        setProfileDialogOpen(false);
    }, []);

    const handleLogout = useCallback(() => {
        handleProfileDialogClose();
        setIsLoggedIn(false);
        setUserDetails(null);
        setSessionData(null);
        setCourseList(null)
        setViewedCourse(null);
        setConfirmDeleteAccount(false);

        new Cookies().remove("userDetails", { path: "/", sameSite: "strict" });
    }, [handleProfileDialogClose, setIsLoggedIn, setUserDetails, setSessionData, setCourseList, setViewedCourse]);

    return (
        <Box sx={{ mr: 2 }}>
            <IconButton color="inherit" onClick={(event) => setAnchorEl(event.target)}>
                <AccountCircleRoundedIcon color="inherit" fontSize="large"/>
            </IconButton>
            <Menu open={menuOpen} anchorEl={anchorEl} onClose={handleMenuClose} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                
                <MenuItem onClick={() => {setProfileDialogOpen(true);handleMenuClose()}}>
                    <ListItemIcon>
                        <TagFacesRoundedIcon fontSize="small"/>
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={() => {setFeedbackDialogOpen(true); handleMenuClose();}}>
                    <ListItemIcon>
                        <FeedbackIcon fontSize="small"/>
                    </ListItemIcon>
                    <Typography variant="body1">Feedback</Typography>
                </MenuItem>
                <MenuItem onClick={() => {handleMenuClose();handleLogout()}}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small"/>
                    </ListItemIcon>
                    <Typography variant="body1">Logout</Typography>
                </MenuItem>
                <Divider variant="middle" />
                <MenuItem>
                <FormControlLabel
                            control={
                                <ThemeSwitch
                                    sx={{ ml: 4 }}
                                    checked={lightMode}
                                    onChange={toggleTheme}
                                />
                            }
                        />
                </MenuItem>
            </Menu>

            <Snackbar open={snackbarMessage !== null} autoHideDuration={4000} onClose={() => setSnackbarMessage(null)} anchorOrigin={{ vertical: "bottom", horizontal: isMobile ? "center" : inCourseViewer ? "right" : "left" }}>
                <Alert severity="success" sx={{ width: isMobile ? '75%' : '100%', mb: isMobile && !inCourseViewer ? 9 : 0 }}> {snackbarMessage} </Alert>
            </Snackbar>

            <AccountEditDialog
                open={profileDialogOpen}
                onClose={handleProfileDialogClose}
                userDetails={userDetails}
                setUserDetails={setUserDetails}
                setSessionData={setSessionData}
                sessionData={sessionData}
                setSnackbarMessage={setSnackbarMessage}
                setConfirmDeleteAccount={setConfirmDeleteAccount}
                confirmDeleteAccount={confirmDeleteAccount}
            />

            <DeleteAccountDialog
                userDetails={userDetails}
                sessionData={sessionData}
                handleLogout={handleLogout}
                confirmDeleteAccount={confirmDeleteAccount}
                setConfirmDeleteAccount={setConfirmDeleteAccount}
            />

            <FeedbackDialog
                feedbackDialogOpen={feedbackDialogOpen}
                setFeedbackDialogOpen={setFeedbackDialogOpen}
                userDetails={userDetails}
                confirmDeleteAccount={confirmDeleteAccount}
                setSnackbarMessage={setSnackbarMessage}
            />
        </Box>
    );
};

export default AccountMenu;
