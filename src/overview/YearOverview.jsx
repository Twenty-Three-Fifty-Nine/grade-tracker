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

import React, { useEffect } from "react";
import {
    Alert,
    Box,
    Stack,
} from "@mui/material";

import ConfirmDialog from "../ConfirmDialog";
import { getLetterGrade } from "../classes/Course";
import { isMobile } from "react-device-detect";
import { SessionContext } from "./GradesOverview";
import TrimesterOverview from "./TrimesterOverview";

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/** Provides a basic overview of how the users year is going. */
const YearOverview = (props) => {
    const {
        setViewedCourse,
    } = props;
    
    // Uses the session data object.
    const session = React.useContext(SessionContext);

    // Tracks which trimester accordions are open.
    const [accordionsOpen, setAccordionsOpen] = React.useState([false, false, false]);

    const [gpaClicked, setGPAClicked] = React.useState(false);

    /** Resets accordion states when the session data is loading. */
    useEffect(() => {
        if (session && session !== "Reloading") setAccordionsOpen([getTriInfo(1).isActive, getTriInfo(2).isActive, getTriInfo(3).isActive]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

    /**
     * Toggles a given accordion.
     * 
     * @param tri - The trimester which determines which accordion to toggle.
     */
    const toggleAccordion = (tri) => {
        const tempOpen = [...accordionsOpen];
        tempOpen[tri - 1] = !tempOpen[tri - 1];
        setAccordionsOpen([...tempOpen]);
    }

    /**
     * @param tri - The trimester to get information about. 
     * @returns An object with information about the trimester.
     */
    const getTriInfo = (tri) => {
        const timeInfo = session && session !== "Reloading" ? session.timeInfo : null;
        if (!timeInfo) return null;
        return {
            tri,
            year: timeInfo.selectedYear,
            isActive: timeInfo.selectedYear === timeInfo.activeTri.year && tri === timeInfo.activeTri.tri,
            isFinished: timeInfo.selectedYear < timeInfo.activeTri.year || (timeInfo.selectedYear === timeInfo.activeTri.year && tri < timeInfo.activeTri.tri)
        };
    }

    /** Gets the GPA for a year based on the courses in the year. */
    const getGPA = () => {
        const trimesters = session && session !== "Reloading" ? session.courses[session.timeInfo.selectedYear] : null;
        if (!trimesters) return null;
        
        let totalGrade = 0;
        let totalCourses = 0;
        trimesters.forEach(trimester => {
            trimester.forEach(course => {
                totalGrade += parseFloat(course.totalGrade);
                totalCourses++;
            });
        });
        let gpa = (totalGrade / totalCourses);
        if (totalCourses === 0) return "N/A";
        else return getLetterGrade(gpa);
    }

    return (
        <Box>
            <Stack spacing={1}>
                <TrimesterOverview triInfo={getTriInfo(1)} open={accordionsOpen ? accordionsOpen[0] : false} toggleAccordion={toggleAccordion} setViewedCourse={setViewedCourse} />
                <TrimesterOverview triInfo={getTriInfo(2)} open={accordionsOpen ? accordionsOpen[1] : false} toggleAccordion={toggleAccordion} setViewedCourse={setViewedCourse} />
                <TrimesterOverview triInfo={getTriInfo(3)} open={accordionsOpen ? accordionsOpen[2] : false} toggleAccordion={toggleAccordion} setViewedCourse={setViewedCourse} />
            </Stack>

            <Alert severity="info" sx={{ mt: 1, mb: isMobile ? 10 : 2 }} iconMapping={{ info: <InfoOutlinedIcon sx={{ "&:hover": { cursor: "pointer" } }} onClick={() => { setGPAClicked(true) }}/> }}> Current GPA for the Year: {getGPA()} </Alert>
            <ConfirmDialog buttonText="Close" open={gpaClicked} handleClose={() => setGPAClicked(false)} message="What is GPA?"
                    subMessage="GPA, or Grade Point Average, is a numerical representation of your academic performance.
                        GPA is calculated by averaging the grades received in all courses taken during a period. A higher GPA indicates better academic performance." />
        </Box>
    )
}

export default YearOverview;