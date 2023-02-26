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
    Divider,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import Axios from "axios";
import Cookies from "universal-cookie";
import PasswordValidation from "../login/PasswordValidation";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const AccountEditDialog = (props) => {
    const {
        confirmDeleteAccount,
        open,
        onClose,
        sessionData,
        setConfirmDeleteAccount,
        setSessionData,
        setSnackbarMessage,
        setUserDetails,
        userDetails,
    } = props;

    const [loading, setLoading] = React.useState(false);
    const [apiAlert, setApiAlert] = React.useState(null);

    const [newName, setNewName] = React.useState(null);
    const [newEmail, setNewEmail] = React.useState(null);

    const [emailError, setEmailError] = React.useState(null);
    const [passwordError, setPasswordError] = React.useState(null);

    const [oldPassword, setOldPassword] = React.useState(null);
    const [newPassword, setNewPassword] = React.useState(null);
    const [newPasswordConfirm, setNewPasswordConfirm] = React.useState(null);
    
    const [showPassword, setShowPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);

    const [validPasswordLength, setValidPasswordLength] = React.useState(false);
    const [validPasswordNumber, setValidPasswordNumber] = React.useState(false);
    const [validPasswordSpecial, setValidPasswordSpecial] = React.useState(false);
    const [validPasswordCapital, setValidPasswordCapital] = React.useState(false);
    const [validPasswordMatch, setValidPasswordMatch] = React.useState(false);

    const handleDialogClose = useCallback(() => {
        setNewName(null);
        setNewEmail(null);
        setOldPassword(null);
        setNewPassword(null);
        setNewPasswordConfirm(null);
        setApiAlert(null);
        setLoading(false);
        setEmailError(null);
        setPasswordError(null);
        setShowPassword(false);
        setShowNewPassword(false);
        setValidPasswordLength(false);
        setValidPasswordNumber(false);
        setValidPasswordSpecial(false);
        setValidPasswordCapital(false);
        setValidPasswordMatch(false);
        setConfirmDeleteAccount(false);

        onClose();
    }, [onClose, setConfirmDeleteAccount]);

    const handleUserUpdate = useCallback(async () => {
        const data = {
            newEmail: !newEmail ? null : newEmail.replace(/\s/g, "").toLowerCase(),
            displayName: !newName ? null : newName.replace(/\s/g, ""),
            oldPassword: !oldPassword ? null : oldPassword,
            newPassword: !newPassword ? null : newPassword
        };

        setLoading(true);

        await Axios.patch("https://api.twentythreefiftynine.com/users/" + userDetails.email, data).then((response) => {
            if (response.status === 200) {
                handleDialogClose();
                setUserDetails(response.data);
                setSessionData({
                    ...sessionData,
                    userData: response.data
                });
                new Cookies().set("userDetails", response.data, {
                    path: "/",
                    sameSite: "strict"
                });
                setSnackbarMessage("Profile updated successfully");
            }
        }).catch((error) => {
            if (error.response.status === 409) setApiAlert("Email already in use");
            else if (error.response.status === 401) setApiAlert("Incorrect password");
            else setApiAlert("Something went wrong");
        });

        setLoading(false);
    }, [newEmail, newName, oldPassword, newPassword, setLoading, userDetails.email, handleDialogClose, setUserDetails, setSessionData, sessionData, setSnackbarMessage, setApiAlert]);

    const handleKeyDown = useCallback((event) => {
        if (event.key === "Enter" && !loading) {
            if (open && !(!newEmail && !newName && !(oldPassword && newPassword && newPasswordConfirm && validPasswordLength && validPasswordNumber && 
               validPasswordSpecial && validPasswordCapital && validPasswordMatch && (newPassword !== oldPassword)))) 
                handleUserUpdate();
        }
    }, [handleUserUpdate, loading, newEmail, newName, newPassword, newPasswordConfirm, oldPassword, open, validPasswordCapital, validPasswordLength, validPasswordMatch, validPasswordNumber, validPasswordSpecial]);

    const handleEmailChange = useCallback((event) => {
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
    }, [userDetails.email]);

    const handlePasswordChange = useCallback((event) => {
        const password = event.target.value;
        setValidPasswordLength(password.length >= 8);
        setValidPasswordNumber(password.match(/\d/) !== null);
        setValidPasswordSpecial(password.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/) !== null);
        setValidPasswordCapital(password.match(/[A-Z]/) !== null);
        setValidPasswordMatch(password === newPasswordConfirm);
        setPasswordError(password === oldPassword ? "New password cannot be the same as old password" : null);
        setNewPassword(password);
    }, [newPasswordConfirm, oldPassword]);

    const handlePasswordConfirmChange = useCallback((event) => {
        const password = event.target.value;
        setValidPasswordMatch(password === newPassword);
        setNewPasswordConfirm(password);
    }, [newPassword]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth onKeyDown={handleKeyDown}>
            <Stack direction="row">
                <Typography variant="h6" sx={{ flexGrow: 1, ml: 3, mt: 2 }}> Update Information </Typography>
                <IconButton onClick={() => setConfirmDeleteAccount(true) } 
                    sx={{ "&:hover": { color: "error.main", backgroundColor: "transparent" }, mr: 1.5, mt: 1.5 }}
                >
                    <DeleteIcon />
                </IconButton>
            </Stack>
            
            <DialogContent>
                <TextField label="Name" defaultValue={userDetails.displayName} fullWidth margin="normal" 
                    onChange={(event) => setNewName(event.target.value === userDetails.displayName ? null : event.target.value)} 
                />
                <TextField label="Email" defaultValue={userDetails.email} fullWidth margin="normal" onChange={handleEmailChange} 
                    error={emailError !== null} helperText={emailError} 
                />

                <Divider variant="middle" sx={{ my: 0.5, borderWidth: 2 }} />

                <TextField label="Current Password" fullWidth margin="dense" onChange={(event) => setOldPassword(event.target.value)}
                    type={ showPassword ? "text" : "password" }
                    InputProps={{ endAdornment: 
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                                { showPassword ? <VisibilityOff /> : <Visibility /> }
                            </IconButton>
                        </InputAdornment>
                    }}
                />
                <TextField label="New Password" fullWidth margin="dense" onChange={handlePasswordChange} error={passwordError !== null} helperText={passwordError} 
                    type={ showNewPassword ? "text" : "password" }
                    InputProps={{ endAdornment: 
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowNewPassword(!showNewPassword)} tabIndex={-1}>
                                { showNewPassword ? <VisibilityOff /> : <Visibility /> }
                            </IconButton>
                        </InputAdornment>
                    }}
                />
                <TextField label="Confirm New Password" type={showNewPassword ? "text" : "password"} fullWidth margin="dense" onChange={handlePasswordConfirmChange} />
                
                {   oldPassword && (
                    <PasswordValidation validPasswordLength={validPasswordLength} validPasswordNumber={validPasswordNumber}
                        validPasswordSpecial={validPasswordSpecial} validPasswordCapital={validPasswordCapital} validPasswordMatch={validPasswordMatch}
                    />
                )}
                <Collapse in={apiAlert !== null && !confirmDeleteAccount}>
                    <Alert severity="error" sx={{ mt: 2 }} 
                        action= {
                            <IconButton onClick={() => setApiAlert(null)}> 
                                <CloseIcon fontSize="small" /> 
                            </IconButton>
                        }
                    >
                        {apiAlert}
                    </Alert>
                </Collapse>
            </DialogContent>

            <DialogActions sx={{ px: 2 }}>
                <Button onClick={onClose}> Close </Button>
                <Box sx={{ position: "relative" }}>
                    <Button
                        onClick={() => handleUserUpdate()}
                        disabled={ loading || (!newEmail && !newName && !(oldPassword && newPassword && newPasswordConfirm && validPasswordLength && 
                            validPasswordNumber && validPasswordSpecial && validPasswordCapital && validPasswordMatch && (newPassword !== oldPassword)))
                        }
                    >
                        Update
                    </Button>
                    { loading && <CircularProgress size={24} sx={{ position: "absolute", top: "50%", left: "50%", mt: "-12px", ml: "-12px" }} /> }
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default AccountEditDialog;