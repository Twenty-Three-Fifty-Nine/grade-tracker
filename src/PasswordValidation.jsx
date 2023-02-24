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
    Typography,
} from '@mui/material';

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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