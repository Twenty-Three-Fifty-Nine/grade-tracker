import React, { useCallback, useEffect } from 'react';
import { Alert, Snackbar, Stack, AppBar, Box, Button, Dialog, Divider, IconButton, Toolbar, Icon, Typography, TextField } from '@mui/material';
import CreateAssessmentCard from './CreateAssessmentCard';
import ConfirmDialog from './ConfirmDialog';
import Axios from 'axios';
import { isMobile } from "react-device-detect";

class Assessment {
    constructor(name, weight, deadline) {
        this.name = name;
        this.weight = weight;
        this.deadline = deadline;
        this.valid = false;
        this.duplicate = false;
        this.isAssignment = true;
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
    const [courseURL, setCourseURL] = React.useState("");
    const [scrollActive, setScrollActive] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState("none");
    const [isSuccess, setIsSuccess] = React.useState("success");
    const [errorText, setErrorText] = React.useState("");
    const [updater, setUpdater] = React.useState(false);

    const [nameValid, setNameValid] = React.useState(false);
    const [codeValid, setCodeValid] = React.useState(false);
    const [urlValid, setURLValid] = React.useState(true);
    const [nameCheckOn, setNameCheckOn] = React.useState(false);
    const [codeCheckOn, setCodeCheckOn] = React.useState(false);
    const [urlCheckOn, setURLCheckOn] = React.useState(false);
    const [formatValid, setFormatValid] = React.useState(false);
    
    const [closeDialog, setCloseDialog] = React.useState(false);

    const checkFormat = useCallback(() => {
        let valid = nameValid && codeValid && assessments.length > 0 && urlValid;
        for(const assessment of assessments){
            if(!assessment.valid) valid = false;
        }
        setFormatValid(valid);
    }, [nameValid, codeValid, assessments, urlValid]);
    
    useEffect(() => {
        checkFormat();
    }, [nameValid, codeValid, assessments, checkFormat])

    const handleNameChange = (e) => {
        setCourseName(e.target.value);
        setNameValid(e.target.value.length > 0 && e.target.value.length < 51);
        setNameCheckOn(true);
    }

    const handleCodeChange = (e) => {
        setCourseCode(e.target.value);
        const exp = /[a-zA-Z]{4}\d{3}/;
        let match = e.target.value.match(exp);
        setCodeValid(match !== null && match[0] === e.target.value);
        setCodeCheckOn(true);
    }

    const handleURLChange = (e) => {
        const stripped = e.target.value.replace(/\s/g, "");
        setCourseURL(stripped);
        const exp = /^(https?:\/\/)?(www\.)?(ecs\.)?wgtn\.ac\.nz\//;
        let match = stripped.match(exp);
        setURLValid((match !== null && stripped.startsWith(match[0]) && stripped.length < 200) || stripped.length === 0);
        setURLCheckOn(true);
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

    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function(str){return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();});
    }

    const createCourse = async () => {
        console.log("Adding new template");
        const codeYearTri = courseCode.toUpperCase() + "|" + activeTri.year + "|" + activeTri.tri;
        await Axios.post("https://b0d0rkqp47.execute-api.ap-southeast-2.amazonaws.com/test/courses  ", {
            codeYearTri: codeYearTri,
            name: toTitleCase(courseName),
            url: courseURL.startsWith("https://") ? courseURL : "https://" + courseURL,
            assignments: assessments.map((a) => {
                return {
                    name: toTitleCase(a.name),
                    weight: a.weight,
                    dueDate: a.deadline,
                    grade: -1,
                    isAssignment: a.isAssignment
                }
            })
        }).then((e) => {
            setSnackbar("success")
            setIsSuccess(true);
            onClose(courseCode.toUpperCase(), true);

            setAssessments([]);
            setCourseName("");
            setCourseCode("");
            setCourseURL("");
            setNameValid(false);
            setCodeValid(false);
            setURLValid(true);
            setNameCheckOn(false);
            setCodeCheckOn(false);
            setURLCheckOn(false);
        }).catch((e) => {
            if(e.response && e.response.status === 409) setErrorText("There is already a template with this course code")
            else setErrorText("There was an error creating a course")
            setSnackbar("error");
            setIsSuccess(false);
        })
    }

