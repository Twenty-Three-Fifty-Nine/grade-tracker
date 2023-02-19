import React from 'react';
import { AppBar, Box, Dialog, IconButton, Toolbar, Icon, Typography, } from '@mui/material';
import { isMobile } from "react-device-detect";

const SyncDialog = (props) => {
    const { onClose, open, courseData} = props;

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <AppBar position="fixed" component="nav">
                <Toolbar>
                    <IconButton color="inherit" onClick={onClose}>
                        <Icon>close</Icon>
                    </IconButton>
                    <Typography sx={{ paddingLeft: 1 }} variant={isMobile ? "body1" : "h6"}> { courseData ? "Syncing " + courseData.code + " to it's template" : "" } </Typography>
                </Toolbar>
            </AppBar>
            <Box>
                
            </Box>
        </Dialog>
    )
}

export default SyncDialog;
