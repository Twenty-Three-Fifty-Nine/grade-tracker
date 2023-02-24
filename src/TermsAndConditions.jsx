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
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
} from "@mui/material";

import { isMobile } from "react-device-detect";

const TermsAndConditions = (props) => {
    const {open, onClose} = props;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle variant={isMobile ? "h5" : "h3"} sx={{textAlign:"center"}}> Terms & Conditions </DialogTitle>
            <DialogContent sx={{ m: "auto"}}>
                <Typography> Welcome to Twenty Three Fifty Nine. Please read the following terms and conditions carefully. By using this website, you agree to be bound by the following terms and conditions. </Typography>
                
                <Divider sx={{my: 2}} />
                <Typography variant="h5"> Overview </Typography>
                <Typography> This website allows users to track their grades and assignments. By using this website, you agree to store and access your data on this website. </Typography>
                
                <Divider sx={{my: 2}} />
                <Typography variant="h5"> Privacy </Typography>
                <Typography> We take your privacy seriously. We will not sell or share your personal information with any third parties. We will only use your personal information for the purposes of providing the grade tracking service. </Typography>
            
                <Divider sx={{my: 2}} />
                <Typography variant="h5"> User Accounts </Typography>
                <Typography> To use this website, you must create a user account. You must provide accurate and complete information when creating your user account. You are responsible for maintaining the security of your account and password. You agree to immediately notify us of any unauthorized use of your account or any other breach of security. </Typography>
            
                <Divider sx={{my: 2}} />
                <Typography variant="h5"> User Data </Typography>
                <Typography> You are responsible for the accuracy and completeness of the data that you enter into the website. We are not responsible for any errors or inaccuracies in your data. </Typography>
            
                <Divider sx={{my: 2}} />
                <Typography variant="h5"> Intellectual Property </Typography>
                <Typography> The website and its content are the property of Twenty Three Fifty Nine. You may not use the website or its content for any commercial purposes without our prior written consent. </Typography>
            
                <Divider sx={{my: 2}} />
                <Typography variant="h5"> Limitation of Liability </Typography>
                <Typography> We are not responsible for any loss or damage resulting from the use of this website, including but not limited to, loss of data or interruptions in service. We are not liable for any indirect, incidental, or consequential damages arising out of the use of this website. </Typography>
            
                <Divider sx={{my: 2}} />
                <Typography variant="h5"> Indemnification </Typography>
                <Typography> You agree to indemnify and hold harmless Twenty Three Fifty Nine, its officers, directors, employees, and agents, from any claims, damages, or expenses arising out of the use of this website. </Typography>
            
                <Divider sx={{my: 2}} />
                <Typography variant="h5"> Modifications </Typography>
                <Typography> We may modify these terms and conditions at any time, without notice. Your continued use of this website after any modifications indicates your acceptance of the modified terms and conditions. </Typography>
            
                <Divider sx={{my: 2}} />
                <Typography variant="h5"> Termination </Typography>
                <Typography> We may terminate your access to this website at any time, for any reason, without notice. </Typography>
            
                <Divider sx={{my: 2}} />
                <Typography variant="h5"> Governing Law </Typography>
                <Typography> These terms and conditions are governed by the laws of New Zealand. Any disputes arising out of the use of this website will be resolved in accordance with the laws of New Zealand. </Typography>
                
                <br />
                <Typography> If you have any questions or concerns about these terms and conditions, please contact us at 2359gradetracker@gmail.com. </Typography>

                <Box sx={{width:"100%", display:"flex", justifyContent:"center"}}>
                    <Button onClick={onClose} variant="contained" sx={{m: 1}}> Close </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default TermsAndConditions;