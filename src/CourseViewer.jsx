import { Typography, Stack, Button, Box, Chip, Divider, Fab, IconButton, FormControl, Tooltip, InputLabel, MenuItem, Select, Card, CardContent, FormControlLabel, Checkbox} from "@mui/material";
import React, {useCallback} from "react";
import dayjs from "dayjs";
import LaunchIcon from '@mui/icons-material/Launch';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AssessmentViewerCard from "./AssessmentViewerCard";
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';

const CourseViewer = (props) => {
    const { courseData, setViewedCourse } = props;
    const [sortType, setSortType] = React.useState("deadline-a");
    const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
    const [finishedFilter, setFinishedFilter] = React.useState(false);
    const [missingGradeFilter, setMissingGradeFilter] = React.useState(false);
    const [pastDeadlineFilter, setPastDeadlineFilter] = React.useState(false);
    const [testFilter, setTestFilter] = React.useState(false);
    const [assignmentFilter, setAssignmentFilter] = React.useState(false);

    let handleKeyDown = null;

    const exitViewer = useCallback(
        () => {
            document.removeEventListener("keydown", handleKeyDown, false);
            setViewedCourse(null);
        },
        [handleKeyDown, setViewedCourse]
    );

    handleKeyDown = useCallback(
        (event) => {
            if(event.key === "Escape") {
                exitViewer();
            }
        },
        [exitViewer]
    );

    React.useEffect(() => {
        document.addEventListener("keydown", handleKeyDown, false);
        window.scrollTo(0, 0);
    }, [handleKeyDown]);

    const handleChangeSort = (e) => {
        setSortType(e.target.value);
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
                            {courseData.getCourseCompletion()}% Completed
                        </Typography>
                        <Box sx={{alignSelf:"center"}}>
                            <Button variant="contained" href={courseData.url} target="_blank" sx={{fontSize:"large", pt: 1, mt: 1}}> {courseData.code} Course Page <LaunchIcon sx={{ml: 1, mt: -0.2}} /> </Button>
                        </Box>
                    </Stack>

                    <Stack spacing={2}>
                        <Typography variant="h4" component="div" sx={{textAlign:"center"}}> 
                            Currently Achieved:
                        </Typography>
                        <Stack direction="row" spacing={10} sx={{alignItems:"center", justifyContent:"center"}}>
                            <Chip label={courseData.totalGrade + "%"} color="secondary" sx={{p: 1, pt: 3, pb: 3, fontSize:30, backgroundColor:"primary.main", borderRadius: 1}} />
                            <Chip label={courseData.getCourseLetter()} color="secondary" sx={{p: 2, pt: 3, pb: 3, fontSize:30, backgroundColor:"primary.main", borderRadius: 1}} />
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
                                    <IconButton color="error" size="medium">
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
            <Divider variant="middle" role="presentation" sx={{borderBottomWidth: 5, borderColor:"primary.main", mr: 10, ml: 10, mb: 5}} />

            <Stack direction="row" sx={{display:"flex", justifyContent:"center", alignItems:"center", mb: 5}}>
                <Box sx={{visibility: "hidden", flexGrow: 1, flexBasis: 0}} />
                <Stack spacing={3} sx={{pl: 2, pr: 2}}>
                    {courseData.names.map((name, index) => (
                        <AssessmentViewerCard key={name}
                            name={name} deadline={courseData.deadlines[index]} weight={courseData.weights[index]} constGrade={courseData.grades[index]} isAss={courseData.isAssList[index]}
                        />
                    ))} 
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

            <Tooltip title={<h3>Return to overview</h3>} placement="right" arrow>
                <Fab color="primary" onClick={() => {setViewedCourse(null)}} sx={{position: 'fixed', bottom: 32, left: 32}}>
                    <ChevronLeftIcon fontSize="large" />
                </Fab>
            </Tooltip>

            <Button sx={{position: "fixed", bottom: 32, right: 32, width: 150, fontSize:"medium"}} variant="contained"> Save Changes</Button>
        </Box>
    )
}

export default CourseViewer;