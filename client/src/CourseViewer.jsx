import { Typography, Stack, Button, Box, Chip, Divider, Fab, IconButton, FormControl, InputLabel, MenuItem, Select, Card, CardContent, FormControlLabel, Checkbox} from "@mui/material";
import React, {useCallback} from "react";
import LaunchIcon from '@mui/icons-material/Launch';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AssessmentViewerCard from "./AssessmentViewerCard";
import FilterListIcon from '@mui/icons-material/FilterList';

const CourseViewer = (props) => {
    const { courseData, setViewedCourse } = props;
    const [sortType, setSortType] = React.useState("deadline-a");
    const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);

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
    }, [handleKeyDown]);

    const handleChangeSort = (e) => {
        setSortType(e.target.value);
    }

    return (
        <Box>  
            <Box sx={{mt: 3, pb: 3}}>
                <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                    Introduction to Computer Program Design and Other Long Things
                </Typography>
                <Stack spacing={20} direction="row" sx={{display:"flex", flexDirection: "row", justifyContent: "space-between", alignItems:"center", ml: 2, mr: 2, mt: 2}}>
                    <Stack spacing={2} sx={{flexGrow: 1, flexBasis: 0}}>
                        <Typography variant="h5" component="div" sx={{textAlign:"center"}}> 
                            Trimester {courseData.tri} - {courseData.year}
                        </Typography>
                        <Box sx={{alignSelf:"center"}}>
                            <Button variant="contained" sx={{fontSize:"large", pt: 1}}> {courseData.code} Course Page <LaunchIcon sx={{ml: 1, mt: -0.2}} /> </Button>
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

                    <Stack spacing={2} sx={{flexGrow: 1, flexBasis: 0}}>
                        <Typography variant="h5" component="div" sx={{textAlign:"center"}}> 
                            Template last updated: 2021
                        </Typography>
                        <Box sx={{alignSelf:"center"}}>
                            <Button variant="contained" sx={{fontSize:"large"}}> Update Course </Button>
                        </Box>
                    </Stack>
                </Stack>
            </Box>
            <Divider variant="middle" role="presentation" sx={{borderBottomWidth: 5, borderColor:"primary.main", mr: 10, ml: 10, mb: 5}} />

            <Stack direction="row" sx={{display:"flex", justifyContent:"center", alignItems:"center", mb: 5}}>
                <Box sx={{visibility: "hidden", flexGrow: 1, flexBasis: 0}} />
                <Stack spacing={3} sx={{pl: 2, pr: 2}}>
                    {courseData.names.map((name, index) => (
                        <AssessmentViewerCard key={name}
                            name={name} deadline={courseData.deadlines[index]} weight={courseData.weights[index]} constGrade={courseData.grades[index]} 
                        />
                    ))} 
                </Stack>

                <Box sx={{alignSelf:"baseline", flexGrow: 1, flexBasis: 0}}>
                    <Stack spacing={2}>
                        <Stack spacing={2} direction={"row"}>
                            <IconButton onClick={() => {setFilterPanelOpen(!filterPanelOpen)}}>
                                <FilterListIcon fontSize="large"/>
                            </IconButton>
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
                                    <FormControlLabel control={<Checkbox />} label="Finished" sx={{ml:0 }}/>
                                    <FormControlLabel control={<Checkbox />} label="Missing Grade" />
                                    <FormControlLabel control={<Checkbox />} label="Past Deadline" />
                                    <FormControlLabel control={<Checkbox />} label="Test" />
                                    <FormControlLabel control={<Checkbox />} label="Assignment" />
                                </Stack>
                            </CardContent>
                        </Card>}
                    </Stack>
                </Box>  
                
            </Stack>

            <Fab color="primary" onClick={() => {setViewedCourse(null)}} sx={{position: 'fixed', bottom: 32, left: 32}}>
                <ChevronLeftIcon fontSize="large" />
            </Fab>
        </Box>
    )
}

export default CourseViewer;