import React, { useCallback } from "react";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton
} from "@mui/material";
import Axios from "axios";
import Cookies from 'universal-cookie';
import CloseIcon from '@mui/icons-material/Close';

const LoginDialog = (props) => {
    const { onClose, open, setIsLoggedIn, setUserDetails, activeTri } = props;

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loginError, setLoginError] = React.useState(false);

    const handleClose = useCallback(() => {
        onClose();
        setLoginError(false);
    }, [onClose]);

    const handleLogin = useCallback(async () => {
        await Axios.post(
            "https://b0d0rkqp47.execute-api.ap-southeast-2.amazonaws.com/test/users/authorise",
            {
                email: email,
                password: password,
                activeTri: activeTri
            }
        )
            .then((result) => {
                setIsLoggedIn(true);
                setUserDetails(result.data);
                new Cookies().set("userDetails", result.data, { path: '/', sameSite: 'strict' });
                handleClose();
            })
            .catch((e) => {
                setLoginError(true);
            });
    }, [email, password, activeTri, setIsLoggedIn, setUserDetails, handleClose]);

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === "Enter") {
                handleLogin();
            }
        },
        [handleLogin]
    );

    return (
        <Dialog open={open} onClose={handleClose} onKeyDown={handleKeyDown}>
            <DialogTitle>Login</DialogTitle>
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
                    <Alert severity="error"
                        action={
                            <IconButton color="inherit" size="small"
                            onClick={() => {
                                setLoginError(false);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
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
