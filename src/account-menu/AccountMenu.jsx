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
import DonationDialog from "./DonationDialog";
import FeedbackDialog from "./FeedbackDialog";
import { isMobile } from "react-device-detect";
import ThemeSwitch from "../themes/ThemeSwitch";

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import FeedbackIcon from "@mui/icons-material/Feedback";
import LogoutIcon from "@mui/icons-material/Logout";
import TagFacesRoundedIcon from "@mui/icons-material/TagFacesRounded";

/** A dropdown menu that opens other account-related dialogs. */
const AccountMenu = (props) => {
    const {
        deletedAccount,
        inCourseViewer,
        lightMode,
        sessionData,
        setCourseList,
        setIsLoggedIn,
        setNewLogout,
        setSessionData,
        setUserDetails,
        setViewedCourse,
        toggleTheme,
        userDetails,
    } = props;

    // Menu related states.
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);

    // Dialog related states.
    const [profileDialogOpen, setProfileDialogOpen] = React.useState(false);
    const [feedbackDialogOpen, setFeedbackDialogOpen] = React.useState(false);
    const [confirmDeleteAccount, setConfirmDeleteAccount] = React.useState(false);
    const [donationClicked, setDonationClicked] = React.useState(false);

    // State for visual feedback when the form is being used.
    const [snackbarMessage, setSnackbarMessage] = React.useState(null);

    /** Logs the user out. */
    const handleLogout = useCallback(() => {
        setProfileDialogOpen(false);
        setIsLoggedIn(false);
        setUserDetails(null);
        setSessionData(null);
        setCourseList(null)
        setViewedCourse(null);
        setConfirmDeleteAccount(false);
        setNewLogout(true);

        new Cookies().remove("userDetails", { path: "/", sameSite: "strict" });
    }, [setIsLoggedIn, setUserDetails, setSessionData, setCourseList, setViewedCourse, setNewLogout]);

    return (
        <Box sx={{ mr: 2 }}>
            <IconButton color="inherit" onClick={(event) => setAnchorEl(event.target)}>
                <AccountCircleRoundedIcon color="inherit" fontSize="large"/>
            </IconButton>
            
            <Menu open={menuOpen} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} transformOrigin={{ horizontal: "right", vertical: "top" }} 
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={() => { setProfileDialogOpen(true); setAnchorEl(null); }}>
                    <ListItemIcon>
                        <TagFacesRoundedIcon fontSize="small"/>
                    </ListItemIcon>
                    <Typography variant="body1"> Profile </Typography>
                </MenuItem>
                <MenuItem onClick={() => { setFeedbackDialogOpen(true); setAnchorEl(null); }}>
                    <ListItemIcon>
                        <FeedbackIcon fontSize="small"/>
                    </ListItemIcon>
                    <Typography variant="body1"> Feedback </Typography>
                </MenuItem>
                <MenuItem onClick={() => { setDonationClicked(true); setAnchorEl(null); }}>
                    <ListItemIcon>
                        <AttachMoneyRoundedIcon fontSize="small"/>
                    </ListItemIcon>
                    <Typography variant="body1"> Donate </Typography>
                </MenuItem>
                <MenuItem onClick={() => {setAnchorEl(null); handleLogout()}}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small"/>
                    </ListItemIcon>
                    <Typography variant="body1"> Logout </Typography>
                </MenuItem>

                <Divider variant="middle" />

                <MenuItem>
                    <FormControlLabel
                        control= {
                            <ThemeSwitch sx={{ ml: 4 }}
                                checked={lightMode} onChange={toggleTheme}
                            />
                        }
                    />
                </MenuItem>
            </Menu>

            <Snackbar open={snackbarMessage !== null} autoHideDuration={4000} onClose={() => setSnackbarMessage(null)} 
                anchorOrigin={{ vertical: "bottom", horizontal: isMobile ? "center" : "left" }} sx={{zIndex: 1, mb: (!isMobile !== !inCourseViewer) ? 10 : 0 }}
            >
                <Alert severity="success" sx={{ width: isMobile ? "75%" : "100%" }}> {snackbarMessage} </Alert>
            </Snackbar>

            <AccountEditDialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} userDetails={userDetails}
                setUserDetails={setUserDetails} setSessionData={setSessionData} sessionData={sessionData} setSnackbarMessage={setSnackbarMessage}
                setConfirmDeleteAccount={setConfirmDeleteAccount} confirmDeleteAccount={confirmDeleteAccount}
            />

            <DeleteAccountDialog userDetails={userDetails} sessionData={sessionData} handleLogout={handleLogout}
                confirmDeleteAccount={confirmDeleteAccount} setConfirmDeleteAccount={setConfirmDeleteAccount} deletedAccount={deletedAccount}
            />

            <FeedbackDialog feedbackDialogOpen={feedbackDialogOpen} setFeedbackDialogOpen={setFeedbackDialogOpen} userDetails={userDetails}
                confirmDeleteAccount={confirmDeleteAccount} setSnackbarMessage={setSnackbarMessage}
            />

            <DonationDialog dialogOpen={donationClicked} handleDialogClose={() => setDonationClicked(false)}/>
        </Box>
    );
};

export default AccountMenu;
