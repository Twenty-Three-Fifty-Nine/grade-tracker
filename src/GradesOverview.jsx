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

import React, { useCallback } from 'react';
import { Box, Fab, Icon, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import YearOverview from './YearOverview';
import AddCourseDialog from './AddCourseDialog';
import Axios from 'axios';
import { isMobile } from "react-device-detect";

class Course {
    constructor(code, name, names, weights, deadlines, grades, isAssList, totalGrade, tri, year, url, lastUpdated, lastSynced) {
        this.code = code;
        this.name = name;
        this.names = names;
        this.weights = weights;
        this.deadlines = deadlines;
        this.grades = grades;
        this.isAssList = isAssList;
        this.totalGrade = totalGrade;
        this.tri = tri;
        this.year = year;
        this.url = url;
        this.lastUpdated = new Date(lastUpdated);
        this.lastSynced = new Date(lastSynced);
    }

    getCourseCompletion() {
        let finished = 0;
        this.grades.forEach((grade) => {
            if (grade !== -1 && !isNaN(grade)) finished++;
        });
        return finished / this.grades.length;
    }

    getCourseLetter() {
        if(isNaN(this.totalGrade)) return "N/A";
        else if(this.totalGrade >= 90) return "A+";
        else if(this.totalGrade >= 85) return "A";
        else if(this.totalGrade >= 80) return "A-";
        else if(this.totalGrade >= 75) return "B+";
        else if(this.totalGrade >= 70) return "B";
        else if(this.totalGrade >= 65) return "B-";
        else if(this.totalGrade >= 60) return "C+";
        else if(this.totalGrade >= 55) return "C";
        else if(this.totalGrade >= 50) return "C-";
        else if(this.totalGrade >= 40) return "D";
        return "E";
    }

    updateTotal() {
        let temp = 0;
        for(let i = 0; i < this.grades.length; i++){
            let num = isNaN(this.grades[i]) ? 0 : this.grades[i];
            temp += (num * this.weights[i] * 0.01);
        }
        this.totalGrade = temp.toFixed(2);
    }
}

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
                for (const element of yearPair.courses) {
                    const data = element;
                    let grades = parseGrades(data.assignments);
                    const assignmentNames = data.assignments.map(
                        (assignment) => assignment.name
                    );
                    const assignmentWeights = data.assignments.map(
                        (assignment) => assignment.weight
                    );
                    const assignmentDeadlines = data.assignments.map(
                        (assignment) => assignment.dueDate
                    );
                    const assignmentIsAssValues = data.assignments.map(
                        (assignment) => assignment.isAssignment
                    );
                    const course = new Course(
                        data.courseCode,
                        data.courseName,
                        assignmentNames,
                        assignmentWeights,
                        assignmentDeadlines,
                        grades,
                        assignmentIsAssValues,
                        data.totalGrade,
                        data.trimester,
                        yearPair.year,
                        data.url,
                        data.lastUpdated,
                        data.lastSynced
                    );
                    ret[yearPair.year][data.trimester - 1].push(course);
                    ret[yearPair.year][data.trimester - 1].sort((a, b) => {
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

    const parseGrades = (assignments) => {
        const ret = [];
        assignments.forEach((assignment) => {
            const grade = assignment.grade;
            if (grade === -1) ret.push(-1);
            else ret.push(grade);
        });
        return ret;
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
