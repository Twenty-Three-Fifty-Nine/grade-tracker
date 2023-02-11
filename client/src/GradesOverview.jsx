import React from 'react';
import { Box, Fab, Icon, Tab, Tabs, Typography } from '@mui/material';
import YearOverview from './YearOverview';
import AddCourseDialog from './AddCourseDialog';
import Axios from 'axios';
import { isMobile } from "react-device-detect";

class Course {
    constructor(code, names, weights, deadlines, grades, totalGrade, tri, year) {
        this.code = code;
        this.names = names;
        this.weights = weights;
        this.deadlines = deadlines;
        this.grades = grades;
        this.totalGrade = totalGrade;
        this.tri = tri;
        this.year = year;
    }

    getCourseCompletion() {
        let finished = 0;
        this.grades.forEach(grade => {
            if(!isNaN(grade)) finished++;
        });
        return finished / this.grades.length;
    }

    getCourseLetter() {
        if(this.totalGrade >= 90) return "A+";
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
    const {userEmail, userName, setViewedCourse} = props
    const baseYear = 2022;
    const activeTri = {year: 2022, tri: 3};

    const [selectedYear, setYear] = React.useState(activeTri.year - baseYear);
    const [sessionData, setSessionData] = React.useState(null);
    const [addCourseOpen, setAddCourseOpen] = React.useState(false);

    const handleChangedYear = async (event, newValue) => {
        setYear(newValue);
        getSessionData(newValue).then((data) => { setSessionData(data); }); 
    };

    const handleLoadData = async () => {
        getSessionData(selectedYear).then((data) => { setSessionData(data); }); 
    };

    const handleOpenAddCourse = () => {
        setAddCourseOpen(true);
    };

    const handleCloseAddCourse = () => {
        setAddCourseOpen(false);
    };

    const getSessionData = async (year) => {
        console.log("Getting Session Data");
        await setSessionData("Reloading");
        return parseCourseData("http://localhost:3001/api/user/courses?userId=" + userEmail + "&year=" + (baseYear + year)).then((courseData) => { 
            return {
                userData: {email: userEmail, displayName: userName},
                timeInfo: {activeTri, selectedYear: baseYear + year},
                courses: courseData
            };
        });
    }

    const parseCourseData = async (request) => {
        return Axios.get(request).then(async (result) => {
            const ret = [[], [], []];
            for(let i = 0; i < result.data.length; i++){
                const data = result.data[i];
                let courseTemplate;
                let grades = parseGrades(data.Grades);
                await getCourseTemplate(data.CourseCode, data.Trimester).then((value) => { courseTemplate = value });
                const course = new Course(data.CourseCode, courseTemplate[0], courseTemplate[1], courseTemplate[2], grades, data.TotalGrade, data.Trimester, data.Year);
                ret[data.Trimester - 1].push(course);
            }
            return ret;
        });
    }

    const parseGrades = (str) => {
        const ret= []
        const splitStr = str.match(/.{1,4}/g);
        splitStr.forEach(grade => {
            if(grade === "null") ret.push("NaN");
            else if(grade === "full") ret.push(100);
            else ret.push(parseInt(grade) * 0.01)
        })
        return ret;
    }

    const getCourseTemplate = async (code, tri) => {
        return Axios.get("http://localhost:3001/api/" + code + "/assignments?trimester=" + tri).then((result) => {
            const ret = [[], [], []]
            for(let i = 0; i < result.data.length; i++){
                ret[0].push(result.data[i].AssignmentName);
                ret[1].push(result.data[i].Weight);
                ret[2].push(result.data[i].DueDate);
            }
            return ret;
        });
    }

    return (
        <Box>        
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={selectedYear} onChange={handleChangedYear}>
                    <Tab label="2022" />
                    <Tab label="2023" />
                </Tabs>
            </Box>
            <Box sx={{ marginTop: 2 }}>
                <SessionContext.Provider value={sessionData !== null ? sessionData : handleLoadData()}>
                    { baseYear + selectedYear <= activeTri.year ? 
                            <YearOverview setViewedCourse={setViewedCourse} /> :
                            <Box sx={{ mt: 30 }}>
                                <Typography variant={isMobile ? "h6" : "h5"} sx={{ textAlign: 'center', marginTop: 2 }}>Academic year is not currently active.</Typography>
                                <Typography variant={isMobile ? "h6" : "h5"} sx={{ textAlign: 'center', marginTop: 1 }}>It will be available on the <Box sx={{ display: "inline", backgroundColor: "highlight.main", borderRadius: 1, pl: 1, pr: 1 }}>20th of February</Box>.</Typography>
                            </Box>
                    }
                    <Fab color="primary" onClick={handleOpenAddCourse} disabled={baseYear + selectedYear !== activeTri.year} sx={{position: 'absolute', bottom: 32, right: 32}}>
                        <Icon>add</Icon>
                    </Fab>
                    <AddCourseDialog open={addCourseOpen} onClose={handleCloseAddCourse} activeTri={activeTri} updateData={handleLoadData} />
                </SessionContext.Provider> 
            </Box>
        </Box>
    )
}

export default GradesOverview;
export const SessionContext = React.createContext();