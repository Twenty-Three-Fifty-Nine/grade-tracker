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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
    Box,
    Chip,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";

import CourseOverview from "./CourseOverview";
import { SessionContext } from "./GradesOverview";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/**
 * @param triInfo The current trimester information. 
 * @returns A chip based on the activity of the current trimester. 
 */
const getActiveChip = (triInfo) => {
    if (triInfo.isFinished) return <Chip label="Finished" color="secondary" sx={{ ml: 1 }} />;
    if (triInfo.isActive) return <Chip label="Current" color="success" sx={{ ml: 1 }} />;
    return <Chip label="Inactive" color="primary" sx={{ ml: 1 }} />;
};

/** An accordion which provides basic information on courses taken in a trimester. */
const TrimesterOverview = (props) => {
    const {
        open,
        setViewedCourse,
        toggleAccordion,
        triInfo,
    } = props;

    // Uses the session data object.
    const courses = React.useContext(SessionContext).courses;
    
    return (
        <Box>
            {   triInfo ?
                <Accordion expanded={open} onChange={() => toggleAccordion(triInfo.tri)} key={triInfo.tri}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography sx={{ pt: 0.5 }}> Trimester {triInfo.tri} </Typography>
                        { getActiveChip(triInfo) } 
                    </AccordionSummary>

                    <AccordionDetails>
                        <Stack spacing={2}>
                            {   courses[triInfo.year][triInfo.tri - 1][0] ?
                                courses[triInfo.year][triInfo.tri - 1].map((courseInfo) => 
                                <CourseOverview key={courseInfo.code} courseInfo={courseInfo} setViewedCourse={setViewedCourse} />) :
                                <Alert severity="warning" sx={{ mt: 1 }}> 
                                    {   triInfo.isFinished ? "No courses were taken this trimester." :
                                        "No courses added to this trimester yet." }
                                </Alert> 
                            }
                        </Stack>
                    </AccordionDetails>
                </Accordion> :
                <Skeleton variant="rounded" height={60} />
            }
        </Box>
    );
};

export default TrimesterOverview;
