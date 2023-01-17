import React from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import Axios from 'axios';

const SignupDialog = (props) => {
    const { onClose, open, onLogin } = props;

    const [displayName, setDisplayName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");

    const [signupError, setSignupError] = React.useState(false);

    const handleClose = () => {
        onClose();
    }

    const handleSignup = async () => {
        if (password !== passwordConfirm) {
            setSignupError(true);
            return;
        }
        await Axios.post("http://localhost:3001/api/users", {
            name: displayName,
            email: email,
            password: password,
        }).then((result) => {
            console.log(result);
            onLogin();
            handleClose();
            console.log("Signup successful");
        }).catch((e) => {
            console.log(e);
            setSignupError(true);
        })
    }

    return (
        <Dialog open={open} onClose={handleClose}>
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
                {signupError && <Alert severity="error">There was an error signing up</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSignup}>Signup</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SignupDialog;