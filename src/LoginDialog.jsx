import React, { useCallback } from "react";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    Collapse,
    Box,
    Typography,
    Snackbar,
} from "@mui/material";
import Axios from "axios";
import Cookies from "universal-cookie";
import CloseIcon from "@mui/icons-material/Close";

const LoginDialog = (props) => {
    const { onClose, open, setIsLoggedIn, setUserDetails, activeTri } = props;

    const [loginState, setLoginState] = React.useState(true);

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loginError, setLoginError] = React.useState(null);

    const [resetPasswordSuccess, setResetPasswordSuccess] = React.useState(false);

    const handleClose = useCallback(() => {
        onClose();
        setLoginError(null);
        setLoginState(true);
    }, [onClose]);

    const handleLogin = useCallback(async () => {
        await Axios.post(
            "https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/authorise",
            {
                email: email,
                password: password,
                activeTri: activeTri,
            }
        )
            .then((result) => {
                setIsLoggedIn(true);
                setUserDetails(result.data);
                new Cookies().set("userDetails", result.data, {
                    path: "/",
                    sameSite: "strict",
                });
                handleClose();
            })
            .catch((e) => {
                setLoginError("There was an error logging in");
            });
    }, [
        email,
        password,
        activeTri,
        setIsLoggedIn,
        setUserDetails,
        handleClose,
    ]);

    const handleForgotPassword = useCallback(() => {
        setLoginState(false);
    }, []);

    const handlePasswordReset = useCallback(() => {

        Axios.post(
            "https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/password/forgot",
            {
                email: email,
            }
        )
            .then((result) => {
                setResetPasswordSuccess(true);
                handleClose();
            })
            .catch((e) => {
                setLoginError("There was an error resetting your password");
            });
    }, [email, handleClose]);

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === "Enter") {
                handleLogin();
            }
        },
        [handleLogin]
    );

    return (
        <>
        <Dialog open={open} onClose={handleClose} onKeyDown={handleKeyDown} fullWidth maxWidth="xs">
            <DialogTitle>{loginState ? "Login" : "Reset Passowrd"}</DialogTitle>
            <DialogContent>
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
                {loginState && (
                    <>
                        <Box>
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
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": { color: "primary.main" },
                                }}
                                onClick={handleForgotPassword}
                            >
                                Forgot Password?
                            </Typography>
                        </Box>

                        
                    </>
                )}<Collapse in={loginError !== null}>
                            <Alert
                                severity="error"
                                action={
                                    <IconButton
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setLoginError(null);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                            >
                                {loginError}
                                
                            </Alert>
                        </Collapse>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "flex-end", px: 2 }}>
                {loginState ? (
                    <>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleLogin}>Login</Button>
                </>
                ) : (
                <>
                    <Button onClick={() => setLoginState(true)}>Cancel</Button>
                    <Button onClick={handlePasswordReset}>Reset Password</Button>
                </>
                )}
            </DialogActions>
        </Dialog>
        <Snackbar open={resetPasswordSuccess} autoHideDuration={4000} onClose={() => setResetPasswordSuccess(false)}>
            <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                Password reset email sent!
            </Alert>
        </Snackbar>
        </>
    );
};

export default LoginDialog;
