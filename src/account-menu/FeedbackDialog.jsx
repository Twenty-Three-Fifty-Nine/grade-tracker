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

const FeedbackDialog = (props) => {
    const {
        confirmDeleteAccount,
        feedbackDialogOpen,
        setFeedbackDialogOpen,
        setSnackbarMessage,
        userDetails,
    } = props;

    const [feedbackSubject, setFeedbackSubject] = React.useState(null);
    const [feedbackMessage, setFeedbackMessage] = React.useState(null);
    const [feedbackType, setFeedbackType] = React.useState("suggestion");
    
    const [loading, setLoading] = React.useState(false);
    const [apiAlert, setApiAlert] = React.useState(null);

    const handleFeedbackDialogClose = useCallback(() => {
        setFeedbackDialogOpen(false);
        setFeedbackSubject(null);
        setFeedbackMessage(null);
        setFeedbackType("suggestion");
        setApiAlert(null);
    }, [setApiAlert, setFeedbackDialogOpen]);
    
    const sendFeedback = useCallback(async () => {
        setLoading(true);

        await Axios.post("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/feedback", {
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

    return (
        <Dialog open={feedbackDialogOpen} onClose={() => handleFeedbackDialogClose()} maxWidth="sm" fullWidth>
            <DialogTitle> Send Feedback </DialogTitle>

            <DialogContent>
                <Stack direction={ isMobile ? "column" : "row" }>
                    <TextField label="Subject" sx={{ width: isMobile ? "100%" : "70%" }} margin="normal" value={ feedbackSubject ? feedbackSubject : "" } 
                        onChange={(e) => setFeedbackSubject(e.target.value)} error={feedbackSubject !== null && (feedbackSubject.length === 0 || feedbackSubject.length > 40)} 
                        helperText={ feedbackSubject === null ? "" : feedbackSubject.length === 0 ? "Subject field cannot be empty" : feedbackSubject.length > 40 ? 
                            "Subject length has to be below 41 characters" : "" }
                    />
                    <FormControl sx={{ width: isMobile ? "100%" : "30%", my: 2, ml: isMobile ? 0 : 2 }}>
                        <InputLabel>Type</InputLabel>
                        <Select value={feedbackType} label="Type" onChange={(e) => setFeedbackType(e.target.value)}>
                            <MenuItem value={"suggestion"}> Suggestion </MenuItem>
                            <MenuItem value={"bug"}> Bug </MenuItem>
                            <MenuItem value={"support"}> Support</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>

                <TextField label="Message Content" fullWidth margin="normal" value={ feedbackMessage ? feedbackMessage : "" } multiline rows={6}
                    onChange={(e) => setFeedbackMessage(e.target.value)}  error={feedbackMessage !== null && (feedbackMessage.length === 0 || feedbackMessage.length > 350)} 
                    helperText={ feedbackMessage === null ? "" : feedbackMessage.length === 0 ? "Content field cannot be empty" : feedbackMessage.length > 350 ? 
                        "Message content has to be below 351 characters" : "" }
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