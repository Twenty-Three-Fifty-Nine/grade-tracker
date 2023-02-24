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
    Icon,
    Tab,
    Tabs,
    Tooltip,
    Typography,
} from "@mui/material";

import AddCourseDialog from "./AddCourseDialog";
import Axios from "axios";
import { isMobile } from "react-device-detect";
import YearOverview from "./YearOverview";
import Assessment from "./Assessment";
import Course from "./Course";

const GradesOverview = (props) => {
    const {userEmail, userName, verifiedEmail, setViewedCourse, sessionData, setSessionData, courseList, setCourseList, activeTri} = props

    const [selectedYear, setYear] = React.useState(activeTri.year);
    const [addCourseOpen, setAddCourseOpen] = React.useState(false);
    const [activateTab, setActivateTab] = React.useState(false);

    setTimeout( () => {
        setActivateTab(true)
    }, 500)

    const parseCourseData = useCallback(async (request) => {
        return Axios.get(request).then(async (result) => {
            const ret = {}
            if (result.data[0] === undefined) return ret;
            for(const yearPair of result.data){
                ret[yearPair.year] = [[], [], []];
                for (const courseData of yearPair.courses) {
                    let assessments = courseData.assignments.map((assessment) => 
                        new Assessment(
                            assessment.name, 
                            assessment.weight, 
                            assessment.grade, 
                            assessment.dueDate, 
                            assessment.isAssignment,
                            false
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
                        yearPair.year,
                    );

                    ret[yearPair.year][courseData.trimester - 1].push(course);
                    ret[yearPair.year][courseData.trimester - 1].sort((a, b) => {
                        return a.code.localeCompare(b.code);
                    });
                }
            }
            return ret;
        });
    }, []);

    const getSessionData = useCallback(async (year) => {
        console.log("Getting Session Data");
        
        await setSessionData("Reloading");
        return parseCourseData(
            "https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/" +
                userEmail +
                "/courses"
        ).then((courseData) => {
            console.log(courseData)
            return {
                userData: { email: userEmail, displayName: userName, verifiedEmail },
                timeInfo: { activeTri, selectedYear: year },
                courses: courseData,
            };
        });
    }, [activeTri, parseCourseData, setSessionData, userEmail, userName, verifiedEmail]);

    const handleLoadData = useCallback(async () => {
        getSessionData(selectedYear).then((data) => {
            setSessionData(data);
        });
    }, [getSessionData, selectedYear, setSessionData]);

    React.useEffect(() => {
        if(!sessionData) handleLoadData();
    }, [handleLoadData, sessionData]);

    const handleChangedYear = async (event, newValue) => {
        setYear(newValue);
        const tempData = sessionData;
        tempData.timeInfo.selectedYear = newValue;
        setSessionData(tempData);
    };

    const handleOpenAddCourse = () => {
        setAddCourseOpen(true);
    };

    const handleCloseAddCourse = () => {
        setAddCourseOpen(false);
    };

    return (
        <Box>        
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                {sessionData && sessionData !== "Reloading" ? 
                    <Tabs value={selectedYear} onChange={handleChangedYear}>
                        {activateTab && Object.entries(sessionData.courses).map(([key, value], index) => (
                            <Tab key={key} value={parseInt(key)} label={key} />
                        ))}
                    </Tabs>
                        
                : null}
            </Box>
            <Box sx={{ marginTop: 2 }}>
                <SessionContext.Provider value={sessionData !== null ? sessionData : "Reloading"}>
                    { selectedYear <= activeTri.year ? 
                            <YearOverview setViewedCourse={setViewedCourse} /> :
                            <Box sx={{ mt: 30 }}>
                                <Typography variant={isMobile ? "h6" : "h5"} sx={{ textAlign: 'center', marginTop: 2 }}>Academic year is not currently active.</Typography>
                                <Typography variant={isMobile ? "h6" : "h5"} sx={{ textAlign: 'center', marginTop: 1 }}>It will be available on the <Box sx={{ display: "inline", backgroundColor: "highlight.main", borderRadius: 1, pl: 1, pr: 1 }}>20th of February</Box>.</Typography>
                            </Box>
                    }
                    <Tooltip title={isMobile ? "" : <h3>Add a new course</h3>} placement="left" arrow>
                        <Fab color="primary" size={isMobile ? "large" : "large"} onClick={handleOpenAddCourse} disabled={selectedYear !== activeTri.year} sx={{position: 'fixed', bottom: isMobile ? 16 : 32, right: isMobile ? "50%" : 32, mr: isMobile ? -3.5 : 0}}>
                            <Icon>add</Icon>
                        </Fab>
                    </Tooltip>
                    <AddCourseDialog open={addCourseOpen} onClose={handleCloseAddCourse} activeTri={activeTri} updateData={handleLoadData} courseList={courseList} setCourseList={setCourseList} />
                </SessionContext.Provider> 
            </Box>
        </Box>
    )
}

export default GradesOverview;
export const SessionContext = React.createContext();
