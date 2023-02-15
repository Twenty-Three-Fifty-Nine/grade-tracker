import { Typography, Stack, Button, Box, Chip, Divider, Fab, IconButton, FormControl, Tooltip, InputLabel, MenuItem, Select, Card, CardContent, FormControlLabel, Checkbox, Snackbar, Alert, Collapse, TextField, ToggleButtonGroup, ToggleButton } from "@mui/material";
import React, {useCallback} from "react";
import { DesktopDatePicker, MobileDatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Axios from "axios";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { TransitionGroup } from 'react-transition-group';

import LaunchIcon from '@mui/icons-material/Launch';
import AssessmentViewerCard from "./AssessmentViewerCard";
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from "./ConfirmDialog";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';

class Assessment {
    constructor(name, weight, grade, deadline, isAss, isNew) {
        this.name = name;
        this.weight = weight;
        this.grade = grade === -1 ? NaN : grade;
        this.deadline = deadline;

        this.gradeValid = true;
        this.valid = true;
        this.isNew = isNew;

        this.duplicateName = false;

        this.isAss = isAss;
        this.hasChanged = isNew;
        this.stopTransition = false;

        this.initName = name;
        this.initDeadline = deadline;
        this.initGrade = grade === -1 ? NaN : grade;
        this.initAss = isAss;
        this.initWeight = weight;
    }

    checkValid() {
        let nameValid = !(this.name.length === 0 || this.name.length > 30 || this.duplicateName);
        let weightValid = this.weight > 0 && this.weight <= 100;
        this.valid = nameValid && this.gradeValid && weightValid;
    }

    checkIfChanged() {
        let gradeChanged = isNaN(this.grade) ? !isNaN(this.initGrade) : this.grade !== this.initGrade;
        let nameChanged = this.name !== this.initName;
        let deadlineChanged = this.deadline !== this.initDeadline;
        let isAssChanged = this.isAss !== this.initAss;
        let weightChanged = this.weight !== this.initWeight;
        this.hasChanged = this.isNew || gradeChanged || nameChanged || deadlineChanged || isAssChanged || weightChanged;
    }

    setGrade(grade) {
        this.grade = parseInt(grade);
        this.checkIfChanged();
    }

    setName(name) {
        this.name = name;
        this.checkIfChanged();
        this.checkValid();
    }

    setDeadline(deadline) {
        this.deadline = deadline;
        this.checkIfChanged();
    }

    setWeight(weight){
        this.weight = weight;
        this.checkValid();
        this.checkIfChanged();
    }

    setIsAss(isAss) {
        this.isAss = isAss;
        this.checkIfChanged();
    }
} 

const CourseViewer = (props) => {
    const { courseData, setViewedCourse, userDetails, setSessionData, sessionData, setCourseList } = props;
    const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
    const [validChanges, setValidChanges] = React.useState(false);
    const [changesMade, setChangesMade] = React.useState(false);
    const [changeOverride, setChangeOverride] = React.useState(false);
    const changesMadeR = React.useRef(false);
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const [confirmExit, setConfirmExit] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState("none");
    const [isSuccess, setIsSuccess] = React.useState("success");
    const [successText, setSuccessText] = React.useState("");
    const [errorText, setErrorText] = React.useState("");
    const [sliderPos, setSliderPos] = React.useState(-270);

    const [courseCompletion, setCourseCompletion] = React.useState(NaN);
    const [courseLetter, setCourseLetter] = React.useState(null);

    const [sortType, setSortType] = React.useState("deadline-a");
    const [finishedFilter, setFinishedFilter] = React.useState(false);
    const [missingGradeFilter, setMissingGradeFilter] = React.useState(false);
    const [pastDeadlineFilter, setPastDeadlineFilter] = React.useState(false);
    const [testFilter, setTestFilter] = React.useState(false);
    const [assignmentFilter, setAssignmentFilter] = React.useState(false);

    const [assessments, setAssessments] = React.useState([]);
    const [filteredAssessments, setFilteredAssessments] = React.useState([]);
    const [currentEdit, setCurrentEdit] = React.useState(null);

    let handleKeyDown = null;

    const exitViewer = useCallback(() => {
        document.removeEventListener("keydown", handleKeyDown, false);
        setViewedCourse(null);
    }, [handleKeyDown, setViewedCourse]);

    const attemptClose = useCallback(() => {
        if(changesMadeR.changes) setConfirmExit(true);
        else exitViewer();
    }, [exitViewer]);

    handleKeyDown = useCallback((event) => {
        if(event.key === "Escape") {
            attemptClose();
        }
    }, [attemptClose]);

    React.useEffect(() => {
        if(assessments.length > 0) return;
        document.addEventListener("keydown", handleKeyDown, false);
        window.scrollTo(0, 0);

        setCourseCompletion((courseData.getCourseCompletion() * 100).toFixed(2));
        setCourseLetter(courseData.getCourseLetter());

        for(let i = 0; i < courseData.names.length; i++){
            const name = courseData.names[i];
            const weight = courseData.weights[i];
            const deadline = courseData.deadlines[i];
            const grade = courseData.grades[i];
            const isAss = courseData.isAssList[i];
            const assessment = new Assessment(name, weight, grade, deadline, isAss);
            setAssessments(current => [...current, assessment]);
            setFilteredAssessments(current => [...current, assessment]);
        };
    }, [assessments.length, courseData, handleKeyDown]);

    const sort = useCallback((type = sortType, list = filteredAssessments) => {
        if(type === "name-a") return sortAlgorithm(true, "name", list);
        else if(type === "name-d") return sortAlgorithm(false, "name", list);
        else if(type === "deadline-a") return sortAlgorithm(true, "deadline", list);
        else if(type === "deadline-d") return sortAlgorithm(false, "deadline", list);
        else if(type === "weight-a") return sortAlgorithm(false, "weight", list);
        else if(type === "weight-d") return sortAlgorithm(true, "weight", list);
    }, [filteredAssessments, sortType])

    const filter = useCallback(() => {
        let temp = [];
        assessments.forEach((assessment) => {
            if((finishedFilter && !isNaN(assessment.grade)) || (missingGradeFilter && isNaN(assessment.grade)) || (!finishedFilter && !missingGradeFilter)){
                if((pastDeadlineFilter && (new Date(assessment.deadline) < new Date())) || !pastDeadlineFilter){
                    if((testFilter && !assessment.isAss) || (assignmentFilter && assessment.isAss) || (!testFilter && !assignmentFilter)){
                        temp.push(assessment)
                    }
                }
            }
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

    const sortAlgorithm = (isAsc, value, temp) => {
        temp.sort((a, b) => a[value] > b[value] ? (isAsc ? 1 : -1) : (isAsc ? -1 : 1));
        return temp;
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
        changesMadeR.changes = changes || override;
    }

    const saveChanges = () => {
        courseData.names = [];
        courseData.weights = [];
        courseData.deadlines = [];
        courseData.grades = [];
        courseData.isAssList = [];
        assessments.forEach((assessment) => {
            let index = assessments.indexOf(assessment);
            courseData.names[index] = assessment.name;
            courseData.weights[index] = assessment.weight;
            courseData.deadlines[index] = assessment.deadline;
            courseData.grades[index] = assessment.grade;
            courseData.isAssList[index] = assessment.isAss;
        })

        courseData.updateTotal();
        setCourseCompletion((courseData.getCourseCompletion() * 100).toFixed(2));
        setCourseLetter(courseData.getCourseLetter());

        assessments.forEach((assessment) => {
            assessment.grade = isNaN(assessment.grade) ? -1 : assessment.grade;
        });

        Axios.patch("https://b0d0rkqp47.execute-api.ap-southeast-2.amazonaws.com/test/users/" + userDetails.email + "/courses/" + courseData.code, {
            assignments: assessments,
            totalGrade: courseData.totalGrade,
            year: courseData.year,
        }).then(() => {
            assessments.forEach((assessment) => {
                assessment.hasChanged = false;
                assessment.isNew = false;
                assessment.initGrade = parseInt(assessment.grade);
                assessment.initName = assessment.name;
                assessment.initAss = assessment.isAss;
                assessment.initDeadline = assessment.deadline; 
            })
            setChangeOverride(false);
            checkChanges(false);
            setSnackbar("success")
            setIsSuccess(true);
            setSuccessText("Changes saved successfully");
        }).catch(() => {
            setSnackbar("error");
            setIsSuccess(false);
            setErrorText("Saving to server failed, try again later");
        });

        assessments.forEach((assessment) => {
            assessment.grade = assessment.grade === -1 ? NaN : assessment.grade;
        });
    }

    const deleteCourse = async () => {
        Axios.delete("https://b0d0rkqp47.execute-api.ap-southeast-2.amazonaws.com/test/users/" + userDetails.email + "/courses/" + courseData.code + "/" + courseData.year).then((response) => {
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
            <Box sx={{mt: 3, pb: 3}}>
                <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                    {courseData.name}
                </Typography>
                {!isMobile ? (<Stack spacing={20} direction="row" sx={{display:"flex", flexDirection: "row", justifyContent: "space-between", alignItems:"baseline", ml: 2, mr: 2, mt: 2}}>
                    <Stack sx={{flexGrow: 1, flexBasis: 0}}>
                        <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                            Trimester {courseData.tri} - {courseData.year}
                        </Typography>
                        <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                            {!isNaN(courseCompletion) ? courseCompletion : "?" }% Completed
                        </Typography>
                        <Box sx={{alignSelf:"center"}}>
                            <Button disabled={courseData.url === ""} variant="contained" href={courseData.url} target="_blank" sx={{fontSize:"large", pt: 1, mt: 1}}> {courseData.code} Course Page <LaunchIcon sx={{ml: 1, mt: -0.2}} /> </Button>
                        </Box>
                    </Stack>

                    <Stack spacing={2}>
                        <Typography variant="h4" component="div" sx={{textAlign:"center"}}> 
                            Currently Achieved:
                        </Typography>
                        <Stack direction="row" spacing={10} sx={{alignItems:"center", justifyContent:"center"}}>
                            <Chip label={courseData.totalGrade + "%"} color="secondary" sx={{p: 1, pt: 3, pb: 3, fontSize:30, backgroundColor:"primary.main", borderRadius: 1}} />
                            <Chip label={courseLetter ? courseLetter : "-"} color="secondary" sx={{p: 2, pt: 3, pb: 3, fontSize:30, backgroundColor:"primary.main", borderRadius: 1}} />
                        </Stack>
                    </Stack>

                    <Stack sx={{flexGrow: 1, flexBasis: 0}}>
                        <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                            Template last updated: {new dayjs(courseData.lastUpdated).format("DD/MM/YYYY")}
                        </Typography>
                        <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                            Last synced to template: {new dayjs(courseData.lastSynced).format("DD/MM/YYYY")}
                        </Typography>
                        <Stack spacing={2} direction="row" sx={{display:"flex", justifyContent:"center", mt: 1.2}}>
                            <Box sx={{alignSelf:"center"}}>
                                <Button variant="contained" sx={{fontSize:"large"}}> Update Template </Button>
                            </Box>
                            <Box sx={{alignSelf:"center"}}>
                                <Button variant="contained" sx={{fontSize:"large"}}> Sync </Button>
                            </Box>
                            <Box sx={{alignSelf:"center"}}>
                                <Tooltip title={<h3>Remove Course</h3>} placement="bottom" arrow>
                                    <IconButton color="error" size="medium" onClick={() => {setConfirmDelete(true)}}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Stack>
                    </Stack>
                </Stack>) : (
                    <Box>
                        <Stack sx={{flexGrow: 1, flexBasis: 0}}>
                            <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                                {!isNaN(courseCompletion) ? courseCompletion : "?" }% Completed
                            </Typography>
                            <Box sx={{alignSelf:"center"}}>
                                <Button disabled={courseData.url === ""} variant="contained" href={courseData.url} target="_blank" sx={{fontSize:"large", pt: 1, mt: 1}}> {courseData.code} Course Page <LaunchIcon sx={{ml: 1, mt: -0.2}} /> </Button>
                            </Box>
                        </Stack>

                        <Divider variant="middle" role="presentation" sx={{borderBottomWidth: 5, borderColor:"primary.main", mr: isMobile ? 3 : 10, ml: isMobile ? 3 : 10, mt: 2, mb : 2}} />

                        <Stack sx={{flexGrow: 1, flexBasis: 0}}>
                            <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                                Template last updated: {new dayjs(courseData.lastUpdated).format("DD/MM/YYYY")}
                            </Typography>
                            <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                                Last synced to template: {new dayjs(courseData.lastSynced).format("DD/MM/YYYY")}
                            </Typography>
                            <Stack spacing={2} direction="row" sx={{display:"flex", justifyContent:"center", mt: 1.2}}>
                                <Box sx={{alignSelf:"center"}}>
                                    <Button variant="contained" sx={{fontSize:"large"}}> Update Template </Button>
                                </Box>
                                <Box sx={{alignSelf:"center"}}>
                                    <Button variant="contained" sx={{fontSize:"large"}}> Sync </Button>
                                </Box>
                                <Box sx={{alignSelf:"center"}}>
                                    <Tooltip title={<h3>Remove Course</h3>} placement="bottom" arrow>
                                        <IconButton color="error" size="medium" onClick={() => {setConfirmDelete(true)}}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Stack>
                        </Stack>

                        <Divider variant="middle" role="presentation" sx={{borderBottomWidth: 5, borderColor:"primary.main", mr: isMobile ? 3 : 10, ml: isMobile ? 3 : 10, mt: 2, mb : 2}} />

                        <Typography variant="h4" component="div" sx={{textAlign:"center"}}> 
                            Currently Achieved:
                        </Typography>
                        <Stack direction="row" spacing={5} sx={{alignItems:"center", justifyContent:"center"}}>
                            <Chip label={courseData.totalGrade + "%"} color="secondary" sx={{p: 1, pt: 3, pb: 3, fontSize:30, backgroundColor:"primary.main", borderRadius: 1}} />
                            <Chip label={courseLetter ? courseLetter : "-"} color="secondary" sx={{p: 2, pt: 3, pb: 3, fontSize:30, backgroundColor:"primary.main", borderRadius: 1}} />
                        </Stack>

                        <Divider variant="middle" role="presentation" sx={{borderBottomWidth: 5, borderColor:"primary.main", mr: isMobile ? 3 : 10, ml: isMobile ? 3 : 10, mt: 2, mb : 2}} />

                        <Stack direction="row" spacing={5} sx={{alignItems:"center", justifyContent:"center"}}>
                            <Button sx={{width: 150, fontSize:"medium"}} variant="contained" onClick={attemptClose}> Return</Button>
                            <Button disabled={!validChanges || !changesMade} sx={{width: 150, fontSize:"medium"}} variant="contained" onClick={saveChanges}> Save</Button>
                        </Stack>
                    </Box>
                )}
            </Box>

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

                                        <TextField label="Worth (%)" type="number" InputProps={{ inputProps: { min: 0 } }} value={currentEdit.weight} sx={{ mt: 2, width: "74%"}}
                                            onChange={(e) => {
                                                currentEdit.setWeight(e.target.value);
                                                checkChanges();
                                            }} 
                                            error={(currentEdit.weight <= 0 || currentEdit.weight > 100)} 
                                            helperText={currentEdit.weight <= 0 ? "The value must be above 0" : currentEdit.weight > 100 ? "The value cannot be above 100" : ""} 
                                            onKeyDown={(e) => {
                                                if(((isNaN(e.key) && e.key !== ".") || currentEdit.weight.toString().length === 5) && e.key !== "Backspace" && e.key !== "Delete"){
                                                    e.preventDefault();
                                                } 
                                            }}
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

            
            {isMobile && <Stack direction="row" spacing={5} sx={{alignItems:"center", justifyContent:"center", mb: 2}}>
                <Divider variant="middle" role="presentation" sx={{borderBottomWidth: 5, borderColor:"primary.main", mr: 3, ml: 3, mt: 2, mb : 2}} />
                <Button sx={{width: 150, fontSize:"medium"}} variant="contained" onClick={attemptClose}> Return</Button>
                <Button disabled={!validChanges || !changesMade} sx={{width: 150, fontSize:"medium"}} variant="contained" onClick={saveChanges}> Save</Button>
            </Stack>}

            <ConfirmDialog open={confirmDelete} handleClose={() => {setConfirmDelete(false)}} buttonText={"Delete"} message={"Remove " + courseData.code + "?"} subMessage={"This action cannot be reverted."} confirmAction={deleteCourse} />
            <ConfirmDialog open={confirmExit} handleClose={() => {setConfirmExit(false)}} buttonText={"Exit"} message={"Exit course viewer?"} subMessage={"You have unsaved changes."} confirmAction={exitViewer} />

            {isMobile && (
                <Box sx={{ position:"fixed", top: 90, right: sliderPos, transition: "all 0.3s linear"}}>
                    <Stack direction="row">
                        <Stack>
                            <Box sx={{backgroundColor: "filterPanel.main", borderRadius: 0, borderBottomLeftRadius: 5, borderTopLeftRadius: 5, mr: -0.25}}>
                                <IconButton onClick={() => {setSliderPos(sliderPos === -270 ? 0 : -270)}} sx={{transition: "all 0.3s linear", transform: sliderPos === -135 ? "rotate(180deg)" : sliderPos === -270 ? "rotate(0deg)" : "rotate(180deg)"}}>
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

            {!isMobile && (<>
                <Tooltip title={<h3>Return to overview</h3>} placement="right" arrow>
                    <Fab color="primary" onClick={attemptClose} sx={{position: 'fixed', bottom: 32, left: 32}}>
                        <KeyboardArrowLeftIcon fontSize="large" />
                    </Fab>
                </Tooltip>

                {changesMade && <Button disabled={!validChanges} sx={{position: "fixed", bottom: 32, right: 32, width: 150, fontSize:"medium"}} variant="contained" onClick={saveChanges}> Save Changes</Button>}
            </>)}
            <Snackbar open={snackbar !== "none"} autoHideDuration={4000} onClose={() => {setSnackbar("none")}} anchorOrigin={{ vertical:"bottom", horizontal: isMobile ? "left" : "right" }}>
                <Alert severity={isSuccess ? "success" : "error"} sx={{ width: isMobile ? '75%' : '100%'}}>
                    {isSuccess ? successText : errorText}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default CourseViewer;