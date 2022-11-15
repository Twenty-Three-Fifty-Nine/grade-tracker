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
            if(grade) finished++;
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

    const handleChangedYear = async (event, newValue) => {
        await setYear(newValue);
        getSessionData(newValue).then((data) => { setSessionData(data); }); 
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
        const selectedYear = baseYear + year;

        await setSessionData("Reloading");
        return parseCourseData("http://localhost:3001/api/user/courses?userId=abdz2004@gmail.com&year=" + selectedYear).then((courseData) => { 
            return {
                userData: {email: "abdz2004@gmail.com", displayName: "ABOOBIES"},
                timeInfo: {activeTri, selectedYear: baseYear + year},
                courses: [
                    [EEEN202, NWEN241],
                    [COMP261, SWEN221],
                    []
                ]
            };
        });
    }

    const parseCourseData = async (request) => {
        return Axios.get(request).then((result) => {
            const ret = [[], [], []];
            for(let i = 0; i < result.data.length; i++){
                const data = result.data[i];
                // const course = new Course(data.CourseCode, 0, 0, 0, 0);
                ret[data.Trimester - 1].push(data);
            }
            console.log(ret);
            return ret;
        });
    }

    //TEMP THINGS!!!!
    const EEEN202 = new Course("EEEN202", ["A1", "A2", "T1", "A3"], [20.00, 25.00, 50.00, 5.00], [new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00')], [90.00, 87.00, 85.00, 98.00]);
    const NWEN241 = new Course("NWEN241", ["A1", "A2", "T1", "A3"], [20.00, 25.00, 50.00, 5.00], [new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00')], [90.00, 87.00, null, 98.00]);
    const COMP261 = new Course("COMP261", ["A1", "A2", "T1", "A3"], [20.00, 25.00, 50.00, 5.00], [new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00')], [90.00, 87.00, 85.00, 98.00]);
    const SWEN221 = new Course("SWEN221", ["A1", "A2", "T1", "A3"], [20.00, 25.00, 50.00, 5.00], [new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00')], [null, null, 85.00, 98.00]);

    //TEMP THINGS ENDS

    return (
        <>        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={selectedYear} onChange={handleChangedYear}>
                <Tab label="2022" />
                <Tab label="2023" />
            </Tabs>
        </Box>
        <Box>
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