import React, { useCallback, useEffect } from 'react';
import { Alert, Snackbar, Stack, AppBar, Box, Button, Dialog, Divider, IconButton, Toolbar, Icon, Typography, TextField, Collapse } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import CreateAssessmentCard from './CreateAssessmentCard';
import ConfirmDialog from './ConfirmDialog';
import Axios from 'axios';
import { isMobile } from "react-device-detect";
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

class Assessment {
    constructor(name, weight, deadline, isNew = true, existing = false, isAssignment = true) {
        this.name = name;
        this.weight = weight;
        this.deadline = deadline;
        this.isAssignment = isAssignment;

        this.isNew = isNew;
        this.hasChanged = false;
        this.valid = existing;
        this.duplicate = false;

        this.initName = name;
        this.initWeight = weight;
        this.initDeadline = deadline;
        this.initIsAss = isAssignment;
    }

    checkIfChanged() {
        let nameChanged = this.name !== this.initName;
        let deadlineChanged = new Date(this.deadline).toString() !== new Date(this.initDeadline).toString();
        let isAssChanged = this.isAssignment !== this.initIsAss;
        let weightChanged = this.weight.toString() !== this.initWeight.toString();
        this.hasChanged = nameChanged || deadlineChanged || isAssChanged || weightChanged;
    }

    setName(name) {
        this.name = name;
        this.checkIfChanged();
    }

    setWeight(weight) {
        this.weight = weight;
        this.checkIfChanged();
    }

    setDeadline(deadline) {
        this.deadline = deadline;
        this.checkIfChanged();
    }

    setIsAssignment(isAssignment) {
        this.isAssignment = isAssignment;
        this.checkIfChanged();
    }
} 

