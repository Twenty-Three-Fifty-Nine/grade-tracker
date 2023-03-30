import React from "react";
import {
    Box,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import ClickAwayListener from '@mui/base/ClickAwayListener';
import { isMobile } from "react-device-detect";

const AssessmentViewerGrades = (props) => {
    const {
        assData,
        filter,
        getAssessmentLetter,
        handleGradeChange,
    } = props;

    // Tracks last value for this field since last filter.
    const [lastValue, setLastValue] = React.useState(assData.grade);

    /** @returns Color of the grade letter box. */
    const getGradeColor = () => {
        if (isNaN(assData.grade) || parseInt(assData.grade) === -1) return "grey";
        if (assData.gradeValid) return "primary.main";
        return "error.main";
    };

    /** Filters assessment list when user is done editing a grade. */
    const handleClickAway = () => {
        if(assData.grade.toString() === lastValue.toString()) return;
        setLastValue(assData.grade);
        filter();
    }

    return (
        <Stack direction={ isMobile ? "column" : "row" }>
            <Divider orientation={ isMobile ? "horizontal" : "vertical" } flexItem={!isMobile} 
                sx={{ borderRightWidth: isMobile ? 0 : 3, mr: isMobile ? 0 : 5, ml: isMobile ? 0 : 2, height: isMobile ? 0 : "100%" }} 
            />

            <Stack spacing={1} sx={{ pr: 0, minWidth: isMobile ? 0 : 290, mt: isMobile ? 1 : 0 }}>
                <Typography variant={"h5"} component="div" sx={{ flex: 1 }}>
                    Grade (%)
                </Typography>

                <Stack direction="row">
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <TextField InputProps={{ inputProps: { min: 0 }, style: { fontSize: 35 } }} 
                            value={ isNaN(assData.grade) || parseInt(assData.grade) === -1 ? "" : assData.grade } 
                            error={!assData.gradeValid} onChange={handleGradeChange} sx={{ fontSize:"large", width: isMobile ? 200 : 180 }} 
                        />
                    </ClickAwayListener>
                    <Box sx={{ mt: 0, ml: 3, border: 2, p: 1.4, borderRadius: 1, width: 85, color: getGradeColor() }}>
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