    const attemptClose = () => {
        if(assessments.length > 0 || courseName !== "" || courseCode !== "" || courseURL !== "") setCloseDialog(true);
        else stopCreating();
    }

    const stopCreating = () => {
        setAssessments([]);
        setCourseName("");
        setCourseCode("");
        setCourseURL("");
        setNameValid(false);
        setCodeValid(false);
        setURLValid(true);
        setNameCheckOn(false);
        setCodeCheckOn(false);
        setURLCheckOn(false);
        setCloseDialog(false);
        onClose();
    }

    return (
        <>
        <Dialog fullScreen open={open} onClose={attemptClose}>
            <AppBar position="fixed" component="nav">
                <Toolbar>
                    <IconButton color="inherit" onClick={attemptClose}>
                        <Icon>close</Icon>
                    </IconButton>
                    <Typography sx={{ flex: 1, paddingLeft: 1 }} variant={isMobile ? "body1" : "h6"}> Create New Course for Trimester {activeTri.tri} </Typography>
                    <Button color="inherit" onClick={createCourse} disabled={!formatValid}> Create </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{padding: 3, margin: "auto", mt: 8.5, width: isMobile ? "100%" : 548}}>
                <Typography variant="h5"> Basic Info </Typography>
                <Divider sx={{marginBottom: 3}} />
                <Stack spacing={2}>
                    <TextField value={courseName} label="Course Name" fullWidth onChange={handleNameChange} error={!nameValid && nameCheckOn} 
                        helperText={courseName.length === 0 && nameCheckOn ? "This field cannot be empty" : courseName.length > 50 && nameCheckOn ? "This field  is too long" : ""} 
                    />
                    <Box sx={{ display: "flex", justifyItems: "center" }}>
                        <TextField value={courseCode} label="Course Code" sx={{ width: "40%" }} onChange={handleCodeChange} 
                            error={!codeValid && codeCheckOn} 
                            helperText={!codeValid && codeCheckOn ? "Invalid course code" : ""} 
                        />
                        <TextField value={courseURL} label="Course Page URL" sx={{ ml: 2, width: "60%" }} onChange={handleURLChange} 
                            error={!urlValid && urlCheckOn} 
                            helperText={!urlValid && urlCheckOn ? courseURL.length > 200 ? "URL is too long" : "Invalid URL" : ""}
                        />
                    </Box>
                </Stack>

                <Typography variant="h5" sx={{paddingTop: 5}}> Course Assessments </Typography>
                <Divider sx={{marginBottom: 3}}></Divider>
                <Stack spacing={2}>
                    {assessments.map((assessment, i) => {
                        return (
                            <CreateAssessmentCard key={i} index={i} details={assessment} removeAssessment={removeAssessment} checkFormat={checkFormat} assessments={assessments} setParentUpdater={setUpdater} parentUpdater={updater} />
                        )
                    })}
                    <Button variant="contained" sx={{ width: 200 }} onClick={addAssessment}> Add New Assessment </Button>
                    <AlwaysScrollToBottom active={scrollActive} />
                </Stack>
            </Box>
        </Dialog>

        <ConfirmDialog open={closeDialog} handleClose={() => {setCloseDialog(false)}} buttonText={"Stop"} message={"Stop template creation?"} subMessage={"Any inputted data will be lost."} confirmAction={stopCreating} />

        <Snackbar open={snackbar !== "none"} autoHideDuration={4000} onClose={() => {setSnackbar("none")}}>
            <Alert severity={isSuccess ? "success" : "error"} sx={{ width: isMobile ? '75%' : '100%' }}>
                {isSuccess ? "Course created successfully" : errorText}
            </Alert>
        </Snackbar>
        </>
    )
}

export default NewCourseDialog;
