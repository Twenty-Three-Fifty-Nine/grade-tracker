import React, { useCallback } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import Axios from 'axios';

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const SignupDialog = (props) => {
    const { open, onClose, setIsLoggedIn, setUserDetails } = props;
    const [displayName, setDisplayName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");

    const [validPasswordLength, setValidPasswordLength] = React.useState(false);
    const [validPasswordNumber, setValidPasswordNumber] = React.useState(false);
    const [validPasswordSpecial, setValidPasswordSpecial] = React.useState(false);
    const [validPasswordCapital, setValidPasswordCapital] = React.useState(false);
    const [validPasswordMatch, setValidPasswordMatch] = React.useState(false);

    const [signupError, setSignupError] = React.useState(false);
    const [signupErrorText, setSignupErrorText] = React.useState("");

    const handleClose = useCallback(() => {
        onClose();
        setSignupErrorText("");
        setSignupError(false);
    }, [onClose]);

    const handleSignup = useCallback(async () => {
        setSignupErrorText("");
        let error = false;
        let text = "";

        if (displayName === "") {
            text = "Display name is required - ";
            error = true;
        }

        if (email === "") {
            text += "Email is required - ";
            error = true;
        } else if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            text += "Email is not valid. Format should be handle@domain.com - ";
            error = true;
        }

        if (password === "") {
            text += "Password is required";
            error = true;
        } else if (!validPasswordLength || !validPasswordNumber || !validPasswordSpecial || !validPasswordCapital) {
            text += "Password does not meet requirements";
            error = true;
        } else if (!validPasswordMatch) {
            text += "Passwords do not match";
            error = true;
        }

        if (error) {
            if (text.endsWith(" - ")) {
                text = text.slice(0, -3);
            }
            setSignupErrorText(text);
            setSignupError(true);
            return;
        }

        await Axios.post("http://localhost:3001/api/users", {
            name: displayName,
            email: email,
            password: password,
        })
            .then((result) => {
                setIsLoggedIn(true);
                const data = {
                    name: displayName,
                    email: email,
                }
                setUserDetails(data);
                handleClose();
            })
            .catch((e) => {
                console.log(e);
                if (e.response.status === 409) {
                    setSignupErrorText("Email already in use");
                } else {
                    setSignupErrorText(
                        "There was an error signing up. Please try again later or contact support."
                    );
                }
                setSignupError(true);
            });
    }, [
        displayName,
        email,
        password,
        validPasswordLength,
        validPasswordNumber,
        validPasswordSpecial,
        validPasswordCapital,
        validPasswordMatch,
        setIsLoggedIn,
        handleClose,
        setUserDetails,
    ]);

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === "Enter") {
                handleSignup();
            }
        },
        [handleSignup]
    );

    const handlePasswordChange = useCallback((e) => {
        setPassword(e.target.value);
        setValidPasswordLength(e.target.value.length >= 8);
        setValidPasswordNumber(e.target.value.match(/\d/) !== null);
        setValidPasswordSpecial(e.target.value.match(/[!@#$%^&*(),.?":{}|<>]/) !== null);
        setValidPasswordCapital(e.target.value.match(/[A-Z]/) !== null);
        setValidPasswordMatch(e.target.value === passwordConfirm && e.target.value !== "");
    }, [passwordConfirm]);

    const handlePasswordConfirmChange = useCallback((e) => {
        setPasswordConfirm(e.target.value);
        setValidPasswordMatch(e.target.value === password && e.target.value !== "");
    }, [password]);

    return (
        <Dialog open={open} onClose={handleClose} onKeyDown={handleKeyDown}>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" id="displayName" label="Display Name" type="text" fullWidth value={displayName} onChange={(e) => { setDisplayName(e.target.value) }}/>
                <TextField margin="dense" id="email" label="Email Address" type="email" fullWidth value={email} onChange={(e) => { setEmail(e.target.value) }} />
                <TextField margin="dense" id="password" label="Password" type="password" fullWidth value={password} onChange={handlePasswordChange} />
                <TextField margin="dense" id="passwordConfirm" label="Confirm Password" type="password" fullWidth value={passwordConfirm} onChange={handlePasswordConfirmChange} />

                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Typography variant="body2" sx={{ display: "flex", gap: 0.5, alignItems: "center"}}>{validPasswordLength ? <CheckCircleIcon sx={{color:'success.main'}} /> : <CancelIcon sx={{color:'error.main'}} /> }Password must be at least 8 characters long</Typography>
                    <Typography variant="body2" sx={{ display: "flex", gap: 0.5, alignItems: "center"}}>{validPasswordNumber ? <CheckCircleIcon sx={{color:'success.main'}} /> : <CancelIcon sx={{color:'error.main'}} /> }Password must contain at least one number</Typography>
                    <Typography variant="body2" sx={{ display: "flex", gap: 0.5, alignItems: "center"}}>{validPasswordCapital ? <CheckCircleIcon sx={{color:'success.main'}} /> : <CancelIcon sx={{color:'error.main'}} /> }Password must contain at least one capital letter</Typography>
                    <Typography variant="body2" sx={{ display: "flex", gap: 0.5, alignItems: "center"}}>{validPasswordSpecial ? <CheckCircleIcon sx={{color:'success.main'}} /> : <CancelIcon sx={{color:'error.main'}} /> }Password must contain at least one special character</Typography>
                    <Typography variant="body2" sx={{ display: "flex", gap: 0.5, alignItems: "center"}}>{validPasswordMatch ? <CheckCircleIcon sx={{color:'success.main'}} /> : <CancelIcon sx={{color:'error.main'}} /> }Password must match</Typography>
                </Box>
                {signupError && <Alert severity="error" sx={{ mt: 2 }}>{signupErrorText}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSignup}>Signup</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SignupDialog;