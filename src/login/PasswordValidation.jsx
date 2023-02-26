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
} from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/** Displays whether a given password is valid or not. */
const PasswordValidation = (props) => {
    const {
        validPasswordCapital,
        validPasswordLength,
        validPasswordMatch,
        validPasswordNumber,
        validPasswordSpecial,
    } = props;
    
    return (
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Check check={validPasswordLength} text={"Password must be at least 8 characters long"} />
            <Check check={validPasswordNumber} text={"Password must contain at least one number"} />
            <Check check={validPasswordCapital} text={"Password must contain at least one capital letter"} />
            <Check check={validPasswordSpecial} text={"Password must contain at least one special character"} />
            <Check check={validPasswordMatch} text={"Password must match"} />
        </Box>
    );
};

/** Used by the password validation component to display each condition. */
const Check = (props) => {
    const {
        check,
        text,
    } = props;

    return (
        <Typography variant="body2" sx={{ display: "flex", gap: 0.5, alignItems: "center" }}> 
            { check ? <CheckCircleIcon sx={{ color: "passing.main" }} /> : <CancelIcon sx={{ color: "error.main" }} /> } 
            {text} 
        </Typography>
    );
};

export default PasswordValidation;