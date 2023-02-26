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
    Collapse,
    Dialog,
    DialogTitle,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import Axios from "axios";

import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

/** Allows the user to delete their account. */
const DeleteAccountDialog = (props) => {
    const {
        confirmDeleteAccount,
        handleLogout,
        sessionData,
        setConfirmDeleteAccount,
        userDetails,
    } = props;

    // Password related states.
    const [deletePassword, setDeletePassword] = React.useState("");
    const [showDeletePassword, setShowDeletePassword] = React.useState(false);

    // Displays an alert if the value is non-null.
    const [apiAlert, setApiAlert] = React.useState(null);

    /** Deletes the user from the database and logs them out. */
    const deleteUser = useCallback(async () => {
        await Axios.delete("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/" + userDetails.email, 
            { data: {
                password: deletePassword, 
                email: userDetails.email.toLowerCase(),
                activeTri: sessionData.timeInfo.activeTri
            }}
        ).then((response) => {
            if(response.status === 200) handleLogout();
        }).catch((error) => setApiAlert("Incorrect password"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deletePassword, handleLogout, userDetails.email]);

    return (
        <Dialog onClose={() => { setConfirmDeleteAccount(false); setDeletePassword(""); setShowDeletePassword(false); }} open={confirmDeleteAccount}>
            <Stack sx={{ pr: 5, pl: 5 }}>
                <DialogTitle sx={{ textAlign:"center", pb: 2 }}> Delete your account? </DialogTitle>

                <Typography sx={{ textAlign:"center", maxWidth: 300}}>
                    This action CANNOT be reverted. You will lose all of your data and be unable to retrieve it.
                </Typography>
                <TextField margin="dense" id="password" label="Password" type={showDeletePassword ? "text" : "password"}
                    fullWidth value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)}
                    InputProps={{endAdornment: 
                        <InputAdornment position="end">
                            <IconButton onClick={() => {setShowDeletePassword(!showDeletePassword)}} tabIndex={-1}>
                                { showDeletePassword ? <VisibilityOff /> : <Visibility /> }
                            </IconButton>
                        </InputAdornment>
                    }}
                />

                <Collapse in={apiAlert !== null}>
                    <Alert severity="error" sx={{ mt: 2 }} 
                        action= {
                            <IconButton onClick={() => setApiAlert(null)}>
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        }
                    >
                        {apiAlert}
                    </Alert>
                </Collapse>
                
                <Stack spacing={2} direction="row" sx={{ margin:"auto", pt: 3, pb: 3 }}>
                    <Button onClick={() => {setConfirmDeleteAccount(false); setDeletePassword(""); setShowDeletePassword(false); }} variant="outlined">
                        Cancel
                    </Button>
                    <Box sx={{ position: "relative" }}>
                        <Button onClick={deleteUser} variant="contained"> Delete </Button>
                    </Box>
                </Stack>
            </Stack>
        </Dialog>
    );
};

export default DeleteAccountDialog;