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
    Checkbox,
    Chip,
    CircularProgress,
    Collapse,
    Dialog,
    Divider,
    Fab,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    DesktopDatePicker,
    MobileDatePicker,
    LocalizationProvider,
} from "@mui/x-date-pickers";

import Assessment from "./Assessment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AssessmentViewerCard from "./AssessmentViewerCard";
import Axios from "axios";
import ConfirmDialog from "./ConfirmDialog";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import NewCourseDialog from "./NewCourseDialog";
import SyncDialog from "./SyncDialog";
import { TransitionGroup } from "react-transition-group";

import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import LaunchIcon from "@mui/icons-material/Launch";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import CourseViewerHeader from "./CourseViewerHeader";

const CourseViewer = (props) => {
    const { courseData, setViewedCourse, userDetails, setSessionData, sessionData, setCourseList } = props;

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
        if(isMobile){
            document.getElementById("slidePanelButton").removeEventListener("transitionend", handleTransitionEnd, false);
            document.getElementById("slidePanelButton").removeEventListener("transitionstart", handleTransitionStart, false);
        }
        setViewedCourse(null);
        setTemplateData(null);
    }, [handleKeyDown, handleTransitionEnd, handleTransitionStart, setViewedCourse]);

    const attemptClose = useCallback(() => {
        if(changesMadeR.current) setConfirmExit(true);
        else exitViewer();
    }, [exitViewer]);

    handleKeyDown = useCallback((event) => {
        if(event.key === "Escape") attemptClose();
    }, [attemptClose]);

    handleTransitionEnd = useCallback((event) => {
        if(sliderPosR.current === -270) setDeleteZIndex(1);
    }, []);

    handleTransitionStart = useCallback((event) => {
        if(sliderPosR.current === 0) setDeleteZIndex(0);
    }, []);

    React.useEffect(() => {
        if(assessments.length > 0) return;

        document.addEventListener("keydown", handleKeyDown, false);
        if(isMobile){
            document.getElementById("slidePanelButton").addEventListener("transitionend", handleTransitionEnd, false);
            document.getElementById("slidePanelButton").addEventListener("transitionstart", handleTransitionStart, false);
        }
        window.scrollTo(0, 0);

        setCourseCompletion((courseData.getCourseCompletion() * 100).toFixed(2));
        setCourseLetter(courseData.getCourseLetter());

        courseData.assessments.forEach((assessment) => {
            setAssessments(current => [...current, assessment.clone()]);
            setFilteredAssessments(current => [...current, assessment.clone()]);
        })
    }, [assessments.length, courseData, handleKeyDown, handleTransitionEnd, handleTransitionStart]);

    const sort = useCallback((type = sortType, list = filteredAssessments) => {
        if(type === "name-a") return sortAlgorithm(true, "name", list);
        else if(type === "name-d") return sortAlgorithm(false, "name", list);
        else if(type === "deadline-a") return sortAlgorithm(true, "deadline", list);
        else if(type === "deadline-d") return sortAlgorithm(false, "deadline", list);
        else if(type === "weight-a") return sortAlgorithm(false, "weight", list);
        else if(type === "weight-d") return sortAlgorithm(true, "weight", list);
    }, [filteredAssessments, sortType])

    const sortAlgorithm = (isAsc, value, temp) => {
        temp.sort((a, b) => a[value] > b[value] ? (isAsc ? 1 : -1) : (isAsc ? -1 : 1));
        return temp;
    }

    const filter = useCallback(() => {
        let temp = [];
        assessments.forEach((assessment) => {
            if(((finishedFilter && !isNaN(assessment.grade)) || (missingGradeFilter && isNaN(assessment.grade)) || (!finishedFilter && !missingGradeFilter)) &&
              ((pastDeadlineFilter && (new Date(assessment.deadline) < new Date())) || !pastDeadlineFilter) &&
              ((testFilter && !assessment.isAss) || (assignmentFilter && assessment.isAss) || (!testFilter && !assignmentFilter)))
                temp.push(assessment)
        })
        setFilteredAssessments(sort(sortType, temp));
    }, [assessments, assignmentFilter, finishedFilter, missingGradeFilter, pastDeadlineFilter, sort, sortType, testFilter]);

    React.useEffect(() => {
        if(assessments.length === 0) return;
        filter();
    }, [finishedFilter, missingGradeFilter, pastDeadlineFilter, testFilter, assignmentFilter, filter, assessments.length]);

    const handleChangeSort = (e) => {
        setSortType(e.target.value);
        setFilteredAssessments(sort(e.target.value));
    }

    const checkChanges = (override = changeOverride) => {
        let changes = false;
        let valid = true;
        assessments.forEach((assessment) => {
            if(assessment.hasChanged) changes = true;
            if(!assessment.valid) valid = false;
        })
        setChangesMade(changes || override);
        setValidChanges(valid);
    }

    const saveChanges = async (synced = false) => {
        setCurrentEdit(null);

        courseData.assessments = [];
        if(synced) courseData.lastSynced = new Date();
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
            url: courseData.url,
        }).then(() => {
            assessments.forEach((assessment) => assessment.resetStates);
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
    }

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
            }))
            setSessionData(temp);

            setConfirmDelete(false);
            exitViewer();
        }).catch((e) => {
            setSnackbar("error");
            setIsSuccess(false);
            setErrorText("Removing course failed, try again later");
        });
        setAPILoading(false);
    }

    const checkDuplicateName = () => {
        assessments.forEach((ass) => {
            ass.duplicateName = false;
            assessments.forEach((comparison) => {
                if(comparison !== ass && comparison.name === ass.name){
                    ass.duplicateName = true;
                }
            })
            ass.checkValid();
        })
    }

    return (
        <Box>  
            <CourseViewerHeader courseData={courseData} courseCompletion={courseCompletion} courseLetter={courseLetter} 
                sessionData={sessionData} changesMade={changesMade} deleteZIndex={deleteZIndex}
                setEditTemplate={setEditTemplate} setSyncMenuOpen={setSyncMenuOpen} setConfirmDelete={setConfirmDelete}
                attemptClose={attemptClose} validChanges={validChanges} apiLoading={apiLoading} saveChanges={saveChanges}
            />

            <Divider variant="middle" role="presentation" sx={{borderBottomWidth: 5, borderColor:"primary.main", mr: isMobile ? 3 : 10, ml: isMobile ? 3 : 10, mb: 5}} />

            <Stack direction="row" sx={{display:"flex", alignItems:"baseline", mb: 5}}>
                {currentEdit && !isMobile ? (
                    <Box sx={{flexGrow: 1, flexBasis: 0, display:"flex", justifyContent:"end", alignItems:"baseline"}}>
                        <Card sx={{width: 360, m: 0, display: "flex", alignItems:"baseline"}}>
                            <CardContent sx={{pt: 1, pr: 5, display: "flex", alignItems:"baseline"}}>
                                <Stack>
                                    <Stack direction="row" spacing={0}>
                                        <Typography variant="h5" sx={{mt: 1, ml: 0.3, width: 210}}> Edit {currentEdit.isAss ? "Assignment" : "Test"} </Typography>
                                            <ToggleButtonGroup
                                                exclusive size="small"
                                                value={currentEdit.isAss ? "ass" : "test"}
                                                onChange={(e, newValue) => { 
                                                    currentEdit.setIsAss(newValue === "ass");
                                                    checkChanges();
                                                }}
                                            >
                                                <ToggleButton value="ass">
                                                    <MenuBookRoundedIcon />
                                                </ToggleButton>
                                                <ToggleButton value="test">
                                                    <DescriptionRoundedIcon />
                                                </ToggleButton>
                                            </ToggleButtonGroup>

                                            <Tooltip title={<h3>Delete Assessment</h3>} placement="bottom" arrow>
                                                <IconButton color="error" sx={{ml: 1}} 
                                                    onClick={() => {
                                                        assessments.splice(assessments.indexOf(currentEdit), 1);
                                                        if(!currentEdit.isNew) setChangeOverride(true);
                                                        checkChanges(!currentEdit.isNew ? true : changeOverride);
                                                        setCurrentEdit(null);
                                                    }}
                                                >    
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                    </Stack>
                                    <Divider sx={{mb: 1.5, mt: 0.5}}/>
                                    <Stack>
                                        <TextField label="Assessment Name"
                                            sx={{width: "90%", mb: 2}}
                                            value={currentEdit.name} onChange={(e) => { 
                                                currentEdit.stopTransition = true;
                                                currentEdit.setName(e.target.value); 
                                                checkDuplicateName();
                                                checkChanges();
                                            }} 
                                            error={(currentEdit.name.length === 0 || currentEdit.name.length > 30 || currentEdit.duplicateName)} 
                                            helperText={currentEdit.name.length === 0 ? "This field cannot be empty" : currentEdit.name.length > 30 ? "This field  is too long" : currentEdit.duplicateName ? "Another assessment has the same name" : ""} 
                                        />

                                        <Box>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker label="Due Date"
                                                    value={currentEdit.deadline}
                                                    inputFormat="DD/MM/YYYY"
                                                    onChange={(newValue) => {
                                                        currentEdit.setDeadline(newValue.format("YYYY-MM-DD HH:mm:ss"));
                                                        checkChanges();
                                                    }}
                                                    renderInput={(params) => <TextField {...params} />}
                                                    
                                                />
                                            </LocalizationProvider>
                                        </Box>

                                        <TextField label="Worth (%)" InputProps={{ inputProps: { min: 0 } }} value={currentEdit.weight} sx={{ mt: 2, width: "74%"}}
                                            onChange={(e) => {
                                                if(!isNaN(e.target.value) && (!e.target.value.includes(".") || (e.target.value.split(".")[1].length || 0) <= 2)) currentEdit.setWeight(e.target.value);
                                                checkChanges();
                                            }} 
                                            error={(currentEdit.weight <= 0 || currentEdit.weight > 100)} 
                                            helperText={currentEdit.weight <= 0 ? "The value must be above 0" : currentEdit.weight > 100 ? "The value cannot be above 100" : ""} 
                                        />

                                        <Button variant="contained" sx={{mt: 2, mr: 1}} onClick={() => {setCurrentEdit(null)}}> Close </Button>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                ): <Box sx={{visibility: "hidden", flexGrow: 1, flexBasis: 0}} />}
                <Stack spacing={3} sx={{pl: 2, pr: 2}}>
                    {filteredAssessments.length > 0 ? <TransitionGroup appear={!currentEdit || !currentEdit.stopTransition} enter={!currentEdit || !currentEdit.stopTransition} exit={false}>
                        {filteredAssessments.map((assessment, index) => (
                            <Collapse key={index} sx={{mb: 2}}>
                                <AssessmentViewerCard assData={assessment} checkChanges={checkChanges} setCurrentEdit={setCurrentEdit} />
                            </Collapse>
                        ))} 
                    </TransitionGroup> : 
                    <Card>
                        <CardContent sx={{minWidth: 731}}>
                            <Typography variant="h5" component="div" sx={{textAlign:"center"}}>
                                No Assessments Match Filter
                            </Typography>
                        </CardContent>
                    </Card>} 
                    <Button variant="contained" 
                        onClick={() => {
                            let newAss = new Assessment("", 10, -1, new dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"), true, true);
                            setAssessments((current) => [...current, newAss]);
                            setCurrentEdit(newAss);
                            setChangesMade(true);
                            setValidChanges(false);
                        }}
                    > Add Assessment </Button>
                </Stack>

                <Box sx={{flexGrow: 1, flexBasis: 0}}>
                    {!isMobile && <Stack spacing={2}>
                        <Stack spacing={2} direction={"row"}>
                            <Tooltip title={<h3>Filter assessments</h3>} placement="top" arrow>
                                <IconButton onClick={() => {setFilterPanelOpen(!filterPanelOpen)}}>
                                    <FilterListIcon fontSize="large"/>
                                </IconButton>
                            </Tooltip>
                            <FormControl sx={{width:200}}>
                                <InputLabel> Sort By </InputLabel>
                                <Select value={sortType} label="Sort By" onChange={handleChangeSort}>
                                    <MenuItem value={"name-a"}>Name (Ascending)</MenuItem>
                                    <MenuItem value={"name-d"}>Name (Descending)</MenuItem>
                                    <MenuItem value={"deadline-a"}>Due Date (Closest)</MenuItem>
                                    <MenuItem value={"deadline-d"}>Due Date (Furthest)</MenuItem>
                                    <MenuItem value={"weight-a"}>Weight (Highest)</MenuItem>
                                    <MenuItem value={"weight-d"}>Weight (Lowest)</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Collapse in={filterPanelOpen}>
                            <Card sx={{width: 300}}>
                                <CardContent>
                                    <Stack spacing={0.5}>
                                        <Typography variant="h5" sx={{ml: 1.3 }}> Assessment Filters </Typography>
                                        <Divider />
                                        <FormControlLabel control={<Checkbox checked={finishedFilter} 
                                            onChange={() => {setFinishedFilter(!finishedFilter)}} />} label="Finished" />
                                        <FormControlLabel control={<Checkbox checked={missingGradeFilter} 
                                            onChange={() => {setMissingGradeFilter(!missingGradeFilter)}} />} label="Missing Grade" />
                                        <FormControlLabel control={<Checkbox checked={pastDeadlineFilter} 
                                            onChange={() => {setPastDeadlineFilter(!pastDeadlineFilter)}} />} label="Past Deadline" />
                                        <FormControlLabel control={<Checkbox checked={testFilter} 
                                            onChange={() => {setTestFilter(!testFilter)}} />} label="Test" />
                                        <FormControlLabel control={<Checkbox checked={assignmentFilter} 
                                            onChange={() => {setAssignmentFilter(!assignmentFilter)}} />} label="Assignment" />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Collapse>
                        <Box sx={{display:"flex", flexWrap:"wrap", gap: 1.5, width:300}}>
                            {finishedFilter && <Chip label="Finished" deleteIcon={<ClearIcon />} onDelete={() => {setFinishedFilter(false)}} sx={{width: 100}} />}
                            {missingGradeFilter && <Chip label="Missing Grade" deleteIcon={<ClearIcon />} onDelete={() => {setMissingGradeFilter(false)}} sx={{width: 130}} />}
                            {pastDeadlineFilter && <Chip label="Past Deadline" deleteIcon={<ClearIcon />} onDelete={() => {setPastDeadlineFilter(false)}} sx={{width: 130}} />}
                            {testFilter && <Chip label="Test" deleteIcon={<ClearIcon />} onDelete={() => {setTestFilter(false)}} sx={{width: 75}} />}
                            {assignmentFilter && <Chip label="Assignment" deleteIcon={<ClearIcon />} onDelete={() => {setAssignmentFilter(false)}} sx={{width: 120}} />}
                            {(finishedFilter || missingGradeFilter || pastDeadlineFilter || testFilter || assignmentFilter) && 
                                <Chip color="secondary" label="Clear Filters" onClick={() => {
                                    setFinishedFilter(false);
                                    setMissingGradeFilter(false);
                                    setPastDeadlineFilter(false);
                                    setTestFilter(false);
                                    setAssignmentFilter(false);
                                }
                            } sx={{width: 100}} />}
                        </Box>
                    </Stack>}
                </Box>  
            </Stack>

            
            {isMobile && (<>
                <Divider variant="middle" role="presentation" sx={{borderBottomWidth: 5, borderColor:"primary.main", mr: 3, ml: 3, mt: 2, mb : 2}} />
                <Stack direction="row" spacing={5} sx={{alignItems:"center", justifyContent:"center", mb: 2}}>
                    <Button sx={{width: 150, fontSize:"medium"}} variant="contained" onClick={attemptClose}> Return</Button>
                    <Box sx={{ position: 'relative' }}>
                        <Button disabled={!validChanges || !changesMade || apiLoading} sx={{width: 150, fontSize:"medium"}} variant="contained" onClick={() => {saveChanges()}}> Save</Button>
                        {apiLoading &&
                            <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px', }} />
                        }
                    </Box>
                </Stack>
            </>)}

            <ConfirmDialog open={confirmDelete} handleClose={() => {setConfirmDelete(false)}} buttonText={"Delete"} message={"Remove " + courseData.code + "?"} subMessage={"This action cannot be reverted."} confirmAction={deleteCourse} loading={apiLoading} />
            <ConfirmDialog open={confirmExit} handleClose={() => {setConfirmExit(false)}} buttonText={"Exit"} message={"Exit course viewer?"} subMessage={"You have unsaved changes."} confirmAction={exitViewer} />

            {isMobile && (
                <Box sx={{ position:"fixed", top: 90, right: sliderPos, transition: "all 0.3s linear"}}>
                    <Stack direction="row"> 
                    {/* //sx={{zIndex: sliderPos === 0 ? 3 : 1}} */}
                        <Stack>
                            <Box sx={{backgroundColor: "filterPanel.main", borderRadius: 0, borderBottomLeftRadius: 5, borderTopLeftRadius: 5, mr: -0.25}}>
                                <IconButton id="slidePanelButton" onClick={() => {setSliderPos(sliderPos === -270 ? 0 : -270)}} sx={{transition: "all 0.3s linear", transform: sliderPos === -135 ? "rotate(180deg)" : sliderPos === -270 ? "rotate(0deg)" : "rotate(180deg)"}}>
                                    <KeyboardArrowLeftIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{visibility: "hidden"}} />
                        </Stack>

                        <Card sx={{width: 270, borderTopLeftRadius: 0, mt: "-1px", backgroundColor:"filterPanel.main"}}>
                            <CardContent>
                                <Stack spacing={0.5}>
                                    <FormControl size="small" sx={{width:200, mb: 1, mt: 1}}>
                                        <InputLabel> Sort By </InputLabel>
                                        <Select value={sortType} label="Sort By" onChange={handleChangeSort}>
                                            <MenuItem value={"name-a"}>Name (Ascending)</MenuItem>
                                            <MenuItem value={"name-d"}>Name (Descending)</MenuItem>
                                            <MenuItem value={"deadline-a"}>Due Date (Closest)</MenuItem>
                                            <MenuItem value={"deadline-d"}>Due Date (Furthest)</MenuItem>
                                            <MenuItem value={"weight-a"}>Weight (Highest)</MenuItem>
                                            <MenuItem value={"weight-d"}>Weight (Lowest)</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Typography variant="body1" sx={{ml: 1.3 }}> Assessment Filters </Typography>
                                    
                                    <Divider />
                                    
                                    <Box sx={{alignSelf:"self-start", display:"flex", flexDirection:"column"}}>
                                        <FormControlLabel control={<Checkbox checked={finishedFilter}
                                            onChange={() => {setFinishedFilter(!finishedFilter)}} />} label="Finished" />
                                        <FormControlLabel control={<Checkbox checked={missingGradeFilter} 
                                            onChange={() => {setMissingGradeFilter(!missingGradeFilter)}} />} label="Missing Grade" />
                                        <FormControlLabel control={<Checkbox checked={pastDeadlineFilter} 
                                            onChange={() => {setPastDeadlineFilter(!pastDeadlineFilter)}} />} label="Past Deadline" />
                                        <FormControlLabel control={<Checkbox checked={testFilter} 
                                            onChange={() => {setTestFilter(!testFilter)}} />} label="Test" />
                                        <FormControlLabel control={<Checkbox checked={assignmentFilter} 
                                            onChange={() => {setAssignmentFilter(!assignmentFilter)}} />} label="Assignment" />
                                    </Box>

                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>
            )}


            <Dialog open={currentEdit !== null && isMobile} onClose={() => {setCurrentEdit(null)}}>
                <Stack sx={{display:"flex", alignItems:"center", mx: 3, my: 2}}>
                    <Typography variant="h5" sx={{mt: 1, mb:0.5, textAlign:"center"}}> Edit {currentEdit && currentEdit.isAss ? "Assignment" : "Test"} </Typography>

                    <ToggleButtonGroup
                        exclusive size="small"
                        value={currentEdit && currentEdit.isAss ? "ass" : "test"}
                        onChange={(e, newValue) => { 
                            currentEdit.setIsAss(newValue === "ass");
                            checkChanges();
                        }}
                    >
                        <ToggleButton value="ass">
                            <Typography> Assignment </Typography>
                        </ToggleButton>
                        <ToggleButton value="test">
                            <Typography> Test </Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Divider sx={{width: 240, mt: 2}} />

                    <TextField label="Assessment Name"
                        sx={{width: "90%", mb: 2, mt: 2}}
                        value={currentEdit ? currentEdit.name : ""} onChange={(e) => { 
                            currentEdit.stopTransition = true;
                            currentEdit.setName(e.target.value); 
                            checkDuplicateName();
                            checkChanges();
                        }} 
                        error={currentEdit && (currentEdit.name.length === 0 || currentEdit.name.length > 30 || currentEdit.duplicateName)} 
                        helperText={!currentEdit ? "" : currentEdit.name.length === 0 ? "This field cannot be empty" : currentEdit.name.length > 30 ? "This field  is too long" : currentEdit.duplicateName ? "Another assessment has the same name" : ""} 
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker label="Due Date" sx={{width: "20%"}}
                            value={currentEdit ? currentEdit.deadline : ""}
                            inputFormat="DD/MM/YYYY"
                            onChange={(newValue) => {
                                currentEdit.setDeadline(newValue.format("YYYY-MM-DD HH:mm:ss"));
                                checkChanges();
                            }}
                            renderInput={(params) => <TextField {...params} sx={{width:"90%"}} />}
                        />
                    </LocalizationProvider>

                    <TextField label="Worth (%)" type="number" InputProps={{ inputProps: { min: 0 } }} value={currentEdit ? currentEdit.weight : "0"} sx={{ mt: 2, width: "90%"}}
                        onChange={(e) => {
                            currentEdit.setWeight(e.target.value);
                            checkChanges();
                        }} 
                        error={currentEdit && (currentEdit.weight <= 0 || currentEdit.weight > 100)} 
                        helperText={!currentEdit ? "" : currentEdit.weight <= 0 ? "The value must be above 0" : currentEdit.weight > 100 ? "The value cannot be above 100" : ""} 
                        onKeyDown={(e) => {
                            if(((isNaN(e.key) && e.key !== ".") || currentEdit.weight.toString().length === 5) && e.key !== "Backspace" && e.key !== "Delete"){
                                e.preventDefault();
                            } 
                        }}
                    />

                    <Stack direction="row" spacing={2} sx={{display:"flex", justifyContent:"center", mt: 2, mb: 1}}>
                        <Button variant="outlined" 
                            onClick={() => {
                                assessments.splice(assessments.indexOf(currentEdit), 1);
                                if(!currentEdit.isNew) setChangeOverride(true);
                                checkChanges(!currentEdit.isNew ? true : changeOverride);
                                setCurrentEdit(null);
                            }}
                        >
                            Delete 
                        </Button>
                        <Button variant="contained"  onClick={() => {setCurrentEdit(null)}}> Close </Button>
                    </Stack>
                </Stack>
            </Dialog>

            {!isMobile && (<>
                <Tooltip title={<h3>Return to overview</h3>} placement="right" arrow>
                    <Fab color="primary" onClick={attemptClose} sx={{position: 'fixed', bottom: 32, left: 32}}>
                        <KeyboardArrowLeftIcon fontSize="large" />
                    </Fab>
                </Tooltip>
                
                {changesMade && (
                    <Box>
                        <Button disabled={!validChanges || apiLoading} sx={{position: "fixed", bottom: 32, right: 32, width: 150, fontSize:"medium"}} variant="contained" onClick={() => {saveChanges()}}> Save Changes</Button>
                        {apiLoading &&
                            <CircularProgress size={36} sx={{ position: 'fixed', bottom: 50, right: 90, mt: '-18px', ml: '-18px', }} />
                        }
                    </Box>
                )}
            </>)}
            <Snackbar open={snackbar !== "none"} autoHideDuration={4000} onClose={() => {setSnackbar("none")}} anchorOrigin={{ vertical:"bottom", horizontal: isMobile ? "center" : "right" }}>
                <Alert severity={isSuccess ? "success" : "error"} sx={{ width: isMobile ? '75%' : '100%'}}>
                    {isSuccess ? successText : errorText}
                </Alert>
            </Snackbar>

            <NewCourseDialog open={editTemplate} activeTri={{year: courseData.year, tri: courseData.tri}} editCode={courseData.code} templateData={templateData} setTemplateData={setTemplateData} 
                onClose={(didUpdate) => {
                    setEditTemplate(false); 
                    if(didUpdate){
                        courseData.lastUpdated = new Date();
                        if(!changesMade && !isMobile) setSyncSuggestion(true);
                    }
                }}
            />

            <ConfirmDialog open={syncSuggestion} handleClose={() => {setSyncSuggestion(false)}} buttonText={"Sync"} message={"Would you like to sync?"} subMessage={"You have updated the template but not your instance. Sync to update your course instance."} confirmAction={() => {setSyncMenuOpen(true); setSyncSuggestion(false)}} />

            <SyncDialog open={syncMenuOpen} onClose={() => {setSyncMenuOpen(false)}} courseData={courseData} templateData={templateData} setTemplateData={setTemplateData} assessments={assessments} setAssessments={setAssessments} saveChanges={saveChanges} />
        </Box>
    )
}

export default CourseViewer;
