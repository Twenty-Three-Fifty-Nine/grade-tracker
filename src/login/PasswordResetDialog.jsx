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
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField,
} from "@mui/material";

import Axios from "axios";
import Cookies from "universal-cookie";
import PasswordValidation from "./PasswordValidation";

import CloseIcon from "@mui/icons-material/Close";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PasswordResetDialog = (props) => {
    const {
        onClose,
        resetData,
        setIsLoggedIn,
        setUserDetails,
    } = props;

    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");

    const [validPasswordLength, setValidPasswordLength] = React.useState(false);
    const [validPasswordNumber, setValidPasswordNumber] = React.useState(false);
    const [validPasswordSpecial, setValidPasswordSpecial] = React.useState(false);
    const [validPasswordCapital, setValidPasswordCapital] = React.useState(false);
    const [validPasswordMatch, setValidPasswordMatch] = React.useState(false);

    const [resetPasswordSuccess, setResetPasswordSuccess] = React.useState(false);
    const [resetPasswordError, setResetPasswordError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

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

    const handleClose = useCallback(() => {
        onClose();
        setPassword("");
        setPasswordConfirm("");
        setValidPasswordLength(false);
        setValidPasswordNumber(false);
        setValidPasswordSpecial(false);
        setValidPasswordCapital(false);
        setValidPasswordMatch(false);
        setResetPasswordSuccess(false);
        setResetPasswordError(false);
        setShowPassword(false);
    }, [onClose]);

    const resetPassword = useCallback(async () => {
        setLoading(true);

        await Axios.post("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/password/reset", {
            email: resetData.email.toLowerCase(),
            token: resetData.token,
            password,
        }).then((response) => {
            setIsLoggedIn(true);
            const data = response.data;
            setUserDetails(data);
            new Cookies().set("userDetails", data, {
                path: "/",
                sameSite: "strict",
            });
            handleClose();
            setResetPasswordSuccess(true);
            setResetPasswordError(false);
        }).catch((e) => {
            setResetPasswordError(true);
            setResetPasswordSuccess(false);
        });

        setLoading(false);
    }, [resetData, password, setIsLoggedIn, setUserDetails, handleClose]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter") {
            if (validPasswordLength && validPasswordNumber && validPasswordSpecial && 
               validPasswordCapital && validPasswordMatch) 
                resetPassword();
        }
    }, [validPasswordLength, validPasswordNumber, validPasswordSpecial, validPasswordCapital, validPasswordMatch, resetPassword]);

    return (
        <Box>
            <Dialog open={resetData !== null} onClose={handleClose} onKeyDown={handleKeyDown}>
                <DialogTitle>Reset Password</DialogTitle>

                <DialogContent>
                    <TextField autoFocus id="password" label="Password" type={showPassword ? 'text' : 'password'}
                        fullWidth value={password} onChange={handlePasswordChange} margin="dense"
                        InputProps={{endAdornment: 
                            <InputAdornment position="end">
                                <IconButton onClick={() => {setShowPassword(!showPassword)}} tabIndex={-1}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                    <TextField margin="dense" id="confirmPassword" label="Confirm Password" type={showPassword ? 'text' : 'password'}
                        fullWidth value={passwordConfirm} onChange={handlePasswordConfirmChange}
                    />
                    
                    <PasswordValidation validPasswordLength={validPasswordLength} validPasswordNumber={validPasswordNumber}
                        validPasswordSpecial={validPasswordSpecial} validPasswordCapital={validPasswordCapital} validPasswordMatch={validPasswordMatch}
                    />

                    <Collapse in={resetPasswordError}>
                        <Alert severity="error" sx={{ width: "100%", mt: 2 }}
                            action={
                                <IconButton color="inherit" size="small"
                                    onClick={() => setResetPasswordError(false)}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            Password reset failed
                        </Alert>
                    </Collapse>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary"> Cancel </Button>

                    <Box sx={{ position: 'relative' }}>
                        <Button onClick={resetPassword} color="primary"
                            disabled= {
                                !( validPasswordLength && validPasswordNumber && validPasswordSpecial &&
                                   validPasswordCapital && validPasswordMatch) || loading
                            }
                        >
                            Reset Password
                        </Button>
                        {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px', }} />}
                    </Box>
                </DialogActions>
            </Dialog>

            <Snackbar open={resetPasswordSuccess} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                    Password reset successfully
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PasswordResetDialog;
