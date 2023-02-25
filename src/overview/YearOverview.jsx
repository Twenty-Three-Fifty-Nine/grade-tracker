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

import React, { useEffect } from 'react';
import {
    Alert,
    Box,
    Stack,
} from '@mui/material';

import { getLetterGrade } from '../classes/Course';
import { isMobile } from "react-device-detect";
import { SessionContext } from './GradesOverview';
import TrimesterOverview from './TrimesterOverview';

const YearOverview = (props) => {
    const {
        setViewedCourse,
    } = props;
    
    const session = React.useContext(SessionContext);

    const [accordionsOpen, setAccordionsOpen] = React.useState([false, false, false]);

    useEffect(() => {
        if (session && session !== "Reloading") setAccordionsOpen([getTriInfo(1).isActive, getTriInfo(2).isActive, getTriInfo(3).isActive]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

    const toggleAccordion = (tri) => {
        const tempOpen = [...accordionsOpen];
        tempOpen[tri - 1] = !tempOpen[tri - 1];
        setAccordionsOpen([...tempOpen]);
    }

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

    const getGPA = () => {
        const trimesters = session && session !== "Reloading" ? session.courses[session.timeInfo.selectedYear] : null;
        if (!trimesters) return null;
        
        let totalGrade = 0;
        let totalCourses = 0;
        trimesters.forEach(trimester => {
            trimester.forEach(course => {
                totalGrade += course.totalGrade;
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

            <Alert severity="info" sx={{ mt: 1, mb: isMobile ? 10 : 2 }}> Current GPA for the Year: {getGPA()} </Alert>
        </Box>
    )
}

export default YearOverview;