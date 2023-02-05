import React, { useCallback } from "react";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material";
import Axios from "axios";

const LoginDialog = (props) => {
    const { onClose, open, setIsLoggedIn, setUserDetails } = props;

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loginError, setLoginError] = React.useState(false);

    const handleClose = useCallback(() => {
        onClose();
        setLoginError(false);
    }, [onClose]);

    const handleLogin = useCallback(async () => {
        await Axios.post("http://localhost:3001/api/authorise", {
            email: email,
            password: password,
        })
            .then((result) => {
                setIsLoggedIn(true);
                setUserDetails(result.data);
                handleClose();
            })
            .catch((e) => {
                setLoginError(true);
            });
    }, [email, password, setIsLoggedIn, handleClose, setUserDetails]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                <DialogContentText>Login to your account</DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <TextField
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                {loginError && (
                    <Alert severity="error">
                        There was an error logging in
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleLogin}>Login</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginDialog;
