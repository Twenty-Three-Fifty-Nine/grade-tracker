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
    Button,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    ListItemIcon,
    Menu,
    MenuItem,
    Snackbar,
    TextField,
    Typography,
    Select,
    Stack,
} from "@mui/material";

import Axios from "axios";
import Cookies from "universal-cookie";
import { isMobile } from "react-device-detect";
import PasswordValidation from "./PasswordValidation";
import ThemeSwitch from "./ThemeSwitch";

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LogoutIcon from "@mui/icons-material/Logout";
import TagFacesRoundedIcon from "@mui/icons-material/TagFacesRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const AccountMenu = (props) => {
    const { setIsLoggedIn, userDetails, setUserDetails, sessionData, setSessionData, setCourseList, setViewedCourse, toggleTheme, lightMode, inCourseViewer } = props;

    const [profileDialogOpen, setProfileDialogOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [confirmDeleteAccount, setConfirmDeleteAccount] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const [newName, setNewName] = React.useState(null);
    const [newEmail, setNewEmail] = React.useState(null);

    const [emailError, setEmailError] = React.useState(null);
    const [passwordError, setPasswordError] = React.useState(null);

    const [oldPassword, setOldPassword] = React.useState(null);
    const [newPassword, setNewPassword] = React.useState(null);
    const [deletePassword, setDeletePassword] = React.useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = React.useState(null);

    const [validPasswordLength, setValidPasswordLength] = React.useState(false);
    const [validPasswordNumber, setValidPasswordNumber] = React.useState(false);
    const [validPasswordSpecial, setValidPasswordSpecial] = React.useState(false);
    const [validPasswordCapital, setValidPasswordCapital] = React.useState(false);
    const [validPasswordMatch, setValidPasswordMatch] = React.useState(false);

    const [apiAlert, setApiAlert] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showDeletePassword, setShowDeletePassword] = React.useState(false);

    const [feedbackDialogOpen, setFeedbackDialogOpen] = React.useState(false);
    const [feedbackSubject, setFeedbackSubject] = React.useState(null);
    const [feedbackMessage, setFeedbackMessage] = React.useState(null);
    const [feedbackType, setFeedbackType] = React.useState("suggestion");

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

    const handleProfileDialogClose = useCallback(() => {
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

    const handleFeedbackDialogClose = useCallback(() => {
        setFeedbackDialogOpen(false);
        setFeedbackSubject(null);
        setFeedbackMessage(null);
        setFeedbackType("suggestion");
        setApiAlert(null);
    }, [])

    const handleUserUpdate = useCallback(() => {
        const data = {
            newEmail: !newEmail ? null : newEmail.replace(/\s/g, "").toLowerCase(),
            displayName: !newName ? null : newName.replace(/\s/g, ""),
            oldPassword: !oldPassword ? null : oldPassword,
            newPassword: !newPassword ? null : newPassword,
        };

        setLoading(true);
        Axios.patch("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/" + userDetails.email, data).then((response) => {
            setLoading(false);
            if (response.status === 200) {
                handleProfileDialogClose();
                setUserDetails(response.data);
                setSessionData({
                    ...sessionData,
                    userData: response.data,
                });
                new Cookies().set("userDetails", response.data, {
                    path: "/",
                    sameSite: "strict",
                });
                setSnackbarOpen(true);
                setSnackbarMessage("Profile updated successfully");
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
    }, [newEmail, newName, oldPassword, newPassword, userDetails.email, handleProfileDialogClose, setUserDetails, setSessionData, sessionData]);

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

    const deleteUser = useCallback(async () => {
        await Axios.delete("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/" + userDetails.email, 
            {data: {
                password: deletePassword, 
                email: userDetails.email.toLowerCase(),
                activeTri: sessionData.timeInfo.activeTri, 
            }}
        ).then((response) => {
                if(response.status === 200) handleLogout();
        }).catch((error) => {
            setApiAlert("Incorrect password");
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deletePassword, handleLogout, userDetails.email]);

    const sendFeedback = useCallback(async () => {
        setLoading(true);
        await Axios.post("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/feedback", {
            subject: feedbackSubject,
            message: feedbackMessage,
            feedbackType,
            email: userDetails.email.toLowerCase(),
            displayName: userDetails.displayName,
        }).then((response) => {
            setSnackbarOpen(true);
            setSnackbarMessage("Feedback sent successfully");
            handleFeedbackDialogClose();
        }).catch((error) => {
            setApiAlert("Something went wrong");
        })
        setLoading(false);
    }, [feedbackMessage, feedbackSubject, feedbackType, handleFeedbackDialogClose, userDetails.displayName, userDetails.email]);

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === "Enter" && !loading){
                if(profileDialogOpen && !(!newEmail && !newName &&
                !(oldPassword && newPassword && newPasswordConfirm && validPasswordLength && validPasswordNumber && validPasswordSpecial && validPasswordCapital && validPasswordMatch && (newPassword !== oldPassword)))) {
                    handleUserUpdate();
                }
            }
        },
        [handleUserUpdate, loading, newEmail, newName, newPassword, newPasswordConfirm, oldPassword, profileDialogOpen, validPasswordCapital, validPasswordLength, validPasswordMatch, validPasswordNumber, validPasswordSpecial]
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

            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: isMobile ? "center" : inCourseViewer ? "right" : "left" }}>
                <Alert severity="success" sx={{ width: isMobile ? '75%' : '100%', mb: isMobile && !inCourseViewer ? 9 : 0 }}> {snackbarMessage} </Alert>
            </Snackbar>

            <Dialog open={profileDialogOpen} onClose={() => handleProfileDialogClose()} maxWidth="sm" fullWidth  onKeyDown={handleKeyDown}>
                <Stack direction="row">
                    <Typography variant="h6" sx={{flexGrow: 1, ml: 3, mt: 2}}> Update Information </Typography>
                    <IconButton onClick={() => {
                        setConfirmDeleteAccount(true);
                    }} sx={{ "&:hover": {color: "error.main", backgroundColor: "transparent" }, mr: 1.5, mt: 1.5}}>
                        <DeleteIcon />
                    </IconButton>
                </Stack>
                
                <DialogContent>
                    <TextField label="Name" defaultValue={userDetails.displayName} fullWidth margin="normal" onChange={(event) => setNewName(event.target.value === userDetails.displayName ? null : event.target.value)} />
                    <TextField label="Email" defaultValue={userDetails.email} fullWidth margin="normal" onChange={handleEmailChange} error={emailError !== null} helperText={emailError} />
                    <Divider variant="middle" sx={{ my: 0.5, borderWidth: 2 }} />
                    <TextField label="Current Password" fullWidth margin="dense" onChange={(event) => setOldPassword(event.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{endAdornment: 
                            <InputAdornment position="end">
                                <IconButton onClick={() => {setShowPassword(!showPassword)}} tabIndex={-1}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                    <TextField label="New Password" fullWidth margin="dense" onChange={handlePasswordChange} error={passwordError !== null} helperText={passwordError} 
                        type={showNewPassword ? 'text' : 'password'}
                        InputProps={{endAdornment: 
                            <InputAdornment position="end">
                                <IconButton onClick={() => {setShowNewPassword(!showNewPassword)}} tabIndex={-1}>
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
                    { <Collapse in={apiAlert !== null && !confirmDeleteAccount}><Alert severity="error" sx={{ mt: 2 }} action={<IconButton onClick={() => setApiAlert(null)}><CloseIcon fontSize="small"/></IconButton>}>{apiAlert}</Alert></Collapse> }
                </DialogContent>
                <DialogActions sx={{px: 2}}>
                    <Button onClick={() => handleProfileDialogClose()}>Close</Button>
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

            <Dialog onClose={() => {setConfirmDeleteAccount(false); setDeletePassword(""); setShowDeletePassword(false);}} open={confirmDeleteAccount} >
                <Stack sx={{pr: 5, pl: 5}}>
                    <DialogTitle sx={{ textAlign:"center", paddingBottom: 2}}>
                        Delete your account?
                    </DialogTitle>
                    <Typography sx={{ textAlign:"center", maxWidth: 300}}>
                        This action CANNOT be reverted. You will lose all of your data and be unable to retrieve it.
                    </Typography>
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type={showDeletePassword ? 'text' : 'password'}
                        InputProps={{endAdornment: 
                            <InputAdornment position="end">
                                <IconButton onClick={() => {setShowDeletePassword(!showDeletePassword)}} tabIndex={-1}>
                                    {showDeletePassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }}
                        fullWidth
                        value={deletePassword}
                        onChange={(e) => {
                            setDeletePassword(e.target.value);
                        }}
                    />
                    { <Collapse in={apiAlert !== null}><Alert severity="error" sx={{ mt: 2 }} action={<IconButton onClick={() => setApiAlert(null)}><CloseIcon fontSize="small"/></IconButton>}>{apiAlert}</Alert></Collapse> }
                    <Stack spacing={2} direction="row" sx={{ margin:"auto", paddingTop: 3, paddingBottom: 3 }}>
                        <Button onClick={() => {setConfirmDeleteAccount(false); setDeletePassword(""); setShowDeletePassword(false);}} variant="outlined">Cancel</Button>
                        <Box sx={{ position: 'relative' }}>
                            <Button onClick={deleteUser} variant="contained"> Delete </Button>
                        </Box>
                    </Stack>
                </Stack>
            </Dialog>

            <Dialog open={feedbackDialogOpen} onClose={() => handleFeedbackDialogClose()} maxWidth="sm" fullWidth>
                <DialogTitle>Send Feedback</DialogTitle>
                <DialogContent>
                    <Stack direction={isMobile ? "column" : "row"}>
                        <TextField label="Subject" sx={{width: isMobile ? "100%" : "70%"}} margin="normal" value={feedbackSubject ? feedbackSubject : ""} onChange={(e) => {setFeedbackSubject(e.target.value)}} 
                            error={feedbackSubject !== null && (feedbackSubject.length === 0 || feedbackSubject.length > 40)} 
                            helperText={feedbackSubject === null ? "" : feedbackSubject.length === 0 ? "Subject field cannot be empty" : feedbackSubject.length > 40 ? "Subject length has to be below 41 characters" : ""}
                        />
                        <FormControl sx={{width: isMobile ? "100%" : "30%", my: 2, ml: isMobile ? 0 : 2}}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={feedbackType}
                                label="Type"
                                onChange={(e) => {setFeedbackType(e.target.value)}}
                            >
                                <MenuItem value={"suggestion"}>Suggestion</MenuItem>
                                <MenuItem value={"bug"}>Bug</MenuItem>
                                <MenuItem value={"support"}>Support</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                    <TextField label="Message Content" fullWidth margin="normal" value={feedbackMessage ? feedbackMessage : ""} onChange={(e) => {setFeedbackMessage(e.target.value)}} multiline rows={6} 
                        error={feedbackMessage !== null && (feedbackMessage.length === 0 || feedbackMessage.length > 350)} 
                        helperText={feedbackMessage === null ? "" : feedbackMessage.length === 0 ? "Content field cannot be empty" : feedbackMessage.length > 350 ? "Message content has to be below 351 characters" : ""}
                    />
                    { <Collapse in={apiAlert !== null && !confirmDeleteAccount}><Alert severity="error" sx={{ mt: 2 }} action={<IconButton onClick={() => setApiAlert(null)}><CloseIcon fontSize="small"/></IconButton>}>{apiAlert}</Alert></Collapse> }
                </DialogContent>
                <DialogActions sx={{px: 2}}>
                    <Button onClick={() => handleFeedbackDialogClose()}>Close</Button>
                    <Box sx={{ position: 'relative' }}>
                        <Button
                            onClick={() => {sendFeedback()}}
                            disabled={loading || (!feedbackSubject || !feedbackMessage || feedbackSubject.length > 40 || feedbackMessage.length > 350)}
                        >
                            Send
                        </Button>
                        {loading &&
                            <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px', }} />
                        }
                    </Box>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AccountMenu;
