import React from 'react';
import { Alert, Stack } from '@mui/material';
import TrimesterOverview from './TrimesterOverview';
import { SessionContext } from './GradesOverview';
import { useEffect } from 'react';

const YearOverview = (props) => {
    const {setViewedCourse} = props;
    const session = React.useContext(SessionContext);

    const [accordionsOpen, setAccordionsOpen] = React.useState([false, false, false]);

    useEffect(() => {
        if(session && session !== "Reloading") setAccordionsOpen([getTriInfo(1).isActive, getTriInfo(2).isActive, getTriInfo(3).isActive]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

    const toggleAccordion = (tri) => {
        const tempOpen = [...accordionsOpen];
        tempOpen[tri - 1] = !tempOpen[tri - 1];
        setAccordionsOpen([...tempOpen]);
    }

    const getTriInfo = (tri) => {
        const timeInfo = session ? session.timeInfo : null;
        if(!timeInfo) return null;
        return {
            tri,
            year: timeInfo.selectedYear,
            isActive: timeInfo.selectedYear === timeInfo.activeTri.year && tri === timeInfo.activeTri.tri,
            isFinished: timeInfo.selectedYear < timeInfo.activeTri.year || (timeInfo.selectedYear === timeInfo.activeTri.year && tri < timeInfo.activeTri.tri)
        }
    }

    const getGPA = () => {
        const trimesters = session ? session.courses : null;
        if(!trimesters) return null;
        let totalGrade = 0;
        let totalCourses = 0;
        trimesters.forEach(trimester => {
            trimester.forEach(course => {
                totalGrade += course.totalGrade;
                totalCourses++;
            })
        })
        let gpa = (totalGrade / totalCourses);
        if(totalCourses === 0) return "N/A";
        else if(gpa >= 90) return "A+";
        else if(gpa >= 85) return "A";
        else if(gpa >= 80) return "A-";
        else if(gpa >= 75) return "B+";
        else if(gpa >= 70) return "B";
        else if(gpa >= 65) return "B-";
        else if(gpa >= 60) return "C+";
        else if(gpa >= 55) return "C";
        else if(gpa >= 50) return "C-";
        else if(gpa >= 40) return "D";
        return "E";
    }

    return (
        <>
        <Stack spacing={1}>
            <TrimesterOverview triInfo={getTriInfo(1)} open={accordionsOpen ? accordionsOpen[0] : false} toggleAccordion={toggleAccordion} setViewedCourse={setViewedCourse} />
            <TrimesterOverview triInfo={getTriInfo(2)} open={accordionsOpen ? accordionsOpen[1] : false} toggleAccordion={toggleAccordion} setViewedCourse={setViewedCourse} />
            <TrimesterOverview triInfo={getTriInfo(3)} open={accordionsOpen ? accordionsOpen[2] : false} toggleAccordion={toggleAccordion} setViewedCourse={setViewedCourse} />
        </Stack>
        <Alert severity="info" sx={{marginTop: 1}}>Current GPA for the Year: {getGPA()}</Alert>
        </>
    )
}

export default YearOverview;
