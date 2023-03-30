/**
 * Twenty Three Fifty Nine - Grade tracking tool
 * Copyright (C) 2023  Abdulrahman Asfari and Christopher E Sa
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

import React, { useCallback, useEffect } from "react";
import {
    Alert,
    AppBar,
    Box,
    Button,
    CircularProgress,
    Collapse,
    Divider,
    Fab,
    IconButton,
    Skeleton,
    Snackbar,
    Stack,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";

import Assessment from "../classes/Assessment";
import Axios from "axios";
import ConfirmDialog from "../ConfirmDialog";
import CreateAssessmentCard from "./CreateAssessmentCard";
import { isMobile } from "react-device-detect";
import { TransitionGroup } from "react-transition-group";

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

/**
 * Allows the user to create a new course template that
 * can be used by others.
 */
const TemplateEditor = (props) => {
    const {
        activeTri,
        onClose,
        open,
        setTemplateData,
        templateData,
        editCode = "",
    } = props;

    // Stores info about the new course.
    const [templateInfo, setTemplateInfo] = React.useState(false);
    const [assessments, setAssessments] = React.useState([]);
    const [courseName, setCourseName] = React.useState("");
    const [courseCode, setCourseCode] = React.useState("");
    const [courseURL, setCourseURL] = React.useState("");

    // States for visual feedback when the form is being used.
    const [snackbar, setSnackbar] = React.useState("none");
    const [isSuccess, setIsSuccess] = React.useState("success");
    const [errorText, setErrorText] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [closeDialog, setCloseDialog] = React.useState(false);
    const [isKeyPress, setIsKeyPress] = React.useState(false);
    const openR = React.useRef();
    openR.current = open;


    // Used to update components when details are updated. 
    const [updater, setUpdater] = React.useState(false);

    // Tracks whether the inputted information is valid to send to the server.
    const [nameValid, setNameValid] = React.useState(false);
    const [codeValid, setCodeValid] = React.useState(false);
    const [urlValid, setURLValid] = React.useState(true);
    const [nameCheckOn, setNameCheckOn] = React.useState(false);
    const [codeCheckOn, setCodeCheckOn] = React.useState(false);
    const [urlCheckOn, setURLCheckOn] = React.useState(false);
    const [formatValid, setFormatValid] = React.useState(false);
    
    // Tracks whether changes were made in the current form session.
    const [initURL, setInitURL] = React.useState(null);
    const [changesMade, setChangesMade] = React.useState(false);
    const [changeOverride, setChangeOverride] = React.useState(false);

    /** Loads template data if a template is being edited. */
    useEffect(() => {
        if (editCode === "" || !open) return;

        setCourseCode(editCode);
        setURLCheckOn(true);
        setNameValid(true);
        setCodeValid(true);
        setURLValid(true);
        setFormatValid(true);
        setChangesMade(false);
        setChangeOverride(false);

        if (templateData) {
            setCourseName(templateData.name);
            setCourseURL(templateData.url);
            setInitURL(templateData.url);

            templateData.assignments.forEach((ass) => 
                setAssessments((prev) => [...prev, new Assessment(ass.name, parseFloat(ass.weight), 0, ass.dueDate, ass.isAssignment, false, true)])    
            );
        } else {
            Axios.get("https://api.twentythreefiftynine.com/courses/" + editCode + "?year=" + activeTri.year + "&trimester=" + activeTri.tri).then((response) => {
                let data = response.data;    
                setTemplateData(data);

                setCourseName(data.name);
                setCourseURL(data.url);
                setInitURL(data.url);

                data.assignments.forEach((ass) => 
                    setAssessments((prev) => [...prev, new Assessment(ass.name, parseFloat(ass.weight), 0, ass.dueDate, ass.isAssignment, false, true)]) 
                );
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    /** Checks if the current course details are valid to send. */
    const checkFormat = useCallback(() => {
        let valid = nameValid && codeValid && assessments.length > 0 && urlValid;
        let changed = courseURL !== initURL;
        for (const assessment of assessments) {
            if (!assessment.valid) valid = false;
            if (assessment.hasChanged || assessment.isNew) changed = true;
        }
        
        setFormatValid(valid);
        setChangesMade(changed);
    }, [nameValid, codeValid, assessments, urlValid, courseURL, initURL]);
    
    /** Checks the validity of the course when basic info fields are changed. */
    useEffect(() => {
        checkFormat();
    }, [nameValid, codeValid, urlValid, assessments, checkFormat]);

    /** Adds event listeners so user can use keyboard to exit editor. */
    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown, false);

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown, false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** Updates name of course and checks if it is valid. */
    const handleNameChange = (e) => {
        setCourseName(e.target.value);
        setNameValid(e.target.value.length > 0 && e.target.value.length < 51);
        setNameCheckOn(true);
    };

    /** Updates course code and checks if it is valid. */
    const handleCodeChange = (e) => {
        setCourseCode(e.target.value);
        const exp = /[a-zA-Z]{4}\d{3}/;
        let match = e.target.value.match(exp);
        setCodeValid(match !== null && match[0] === e.target.value);
        setCodeCheckOn(true);
    };

    /** Updates course URL and checks if it valid. */
    const handleURLChange = (e) => {
        const stripped = e.target.value.replace(/\s/g, "");
        setCourseURL(stripped);
        const exp = /^(https?:\/\/)?(www\.)?(ecs\.)?(nuku\.)?wgtn\.ac\.nz\//;
        let match = stripped.match(exp);
        setURLValid((match !== null && stripped.startsWith(match[0]) && stripped.length < 200) || stripped.length === 0);
        setURLCheckOn(true);
    };

    /** Adds a new assessment to the current assessment list. */
    const addAssessment = () => {
        const date = new Date();
        date.setSeconds(0);
        setAssessments(oldArray => [...oldArray, new Assessment("", 0, 0, date, true, true, false)]);
    };

    /**
     * Removes an assessment using a given index.
     * 
     * @param index - The index of the assessment to remove.
     */
    const removeAssessment = (index) => {
        if (!assessments[index].isNew) setChangeOverride(true);
        setAssessments(assessments.filter((a, i) => i !== index));
    };

    /**
     * @param str - String to convert. 
     * @returns The provided string converted to title case.
     */
    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function(str){ return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase(); });
    };

    /**
     * Attempts to create a course template using the provided information,
     * then displays a snackbar and adds the newly added course to the user
     * if the template was created successfully. 
     */
    const createCourse = async () => {
        const codeYearTri = courseCode.toUpperCase() + "|" + activeTri.year + "|" + activeTri.tri;

        setLoading(true);
        
        await Axios.post("https://api.twentythreefiftynine.com/courses", {
            codeYearTri: codeYearTri,
            name: toTitleCase(courseName),
            url: courseURL.startsWith("https://") || courseURL === "" ? courseURL : "https://" + courseURL,
            assignments: assessments.map((a) => {
                return {
                    name: toTitleCase(a.name),
                    weight: a.weight,
                    dueDate: a.deadline,
                    grade: -1,
                    isAssignment: a.isAss
                }
            })
        }).then((e) => {
            setSnackbar("success")
            setIsSuccess(true);
            onClose(courseCode.toUpperCase(), true);

            resetStates();
        }).catch((e) => {
            if (e.response && e.response.status === 409) setErrorText("There is already a template with this course code");
            else setErrorText("There was an error creating a course");
            setSnackbar("error");
            setIsSuccess(false);
        });

        setLoading(false);
    };

    /**
     * Attempts to update the template details if the editor is open
     * in edit mode, then displays a snackbar.
     */
    const updateCourse = async () => {
        const codeYearTri = courseCode.toUpperCase() + "|" + activeTri.year + "|" + activeTri.tri;
        
        setLoading(true);

        await Axios.put("https://api.twentythreefiftynine.com/courses/" + editCode, {
            codeYearTri: codeYearTri,
            name: toTitleCase(courseName),
            url: courseURL.startsWith("https://") || courseURL === "" ? courseURL : "https://" + courseURL,
            assignments: assessments.map((a) => {
                return {
                    name: toTitleCase(a.name),
                    weight: a.weight,
                    dueDate: a.deadline,
                    grade: -1,
                    isAssignment: a.isAss
                }
            })
        }).then((e) => {
            setSnackbar("success")
            setIsSuccess(true);
            onClose(true);

            resetStates();
            setTemplateData(null);
        }).catch((e) => {
            setErrorText("There was an error updating the template")
            setSnackbar("error");
            setIsSuccess(false);
        });

        setLoading(false);
    };

    /** Closes the creator dialog. */
    const stopCreating = useCallback((keyPressed = isKeyPress) => {
        resetStates();
        onClose(false, keyPressed);
    }, [isKeyPress, onClose]);

    /** 
     * Closes the editor unless changes have been made in the 
     * current editor session, in which case a confirmation dialog
     * is shown to the user.
     */
    const attemptClose = useCallback((keyPressed = isKeyPress) => {
        if ((editCode === "" || changesMade || changeOverride) && 
           (assessments.length > 0 || courseName !== "" || courseCode !== "" || courseURL !== "")) 
            setCloseDialog(true);
        else stopCreating(keyPressed);
    }, [assessments.length, changeOverride, changesMade, courseCode, courseName, courseURL, editCode, isKeyPress, stopCreating]);

    /** Alternative to clicking the return button. */
    const handleKeyDown = useCallback((event) => {
        setIsKeyPress(true);
        if (event.key === "Escape" && openR.current) attemptClose(true);
    }, [attemptClose]);

    /** Resets the dialog states and fields. */
    const resetStates = () => {
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
    }

    /** @returns Helper text for the course name. */
    const getCourseNameHelperText = () => {
        if (!nameCheckOn) return "";
        if (courseName.length === 0) return "Course name cannot be empty";
        if (courseName.length > 50) return "Course name cannot be longer than 50 characters";
        return "";
    };

    /** @returns Helper text for the course URL. */
    const getURLHelperText = () => {
        if (!urlCheckOn) return "";
        if (courseURL.length > 200) return "URL cannot be longer than 200 characters";
        if (!urlValid) return "URL is invalid";
        return "";
    };

    /** @returns Helper text for the snackbar. */
    const getAlertText = () => {
        if (!isSuccess) return errorText;
        if (editCode) return "Course updated successfully";
        return "Course created successfully";
    };

    return (
        <Box>
            {   open &&
                <Box>
                    <AppBar position="fixed" component="nav">
                        <Toolbar>
                        { isMobile && (
                                <IconButton color="inherit" onClick={() => onClose(false)} size="small">
                                    <CloseRoundedIcon />
                                </IconButton>
                            )}
                            <Typography sx={{ flex: 1, pl: 1 }} variant={isMobile ? "body1" : "h6"}> 
                                { editCode !== "" ? "Editing " + editCode : "Create New Course for Trimester " + activeTri.tri } 
                            </Typography>
                            <Box sx={{ position: "relative" }}>
                                <Button color="inherit" onClick={editCode !== "" ? updateCourse : createCourse} disabled={loading || !formatValid || 
                                    (editCode !== "" && !(changesMade || changeOverride))}
                                > 
                                    { editCode !== "" ? "Update" : "Create" } </Button>
                                { loading && <CircularProgress size={24} sx={{ position: "absolute", top: "50%", left: "50%", mt: "-12px", ml: "-12px" }} /> }
                            </Box>
                        </Toolbar>
                    </AppBar>

                    <Box sx={{ p: 3, m: "auto", mt: 8.5, width: isMobile ? "100%" : 548 }}>
                        <Stack direction="row" sx={{ display: "flex", alignItems: "center", justifyContent: "baseline" }}>
                            <Box visibility="hidden" sx={{ flexGrow: 1, flexBasis: 0 }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}> Basic Info </Typography>
                            <Box sx={{ flexGrow: 1, flexBasis: 0, ml: 2, mt: 0.5 }}>
                                <HelpRoundedIcon onClick={() => setTemplateInfo(true)} 
                                    sx={{ fontSize: 40, color: "grey", "&:hover": {color: "white" }, transition: "0.2s", cursor: "pointer" }}
                                />
                            </Box>
                        </Stack>
                        
                        <Divider sx={{ mb: 3 }} />

                        <Stack spacing={2}>
                            <TextField value={courseName} disabled={editCode !== "" ? true : false} label="Course Name" fullWidth onChange={handleNameChange} 
                                error={!nameValid && nameCheckOn} helperText={ getCourseNameHelperText() }
                            />
                            <Box sx={{ display: "flex", justifyItems: "center" }}>
                                <TextField value={courseCode} disabled={editCode !== "" ? true : false} label="Course Code" sx={{ width: "40%" }} onChange={handleCodeChange} 
                                    error={!codeValid && codeCheckOn} helperText={ !codeValid && codeCheckOn ? "Invalid course code" : "" } 
                                />
                                <TextField value={courseURL} label="Course Page URL" sx={{ ml: 2, width: "60%" }} onChange={handleURLChange} 
                                    error={!urlValid && urlCheckOn} helperText={ getURLHelperText() }
                                />
                            </Box>
                        </Stack>

                        <Typography variant="h5" sx={{ pt: 5, textAlign: "center" }}> Course Assessments </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Stack spacing={2}>
                            {   assessments.length > 0 ? (
                                <TransitionGroup>
                                    {assessments.map((assessment, i) => (
                                        <Collapse key={i} sx={{ mb: 2 }}>
                                            <CreateAssessmentCard index={i} details={assessment} removeAssessment={removeAssessment} editCode={editCode}
                                                checkFormat={checkFormat} assessments={assessments} setParentUpdater={setUpdater} parentUpdater={updater} 
                                            />
                                        </Collapse>
                                    ))}
                                </TransitionGroup>) : (editCode !== "" && 
                                <Stack spacing={2}>
                                    <Skeleton variant="rounded" height={150} />
                                    <Skeleton variant="rounded" height={150} />
                                    <Skeleton variant="rounded" height={150} />
                                </Stack>
                            )}
                            {   (assessments.length > 0 || editCode === "") && 
                                <Button variant="contained" sx={{ width: 200, alignSelf: "center" }} onClick={addAssessment}> 
                                    Add New Assessment 
                                </Button> 
                            }
                        </Stack>
                    </Box>
                    {!isMobile && (
                        <Tooltip title={ editCode !== "" ? <h3> Return to {editCode} </h3> : <h3> Return to overview </h3> } placement="right" arrow>
                            <Fab color="primary" onClick={attemptClose} sx={{ position: "fixed", bottom: 32, left: 32 }}>
                                <KeyboardArrowLeftIcon fontSize="large" />
                            </Fab>
                        </Tooltip>
                    )}
                </Box>
            }

            <ConfirmDialog open={closeDialog} handleClose={() => {setCloseDialog(false)}} buttonText={"Stop"} message={"Stop template creation?"} 
                subMessage={"Any inputted data will be lost."} confirmAction={stopCreating} 
            />
            
            <Snackbar open={snackbar !== "none" } autoHideDuration={4000} onClose={() => setSnackbar("none")}
                anchorOrigin={{ vertical:"bottom", horizontal: isMobile ? "center" : "left" }} sx={{zIndex: -1, mb: !isMobile && editCode !== "" ? 10 : 0}}
            >
                <Alert severity={isSuccess ? "success" : "error"} sx={{ width: isMobile ? "75%" : "100%", mb: isMobile && isSuccess && editCode === "" ? 9 : 0 }}>
                    { getAlertText() }
                </Alert>
            </Snackbar>

            <ConfirmDialog open={templateInfo} handleClose={() => setTemplateInfo(false)} buttonText={"Got It"} message={ editCode !== "" ? "How Template Updating Works" : "How Template Creation Works"} 
                confirmAction={null} subMessage={editCode !== "" ? "When you add a course to your offering in a given trimester, sometimes the information may not be up to date. " + 
                "This is where the updating system comes in; you can change the assessment information of the template so everyone else can access it. " + 
                "Note that if the inputted information does not apply to the majority of a class, consider updating your personal copy of the course instead using the course viewer." :
                
                "Templates are a powerful system that exist to preserve a students' most valuable resource: time. Only one student has to create a template for a course, " + 
                "and then any student can add that course to their course list and immediately gain access to any assessment information the template creator inputted." }
            />
        </Box>
    );
};

export default TemplateEditor;
