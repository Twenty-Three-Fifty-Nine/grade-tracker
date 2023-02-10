import React, { useEffect } from 'react';
import { Alert, FormControlLabel, Snackbar, Stack, AppBar, Box, Button, Checkbox, Dialog, Divider, IconButton, Toolbar, Icon, Typography, TextField } from '@mui/material';
import CreateAssessmentCard from './CreateAssessmentCard';
import Axios from 'axios';
import { isMobile } from "react-device-detect";

class Assessment {
    constructor(name, weight, deadline, valid) {
        this.name = name;
        this.weight = weight;
        this.deadline = deadline;
        this.valid = false;
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
    const [snackbar, setSnackbar] = React.useState("none");
    const [isSuccess, setIsSuccess] = React.useState("success");

    const [nameValid, setNameValid] = React.useState(false);
    const [codeValid, setCodeValid] = React.useState(false);
    const [nameCheckOn, setNameCheckOn] = React.useState(false);
    const [codeCheckOn, setCodeCheckOn] = React.useState(false);
    const [formatValid, setFormatValid] = React.useState(false);

    useEffect(() => {
        checkFormat();
    }, [nameValid, codeValid, assessments])

    const handleNameChange = (e) => {
        setCourseName(e.target.value);
        setNameValid(e.target.value.length > 0 && e.target.value.length < 51);
        setNameCheckOn(true);
    }

    const handleCodeChange = (e) => {
        setCourseCode(e.target.value);
        const exp = new RegExp('[a-zA-Z]{4}[0-9]{3}', 'g');
        let match = e.target.value.match(exp);
        setCodeValid(match !== null && match[0] === e.target.value);
        setCodeCheckOn(true);
    }

    const checkFormat = () => {
        let valid = nameValid && codeValid && assessments.length > 0;
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
            courseCode: courseCode.toUpperCase(),
            courseName: courseName,
            trimester: activeTri.tri
        }).then((e) => {
            setSnackbar("success")
            setIsSuccess(true);
            addAssessments().then(() => { onClose(courseCode.toUpperCase(), assessments.length) });

            setAssessments([]);
            setCourseName("");
            setCourseCode("");
            setNameValid(false);
            setCodeValid(false);
            setNameCheckOn(false);
            setCodeCheckOn(false);
        }).catch((e) => {
            setSnackbar("error");
            setIsSuccess(false);
        })
    }

    const addAssessments = async () => {
        await assessments.forEach(async (assessment) => {
            console.log("Adding new assessment: " + assessment.name);
            await Axios.post("http://localhost:3001/api/assignments", {
                courseCode: courseCode.toUpperCase(),
                trimester: activeTri.tri,
                assignmentName: assessment.name,
                weight: assessment.weight,
                dueDate: assessment.deadline
            })
        })
    }

    const stopCreating = () => {
        setAssessments([]);
        setCourseName("");
        setCourseCode("");
        setNameValid(false);
        setCodeValid(false);
        setNameCheckOn(false);
        setCodeCheckOn(false);
        onClose();
    }

    return (
        <>
        <Dialog fullScreen open={open} onClose={stopCreating}>
            <AppBar position="static" component="nav">
                <Toolbar>
                    <IconButton color="inherit" onClick={stopCreating}>
                        <Icon>close</Icon>
                    </IconButton>
                    <Typography sx={{ flex: 1, paddingLeft: 1 }} variant={isMobile ? "body1" : "h6"}> Create New Course for Trimester {activeTri.tri} </Typography>
                    <Button color="inherit" onClick={createCourse} disabled={!formatValid}> Create </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{padding: 3, margin: "auto", marginTop: 0}}>
                <Typography variant="h5"> Basic Info </Typography>
                <Divider sx={{marginBottom: 3}} />
                <Stack spacing={2}>
                    <TextField value={courseName} label="Course Name" fullWidth onChange={handleNameChange} error={!nameValid && nameCheckOn} 
                        helperText={courseName.length === 0 && nameCheckOn ? "This field cannot be empty" : courseName.length > 50 && nameCheckOn ? "This field  is too long" : ""} 
                    />
                    <Box sx={{ display: "flex", justifyItems: "center" }}>
                        <TextField value={courseCode} label="Course Code" sx={{ width: isMobile ? "100%" : "40%" }} onChange={handleCodeChange} 
                            error={!codeValid && codeCheckOn} 
                            helperText={!codeValid && codeCheckOn ? "Invalid course code" : ""} 
                        />
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Course Info Incomplete" sx={{m: isMobile ? "0 auto" : 0.7, ml: isMobile ? "auto" : 3}}/>
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
        <Snackbar open={snackbar !== "none"} autoHideDuration={4000} onClose={() => {setSnackbar("none")}}>
            <Alert severity={isSuccess ? "success" : "error"} sx={{ width: isMobile ? '75%' : '100%' }}>
                {isSuccess ? "Course created successfully." : "Course template exists already."}
            </Alert>
        </Snackbar>
        </>
    )
}

export default NewCourseDialog;
