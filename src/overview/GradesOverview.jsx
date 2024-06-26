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

import React, { useCallback } from "react";
import {
    Box,
    Fab,
    Stack,
    Tab,
    Tabs,
    Tooltip,
} from "@mui/material";

import AddCourseDialog from "../course-manipulation/AddCourseDialog";
import Assessment from "../classes/Assessment";
import Axios from "axios";
import Course from "../classes/Course";
import { isMobile } from "react-device-detect";
import YearOverview from "./YearOverview";

import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
const TranscriptDialog = React.lazy(() => import("../TranscriptDialog"));

/**
 * One of the 3 main pages of the application. This displays an overview 
 * of the users years, trimesters, and the courses that they are taking. Through this menu
 * they can add or create new courses, as well as manage their account. 
 */
const GradesOverview = (props) => {
    const {
        accordionsOpen,
        activateTab,
        activeTri,
        courseList,
        selectedYear,
        sessionData,
        setAccordionsOpen,
        setActivateTab,
        setCourseList,
        setSessionData,
        setUpdatedYear,
        setViewAssessments,
        setViewedCourse,
        setYear,
        updatedYear,
        userEmail,
        userName,
        verifiedEmail,
    } = props;

    // Tracks if other dialogs or screens are open.
    const [addCourseOpen, setAddCourseOpen] = React.useState(false);
    const [courseCreator, setCourseCreator] = React.useState(false);
    const [createTranscriptOpen, setCreateTranscriptOpen] = React.useState(false);

    /** Stops the year tab value from being loaded before the tabs exist. */
    setTimeout(() => {
        setActivateTab(true)
    }, 500);

    /**
     * Makes an API request to get the users courses and then converts
     * them to a data structure that can be read by the rest of the components. 
     * 
     * @param request - The request to be made to the server.
     */
    const parseCourseData = useCallback(async (request) => {
        return Axios.get(request).then(async (result) => {
            const ret = {};
            if (result.data[0] === undefined) return ret;
            for (const yearPair of result.data) {
                ret[yearPair.year] = [[], [], []];
                for (const courseData of yearPair.courses) {
                    let assessments = courseData.assignments.map((assessment) => 
                        new Assessment(
                            assessment.name, 
                            assessment.weight, 
                            assessment.grade, 
                            assessment.dueDate, 
                            assessment.isAssignment,
                            false,
                            true
                        )
                    );

                    const course = new Course(
                        courseData.courseCode,
                        courseData.courseName,
                        courseData.url,
                        assessments,
                        courseData.totalGrade,
                        courseData.lastUpdated,
                        courseData.lastSynced,
                        courseData.trimester,
                        yearPair.year
                    );

                    ret[yearPair.year][courseData.trimester - 1].push(course);
                    ret[yearPair.year][courseData.trimester - 1].sort((a, b) => a.code.localeCompare(b.code));
                };
            };

            return ret;
        });
    }, []);

    /**
     * Calls parse course data and then creates an object with additional information,
     * 
     * @param year - The currently selected year. 
     */
    const getSessionData = useCallback(async (year) => {
        await setSessionData("Reloading");
        return parseCourseData("https://api.twentythreefiftynine.com/users/" + userEmail + "/courses").then((courseData) => {
            return {
                userData: { email: userEmail, displayName: userName, verifiedEmail },
                timeInfo: { activeTri, selectedYear: year },
                courses: courseData
            };
        });
    }, [activeTri, parseCourseData, setSessionData, userEmail, userName, verifiedEmail]);

    /** 
     * Calls the session data getter then sets the session data state to the object 
     * so it can be sent to other objects as a context. 
     */
    const handleLoadData = useCallback(async () => {
        getSessionData(selectedYear).then((data) => setSessionData(data));
    }, [getSessionData, selectedYear, setSessionData]);

    /** Loads session data if the value of it is null when this component is mounted. */
    React.useEffect(() => {
        if (!sessionData) handleLoadData();
    }, [handleLoadData, sessionData]);

    /**
     * Changes the selected year value.
     * 
     * @param event The change event. 
     * @param newValue The new value (year). 
     */
    const handleChangedYear = async (event, newValue) => {
        if (selectedYear !== newValue) setUpdatedYear(true);
        setYear(newValue);
        const tempData = sessionData;
        tempData.timeInfo.selectedYear = newValue;
        setSessionData(tempData);
    };

    return (
        <Box>        
            {   !courseCreator &&
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    {   sessionData && sessionData !== "Reloading" ? 
                        <Tabs value={selectedYear} onChange={handleChangedYear}>
                            {activateTab && Object.entries(sessionData.courses).map(([key, value]) => <Tab key={key} value={parseInt(key)} label={key} />)}
                        </Tabs>
                    : null }
                </Box>
            }

            <Box sx={{ mt: 2 }}>
                <SessionContext.Provider value={ sessionData !== null ? sessionData : "Reloading" }>
                    {   !courseCreator && 
                        <Box>
                            <YearOverview setViewedCourse={setViewedCourse} updatedYear={updatedYear} setUpdatedYear={setUpdatedYear} 
                                accordionsOpen={accordionsOpen} setAccordionsOpen={setAccordionsOpen} setViewAssessments={setViewAssessments} />

                            <Stack spacing={ 2 } direction={ isMobile ? "row" : "column" }
                                sx={{ position: "fixed", bottom: isMobile ? 16 : 32, right: isMobile ? "50%" : 32, mr: isMobile ? -3.5 : 0, zIndex: 2, alignItems: "center" }}
                            >
                                <Tooltip title={isMobile ? "" : <h3> Create a transcript </h3>} placement="left" arrow>
                                    <Fab color="secondary" size="small" onClick={() => setCreateTranscriptOpen(true)}>
                                        <DescriptionIcon />
                                    </Fab>
                                </Tooltip>
                                <Tooltip title={isMobile ? "" : <h3> Add a new course </h3>} placement="left" arrow>
                                    <Fab color="primary" size={ "large" } onClick={() => setAddCourseOpen(true)} disabled={selectedYear !== activeTri.year}>
                                        <AddIcon />
                                    </Fab>
                                </Tooltip>
                            </Stack>
                        </Box>
                    }

                    <AddCourseDialog open={addCourseOpen} onClose={() => setAddCourseOpen(false)} activeTri={activeTri} updateData={handleLoadData} 
                        courseList={courseList} setCourseList={setCourseList} courseCreator={courseCreator} setCourseCreator={setCourseCreator}
                    />

                    <TranscriptDialog open={createTranscriptOpen} onClose={() => setCreateTranscriptOpen(false)} sessionData={sessionData}/>
                </SessionContext.Provider> 
            </Box>
        </Box>
    );
};

export default GradesOverview;
export const SessionContext = React.createContext();