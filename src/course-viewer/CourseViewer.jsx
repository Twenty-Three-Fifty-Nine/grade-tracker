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

import React, { useCallback } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Collapse,
    Divider,
    Fab,
    Snackbar,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import Assessment from "../classes/Assessment";
import AssessmentViewerCard from "./AssessmentViewerCard";
import Axios from "axios";
import ConfirmDialog from "../ConfirmDialog";
import CourseViewerEditorDesktop from "./CourseViewerEditorDesktop";
import CourseViewerEditorMobile from "./CourseViewerEditorMobile";
import CourseViewerFilterDesktop from "./CourseViewerFilterDesktop";
import CourseViewerFilterMobile from "./CourseViewerFilterMobile";
import CourseViewerHeader from "./CourseViewerHeader";
import CourseViewerMobileActionButtons from "./CourseViewerMobileActionButtons";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import NewCourseDialog from "../course-manipulation/NewCourseDialog";
import SyncDialog from "../course-manipulation/SyncDialog";
import { TransitionGroup } from "react-transition-group";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const CourseViewer = (props) => {
    const { 
        courseData, 
        setViewedCourse, 
        userDetails, 
        setSessionData, 
        sessionData, 
        setCourseList, 
    } = props;

    const [validChanges, setValidChanges] = React.useState(false);
    const [changesMade, setChangesMade] = React.useState(false);
    const [changeOverride, setChangeOverride] = React.useState(false);
    const changesMadeR = React.useRef();
    changesMadeR.current = changesMade;

    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const [confirmExit, setConfirmExit] = React.useState(false);

    const [snackbar, setSnackbar] = React.useState("none");
    const [isSuccess, setIsSuccess] = React.useState("success");
    const [successText, setSuccessText] = React.useState("");
    const [errorText, setErrorText] = React.useState("");

    const [sliderPos, setSliderPos] = React.useState(-270);
    const sliderPosR = React.useRef();
    sliderPosR.current = sliderPos;
    const [deleteZIndex, setDeleteZIndex] = React.useState(1);

    const [editTemplate, setEditTemplate] = React.useState(false);
    const [syncMenuOpen, setSyncMenuOpen] = React.useState(false);
    const [syncSuggestion, setSyncSuggestion] = React.useState(false);
    const [apiLoading, setAPILoading] = React.useState(false);

    const [courseCompletion, setCourseCompletion] = React.useState(NaN);
    const [courseLetter, setCourseLetter] = React.useState(null);

    const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
    const [sortType, setSortType] = React.useState("deadline-a");
    const [finishedFilter, setFinishedFilter] = React.useState(false);
    const [missingGradeFilter, setMissingGradeFilter] = React.useState(false);
    const [pastDeadlineFilter, setPastDeadlineFilter] = React.useState(false);
    const [testFilter, setTestFilter] = React.useState(false);
    const [assignmentFilter, setAssignmentFilter] = React.useState(false);

    const [assessments, setAssessments] = React.useState([]);
    const [filteredAssessments, setFilteredAssessments] = React.useState([]);
    const [currentEdit, setCurrentEdit] = React.useState(null);
    const [templateData, setTemplateData] = React.useState(false);

    let handleKeyDown = null;
    let handleTransitionEnd = null;
    let handleTransitionStart = null;

    const exitViewer = useCallback(() => {
        document.removeEventListener("keydown", handleKeyDown, false);
        if (isMobile) {
            document.getElementById("mobileSlidePanel").removeEventListener("transitionend", handleTransitionEnd, false);
            document.getElementById("mobileSlidePanel").removeEventListener("transitionstart", handleTransitionStart, false);
        }
        setViewedCourse(null);
        setTemplateData(null);
    }, [handleKeyDown, handleTransitionEnd, handleTransitionStart, setViewedCourse]);

    const attemptClose = useCallback(() => {
        if (changesMadeR.current) setConfirmExit(true);
        else exitViewer();
    }, [exitViewer]);

    handleKeyDown = useCallback((event) => {
        if (event.key === "Escape") attemptClose();
    }, [attemptClose]);

    handleTransitionEnd = useCallback((event) => {
        if (sliderPosR.current === -270) setDeleteZIndex(1);
    }, []);

    handleTransitionStart = useCallback((event) => {
        if (sliderPosR.current === 0) setDeleteZIndex(0);
    }, []);

    React.useEffect(() => {
        if (assessments.length > 0) return;

        document.addEventListener("keydown", handleKeyDown, false);
        if (isMobile) {
            document.getElementById("mobileSlidePanel").addEventListener("transitionend", handleTransitionEnd, false);
            document.getElementById("mobileSlidePanel").addEventListener("transitionstart", handleTransitionStart, false);
        }
        window.scrollTo(0, 0);

        setCourseCompletion((courseData.getCourseCompletion() * 100).toFixed(2));
        setCourseLetter(courseData.getCourseLetter());

        courseData.assessments.forEach((assessment) => {
            setAssessments(current => [...current, assessment.clone()]);
            setFilteredAssessments(current => [...current, assessment.clone()]);
        });
    }, [assessments.length, courseData, handleKeyDown, handleTransitionEnd, handleTransitionStart]);

    const sort = useCallback((type = sortType, list = filteredAssessments) => {
        if (type === "name-a") return sortAlgorithm(true, "name", list);
        else if (type === "name-d") return sortAlgorithm(false, "name", list);
        else if (type === "deadline-a") return sortAlgorithm(true, "deadline", list);
        else if (type === "deadline-d") return sortAlgorithm(false, "deadline", list);
        else if (type === "weight-a") return sortAlgorithm(false, "weight", list);
        else if (type === "weight-d") return sortAlgorithm(true, "weight", list);
    }, [filteredAssessments, sortType]);

    const sortAlgorithm = (isAsc, value, temp) => {
        temp.sort((a, b) => a[value] > b[value] ? (isAsc ? 1 : -1) : (isAsc ? -1 : 1));
        return temp;
    };

    const filter = useCallback(() => {
        let temp = [];
        assessments.forEach((assessment) => {
            if (((finishedFilter && !isNaN(assessment.grade)) || (missingGradeFilter && isNaN(assessment.grade)) || (!finishedFilter && !missingGradeFilter)) &&
               ((pastDeadlineFilter && (new Date(assessment.deadline) < new Date())) || !pastDeadlineFilter) &&
               ((testFilter && !assessment.isAss) || (assignmentFilter && assessment.isAss) || (!testFilter && !assignmentFilter)))
                temp.push(assessment);
        });
        setFilteredAssessments(sort(sortType, temp));
    }, [assessments, assignmentFilter, finishedFilter, missingGradeFilter, pastDeadlineFilter, sort, sortType, testFilter]);

    React.useEffect(() => {
        if (assessments.length === 0) return;
        filter();
    }, [finishedFilter, missingGradeFilter, pastDeadlineFilter, testFilter, assignmentFilter, filter, assessments.length]);

    const handleChangeSort = (e) => {
        setSortType(e.target.value);
        setFilteredAssessments(sort(e.target.value));
    };

    const checkChanges = (override = changeOverride) => {
        let changes = false;
        let valid = true;
        assessments.forEach((assessment) => {
            if (assessment.hasChanged) changes = true;
            if (!assessment.valid) valid = false;
        });
        setChangesMade(changes || override);
        setValidChanges(valid);
    };

    const saveChanges = async (synced = false) => {
        setCurrentEdit(null);

        courseData.assessments = [];
        if (synced) courseData.lastSynced = new Date();
        assessments.forEach((assessment) => {
            courseData.assessments.push(assessment.clone());
        });

        courseData.updateTotal();
        setCourseCompletion((courseData.getCourseCompletion() * 100).toFixed(2));
        setCourseLetter(courseData.getCourseLetter());

        assessments.forEach((assessment) => {
            assessment.grade = isNaN(assessment.grade) ? -1 : assessment.grade;
        });

        setAPILoading(true);

        await Axios.patch("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/" + userDetails.email + "/courses/" + courseData.code, {
            assignments: assessments,
            totalGrade: courseData.totalGrade,
            year: courseData.year,
            synced: synced,
            url: courseData.url
        }).then(() => {
            assessments.forEach((assessment) => {
                assessment.resetStates();
            });
            setChangeOverride(false);
            checkChanges(false);

            setSnackbar("success")
            setIsSuccess(true);
            setSuccessText("Changes saved successfully");
        }).catch((e) => {
            setSnackbar("error");
            setIsSuccess(false);
            setErrorText("Saving to server failed, try again later");
        });

        setAPILoading(false);

        assessments.forEach((assessment) => {
            assessment.grade = assessment.grade === -1 ? NaN : assessment.grade;
        });
    };

    const deleteCourse = async () => {
        setAPILoading(true);

        await Axios.delete("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/" + userDetails.email + "/courses/" + courseData.code + "/" + courseData.year).then((response) => {
            setCourseList(current => [...current, courseData.code].sort());

            let temp = sessionData;
            temp.courses[courseData.year][courseData.tri - 1].forEach((course => {
                if(course.code === courseData.code){
                    let index = temp.courses[courseData.year][courseData.tri - 1].indexOf(course)
                    temp.courses[courseData.year][courseData.tri - 1].splice(index, 1);
                }
            }));
            setSessionData(temp);

            setConfirmDelete(false);
            exitViewer();
        }).catch((e) => {
            setSnackbar("error");
            setIsSuccess(false);
            setErrorText("Removing course failed, try again later");
        });

        setAPILoading(false);
    };

    const checkDuplicateName = () => {
        assessments.forEach((ass) => {
            ass.duplicateName = false;
            assessments.forEach((comparison) => {
                if (comparison !== ass && comparison.name === ass.name) {
                    ass.duplicateName = true;
                }
            })
            ass.checkValid();
        });
    };

    return (
        <Box>  
            <CourseViewerHeader courseData={courseData} courseCompletion={courseCompletion} courseLetter={courseLetter} 
                sessionData={sessionData} changesMade={changesMade} deleteZIndex={deleteZIndex}
                setEditTemplate={setEditTemplate} setSyncMenuOpen={setSyncMenuOpen} setConfirmDelete={setConfirmDelete}
                attemptClose={attemptClose} validChanges={validChanges} apiLoading={apiLoading} saveChanges={saveChanges}
            />

            <Divider variant="middle" role="presentation" 
                sx={{ borderBottomWidth: 5, borderColor:"primary.main", mr: isMobile ? 3 : 10, ml: isMobile ? 3 : 10, mb: 5 }} 
            />

            <Stack direction="row" sx={{ display:"flex", alignItems:"baseline", mb: 5 }}>
                {   currentEdit && !isMobile ?  
                    <CourseViewerEditorDesktop currentEdit={currentEdit} setCurrentEdit={setCurrentEdit} checkChanges={checkChanges} assessments={assessments} 
                        changeOverride={changeOverride} setChangeOverride={setChangeOverride} checkDuplicateName={checkDuplicateName}
                    /> : <Box sx={{ visibility: "hidden", flexGrow: 1, flexBasis: 0 }} />
                }

                <Stack spacing={3} sx={{ pl: 2, pr: 2 }}>
                    {   filteredAssessments.length > 0 ? 
                        <TransitionGroup appear={!currentEdit || !currentEdit.stopTransition} enter={!currentEdit || !currentEdit.stopTransition} exit={false}>
                            {filteredAssessments.map((assessment, index) => (
                                <Collapse key={index} sx={{ mb: 2 }}>
                                    <AssessmentViewerCard assData={assessment} checkChanges={checkChanges} setCurrentEdit={setCurrentEdit} />
                                </Collapse>
                            ))} 
                        </TransitionGroup> : 
                        <Card>
                            <CardContent sx={{ minWidth: 731 }}>
                                <Typography variant="h5" component="div" sx={{textAlign:"center"}}> No Assessments Match Filter </Typography>
                            </CardContent>
                        </Card>
                    } 
                    
                    <Button variant="contained" 
                        onClick={() => {
                            let newAss = new Assessment("", 10, -1, new dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"), true, true, false);
                            setAssessments((current) => [...current, newAss]);
                            setCurrentEdit(newAss);
                            setChangesMade(true);
                            setValidChanges(false);
                        }}
                    > Add Assessment </Button>
                </Stack>

                <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
                    {   !isMobile && 
                        <CourseViewerFilterDesktop setFilterPanelOpen={setFilterPanelOpen} filterPanelOpen={filterPanelOpen} 
                            sortType={sortType} handleChangeSort={handleChangeSort} finishedFilter={finishedFilter} missingGradeFilter={missingGradeFilter}
                            pastDeadlineFilter={pastDeadlineFilter} testFilter={testFilter} assignmentFilter={assignmentFilter} setFinishedFilter={setFinishedFilter}
                            setMissingGradeFilter={setMissingGradeFilter} setPastDeadlineFilter={setPastDeadlineFilter} setTestFilter={setTestFilter} setAssignmentFilter={setAssignmentFilter}
                        />
                    }
                </Box>  
            </Stack>
            
            {   !isMobile && 
                <Box>
                    <Tooltip title={<h3> Return to overview </h3>} placement="right" arrow>
                        <Fab color="primary" onClick={attemptClose} sx={{ position: "fixed", bottom: 32, left: 32 }}>
                            <KeyboardArrowLeftIcon fontSize="large" />
                        </Fab>
                    </Tooltip>
                    
                    {changesMade && (
                        <Box>
                            <Button disabled={!validChanges || apiLoading} sx={{ position: "fixed", bottom: 32, right: 32, width: 150, fontSize:"medium" }} 
                                variant="contained" onClick={() => {saveChanges()}}> 
                                Save Changes
                            </Button>
                            {apiLoading && <CircularProgress size={36} sx={{ position: "fixed", bottom: 50, right: 90, mt: "-18px", ml: "-18px" }} />}
                        </Box>
                    )}
                </Box>
            }

            {   isMobile && 
                <CourseViewerMobileActionButtons attemptClose={attemptClose} validChanges={validChanges} 
                    changesMade={changesMade} apiLoading={apiLoading} saveChanges={saveChanges} mb={2}
                />
            }

            {   isMobile && 
                <Box id="mobileSlidePanel"> 
                    <CourseViewerFilterMobile sliderPos={sliderPos} setSliderPos={setSliderPos} sortType={sortType} 
                        handleChangeSort={handleChangeSort} finishedFilter={finishedFilter} missingGradeFilter={missingGradeFilter} pastDeadlineFilter={pastDeadlineFilter} 
                        testFilter={testFilter} assignmentFilter={assignmentFilter} setFinishedFilter={setFinishedFilter} setMissingGradeFilter={setMissingGradeFilter}
                        setPastDeadlineFilter={setPastDeadlineFilter} setTestFilter={setTestFilter} setAssignmentFilter={setAssignmentFilter}
                    />
                </Box>
            }
            
            <CourseViewerEditorMobile currentEdit={currentEdit} setCurrentEdit={setCurrentEdit} checkChanges={checkChanges} assessments={assessments} 
                changeOverride={changeOverride} setChangeOverride={setChangeOverride} checkDuplicateName={checkDuplicateName}
            />

            <ConfirmDialog open={confirmDelete} handleClose={() => setConfirmDelete(false)} buttonText={"Delete"} message={"Remove " + courseData.code + "?"} 
                subMessage={"This action cannot be reverted."} confirmAction={deleteCourse} loading={apiLoading} 
            />

            <ConfirmDialog open={confirmExit} handleClose={() => setConfirmExit(false)} buttonText={"Exit"} message={"Exit course viewer?"} 
                subMessage={"You have unsaved changes."} confirmAction={exitViewer} 
            />

            <ConfirmDialog open={syncSuggestion} handleClose={() => setSyncSuggestion(false)} buttonText={"Sync"} message={"Would you like to sync?"} 
                subMessage={"You have updated the template but not your instance. Sync to update your course instance."} 
                confirmAction={() => {
                    setSyncMenuOpen(true); 
                    setSyncSuggestion(false)
                }} 
            />

            <NewCourseDialog open={editTemplate} activeTri={{ year: courseData.year, tri: courseData.tri }} editCode={courseData.code} 
                templateData={templateData} setTemplateData={setTemplateData} 
                onClose={(didUpdate) => {
                    setEditTemplate(false); 
                    if (didUpdate) {
                        courseData.lastUpdated = new Date();
                        if (!changesMade && !isMobile) setSyncSuggestion(true);
                    }
                }}
            />

            <SyncDialog open={syncMenuOpen} onClose={() => setSyncMenuOpen(false)} courseData={courseData} templateData={templateData} 
                setTemplateData={setTemplateData} assessments={assessments} setAssessments={setAssessments} saveChanges={saveChanges} 
            />

            <Snackbar open={snackbar !== "none"} autoHideDuration={4000} onClose={() => setSnackbar("none")}
                anchorOrigin={{ vertical:"bottom", horizontal: isMobile ? "center" : "right" }}
            >
                <Alert severity={isSuccess ? "success" : "error"} sx={{ width: isMobile ? "75%" : "100%" }}>
                    { isSuccess ? successText : errorText }
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CourseViewer;
