import React, { useCallback } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import Axios from 'axios';
import PasswordChecklist from "react-password-checklist"

const SignupDialog = (props) => {
    const { open, onClose, setIsLoggedIn, setUserDetails } = props;
    const [displayName, setDisplayName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");
    const [validPassword, setValidPassword] = React.useState(false);

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
        } else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            text += "Email is not valid. Format should be handle@domain.com - ";
            error = true;
        }

        if (password === "") {
            text += "Password is required";
            error = true;
        } else if (!validPassword) {
            text += "Password is not valid";
            error = true;
        }

        if (error) {
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
        validPassword,
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

    return (
        <Dialog open={open} onClose={handleClose} onKeyDown={handleKeyDown}>
            <DialogTitle>Signup</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Signup for an account
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="displayName"
                    label="Display Name"
                    type="text"
                    fullWidth
                    value={displayName}
                    onChange={(e) => { setDisplayName(e.target.value) }}
                />
                <TextField
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                />
                <TextField
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <TextField
                    margin="dense"
                    id="passwordConfirm"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    value={passwordConfirm}
                    onChange={(e) => { setPasswordConfirm(e.target.value) }}
                />

                <PasswordChecklist
				rules={["minLength","specialChar","number","capital","match"]}
				minLength={5}
				value={password}
				valueAgain={passwordConfirm}
				onChange={(isValid) => { setValidPassword(isValid) }}
			/>
                {signupError && <Alert severity="error">{signupErrorText}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSignup}>Signup</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SignupDialog;