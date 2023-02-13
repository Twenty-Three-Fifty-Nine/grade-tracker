import { Typography, Stack, Button, Box, Chip, Divider, Fab, IconButton, FormControl, Tooltip, InputLabel, MenuItem, Select, Card, CardContent, FormControlLabel, Checkbox, Snackbar, Alert } from "@mui/material";
import React, {useCallback} from "react";
import Axios from "axios";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";

import LaunchIcon from '@mui/icons-material/Launch';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AssessmentViewerCard from "./AssessmentViewerCard";
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from "./ConfirmDialog";

class Assessment {
    constructor(name, weight, grade, deadline, isAss) {
        this.name = name;
        this.weight = weight;
        this.initGrade = grade === -1 ? NaN : grade;
        this.grade = grade === -1 ? NaN : grade;
        this.deadline = deadline;
        this.valid = true;
        this.duplicate = false;
        this.isAss = isAss;
        this.hasChanged = false;
    }

    setGrade(grade) {
        this.grade = grade;
        this.hasChanged = isNaN(this.grade) ? !isNaN(this.initGrade) : this.grade !== this.initGrade;
    }
} 

const CourseViewer = (props) => {
    const { courseData, setViewedCourse, userDetails, setSessionData, sessionData, setCourseList } = props;
    const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
    const [validChanges, setValidChanges] = React.useState(false);
    const [changesMade, setChangesMade] = React.useState(false);
    const changesMadeR = React.useRef(false);
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const [confirmExit, setConfirmExit] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState("none");
    const [isSuccess, setIsSuccess] = React.useState("success");
    const [successText, setSuccessText] = React.useState("");
    const [errorText, setErrorText] = React.useState("");

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

    const checkChanges = () => {
        let changes = false;
        let valid = true;
        assessments.forEach((assessment) => {
            if(assessment.hasChanged) changes = true;
            if(!assessment.valid) valid = false;
        })
        setChangesMade(changes);
        setValidChanges(valid);
        changesMadeR.changes = changes;
    }

    const saveChanges = () => {
        assessments.forEach((assessment) => {
            let index = assessments.indexOf(assessment);
            courseData.names[index] = assessment.name;
            courseData.weights[index] = assessment.weight;
            courseData.deadlines[index] = assessment.deadline;
            courseData.grades[index] = assessment.grade;
            courseData.isAssList[index] = assessment.isAss;
            assessment.hasChanged = false;
            assessment.initGrade = assessment.grade;
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
            checkChanges();
            setChangesMade(false);
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
        Axios.delete("https://b0d0rkqp47.execute-api.ap-southeast-2.amazonaws.com/test/users/" + userDetails.email + "/courses/" + courseData.year + "/" + courseData.code).then((response) => {
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

    return (
        <Box>  
            <Box sx={{mt: 3, pb: 3}}>
                <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                    {courseData.name}
                </Typography>
                <Stack spacing={20} direction="row" sx={{display:"flex", flexDirection: "row", justifyContent: "space-between", alignItems:"baseline", ml: 2, mr: 2, mt: 2}}>
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
                </Stack>
            </Box>
            <Divider variant="middle" role="presentation" sx={{borderBottomWidth: 5, borderColor:"primary.main", mr: 10, ml: 10, mb: 5}} />

            <Stack direction="row" sx={{display:"flex", justifyContent:"center", alignItems:"baseline", mb: 5}}>
                <Box sx={{visibility: "hidden", flexGrow: 1, flexBasis: 0}} />
                <Stack spacing={3} sx={{pl: 2, pr: 2}}>
                    {filteredAssessments.length > 0 ? filteredAssessments.map((assessment, index) => (
                        <AssessmentViewerCard key={assessment.name} assData={assessment} checkChanges={checkChanges} />
                    )) : 
                    <Card>
                        <CardContent sx={{minWidth: 731}}>
                            <Typography variant="h5" component="div" sx={{textAlign:"center"}}>
                                No Assessments Match Filter
                            </Typography>
                        </CardContent>
                    </Card>} 
                    <Button variant="contained"> Add Assessment </Button>
                </Stack>

                <Box sx={{alignSelf:"baseline", flexGrow: 1, flexBasis: 0}}>
                    <Stack spacing={2}>
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
                        {filterPanelOpen && <Card sx={{width: 300}}>
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
                        </Card>}
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
                    </Stack>
                </Box>  
            </Stack>

            <ConfirmDialog open={confirmDelete} handleClose={() => {setConfirmDelete(false)}} buttonText={"Delete"} message={"Remove " + courseData.code + "?"} subMessage={"This action cannot be reverted."} confirmAction={deleteCourse} />
            <ConfirmDialog open={confirmExit} handleClose={() => {setConfirmExit(false)}} buttonText={"Exit"} message={"Exit course viewer?"} subMessage={"You have unsaved changes."} confirmAction={exitViewer} />

            <Tooltip title={<h3>Return to overview</h3>} placement="right" arrow>
                <Fab color="primary" onClick={attemptClose} sx={{position: 'fixed', bottom: 32, left: 32}}>
                    <ChevronLeftIcon fontSize="large" />
                </Fab>
            </Tooltip>

            {changesMade && <Button disabled={!validChanges} sx={{position: "fixed", bottom: 32, right: 32, width: 150, fontSize:"medium"}} variant="contained" onClick={saveChanges}> Save Changes</Button>}

            <Snackbar open={snackbar !== "none"} autoHideDuration={4000} onClose={() => {setSnackbar("none")}} anchorOrigin={{ vertical:"bottom", horizontal:"right" }}>
                <Alert severity={isSuccess ? "success" : "error"} sx={{ width: isMobile ? '75%' : '100%'}}>
                    {isSuccess ? successText : errorText}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default CourseViewer;