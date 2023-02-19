import React from "react";
import { Box, Typography } from '@mui/material';

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const PasswordValidation = (props) => {
    const { validPasswordLength, validPasswordNumber, validPasswordSpecial, validPasswordCapital, validPasswordMatch } = props;
    
    return (
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="body2" sx={{ display: "flex", gap: 0.5, alignItems: "center"}}>{validPasswordLength ? <CheckCircleIcon sx={{color:'passing.main'}} /> : <CancelIcon sx={{color:'error.main'}} /> }Password must be at least 8 characters long</Typography>
            <Typography variant="body2" sx={{ display: "flex", gap: 0.5, alignItems: "center"}}>{validPasswordNumber ? <CheckCircleIcon sx={{color:'passing.main'}} /> : <CancelIcon sx={{color:'error.main'}} /> }Password must contain at least one number</Typography>
            <Typography variant="body2" sx={{ display: "flex", gap: 0.5, alignItems: "center"}}>{validPasswordCapital ? <CheckCircleIcon sx={{color:'passing.main'}} /> : <CancelIcon sx={{color:'error.main'}} /> }Password must contain at least one capital letter</Typography>
            <Typography variant="body2" sx={{ display: "flex", gap: 0.5, alignItems: "center"}}>{validPasswordSpecial ? <CheckCircleIcon sx={{color:'passing.main'}} /> : <CancelIcon sx={{color:'error.main'}} /> }Password must contain at least one special character</Typography>
            <Typography variant="body2" sx={{ display: "flex", gap: 0.5, alignItems: "center"}}>{validPasswordMatch ? <CheckCircleIcon sx={{color:'passing.main'}} /> : <CancelIcon sx={{color:'error.main'}} /> }Password must match</Typography>
        </Box>
    );
}

export default PasswordValidation;