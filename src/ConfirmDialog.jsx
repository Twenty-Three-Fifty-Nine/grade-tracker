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

import React from "react";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";

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