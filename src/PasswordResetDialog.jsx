import React, { useCallback } from "react";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Snackbar,
    TextField,
} from "@mui/material";
import Axios from "axios";
import Cookies from "universal-cookie";
import PasswordValidation from "./PasswordValidation";

const PasswordResetDialog = (props) => {
    const { onClose, resetData, setIsLoggedIn, setUserDetails } = props;

    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");

    const [validPasswordLength, setValidPasswordLength] = React.useState(false);
    const [validPasswordNumber, setValidPasswordNumber] = React.useState(false);
    const [validPasswordSpecial, setValidPasswordSpecial] = React.useState(false);
    const [validPasswordCapital, setValidPasswordCapital] = React.useState(false);
    const [validPasswordMatch, setValidPasswordMatch] = React.useState(false);

    const [resetPasswordSuccess, setResetPasswordSuccess] = React.useState(false);
    const [resetPasswordError, setResetPasswordError] = React.useState(false);

    const handlePasswordChange = useCallback(
        (e) => {
            setPassword(e.target.value);
            setValidPasswordLength(e.target.value.length >= 8);
            setValidPasswordNumber(e.target.value.match(/\d/) !== null);
            setValidPasswordSpecial(
                e.target.value.match(/[!@#$%^&*(),.?":{}|<>]/) !== null
            );
            setValidPasswordCapital(e.target.value.match(/[A-Z]/) !== null);
            setValidPasswordMatch(
                e.target.value === passwordConfirm && e.target.value !== ""
            );
        },
        [passwordConfirm]
    );

    const handlePasswordConfirmChange = useCallback(
        (e) => {
            setPasswordConfirm(e.target.value);
            setValidPasswordMatch(
                e.target.value === password && e.target.value !== ""
            );
        },
        [password]
    );

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
    }, [onClose]);

    const resetPassword = useCallback(async () => {
        Axios.post(
            "https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/password/reset",
            {
                email: resetData.email,
                token: resetData.token,
                password,
            }
        ).then((response) => {
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
    }, [resetData, password, setIsLoggedIn, setUserDetails, handleClose]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter") {
                if (
                    validPasswordLength &&
                    validPasswordNumber &&
                    validPasswordSpecial &&
                    validPasswordCapital &&
                    validPasswordMatch
                ) {
                    resetPassword();
                }
            }
        },
        [
            validPasswordLength,
            validPasswordNumber,
            validPasswordSpecial,
            validPasswordCapital,
            validPasswordMatch,
            resetPassword,
        ]
    );
    return (
        <>
        <Dialog
            open={resetData !== null}
            onClose={handleClose}
            onKeyDown={handleKeyDown}
        >
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={handlePasswordChange}
                />
                <TextField
                    margin="dense"
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    value={passwordConfirm}
                    onChange={handlePasswordConfirmChange}
                />
                <PasswordValidation
                    validPasswordLength={validPasswordLength}
                    validPasswordNumber={validPasswordNumber}
                    validPasswordSpecial={validPasswordSpecial}
                    validPasswordCapital={validPasswordCapital}
                    validPasswordMatch={validPasswordMatch}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={onClose}
                    color="primary"
                    disabled={
                        !(
                            validPasswordLength &&
                            validPasswordNumber &&
                            validPasswordSpecial &&
                            validPasswordCapital &&
                            validPasswordMatch
                        )
                    }
                >
                    Reset Password
                </Button>
            </DialogActions>
        </Dialog>
        <Snackbar open={resetPasswordSuccess || resetPasswordError} autoHideDuration={6000} onClose={() => { if (resetPasswordSuccess) handleClose() }}>
            <Alert onClose={handleClose} severity={resetPasswordSuccess ? "success" : "error"} sx={{ width: "100%" }}>
                {resetPasswordSuccess ? "Password reset successfully" : "Password reset failed"}
            </Alert>
        </Snackbar>
        </>
    );
};

export default PasswordResetDialog;
