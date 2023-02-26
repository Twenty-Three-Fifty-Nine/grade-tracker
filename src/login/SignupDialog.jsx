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
    Checkbox,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import Axios from "axios";
import Cookies from "universal-cookie";
import PasswordValidation from "./PasswordValidation";

import CloseIcon from "@mui/icons-material/Close";
import TermsAndConditions from "../TermsAndConditions";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

/**
 * This dialog allows the user to create a new account, then logs
 * them in and gives them access the rest of the website. 
 */
const SignupDialog = (props) => {
    const {
        activeTri,
        onClose,
        open,
        setEmailSent,
        setIsLoggedIn,
        setUserDetails,
    } = props;

    // Stores user details from the login form.
    const [displayName, setDisplayName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");
    const [acceptedTerms, setAcceptedTerms] = React.useState(false);

    // Stores the validity of the inputted password.
    const [validPasswordLength, setValidPasswordLength] = React.useState(false);
    const [validPasswordNumber, setValidPasswordNumber] = React.useState(false);
    const [validPasswordSpecial, setValidPasswordSpecial] = React.useState(false);
    const [validPasswordCapital, setValidPasswordCapital] = React.useState(false);
    const [validPasswordMatch, setValidPasswordMatch] = React.useState(false);

    // States for visual feedback when the form is being used.
    const [signupError, setSignupError] = React.useState(false);
    const [signupErrorText, setSignupErrorText] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showTerms, setShowTerms] = React.useState(false);

    /** Closes the sign up dialog. */
    const handleClose = useCallback(() => {
        onClose();
        setSignupErrorText("");
        setSignupError(false);
        setDisplayName("");
        setEmail("");
        setPassword("");
        setPasswordConfirm("");
        setShowPassword(false);
        setAcceptedTerms(false);
    }, [onClose]);

    /** 
     * Checks if the inputted information is valid and then 
     * attempts to create a new user account. A snackbar is displayed
     * and a verification email is sent if creation is successfuly.
     */
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
            text += "Password is required - ";
            error = true;
        } else if (!validPasswordLength || !validPasswordNumber || !validPasswordSpecial || !validPasswordCapital) {
            text += "Password does not meet requirements - ";
            error = true;
        } else if (!validPasswordMatch) {
            text += "Passwords do not match - ";
            error = true;
        }

        if (!acceptedTerms) {
            text += "You must accept the terms and conditions";
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

        setLoading(true);

        await Axios.post("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/signup", {
            displayName: displayName,
            email: email.toLowerCase(),
            password: password,
            activeTri: activeTri
        }).then((result) => {
            setIsLoggedIn(true);
            setEmailSent(true);
            setUserDetails(result.data);
            new Cookies().set("userDetails", result.data, { path: "/", sameSite: "strict" });
            handleClose();
        }).catch((e) => {
            if (e.response.status === 409) {
                setSignupErrorText("Email already in use");
            } else {
                setSignupErrorText("There was an error signing up. Please try again later or contact support.");
            }
            setSignupError(true);
        });

        setLoading(false);
    }, [displayName, email, password, validPasswordLength, validPasswordNumber, validPasswordSpecial, validPasswordCapital, validPasswordMatch, acceptedTerms, activeTri, setIsLoggedIn, setEmailSent, setUserDetails, handleClose]);

    /** An alternative to pressing the sign up button. */
    const handleKeyDown = useCallback((event) => {
        if (event.key === "Enter") handleSignup();
    }, [handleSignup]);

    /**
     * Called when the user changes the password field
     * and updates the validity states for the password.
     */
    const handlePasswordChange = useCallback((e) => {
        setPassword(e.target.value);
        setValidPasswordLength(e.target.value.length >= 8);
        setValidPasswordNumber(e.target.value.match(/\d/) !== null);
        setValidPasswordSpecial(e.target.value.match(/[!@#$%^&*(),.?":{}|<>]/) !== null);
        setValidPasswordCapital(e.target.value.match(/[A-Z]/) !== null);
        setValidPasswordMatch(e.target.value === passwordConfirm && e.target.value !== "");
    }, [passwordConfirm]);

    /**
     * Called when the user changes the password confirmation
     * field and updates whether or not is matches the password.
     */
    const handlePasswordConfirmChange = useCallback((e) => {
        setPasswordConfirm(e.target.value);
        setValidPasswordMatch(e.target.value === password && e.target.value !== "");
    }, [password]);

    return (
        <Box>
            <Dialog open={open} onClose={handleClose} onKeyDown={handleKeyDown}>
                <DialogTitle> Sign Up </DialogTitle>

                <DialogContent>
                    <TextField autoFocus margin="dense" id="displayName" label="Display Name" type="text" fullWidth 
                        value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <TextField margin="dense" id="email" label="Email Address" type="email" fullWidth value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <TextField margin="dense" id="password" label="Password" fullWidth value={password} onChange={handlePasswordChange} 
                        type={showPassword ? "text" : "password"}
                        InputProps={{endAdornment: 
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                                    { showPassword ? <VisibilityOff /> : <Visibility /> }
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                    <TextField margin="dense" id="passwordConfirm" label="Confirm Password" type={showPassword ? "text" : "password"} 
                        fullWidth value={passwordConfirm} onChange={handlePasswordConfirmChange} 
                    />

                    <PasswordValidation validPasswordLength={validPasswordLength} validPasswordNumber={validPasswordNumber} 
                        validPasswordSpecial={validPasswordSpecial} validPasswordCapital={validPasswordCapital} validPasswordMatch={validPasswordMatch} 
                    />
                    
                    <Stack direction="row" sx={{ ml: -1.1, mt: 1 }}>
                        <Checkbox checked={acceptedTerms} onChange={(e, newValue) => setAcceptedTerms(newValue)} />
                        <Typography variant="h6" sx={{ mt: 1.2, fontSize:"16px" }}> 
                            Accept <Box display="inline-block" onClick={() => {setShowTerms(true)}} 
                            sx={{ cursor:"pointer", color:"info.main", "&:hover":{ textDecoration:"underline" } }}> Terms & Conditions </Box>
                        </Typography> 
                    </Stack>

                    <Collapse in={signupError}>
                        <Alert severity="error" sx={{ mt: 2 }}
                            action={
                                <IconButton color="inherit" size="small" onClick={() => setSignupError(false)}>
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {signupErrorText}   
                        </Alert>
                    </Collapse>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}> Cancel </Button>
                    <Box sx={{ position: "relative" }}>
                        <Button onClick={handleSignup} disabled={loading || !acceptedTerms || !validPasswordLength || !validPasswordNumber || 
                            !validPasswordSpecial || !validPasswordCapital || !validPasswordMatch || !displayName || !email || !password || !passwordConfirm}
                        >
                            Sign Up
                        </Button>
                        { loading && <CircularProgress size={24} sx={{ position: "absolute", top: "50%", left: "50%", mt: "-12px", ml: "-12px" }} /> }
                    </Box>
                </DialogActions>
            </Dialog>

            <TermsAndConditions open={showTerms} onClose={() => setShowTerms(false)} />
        </Box>
    );
}

export default SignupDialog;