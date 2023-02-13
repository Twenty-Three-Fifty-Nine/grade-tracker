import React from 'react';
import { Dialog, DialogTitle, Stack, Typography, Button } from '@mui/material';

const ConfirmDialog = (props) => {
    const { open, handleClose, message, subMessage, confirmAction } = props;

    return (
        <>
        <Dialog onClose={handleClose} open={open} >
            <Stack sx={{pr: 5, pl: 5}}>
                <DialogTitle sx={{ textAlign:"center", paddingBottom: 2}}>
                    {message}
                </DialogTitle>
                <Typography>
                    {subMessage}
                </Typography>
                <Stack spacing={2} direction="row" sx={{ margin:"auto", paddingTop: 3, paddingBottom: 3 }}>
                    <Button onClick={handleClose} variant="outlined">Cancel</Button>
                    <Button onClick={confirmAction} variant="contained">Delete</Button>
                </Stack>
            </Stack>
        </Dialog>
        </>
    );
}

export default ConfirmDialog