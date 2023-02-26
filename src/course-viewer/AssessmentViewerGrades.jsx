import React from "react";
import {
    Box,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { isMobile } from "react-device-detect";

const AssessmentViewerGrades = (props) => {
    const {
        assData,
        handleGradeChange,
        getAssessmentLetter,
    } = props;

    const getGradeColor = () => {
        if (isNaN(assData.grade) || parseInt(assData.grade) === -1) return "grey";
        if (assData.gradeValid) return "primary.main";
        return "error.main";
    };

    return (
        <Stack direction={ isMobile ? "column" : "row" }>
            <Divider orientation={ isMobile ? "horizontal" : "vertical" } flexItem={!isMobile} 
                sx={{ borderRightWidth: isMobile ? 0 : 3, mr: isMobile ? 0 : 5, ml: isMobile ? 0 : 2, height: isMobile ? 0 : "100%" }} 
            />

            <Stack spacing={1} sx={{ pr: 0, minWidth: isMobile ? 0 : 290, mt: isMobile ? 1 : 0 }}>
                <Typography variant={"h5"} component="div" sx={{ flex: 1 }}>
                    { isMobile ? "Grade:" : "Grade" }
                </Typography>

                <Stack direction="row">
                    <TextField InputProps={{ inputProps: { min: 0 }, style: { fontSize: 35 } }} 
                        value={ isNaN(assData.grade) || parseInt(assData.grade) === -1 ? "" : assData.grade } 
                        error={!assData.gradeValid} onChange={handleGradeChange} sx={{ fontSize:"large", width: isMobile ? 180 : 150 }} 
                    />
                    <Box sx={{ mt: 0, ml: 3, border: 2, p: 1.4, borderRadius: 1, minWidth: 85, color: getGradeColor() }}>
                        <Typography variant={"h3"} component="div" sx={{ textAlign:"center" }}>
                            {getAssessmentLetter()}
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default AssessmentViewerGrades;