import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

import LaunchIcon from "@mui/icons-material/Launch";

const DonationDialog = (props) => {
    const {
        dialogOpen,
        handleDialogClose
    } = props;

    return (
        <Dialog open={dialogOpen} onClose={handleDialogClose} minWidth="sm" fullWidth>
            <DialogTitle>Donate</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    You can donate to the project by clicking the button below.
                    This website is completly free to use and donations aren't necessary.
                    Any donations will be greatly appreciated and will be used for the benefit of the project (such as hosting).
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Close</Button>
                <Button onClick={() => {
                    handleDialogClose();
                    window.open("https://ko-fi.com/twentythreefiftynine", "_blank");
                }} >
                    Donate <LaunchIcon fontSize="small" sx={{ ml: 1, mt: -0.4 }} />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DonationDialog;