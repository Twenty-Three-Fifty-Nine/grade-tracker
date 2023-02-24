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
    Typography,
    Snackbar,
    Collapse,
    CircularProgress,
    Box, 
    InputAdornment 
} from "@mui/material";
import Axios from "axios";
import Cookies from "universal-cookie";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginDialog = (props) => {
    const { onClose, open, setIsLoggedIn, setUserDetails, activeTri } = props;

    const [loginState, setLoginState] = React.useState(true);

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loginError, setLoginError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const [resetPasswordSuccess, setResetPasswordSuccess] = React.useState(false);

    const handleClose = useCallback(() => {
        onClose();
        setLoginError(null);
        setLoginState(true);
        setEmail("");
        setPassword("");
        setShowPassword(false);
    }, [onClose]);

    const handleLogin = useCallback(async () => {
        setLoading(true);

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
        setLoading(false);
    }, [email, password, activeTri, setIsLoggedIn, setUserDetails, handleClose]);

    const handleForgotPassword = useCallback(() => {
        setLoginState(false);
    }, []);

    const handlePasswordReset = useCallback(() => {
        setLoading(true);

        Axios.post(
            "https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/password/forgot",
            {
                email: email,
            }
        )
            .then((result) => {
                setLoading(false);
                setResetPasswordSuccess(true);
                handleClose();
            })
            .catch((e) => {
                setLoading(false);
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
        <Dialog open={open} onClose={() => {loginState ? handleClose() : setLoginState(true)}} onKeyDown={handleKeyDown} fullWidth maxWidth="xs">
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
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{endAdornment: 
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => {setShowPassword(!showPassword)}} tabIndex={-1}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }}
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
                <Box sx={{ position: 'relative' }}>
                    <Button onClick={handleLogin} disabled={loading}>Login</Button>
                    {loading &&
                        <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px', }} />
                    }
                </Box>
                </>
                ) : (
                <>
                    <Button onClick={() => setLoginState(true)}>Cancel</Button>
                    <Box sx={{ position: 'relative' }}>
                        <Button onClick={handlePasswordReset} disabled={loading}>Reset Password</Button>
                        {loading &&
                            <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px', }} />
                        }
                    </Box>
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
