import React from 'react';
import { Dialog, DialogTitle, Stack, Typography, Button, Box, CircularProgress } from '@mui/material';

const ConfirmDialog = (props) => {
    const { open, handleClose, message, subMessage, confirmAction, buttonText, loading } = props;

    return (
        <>
        <Dialog onClose={handleClose} open={open} >
            <Stack sx={{pr: 5, pl: 5}}>
                <DialogTitle sx={{ textAlign:"center", paddingBottom: 2}}>
                    {message}
                </DialogTitle>
                <Typography sx={{ textAlign:"center"}}>
                    {subMessage}
                </Typography>
                <Stack spacing={2} direction="row" sx={{ margin:"auto", paddingTop: 3, paddingBottom: 3 }}>
                    {confirmAction && <Button onClick={handleClose} variant="outlined">Cancel</Button>}
                    <Box sx={{ position: 'relative' }}>
                        <Button onClick={confirmAction ? confirmAction : handleClose} disabled={loading} variant="contained">{buttonText}</Button>
                        {loading &&
                            <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px', }} />
                        }
                    </Box>
                </Stack>
            </Stack>
        </Dialog>
        </>
    );
}

export default ConfirmDialog