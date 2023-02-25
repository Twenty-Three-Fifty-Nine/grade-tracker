import React from "react";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Stack,
} from "@mui/material";

import { isMobile } from "react-device-detect";

const CourseViewerMobileActionButtons = (props) => {
    const {
        attemptClose,
        validChanges,
        changesMade,
        apiLoading,
        saveChanges
    } = props;

    return (
        <Box>
            <Divider variant="middle" role="presentation" sx={{borderBottomWidth: 5, borderColor:"primary.main", mr: isMobile ? 3 : 10, ml: isMobile ? 3 : 10, mt: 2, mb : 2}} />

            <Stack direction="row" spacing={5} sx={{alignItems:"center", justifyContent:"center"}}>
                <Button sx={{width: 150, fontSize:"medium"}} variant="contained" onClick={attemptClose}> Return</Button>
                <Box sx={{ position: 'relative' }}>
                    <Button disabled={!validChanges || !changesMade || apiLoading} sx={{width: 150, fontSize:"medium"}} variant="contained" onClick={() => {saveChanges()}}> Save</Button>
                    {apiLoading &&
                        <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px', }} />
                    }
                </Box>
            </Stack>
        </Box>
    );
};

export default CourseViewerMobileActionButtons;