import React, { useEffect } from 'react';
import { FormControlLabel, Stack, AppBar, Box, Button, Checkbox, Dialog, Divider, IconButton, Toolbar, Icon, Typography, TextField } from '@mui/material';
import CreateAssessmentCard from './CreateAssessmentCard';
import Axios from 'axios';

class Assessment {
    constructor(name, weight, deadline) {
        this.name = name;
        this.weight = weight;
        this.deadline = deadline;
    }

    dateToSQLDate = () => {
        const date = this.deadline;
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":00";
    }
} 

const AlwaysScrollToBottom = ({active}) => {
    const elementRef = React.useRef();
    useEffect(() => {if(active) elementRef.current.scrollIntoView()});
    return <div ref={elementRef} />;
  };

const NewCourseDialog = (props) => {
    const { onClose, open, activeTri } = props;

    const [assessments, setAssessments] = React.useState([]);
    const [courseName, setCourseName] = React.useState("");
    const [courseCode, setCourseCode] = React.useState("");
    const [scrollActive, setScrollActive] = React.useState(false);

    const addAssessment = () => {
        setScrollActive(true);
        const date = new Date();
        date.setSeconds(0);
        setAssessments(oldArray => [...oldArray, new Assessment(null, null, date)]);
    }

    const removeAssessment = (index) => {
        setScrollActive(false);
        setAssessments(assessments.filter((a, i) => i !== index));
    }

    const createCourse = async () => {
        console.log("Adding new template");
        await Axios.post("http://localhost:3001/api/courses", {
            courseCode: courseCode,
            courseName: courseName,
            trimester: activeTri.tri
        })

        await assessments.forEach(async (assessment) => {
            console.log("Adding new assessment: " + assessment.name);
            await Axios.post("http://localhost:3001/api/assignments", {
                courseCode: courseCode,
                assignmentName: assessment.name,
                weight: assessment.weight,
                dueDate: assessment.dateToSQLDate()
            })
        })

        setAssessments([]);
        onClose(courseCode);   
    }

    const stopCreating = () => {
        setAssessments([]);
        onClose();
    }

    return (
        <Dialog fullScreen open={open} onClose={stopCreating}>
            <AppBar position="static" component="nav">
                <Toolbar>
                    <IconButton color="inherit" onClick={stopCreating}>
                        <Icon>close</Icon>
                    </IconButton>
                    <Typography sx={{ flex: 1, paddingLeft: 1 }} variant="h6"> Create New Course for Trimester {activeTri.tri} </Typography>
                    <Button color="inherit" onClick={createCourse}> Create </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{padding: 3, margin: "auto", marginTop: 0}}>
                <Typography variant="h5"> Basic Info </Typography>
                <Divider sx={{marginBottom: 3}} />
                <Stack spacing={2}>
                    <TextField value={courseName} label="Course Name" sx={{ width: 500 }} onChange={(e) => setCourseName(e.target.value)}/>
                    <Box>
                        <TextField value={courseCode} label="Course Code" sx={{ width: 200 }} onChange={(e) => setCourseCode(e.target.value)} />
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Course Info Incomplete" sx={{padding: 0.7, paddingLeft: 6}}/>
                    </Box>
                </Stack>

                <Typography variant="h5" sx={{paddingTop: 5}}> Course Assessments </Typography>
                <Divider sx={{marginBottom: 3}}></Divider>
                <Stack spacing={2}>
                    {assessments.map((assessment, i) => {
                        return (
                            <CreateAssessmentCard key={i} index={i} details={assessment} removeAssessment={removeAssessment} />
                        )
                    })}
                    <Button variant="contained" sx={{ width: 200 }} onClick={addAssessment}> Add New Assessment </Button>
                    <AlwaysScrollToBottom active={scrollActive} />
                </Stack>
            </Box>
        </Dialog>
    )
}

export default NewCourseDialog;
