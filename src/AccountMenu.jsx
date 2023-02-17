import React, { useCallback } from "react";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, TextField, Typography } from "@mui/material";
import Cookies from "universal-cookie";
import PasswordValidation from "./PasswordValidation";
import Axios from "axios";


const TextButton = (props) => {
    const { text, onClick } = props;
    return (
        <Typography
            variant="body1"
            fontSize={18}
            component="div"
            sx={{
                flexGrow: 1,
                "&:hover": { backgroundColor: "highlight.main" },
                cursor: "pointer",
                borderRadius: 1,
                p: 1,
            }}
            onClick={onClick}
            textAlign="left"
        >
            {text}
        </Typography>
    );
};


const AccountMenu = (props) => {
    const { setIsLoggedIn, userDetails, setUserDetails, sessionData, setSessionData, setViewedCourse } = props;

    const [menuOpen, setMenuOpen] = React.useState(false);
    const [profileDialogOpen, setProfileDialogOpen] = React.useState(false);

    const [newName, setNewName] = React.useState(null);
    const [newEmail, setNewEmail] = React.useState(null);

    const [emailError, setEmailError] = React.useState(null);

    const [oldPassword, setOldPassword] = React.useState(null);
    const [newPassword, setNewPassword] = React.useState(null);
    const [newPasswordConfirm, setNewPasswordConfirm] = React.useState(null);

    const [validPasswordLength, setValidPasswordLength] = React.useState(false);
    const [validPasswordNumber, setValidPasswordNumber] = React.useState(false);
    const [validPasswordSpecial, setValidPasswordSpecial] = React.useState(false);
    const [validPasswordCapital, setValidPasswordCapital] = React.useState(false);
    const [validPasswordMatch, setValidPasswordMatch] = React.useState(false);

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
            setNewPassword(password);
        },
        [newPasswordConfirm]
    );

    const handlePasswordConfirmChange = useCallback(
        (event) => {
            const password = event.target.value;
            setValidPasswordMatch(password === newPassword);
            setNewPasswordConfirm(password);
        },
        [newPassword]
    );

    const handleDialogClose = useCallback(() => {
        setProfileDialogOpen(false);
        setOldPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
        setValidPasswordLength(false);
        setValidPasswordNumber(false);
        setValidPasswordSpecial(false);
        setValidPasswordCapital(false);
        setValidPasswordMatch(false);
    }, [setProfileDialogOpen, setOldPassword, setNewPassword, setNewPasswordConfirm, setValidPasswordLength, setValidPasswordNumber, setValidPasswordSpecial, setValidPasswordCapital, setValidPasswordMatch,]);

    const handleUserUpdate = useCallback(() => {
        const data = {
            newEmail: !newEmail ? null : newEmail.replace(/\s/g, ""),
            displayName: !newName ? null : newName.replace(/\s/g, ""),
            oldPassword: !oldPassword ? null : oldPassword,
            newPassword: !newPassword ? null : newPassword,
        };

        Axios.patch("https://b0d0rkqp47.execute-api.ap-southeast-2.amazonaws.com/test/users/" + userDetails.email, data).then((response) => {
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
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }, [newEmail, newName, oldPassword, newPassword, userDetails.email, handleDialogClose, setUserDetails, setSessionData, sessionData]);

    const handleLogout = useCallback(() => {
        handleDialogClose();
        setIsLoggedIn(false);
        setUserDetails(null);
        setSessionData(null);
        setViewedCourse(null);

        new Cookies().remove("userDetails", { path: "/", sameSite: "strict" });
    }, [handleDialogClose, setIsLoggedIn, setUserDetails, setSessionData, setViewedCourse]);

    return (
        <>
            <Box
                sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
                onMouseLeave={() => setMenuOpen(false)}
            >
                <IconButton onClick={() => setMenuOpen(!menuOpen)} color="inherit" sx={{ position: "relative" }}>
                    <AccountCircleRoundedIcon fontSize="large" />
                </IconButton>
                {menuOpen && (
                    <Box
                        sx={{ position: "absolute", top: "100%", right: "70%", width: 150, zIndex: 1, backgroundColor: "filterPanel.main", borderRadius: 1, boxShadow: 1, border: "1px solid black", }}
                    >
                        <TextButton
                            text="Update Details"
                            onClick={() => {
                                setProfileDialogOpen(true);
                                setMenuOpen(false);
                            }}
                        />
                        <TextButton text="Logout" onClick={handleLogout} />
                    </Box>
                )}
            </Box>

            {profileDialogOpen && (
                <Dialog open={profileDialogOpen} onClose={() => handleDialogClose()} maxWidth="sm" fullWidth >
                    <DialogTitle>Update Information</DialogTitle>
                    <DialogContent>
                        <TextField label="Name" defaultValue={userDetails.displayName} fullWidth margin="normal" onChange={(event) => setNewName(event.target.value === userDetails.displayName ? null : event.target.value)} />
                        <TextField label="Email" defaultValue={userDetails.email} fullWidth margin="normal" onChange={handleEmailChange} error={emailError !== null} helperText={emailError} />
                        <Divider variant="middle" sx={{ my: 0.5, borderWidth: 2 }} />
                        <TextField label="Current Password" type="password" fullWidth margin="dense" onChange={(event) => setOldPassword(event.target.value) } />
                        <TextField label="New Password" type="password" fullWidth margin="dense" onChange={handlePasswordChange} />
                        <TextField label="Confirm New Password" type="password" fullWidth margin="dense" onChange={handlePasswordConfirmChange} />
                        {oldPassword && (
                            <PasswordValidation
                                validPasswordLength={validPasswordLength}
                                validPasswordNumber={validPasswordNumber}
                                validPasswordSpecial={validPasswordSpecial}
                                validPasswordCapital={validPasswordCapital}
                                validPasswordMatch={validPasswordMatch}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleDialogClose()}>Close</Button>
                        <Button
                            onClick={() => handleUserUpdate()}
                            disabled={
                                !newEmail &&
                                !newName &&
                                !(oldPassword && newPassword && newPasswordConfirm && validPasswordLength && validPasswordNumber && validPasswordSpecial && validPasswordCapital && validPasswordMatch)
                            }
                        >
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default AccountMenu;
