import React, { useCallback } from "react";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Alert, Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, ListItemIcon, Menu, MenuItem, Snackbar, TextField, Typography, CircularProgress, InputAdornment } from "@mui/material";
import Cookies from "universal-cookie";
import PasswordValidation from "./PasswordValidation";
import Axios from "axios";
import { isMobile } from "react-device-detect";
import ThemeSwitch from "./ThemeSwitch";

import TagFacesRoundedIcon from '@mui/icons-material/TagFacesRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const AccountMenu = (props) => {
    const { setIsLoggedIn, userDetails, setUserDetails, sessionData, setSessionData, setCourseList, setViewedCourse, toggleTheme, lightMode, inCourseViewer } = props;

    const [profileDialogOpen, setProfileDialogOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    const [newName, setNewName] = React.useState(null);
    const [newEmail, setNewEmail] = React.useState(null);

    const [emailError, setEmailError] = React.useState(null);
    const [passwordError, setPasswordError] = React.useState(null);

    const [oldPassword, setOldPassword] = React.useState(null);
    const [newPassword, setNewPassword] = React.useState(null);
    const [newPasswordConfirm, setNewPasswordConfirm] = React.useState(null);

    const [validPasswordLength, setValidPasswordLength] = React.useState(false);
    const [validPasswordNumber, setValidPasswordNumber] = React.useState(false);
    const [validPasswordSpecial, setValidPasswordSpecial] = React.useState(false);
    const [validPasswordCapital, setValidPasswordCapital] = React.useState(false);
    const [validPasswordMatch, setValidPasswordMatch] = React.useState(false);

    const [apiAlert, setApiAlert] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);

    const handleEmailChange = useCallback(
        (event) => {
            const email = event.target.value;
            if (email === userDetails.email) {
                setEmailError(null);
                setNewEmail(null);
            } else if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
                setEmailError("Invalid email");
            } else {
                setEmailError(null);
                setNewEmail(email);
            }
        },
        [userDetails.email]
    );

    const handlePasswordChange = useCallback(
        (event) => {
            const password = event.target.value;
            setValidPasswordLength(password.length >= 8);
            setValidPasswordNumber(password.match(/\d/) !== null);
            setValidPasswordSpecial(password.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/) !== null);
            setValidPasswordCapital(password.match(/[A-Z]/) !== null);
            setValidPasswordMatch(password === newPasswordConfirm);
            setPasswordError(password === oldPassword ? "New password cannot be the same as old password" : null);
            setNewPassword(password);
        },
        [newPasswordConfirm, oldPassword]
    );

    const handlePasswordConfirmChange = useCallback(
        (event) => {
            const password = event.target.value;
            setValidPasswordMatch(password === newPassword);
            setNewPasswordConfirm(password);
        },
        [newPassword]
    );

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, [setAnchorEl]);

    const handleDialogClose = useCallback(() => {
        setNewName(null);
        setNewEmail(null);
        setEmailError(null);
        setApiAlert(null);
        setOldPassword(null);
        setNewPassword(null);
        setNewPasswordConfirm(null);
        setValidPasswordLength(null);
        setValidPasswordNumber(null);
        setValidPasswordSpecial(null);
        setValidPasswordCapital(null);
        setValidPasswordMatch(null);
        setPasswordError(null);
        setProfileDialogOpen(false);
        setShowPassword(false);
        setShowNewPassword(false);
    }, [setOldPassword, setNewPassword, setNewPasswordConfirm, setValidPasswordLength, setValidPasswordNumber, setValidPasswordSpecial, setValidPasswordCapital, setValidPasswordMatch]);

    const handleUserUpdate = useCallback(() => {
        const data = {
            newEmail: !newEmail ? null : newEmail.replace(/\s/g, ""),
            displayName: !newName ? null : newName.replace(/\s/g, ""),
            oldPassword: !oldPassword ? null : oldPassword,
            newPassword: !newPassword ? null : newPassword,
        };

        setLoading(true);
        Axios.patch("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/" + userDetails.email, data).then((response) => {
            setLoading(false);
            if (response.status === 200) {
                handleDialogClose();
                const userObj = {
                    email: response.data.email,
                    displayName: response.data.displayName,
                };
                setUserDetails(userObj);
                setSessionData({
                    ...sessionData,
                    userData: userObj,
                });
                new Cookies().set("userDetails", userObj, {
                    path: "/",
                    sameSite: "strict",
                });
                setSnackbarOpen(true);
            }
        })
        .catch((error) => {
            setLoading(false);
            if (error.response.status === 409) {
                setApiAlert("Email already in use");
            } else if (error.response.status === 401) {
                setApiAlert("Incorrect password");
            } else {
                setApiAlert("Something went wrong");
            }
        });
    }, [newEmail, newName, oldPassword, newPassword, userDetails.email, handleDialogClose, setUserDetails, setSessionData, sessionData]);

    const handleLogout = useCallback(() => {
        handleDialogClose();
        setIsLoggedIn(false);
        setUserDetails(null);
        setSessionData(null);
        setCourseList(null)
        setViewedCourse(null);

        new Cookies().remove("userDetails", { path: "/", sameSite: "strict" });
    }, [handleDialogClose, setIsLoggedIn, setUserDetails, setSessionData, setCourseList, setViewedCourse]);

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === "Enter" && !(!newEmail &&
                !newName &&
                !(oldPassword && newPassword && newPasswordConfirm && validPasswordLength && validPasswordNumber && validPasswordSpecial && validPasswordCapital && validPasswordMatch && (newPassword !== oldPassword)))) {
                handleUserUpdate();
            }
        },
        [handleUserUpdate, newEmail, newName, newPassword, newPasswordConfirm, oldPassword, validPasswordCapital, validPasswordLength, validPasswordMatch, validPasswordNumber, validPasswordSpecial]
    );

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

            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: isMobile ? "center" : inCourseViewer ? "right" : "left" }}>
                <Alert severity="success" sx={{ width: isMobile ? '75%' : '100%', mb: isMobile && !inCourseViewer ? 9 : 0 }} >Profile updated successfully</Alert>
            </Snackbar>

            {profileDialogOpen && (
                <Dialog open={profileDialogOpen} onClose={() => handleDialogClose()} maxWidth="sm" fullWidth  onKeyDown={handleKeyDown}>
                    <DialogTitle>Update Information</DialogTitle>
                    <DialogContent>
                        <TextField label="Name" defaultValue={userDetails.displayName} fullWidth margin="normal" onChange={(event) => setNewName(event.target.value === userDetails.displayName ? null : event.target.value)} />
                        <TextField label="Email" defaultValue={userDetails.email} fullWidth margin="normal" onChange={handleEmailChange} error={emailError !== null} helperText={emailError} />
                        <Divider variant="middle" sx={{ my: 0.5, borderWidth: 2 }} />
                        <TextField label="Current Password" fullWidth margin="dense" onChange={(event) => setOldPassword(event.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{endAdornment: 
                                <InputAdornment position="end">
                                    <IconButton onClick={() => {setShowPassword(!showPassword)}}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                        <TextField label="New Password" fullWidth margin="dense" onChange={handlePasswordChange} error={passwordError !== null} helperText={passwordError} 
                            type={showNewPassword ? 'text' : 'password'}
                            InputProps={{endAdornment: 
                                <InputAdornment position="end">
                                    <IconButton onClick={() => {setShowNewPassword(!showNewPassword)}}>
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                        <TextField label="Confirm New Password" type={showNewPassword ? 'text' : 'password'} fullWidth margin="dense" onChange={handlePasswordConfirmChange} />
                        {oldPassword && (
                            <PasswordValidation
                                validPasswordLength={validPasswordLength}
                                validPasswordNumber={validPasswordNumber}
                                validPasswordSpecial={validPasswordSpecial}
                                validPasswordCapital={validPasswordCapital}
                                validPasswordMatch={validPasswordMatch}
                            />
                        )}
                        { <Collapse in={apiAlert}><Alert severity="error" sx={{ mt: 2 }} action={<IconButton onClick={() => setApiAlert(null)}><CloseIcon fontSize="small"/></IconButton>}>{apiAlert}</Alert></Collapse> }
                    </DialogContent>
                    <DialogActions sx={{px: 2}}>
                        <Button onClick={() => handleDialogClose()}>Close</Button>
                        <Box sx={{ position: 'relative' }}>
                            <Button
                                onClick={() => handleUserUpdate()}
                                disabled={
                                    loading || (!newEmail &&
                                    !newName &&
                                    !(oldPassword && newPassword && newPasswordConfirm && validPasswordLength && validPasswordNumber && validPasswordSpecial && validPasswordCapital && validPasswordMatch && (newPassword !== oldPassword)))
                                }
                            >
                                Update
                            </Button>
                            {loading &&
                                <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px', }} />
                            }
                        </Box>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default AccountMenu;