const NewCourseDialog = (props) => {
    const { onClose, open, activeTri, editCode, templateData, setTemplateData } = props;

    const [assessments, setAssessments] = React.useState([]);
    const [courseName, setCourseName] = React.useState("");
    const [courseCode, setCourseCode] = React.useState("");
    const [courseURL, setCourseURL] = React.useState("");
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
    const [templateInfo, setTemplateInfo] = React.useState(false);

    const [initURL, setInitURL] = React.useState(null);
    const [changesMade, setChangesMade] = React.useState(false);
    const [changeOverride, setChangeOverride] = React.useState(false);

    useEffect(() => {
        if(!editCode || !open) return;

        setCourseCode(editCode);

        setURLCheckOn(true);
        setNameValid(true);
        setCodeValid(true);
        setURLValid(true);
        setFormatValid(true);
        setChangesMade(false);
        setChangeOverride(false);

        if(templateData){
            setCourseName(templateData.name);
            setCourseURL(templateData.url);
            setInitURL(templateData.url);

            templateData.assignments.forEach((ass) => {
                setAssessments((prev) => [...prev, new Assessment(ass.name, parseInt(ass.weight), ass.dueDate, false, true, ass.isAssignment)]);    
            })
        }else{
            Axios.get("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/courses/" + editCode + "?year=" + activeTri.year + "&trimester=" + activeTri.tri).then((response) => {
                let data = response.data;    
                setTemplateData(data);

                setCourseName(data.name);
                setCourseURL(data.url);
                setInitURL(data.url);

                data.assignments.forEach((ass) => {
                    setAssessments((prev) => [...prev, new Assessment(ass.name, parseInt(ass.weight), ass.dueDate, false, true, ass.isAssignment)]);    
                })
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const checkFormat = useCallback(() => {
        let valid = nameValid && codeValid && assessments.length > 0 && urlValid;
        let changed = courseURL !== initURL;
        for(const assessment of assessments){
            if(!assessment.valid) valid = false;
            if(assessment.hasChanged || assessment.isNew) changed = true;
        }
        
        setFormatValid(valid);
        setChangesMade(changed);
    }, [nameValid, codeValid, assessments, urlValid, courseURL, initURL]);
    
    useEffect(() => {
        checkFormat();
    }, [nameValid, codeValid, urlValid, assessments, checkFormat])

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
        const exp = /^(https?:\/\/)?(www\.)?(ecs\.)?(nuku\.)?wgtn\.ac\.nz\//;
        let match = stripped.match(exp);
        setURLValid((match !== null && stripped.startsWith(match[0]) && stripped.length < 200) || stripped.length === 0);
        setURLCheckOn(true);
    }

    const addAssessment = () => {
        const date = new Date();
        date.setSeconds(0);
        setAssessments(oldArray => [...oldArray, new Assessment("", 0, date)]);
    }

    const removeAssessment = (index) => {
        if(!assessments[index].isNew) setChangeOverride(true);
        setAssessments(assessments.filter((a, i) => i !== index));
    }

    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function(str){return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();});
    }

    const createCourse = async () => {
        console.log("Adding new template");
        const codeYearTri = courseCode.toUpperCase() + "|" + activeTri.year + "|" + activeTri.tri;
        await Axios.post("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/courses", {
            codeYearTri: codeYearTri,
            name: toTitleCase(courseName),
            url: courseURL.startsWith("https://") || courseURL === "" ? courseURL : "https://" + courseURL,
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

    const updateCourse = async () => {
        console.log("Updating template");
        const codeYearTri = courseCode.toUpperCase() + "|" + activeTri.year + "|" + activeTri.tri;
        await Axios.put("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/courses/" + editCode, {
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
            onClose(true);

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
            setTemplateData(null);
        }).catch((e) => {
            setErrorText("There was an error updating the template")
            setSnackbar("error");
            setIsSuccess(false);
        })
    }

    const attemptClose = () => {
        if((editCode === null || changesMade || changeOverride) && (assessments.length > 0 || courseName !== "" || courseCode !== "" || courseURL !== "")) setCloseDialog(true);
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
                    <Typography sx={{ flex: 1, paddingLeft: 1 }} variant={isMobile ? "body1" : "h6"}> { editCode ? "Editing " + editCode : "Create New Course for Trimester " + activeTri.tri } </Typography>
                    <Button color="inherit" onClick={editCode ? updateCourse : createCourse} disabled={!formatValid || (editCode && !(changesMade || changeOverride))}> {editCode ? "Update" : "Create" } </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{padding: 3, margin: "auto", mt: 8.5, width: isMobile ? "100%" : 548}}>
                <Stack direction="row" sx={{display:"flex", alignItems:"center", justifyContent:"baseline"}}>
                    <Box visibility="hidden" sx={{flexGrow: 1, flexBasis: 0}} />
                    <Typography variant="h5" sx={{textAlign:"center"}}> Basic Info </Typography>
                    <Box sx={{ flexGrow: 1, flexBasis: 0, ml: 2, mt: 0.5}}>
                        <HelpRoundedIcon onClick={() => {setTemplateInfo(true)}} sx={{ fontSize: 40, color: "grey", "&:hover": {color: "white" }, transition: "0.2s", cursor: "pointer"}} />
                    </Box>
                </Stack>
                
                <Divider sx={{marginBottom: 3}} />
                <Stack spacing={2}>
                    <TextField value={courseName} disabled={editCode ? true : false} label="Course Name" fullWidth onChange={handleNameChange} error={!nameValid && nameCheckOn} 
                        helperText={courseName.length === 0 && nameCheckOn ? "This field cannot be empty" : courseName.length > 50 && nameCheckOn ? "This field  is too long" : ""} 
                    />
                    <Box sx={{ display: "flex", justifyItems: "center" }}>
                        <TextField value={courseCode} disabled={editCode ? true : false} label="Course Code" sx={{ width: "40%" }} onChange={handleCodeChange} 
                            error={!codeValid && codeCheckOn} 
                            helperText={!codeValid && codeCheckOn ? "Invalid course code" : ""} 
                        />
                        <TextField value={courseURL} label="Course Page URL" sx={{ ml: 2, width: "60%" }} onChange={handleURLChange} 
                            error={!urlValid && urlCheckOn} 
                            helperText={!urlValid && urlCheckOn ? courseURL.length > 200 ? "URL is too long" : "Invalid URL" : ""}
                        />
                    </Box>
                </Stack>

                <Typography variant="h5" sx={{paddingTop: 5, textAlign:"center"}}> Course Assessments </Typography>
                <Divider sx={{marginBottom: 3}}></Divider>
                
                    <Stack spacing={2}>
                        <TransitionGroup>
                        {assessments.map((assessment, i) => (
                            <Collapse key={i} sx={{mb: 2}}>
                                <CreateAssessmentCard index={i} details={assessment} removeAssessment={removeAssessment} checkFormat={checkFormat} assessments={assessments} setParentUpdater={setUpdater} parentUpdater={updater} />
                            </Collapse>
                        ))}
                        </TransitionGroup>
                        <Button variant="contained" sx={{ width: 200, alignSelf:"center" }} onClick={addAssessment}> Add New Assessment </Button>
                    </Stack>
                
            </Box>
        </Dialog>

        <ConfirmDialog open={closeDialog} handleClose={() => {setCloseDialog(false)}} buttonText={"Stop"} message={"Stop template creation?"} subMessage={"Any inputted data will be lost."} confirmAction={stopCreating} />
        
        <Snackbar open={snackbar !== "none"} autoHideDuration={4000} onClose={() => {setSnackbar("none")}}
            anchorOrigin={{ vertical:"bottom", horizontal: isMobile ? "center" : editCode === null ? "left" : "right" }}
        >
            <Alert severity={isSuccess ? "success" : "error"} sx={{ width: isMobile ? '75%' : '100%', mb: isMobile && isSuccess && !editCode ? 9 : 0}}>
                {isSuccess ? editCode ? "Course updated successfully" : "Course created successfully" : errorText}
            </Alert>
        </Snackbar>

        <ConfirmDialog open={templateInfo} handleClose={() => {setTemplateInfo(false)}} buttonText={"Got It"} message={editCode ? "How Template Updating Works" : "How Template Creation Works"} confirmAction={null} 
            subMessage={editCode ? "When you add a course to your offering in a given trimester, sometimes the information may not be up to date. " + 
            "This is where the updating system comes in; you can change the assessment information of the template so everyone else can access it. " + 
            "Note that if the inputted information does not apply to the majority of a class, consider updating your personal copy of the course instead using the course viewer." 
            : "Templates are a powerful system that exist to preserve a students' most valuable resource: time. Only one student has to create a template for a course, " + 
            "and then any student can add that course to their course list and immediately gain access to any assessment information the template creator inputted." 
            }
        />
        </>
    )
}

export default NewCourseDialog;
