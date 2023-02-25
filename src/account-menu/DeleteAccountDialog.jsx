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

const DeleteAccountDialog = (props) => {
    const {
        confirmDeleteAccount,
        handleLogout,
        sessionData,
        setConfirmDeleteAccount,
        userDetails,
    } = props;

    const [deletePassword, setDeletePassword] = React.useState("");
    const [showDeletePassword, setShowDeletePassword] = React.useState(false);

    const [apiAlert, setApiAlert] = React.useState(null);

    const deleteUser = useCallback(async () => {
        await Axios.delete("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/" + userDetails.email, 
            {data: {
                password: deletePassword, 
                email: userDetails.email.toLowerCase(),
                activeTri: sessionData.timeInfo.activeTri, 
            }}
        ).then((response) => {
                if(response.status === 200) handleLogout();
        }).catch((error) => {
            setApiAlert("Incorrect password");
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deletePassword, handleLogout, userDetails.email]);

    return (
        <Dialog onClose={() => {setConfirmDeleteAccount(false); setDeletePassword(""); setShowDeletePassword(false);}} open={confirmDeleteAccount} >
            <Stack sx={{pr: 5, pl: 5}}>
                <DialogTitle sx={{ textAlign:"center", paddingBottom: 2}}>
                    Delete your account?
                </DialogTitle>
                <Typography sx={{ textAlign:"center", maxWidth: 300}}>
                    This action CANNOT be reverted. You will lose all of your data and be unable to retrieve it.
                </Typography>
                <TextField
                    margin="dense"
                    id="password"
                    label="Password"
                    type={showDeletePassword ? 'text' : 'password'}
                    InputProps={{endAdornment: 
                        <InputAdornment position="end">
                            <IconButton onClick={() => {setShowDeletePassword(!showDeletePassword)}} tabIndex={-1}>
                                {showDeletePassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }}
                    fullWidth
                    value={deletePassword}
                    onChange={(e) => {
                        setDeletePassword(e.target.value);
                    }}
                />
                { <Collapse in={apiAlert !== null}><Alert severity="error" sx={{ mt: 2 }} action={<IconButton onClick={() => setApiAlert(null)}><CloseIcon fontSize="small"/></IconButton>}>{apiAlert}</Alert></Collapse> }
                <Stack spacing={2} direction="row" sx={{ margin:"auto", paddingTop: 3, paddingBottom: 3 }}>
                    <Button onClick={() => {setConfirmDeleteAccount(false); setDeletePassword(""); setShowDeletePassword(false);}} variant="outlined">Cancel</Button>
                    <Box sx={{ position: 'relative' }}>
                        <Button onClick={deleteUser} variant="contained"> Delete </Button>
                    </Box>
                </Stack>
            </Stack>
        </Dialog>
    )
}

export default DeleteAccountDialog;