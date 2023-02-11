import { Typography, Stack, Button, Box, Chip, Divider, Fab} from "@mui/material";
import React, {useCallback} from "react";
import LaunchIcon from '@mui/icons-material/Launch';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AssessmentViewerCard from "./AssessmentViewerCard";

const CourseViewer = (props) => {
    const { courseData, setViewedCourse } = props;

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

            <Stack spacing={3} sx={{display:"flex", justifyContent:"center", alignItems:"center", mb: 5}}>
                {courseData.names.map((name, index) => (
                    <AssessmentViewerCard sx={{margin:"0 auto"}} key={name}
                        name={name} deadline={courseData.deadlines[index]} weight={courseData.weights[index]} constGrade={courseData.grades[index]} 
                    />
                ))} 
            </Stack>

            <Fab color="primary" onClick={() => {setViewedCourse(null)}} sx={{position: 'fixed', bottom: 32, left: 32}}>
                <ChevronLeftIcon fontSize="large" />
            </Fab>
        </Box>
    )
}

export default CourseViewer;