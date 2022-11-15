import React from 'react';
import { Alert, Box, Fab, Icon, Tab, Tabs } from '@mui/material';
import YearOverview from './YearOverview';
import AddCourseDialog from './AddCourseDialog';
import Axios from 'axios';

class Course {
    constructor(code, names, weights, deadlines, grades) {
        this.code = code;
        this.names = names;
        this.weights = weights;
        this.deadlines = deadlines;
        this.grades = grades;
    }

    getCourseCompletion() {
        let finished = 0;
        this.grades.forEach(grade => {
            if(!isNaN(grade)) finished++;
        });
        return finished / this.grades.length;
    }
} 

const GradesOverview = () => {
    const baseYear = 2022;
    const activeTri = {year: 2022, tri: 3};

    const [selectedYear, setYear] = React.useState(0);
    const [sessionData, setSessionData] = React.useState(null);
    const [addCourseOpen, setAddCourseOpen] = React.useState(false);

    const handleChangedYear = (event, newValue) => {
        setYear(newValue);
    };

    const handleNoData = async () => {
        getSessionData(selectedYear).then((data) => { setSessionData(data); }); 
    };

    const handleOpenAddCourse = () => {
        setAddCourseOpen(true);
    };

    const handleCloseAddCourse = (newCourse, courseCode) => {
        setAddCourseOpen(false);
        if(newCourse) console.log("Creating New Course");
        else if(courseCode) console.log(courseCode);
    };

    const getSessionData = async (year) => {
        console.log("Getting Session Data");

        await setSessionData("Reloading");
        return parseCourseData("http://localhost:3001/api/user/courses?userId=abdz2004@gmail.com").then((courseData) => { 
            return {
                userData: {email: "abdz2004@gmail.com", displayName: "ABOOBIES"},
                timeInfo: {activeTri, selectedYear: baseYear + year},
                courses: courseData
            };
        });
    }

    const parseCourseData = async (request) => {
        return Axios.get(request).then(async (result) => {
            const ret = {
                2022: [[], [], []],
                2023: [[], [], []],
            };

            for(let i = 0; i < result.data.length; i++){
                const data = result.data[i];
                let courseTemplate;
                let grades = parseGrades(data.Grades);
                await getCourseTemplate(data.CourseCode, data.Trimester).then((value) => { courseTemplate = value });

                const course = new Course(data.CourseCode, courseTemplate[0], courseTemplate[1], courseTemplate[2], grades);
                ret[data.Year][data.Trimester - 1].push(course);
            }
            return ret;
        });
    }

    const parseGrades = (str) => {
        const ret= []
        const splitStr = str.match(/.{1,4}/g);
        splitStr.forEach(grade => {
            if(grade === null) ret.push(null);
            else ret.push(parseInt(grade) * 0.01)
        })
        return ret;
    }

    const getCourseTemplate = async (code, tri) => {
        return Axios.get("http://localhost:3001/api/" + code + "/assignments?trimester=" + (tri - 1)).then((result) => {
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
        <>        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={selectedYear} onChange={handleChangedYear}>
                <Tab label="2022" />
                <Tab label="2023" />
            </Tabs>
        </Box>
        <Box sx={{ marginTop: 2 }}>
            { baseYear + selectedYear <= new Date().getFullYear() ? 
                <SessionContext.Provider value={sessionData !== null ? sessionData : handleNoData()}>
                    <YearOverview />
                </SessionContext.Provider> :
                <Alert severity="warning" sx={{marginTop: 1}}> Academic year is not currently active. </Alert>
            }
            <Fab color="primary" onClick={handleOpenAddCourse} disabled={baseYear + selectedYear > new Date().getFullYear()} sx={{position: 'absolute', bottom: 32, right: 32}}>
                <Icon>add</Icon>
            </Fab>
            <AddCourseDialog open={addCourseOpen} onClose={handleCloseAddCourse} activeTri={activeTri} />
        </Box>
        </>
    )
}

export default GradesOverview;
export const SessionContext = React.createContext();