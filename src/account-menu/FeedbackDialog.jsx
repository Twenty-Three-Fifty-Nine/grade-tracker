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
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";

import Axios from "axios";
import { isMobile } from "react-device-detect";

import CloseIcon from "@mui/icons-material/Close";

/** Allows the user to send feedback. */
const FeedbackDialog = (props) => {
    const {
        confirmDeleteAccount,
        feedbackDialogOpen,
        setFeedbackDialogOpen,
        setSnackbarMessage,
        userDetails,
    } = props;

    // Feedback information.
    const [feedbackSubject, setFeedbackSubject] = React.useState(null);
    const [feedbackMessage, setFeedbackMessage] = React.useState(null);
    const [feedbackType, setFeedbackType] = React.useState(userDetails.verifiedEmail ? "suggestion" : "support");
    
    // States for visual feedback when the form is being used.
    const [loading, setLoading] = React.useState(false);
    const [apiAlert, setApiAlert] = React.useState(null);

    /** Closes the feedback dialog. */
    const handleFeedbackDialogClose = useCallback(() => {
        setFeedbackDialogOpen(false);
        setFeedbackSubject(null);
        setFeedbackMessage(null);
        setFeedbackType(userDetails.verifiedEmail ? "suggestion" : "support");
        setApiAlert(null);
    }, [setFeedbackDialogOpen, userDetails.verifiedEmail]);
    
    /** Attempts to send the feedback and then displays a snackbar. */
    const sendFeedback = useCallback(async () => {
        setLoading(true);

        await Axios.post("https://api.twentythreefiftynine.com/feedback", {
            subject: feedbackSubject,
            message: feedbackMessage,
            feedbackType,
            email: userDetails.email.toLowerCase(),
            displayName: userDetails.displayName,
        }).then((response) => {
            setSnackbarMessage("Feedback sent successfully");
            handleFeedbackDialogClose();
        }).catch((error) => setApiAlert("Something went wrong"));

        setLoading(false);
    }, [feedbackMessage, feedbackSubject, feedbackType, handleFeedbackDialogClose, setApiAlert, setLoading, setSnackbarMessage, userDetails.displayName, userDetails.email]);

    /** 
     * @param field - The field to get helper text for.
     * @param content - The content of the field to check.
     * @param length - The maximum length of the content.
     * @returns Helper text for the given field. 
     */
    const getHelperText = (field, content, length) => {
        if (content === null) return "";
        if (content.length === 0) return `${field} field cannot be empty`;
        if (content.length > length) return `${field} length has to be below ${length + 1} characters`;
        return "";
    };

    return (
        <Dialog open={feedbackDialogOpen} onClose={() => handleFeedbackDialogClose()} maxWidth="sm" fullWidth>
            <DialogTitle> Send Feedback </DialogTitle>

            <DialogContent>
                <Stack direction={ isMobile ? "column" : "row" }>
                    <TextField label="Subject" sx={{ width: isMobile ? "100%" : "70%" }} margin="normal" value={ feedbackSubject ? feedbackSubject : "" } 
                        onChange={(e) => setFeedbackSubject(e.target.value)} error={feedbackSubject !== null && (feedbackSubject.length === 0 || feedbackSubject.length > 40)} 
                        helperText={ getHelperText("Subject", feedbackSubject, 40) }
                    />
                    <FormControl sx={{ width: isMobile ? "100%" : "30%", my: 2, ml: isMobile ? 0 : 2 }}>
                        <InputLabel>Type</InputLabel>
                        <Select value={feedbackType} label="Type" onChange={(e) => setFeedbackType(e.target.value)}>
                            { userDetails.verifiedEmail && <MenuItem value={"suggestion"}> Suggestion </MenuItem> }
                            { userDetails.verifiedEmail && <MenuItem value={"bug"}> Bug </MenuItem> }
                            <MenuItem value={"support"}> Support</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>

                <TextField label="Message Content" fullWidth margin="normal" value={ feedbackMessage ? feedbackMessage : "" } multiline rows={6}
                    onChange={(e) => setFeedbackMessage(e.target.value)}  error={feedbackMessage !== null && (feedbackMessage.length === 0 || feedbackMessage.length > 350)} 
                    helperText={ getHelperText("Message", feedbackMessage, 350) }
                />
                
                <Collapse in={apiAlert !== null && !confirmDeleteAccount}>
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
            </DialogContent>

            <DialogActions sx={{ px: 2 }}>
                <Button onClick={() => handleFeedbackDialogClose()}> Close </Button>
                <Box sx={{ position: "relative" }}>
                    <Button onClick={() => sendFeedback()}
                        disabled={loading || (!feedbackSubject || !feedbackMessage || feedbackSubject.length > 40 || feedbackMessage.length > 350)}
                    >
                        Send
                    </Button>
                    { loading && <CircularProgress size={24} sx={{ position: "absolute", top: "50%", left: "50%", mt: "-12px", ml: "-12px" }} /> }
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default FeedbackDialog;