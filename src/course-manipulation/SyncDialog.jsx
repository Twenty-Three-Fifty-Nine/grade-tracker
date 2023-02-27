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

import React, { useEffect } from "react";
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Dialog,
    Divider,
    FormControlLabel,
    Icon,
    IconButton,
    Skeleton,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";

import Assessment from "../classes/Assessment";
import Axios from "axios";
import ConfirmDialog from "../ConfirmDialog";
import { isMobile } from "react-device-detect";
import SyncAssessmentCard from "./SyncAssessmentCard";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";

/** 
 * This dialog allows the user to sync their current course
 * instance to the up-to-date version of the course template.
 */
const SyncDialog = (props) => {
    const {
        assessments,
        courseData,
        onClose,
        open,
        saveChanges,
        setAssessments,
        setTemplateData,
        templateData,
    } = props;

    // Stores a list of the assessments to be displayed for syncing.
    const [changedAssessments, setChangedAssessments] = React.useState([]);
    const [unchangedAssessments, setUnchangedAssessments] = React.useState([]);
    const [newAssessments, setNewAssessments] = React.useState([]);
    const [equalAssessments, setEqualAssessments] = React.useState([]);

    // Used to control sync selection.
    const [newAssessmentPreference, setNewAssessmentPreference] = React.useState(true);
    const [keepNewURL, setKeepNewURL] = React.useState(true);

    // Tracks whether syncing will actually change any information.
    const [validSync, setValidSync] = React.useState(false);

    // Used to open confirmation and information dialogs.
    const [confirmSync, setConfirmSync] = React.useState(false);
    const [syncInfo, setSyncInfo] = React.useState(false);

    /** Checks if syncing will actually change any information. */
    const checkValidSync = () => {
        let changesAvailable = changedAssessments.length + newAssessments.length > 0 || templateData.url !== courseData.url;

        let foundChangeSelection = false;
        changedAssessments.forEach(assessment => {
            if (assessment.newSelected) foundChangeSelection = true;
        })

        let foundNewSelection = false;
        newAssessments.forEach(assessment => {
            if (assessment.selected) foundNewSelection = true;
        })

        setValidSync(changesAvailable && (foundChangeSelection || foundNewSelection));
    };

    /**
     * Loads the assessment pairs that will be displayed to the user.
     * 
     * @param data - The course template to load.
     */
    const loadAssesmentList = React.useCallback((data = templateData) => {
        let assignments = [];
        for (const assignment of data.assignments) {
            let assessment = new Assessment(assignment.name, Number(assignment.weight), -1, assignment.dueDate, assignment.isAssignment, false, true);
            assessment.isUserAss = false;
            assignments.push(assessment);
        }    

        courseData.assessments.forEach(assessment => {
            let newAss = new Assessment(assessment.name, assessment.weight, -1, assessment.deadline, assessment.isAss, false, true);
            newAss.isUserAss = true;
            assignments.push(newAss);  
        });

        const blankAssessment = new Assessment("", 0, -1, "", null, false, false);

        const groupedAssignments = assignments.map((assignment) => {
            let found = assignments.filter((ass) => ass.name === assignment.name);
            if (found.length === 2) {
                let a1 = found[0]
                let a2 = found[1]
                return {
                    user: a1.isUserAss ? a1 : a2,
                    template: a2.isUserAss ? a1 : a2,
                    newSelected: true,
                    selected: true
                }
            }

            return {
                user: found[0].isUserAss ? found[0] : blankAssessment,
                template: found[0].isUserAss ? blankAssessment : found[0],
                newSelected: false,
                selected: true
            }
        });

        // Remove duplicates
        let filtered = groupedAssignments.filter((assignment, index) => {
            return index === groupedAssignments.findIndex((ass) => { 
                return ass.user.name === assignment.user.name && ass.template.name === assignment.template.name
            })
        });
        
        let changeFound = false;
        filtered.forEach((assessment) => {
            if (assessment.user.name === "") {
                changeFound = true;
                setNewAssessments(curr => [...curr, assessment]);
            } else if (assessment.template.name === "") {
                setUnchangedAssessments(curr => [...curr, assessment]);
            } else if(assessment.user.equalsTemplate(assessment.template)) {
                setEqualAssessments(curr => [...curr, assessment]);
            } else {
                changeFound = true;
                setChangedAssessments(curr => [...curr, assessment]);
            }
        });

        return changeFound || data.url !== courseData.url;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseData.deadlines, courseData.isAssList, courseData.names, courseData.weights, templateData]);

    /** Resets states and loads template when this dialog opens. */
    useEffect(() => {
        if (!open) return;
        
        setChangedAssessments([]);
        setUnchangedAssessments([]);
        setNewAssessments([]);
        setEqualAssessments([]);
        setNewAssessmentPreference(true);
        setKeepNewURL(true);
        if (templateData) {
            setValidSync(loadAssesmentList());
        } else {
            Axios.get("https://api.twentythreefiftynine.com/courses/" + courseData.code + "?year=" + courseData.year + "&trimester=" + courseData.tri).then((response) => {
                setTemplateData(response.data);
                setValidSync(loadAssesmentList(response.data));
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    /** Saves changes to complete sync. */
    useEffect(() => {
        if (!open) return;
        if (keepNewURL) courseData.url = templateData.url;
        saveChanges(true);
        onClose();
        setConfirmSync(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assessments]);

    /** Syncs local course data to then be saved on the cloud in a later function. */
    const sync = () => {
        let syncList = equalAssessments.map((assessment) => assessment.user);
        let existingAssessments = assessments.map((assessment) => assessment.name);
        
        syncList.forEach((assessment) => {
            let grade = assessments[existingAssessments.indexOf(assessment.name)].grade;
            assessment.grade = grade;
        });

        changedAssessments.forEach(assessment => {
            let grade = assessments[existingAssessments.indexOf(assessment.user.name)].grade;
            assessment.user.grade = grade;
            assessment.template.grade = grade;
            syncList.push(assessment.newSelected ? assessment.template : assessment.user);
        });

        unchangedAssessments.forEach(assessment => {
            let grade = assessments[existingAssessments.indexOf(assessment.user.name)].grade;
            assessment.user.grade = grade;
            if (assessment.selected) syncList.push(assessment.user);
        });

        newAssessments.forEach(assessment => {
            if (assessment.selected) syncList.push(assessment.template);
        });

        setAssessments(syncList);
    };

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <AppBar position="fixed" component="nav">
                <Toolbar>
                    <IconButton color="inherit" onClick={onClose}>
                        <Icon>close</Icon>
                    </IconButton>
                    <Typography sx={{ flex: 1, pl: 1 }} variant={isMobile ? "body1" : "h6"}> 
                        { courseData ? "Syncing " + courseData.code + " to it's Template" : "" } 
                    </Typography>
                    <Tooltip title={<h3> { !validSync ? "There are no changes to sync" : "" } </h3>} placement="left" arrow>
                        <Box>
                            <Button color="inherit" onClick={() => setConfirmSync(true)} disabled={!validSync}> Sync </Button>
                        </Box>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            <Box sx={{ mt: 10, mb: 10 }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography variant="h4" textAlign="center"> {courseData.code} </Typography>
                    <HelpRoundedIcon onClick={() => setSyncInfo(true)} sx={{ fontSize: 40, color: "grey", ml: 2, 
                        "&:hover": {color: "white" }, transition: "0.2s", cursor: "pointer" }} 
                    />
                </Box>
                
                <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                    <Card sx={{display: "flex", alignItems:"center", justifyContent:"center"}}>
                        <CardContent sx={{ width: 800, py: 4 }}>
                            <Stack sx={{ display: "flex", alignItems:"center", justifyContent:"center" }}>
                                <Stack direction="row" sx={{ display: "flex", alignItems:"center", justifyContent:"center" }}>
                                    <Typography sx={{ flexGrow: 1, flexBasis: 0, width: 300, textAlign:"end" }} variant="h6"> Current Assessments </Typography>
                                    <IconButton sx={{ mx: 2, backgroundColor:"secondary.main" }} 
                                        onClick={() => {
                                            setNewAssessmentPreference(!newAssessmentPreference);
                                            changedAssessments.forEach((assessment) => {
                                                assessment.newSelected = !newAssessmentPreference;
                                            });
                                            checkValidSync();
                                        }}
                                    > 
                                        <ArrowForwardIosIcon sx={{ transition: "all 0.2s linear", transform: newAssessmentPreference ? "rotate(0deg)" : "rotate(-180deg)"}} />
                                    </IconButton>
                                    <Typography variant="h6" sx={{flexGrow: 1, flexBasis: 0, width: 300}}>Template Assessments</Typography>
                                </Stack>

                                <FormControlLabel control={ <Checkbox defaultChecked /> } 
                                    label={ <Typography variant="h6"> Keep New Assessments </Typography> } labelPlacement="start" 
                                    onChange={(e, newValue) => {
                                        newAssessments.forEach((assessment) => {
                                            assessment.selected = newValue;
                                        });
                                        checkValidSync();
                                    }} 
                                />

                                <FormControlLabel control={ <Checkbox defaultChecked /> } 
                                    label={ <Typography variant="h6"> Keep Your Assessments </Typography> } labelPlacement="start" 
                                    onChange={(e, newValue) => {
                                        unchangedAssessments.forEach((assessment) => {
                                            assessment.selected = newValue;
                                        });
                                    }} 
                                />
                                
                                {   templateData && templateData.url !== courseData.url && (
                                    <Stack direction="row">
                                        <FormControlLabel control={ <Checkbox checked={keepNewURL} /> } 
                                            label={ <Typography variant="h6"> Keep New Course URL </Typography> } labelPlacement="start" 
                                            onChange={(e, newValue) => {
                                                setKeepNewURL(newValue);
                                            }} 
                                        />

                                        <Button disabled={templateData.url === ""} href={templateData.url} target="_blank" sx={{ fontSize: 18, ml: 2 }}> Open URL </Button>
                                    </Stack>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>

                    {   changedAssessments.length + equalAssessments.length + newAssessments.length + unchangedAssessments.length === 0 && 
                        <Stack direction="column" spacing={2} justifyContent="center" alignItems="center">
                            <Skeleton variant="rounded" width={900} height={150} />
                            <Skeleton variant="rounded" width={900} height={150} />
                            <Skeleton variant="rounded" width={900} height={150} />
                        </Stack>
                    }

                    {   changedAssessments.length > 0 && (
                        <>
                            <Typography variant="h5" textAlign="center"> Changed Assessments </Typography>
                            <Divider sx={{ width: "50%", borderWidth: 2 }} />

                            {   changedAssessments.map((assignment, i) => {
                                return (
                                    <Stack direction="row" key={assignment.user.name + assignment.template.name} justifyContent="center" alignItems="center">
                                        <SyncAssessmentCard assessment={assignment.user} />
                                        <IconButton onClick={() => { assignment.newSelected = !assignment.newSelected; checkValidSync(); }} sx={{ backgroundColor:"secondary.main", mx: 4 }}> 
                                            <ArrowForwardIosIcon sx={{ transition: "all 0.2s linear", transform: assignment.newSelected ? "rotate(0deg)" : "rotate(-180deg)" }} />
                                        </IconButton>
                                        <SyncAssessmentCard assessment={assignment.template} />
                                    </Stack>
                                )
                            })}
                            <Box visibility="hidden" sx={{ mb: 4 }} />
                        </>
                    )}

                    {   newAssessments.length > 0 && (
                        <>
                            <Typography variant="h5" textAlign="center"> New Assessments </Typography>
                            <Divider sx={{ width: "50%", borderWidth: 2 }} />

                            {   newAssessments.map((assignment) => {
                                return (
                                    <Stack direction="row" key={assignment.user.name + assignment.template.name} justifyContent="center" alignItems="center">
                                        <SyncAssessmentCard assessment={assignment.user}/>
                                        <IconButton onClick={() => { assignment.selected = !assignment.selected; checkValidSync(); }} sx={{ backgroundColor:"secondary.main", mx: 4 }}> 
                                            <ArrowForwardIosIcon sx={{ transition: "all 0.2s linear", transform: assignment.selected ? "rotate(0deg)" : "rotate(-180deg)" }} />
                                        </IconButton>
                                        <SyncAssessmentCard assessment={assignment.template} />
                                    </Stack>
                                )
                            })}
                            <Box visibility="hidden" sx={{ mb: 4 }} />
                        </>
                    )}

                    
                    {   unchangedAssessments.length > 0 && (
                        <>
                            <Typography variant="h5" textAlign="center"> Your Assessments </Typography>
                            <Divider sx={{ width: "50%", borderWidth: 2 }} />

                            {unchangedAssessments.map((assignment) => {
                                return (
                                    <Stack direction="row" key={assignment.user.name + assignment.template.name} justifyContent="center" alignItems="center">
                                        <SyncAssessmentCard assessment={assignment.user}/>
                                        <IconButton onClick={() => { assignment.selected = !assignment.selected; }} sx={{ backgroundColor:"secondary.main", mx: 4 }}> 
                                            <ArrowForwardIosIcon sx={{ transition: "all 0.2s linear", transform: !assignment.selected ? "rotate(0deg)" : "rotate(-180deg)" }} />
                                        </IconButton>
                                        <SyncAssessmentCard assessment={assignment.template} />
                                    </Stack>
                                )
                            })}
                            <Box visibility="hidden" sx={{ mb: 4 }} />
                        </>
                    )} 

                    {equalAssessments.length > 0 && (
                        <>
                            <Typography variant="h5" textAlign="center"> Equal Assessments </Typography>
                            <Divider sx={{ width: "50%", borderWidth: 2 }} />

                            {   equalAssessments.map((assignment) => {
                                return (
                                    <Stack direction="row" key={assignment.user.name + assignment.template.name} justifyContent="center" alignItems="center">
                                        <SyncAssessmentCard assessment={assignment.user} />
                                        <Box sx={{ mx: 5.1 }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M19 10H5V8h14v2m0 6H5v-2h14v2Z" />
                                            </svg>
                                        </Box>
                                        <SyncAssessmentCard assessment={assignment.template} />
                                    </Stack>
                                )
                            })}
                            <Box visibility="hidden" sx={{ mb: 4 }} />
                        </>
                    )}
                </Stack>
            </Box>

            <ConfirmDialog open={confirmSync} handleClose={() => {setConfirmSync(false)}} buttonText={"Sync"} message={"Sync " + courseData.code + " to it's Template?"} 
                subMessage={"This action cannot be reverted."} confirmAction={sync} 
            />
            
            <ConfirmDialog open={syncInfo} handleClose={() => {setSyncInfo(false)}} buttonText={"Got It"} message={"How Template Syncing Works"} confirmAction={null} 
                subMessage={"Syncing is the process of updating your course information with a newer version of the template." + 
                " You can choose what changes you want to keep from the new template and how much you want to keep from your current instance."}
            />
        </Dialog>
    );
};

export default SyncDialog;
