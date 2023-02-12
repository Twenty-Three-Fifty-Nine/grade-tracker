import React, { useCallback, useMemo } from 'react';
import { Box, Fab, Icon, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import YearOverview from './YearOverview';
import AddCourseDialog from './AddCourseDialog';
import Axios from 'axios';
import { isMobile } from "react-device-detect";

class Course {
    constructor(code, names, weights, deadlines, grades, totalGrade, tri, year, url) {
        this.code = code;
        this.names = names;
        this.weights = weights;
        this.deadlines = deadlines;
        this.grades = grades;
        this.totalGrade = totalGrade;
        this.tri = tri;
        this.year = year;
        this.url = url;
    }

    getCourseCompletion() {
        let finished = 0;
        this.grades.forEach((grade) => {
            if (grade !== -1) finished++;
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
}

const GradesOverview = (props) => {
    const {userEmail, userName, setViewedCourse, sessionData, setSessionData, courseList, setCourseList} = props
    const baseYear = 2022;
    const activeTri = useMemo(() => { return {year: 2022, tri: 3} }, []);

    const [selectedYear, setYear] = React.useState(activeTri.year - baseYear);
    const [addCourseOpen, setAddCourseOpen] = React.useState(false);

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
                    const course = new Course(
                        data.course,
                        assignmentNames,
                        assignmentWeights,
                        assignmentDeadlines,
                        grades,
                        data.finalGrade,
                        data.trimester,
                        yearPair.year,
                        data.url
                    );
                    ret[yearPair.year][data.trimester - 1].push(course);
                }
            }
            return ret;
        });
    }, []);

    const getSessionData = useCallback(async (year) => {
        console.log("Getting Session Data");
        await setSessionData("Reloading");
        return parseCourseData(
            "https://b0d0rkqp47.execute-api.ap-southeast-2.amazonaws.com/test/users/" +
                userEmail +
                "/courses"
        ).then((courseData) => {
            return {
                userData: { email: userEmail, displayName: userName },
                timeInfo: { activeTri, selectedYear: baseYear + year },
                courses: courseData,
            };
        });
    }, [activeTri, parseCourseData, setSessionData, userEmail, userName]);

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
        tempData.timeInfo.selectedYear = baseYear + newValue;
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
                <Tabs value={selectedYear} onChange={handleChangedYear}>
                    <Tab label="2022" />
                    <Tab label="2023" />
                </Tabs>
            </Box>
            <Box sx={{ marginTop: 2 }}>
                <SessionContext.Provider value={sessionData !== null ? sessionData : "Reloading"}>
                    { baseYear + selectedYear <= activeTri.year ? 
                            <YearOverview setViewedCourse={setViewedCourse} /> :
                            <Box sx={{ mt: 30 }}>
                                <Typography variant={isMobile ? "h6" : "h5"} sx={{ textAlign: 'center', marginTop: 2 }}>Academic year is not currently active.</Typography>
                                <Typography variant={isMobile ? "h6" : "h5"} sx={{ textAlign: 'center', marginTop: 1 }}>It will be available on the <Box sx={{ display: "inline", backgroundColor: "highlight.main", borderRadius: 1, pl: 1, pr: 1 }}>20th of February</Box>.</Typography>
                            </Box>
                    }
                    <Tooltip title={<h3>Add a new course</h3>} placement="left" arrow>
                        <Fab color="primary" onClick={handleOpenAddCourse} disabled={baseYear + selectedYear !== activeTri.year} sx={{position: 'fixed', bottom: 32, right: 32}}>
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
