import React, { useCallback } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Collapse, CircularProgress, Box, InputAdornment, Stack, Checkbox, Typography } from '@mui/material';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import PasswordValidation from './PasswordValidation';

import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const SignupDialog = (props) => {
    const { open, onClose, setIsLoggedIn, setUserDetails, activeTri } = props;
    const [displayName, setDisplayName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");
    const [acceptedTerms, setAcceptedTerms] = React.useState(false);

    const [validPasswordLength, setValidPasswordLength] = React.useState(false);
    const [validPasswordNumber, setValidPasswordNumber] = React.useState(false);
    const [validPasswordSpecial, setValidPasswordSpecial] = React.useState(false);
    const [validPasswordCapital, setValidPasswordCapital] = React.useState(false);
    const [validPasswordMatch, setValidPasswordMatch] = React.useState(false);

    const [signupError, setSignupError] = React.useState(false);
    const [signupErrorText, setSignupErrorText] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

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

        setLoading(true);

        await Axios.post(
            "https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/signup",
            {
                displayName: displayName,
                email: email,
                password: password,
                activeTri: activeTri
            }
        )
            .then((result) => {
                setIsLoggedIn(true);
                const data = {
                    displayName: displayName,
                    email: email,
                };
                setUserDetails(data);
                new Cookies().set("userDetails", data, { path: '/', sameSite: 'strict' });
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
        setLoading(false)
    }, [displayName, email, password, validPasswordLength, validPasswordNumber, validPasswordSpecial, validPasswordCapital, validPasswordMatch, activeTri, setIsLoggedIn, setUserDetails, handleClose]);

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
                <TextField margin="dense" id="password" label="Password" fullWidth value={password} onChange={handlePasswordChange} 
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{endAdornment: 
                        <InputAdornment position="end">
                            <IconButton onClick={() => {setShowPassword(!showPassword)}}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }}
                />
                <TextField margin="dense" id="passwordConfirm" label="Confirm Password" type={showPassword ? 'text' : 'password'} fullWidth value={passwordConfirm} onChange={handlePasswordConfirmChange} />

                <PasswordValidation validPasswordLength={validPasswordLength} validPasswordNumber={validPasswordNumber} validPasswordSpecial={validPasswordSpecial} validPasswordCapital={validPasswordCapital} validPasswordMatch={validPasswordMatch} />
                
                <Stack direction="row" sx={{ml: -1.1, mt: 1}}>
                    <Checkbox checked={acceptedTerms} onChange={(e, newValue) => {setAcceptedTerms(newValue)}} />
                    <Typography variant="h6" sx={{mt:1.2, fontSize:"16px"}}> 
                        Accept <Box display="inline-block" onClick={() => {console.log("hi")}} sx={{cursor:"pointer", color:"info.main", "&:hover":{textDecoration:"underline"}}}> Terms & Conditions </Box>
                    </Typography> 
                </Stack>

                {<Collapse in={signupError}>
                    <Alert severity="error" sx={{ mt: 2 }}
                        action={
                            <IconButton color="inherit" size="small"
                            onClick={() => {
                                setSignupError(false);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        {signupErrorText}   
                    </Alert>
                </Collapse>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Box sx={{ position: 'relative' }}>
                    <Button onClick={handleSignup} disabled={loading || !acceptedTerms}>Signup</Button>
                    {loading &&
                        <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px', }} />
                    }
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default SignupDialog;