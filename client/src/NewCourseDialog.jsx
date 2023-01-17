import React, { useEffect } from 'react';
import { FormControlLabel, Stack, AppBar, Box, Button, Checkbox, Dialog, Divider, IconButton, Toolbar, Icon, Typography, TextField } from '@mui/material';
import CreateAssessmentCard from './CreateAssessmentCard';
import Axios from 'axios';

class Assessment {
    constructor(name, weight, deadline, valid) {
        this.name = name;
        this.weight = weight;
        this.deadline = deadline;
        this.valid = false;
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

    const [nameValid, setNameValid] = React.useState(false);
    const [codeValid, setCodeValid] = React.useState(false);
    const [formatValid, setFormatValid] = React.useState(false);

    useEffect(() => {
        checkFormat();
    }, [nameValid, codeValid, assessments])

    const handleNameChange = (e) => {
        setCourseName(e.target.value);
        setNameValid(e.target.value.length > 0 && e.target.value.length < 51);
    }

    const handleCodeChange = (e) => {
        setCourseCode(e.target.value);
        const exp = new RegExp('[a-zA-Z]{4}[0-9]{3}', 'g');
        let match = e.target.value.match(exp);
        setCodeValid(match !== null && match[0] === e.target.value);
    }

    const checkFormat = () => {
        let valid = nameValid && codeValid;
        for(const assessment of assessments){
            if(!assessment.valid) valid = false;
        }
        setFormatValid(valid);
    }

    const addAssessment = () => {
        setScrollActive(true);
        const date = new Date();
        date.setSeconds(0);
        setAssessments(oldArray => [...oldArray, new Assessment("", 0, date)]);
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

        await addAssessments().then(() => { onClose(courseCode, assessments.length) });

        setAssessments([]);
        setCourseName("");
        setCourseCode("");
    }

    const addAssessments = async () => {
        await assessments.forEach(async (assessment) => {
            console.log("Adding new assessment: " + assessment.name);
            await Axios.post("http://localhost:3001/api/assignments", {
                courseCode: courseCode,
                trimester: activeTri.tri,
                assignmentName: assessment.name,
                weight: assessment.weight,
                dueDate: assessment.dateToSQLDate()
            })
        })
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
                    <Button color="inherit" onClick={createCourse} disabled={!formatValid}> Create </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{padding: 3, margin: "auto", marginTop: 0}}>
                <Typography variant="h5"> Basic Info </Typography>
                <Divider sx={{marginBottom: 3}} />
                <Stack spacing={2}>
                    <TextField value={courseName} label="Course Name" sx={{ width: 500 }} onChange={handleNameChange} error={!nameValid} 
                        helperText={courseName.length === 0 ? "This field cannot be empty" : courseName.length > 50 ? "This field  is too long" : ""} 
                    />
                    <Box>
                        <TextField value={courseCode} label="Course Code" sx={{ width: 200 }} onChange={handleCodeChange} 
                            error={!codeValid} 
                            helperText={!codeValid ? "Invalid course code" : ""} 
                        />
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Course Info Incomplete" sx={{padding: 0.7, paddingLeft: 6}}/>
                    </Box>
                </Stack>

                <Typography variant="h5" sx={{paddingTop: 5}}> Course Assessments </Typography>
                <Divider sx={{marginBottom: 3}}></Divider>
                <Stack spacing={2}>
                    {assessments.map((assessment, i) => {
                        return (
                            <CreateAssessmentCard key={i} index={i} details={assessment} removeAssessment={removeAssessment} checkFormat={checkFormat} />
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
