import React from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import Axios from 'axios';
import { SessionContext } from './GradesOverview';

const LoginDialog = (props) => {
    const { onClose, open } = props;
    const session = React.useContext(SessionContext);

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loginError, setLoginError] = React.useState(false);

    const handleClose = () => {
        onClose();
    }
    
    const handleLogin = async () => {
        await Axios.post("http://localhost:3001/api/user/login", {
            email: email,
            password: password
        }).then((result) => {
            session.setUserData(result.data);
            handleClose();
        }).catch((e) => {setLoginError(true)})
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Login to your account
                </DialogContentText>
                <TextField
                    autoFocus
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
                {loginError && <Alert severity="error">There was an error logging in</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={ handleClose }>Cancel</Button>
                <Button onClick={ handleLogin }>Login</Button>
            </DialogActions>
        </Dialog>
    )
}

export default LoginDialog;