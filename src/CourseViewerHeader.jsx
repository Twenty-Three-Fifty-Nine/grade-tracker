import React from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import dayjs from "dayjs";
import { isMobile } from "react-device-detect";

import DeleteIcon from "@mui/icons-material/Delete";
import LaunchIcon from "@mui/icons-material/Launch";
import CourseViewerMobileActionButtons from "./CourseViewerMobileActionButtons";

const CourseViewerHeader = (props) => {
    const { 
        courseData, 
        courseCompletion, 
        courseLetter, 
        sessionData, 
        changesMade, 
        deleteZIndex,
        setEditTemplate, 
        setSyncMenuOpen, 
        setConfirmDelete,
        attemptClose, 
        validChanges,
        apiLoading,
        saveChanges
    } = props;

    return (
        <Box sx={{mt: 3, pb: 3}}>
            <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                {courseData.name}
            </Typography>

            <Stack spacing={isMobile ? 0 : 20} direction={isMobile ? "column" : "row"} sx={{display: isMobile ? "block" : "flex", flexDirection: "row", justifyContent: "space-between", alignItems:"baseline", ml: isMobile ? 0 : 2, mr: isMobile ? 0 : 2, mt: isMobile ? 0 : 2}}>
                <Stack sx={{flexGrow: 1, flexBasis: 0}}>
                    {!isMobile && <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                        Trimester {courseData.tri} - {courseData.year}
                    </Typography>}

                    <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                        {!isNaN(courseCompletion) ? courseCompletion : "?" }% Completed
                    </Typography>

                    <Box sx={{alignSelf:"center"}}>
                        <Button disabled={courseData.url === ""} variant="contained" href={courseData.url} target="_blank" sx={{fontSize:"large", pt: 1, mt: 1}}> {courseData.code} Course Page <LaunchIcon sx={{ml: 1, mt: -0.2}} /> </Button>
                    </Box>
                </Stack>

                {isMobile && <Divider variant="middle" role="presentation" sx={{borderBottomWidth: 5, borderColor:"primary.main", my: 2, mx: 3}} /> }

                <Stack direction={isMobile ? "column-reverse" : "column"}>
                    <Stack spacing={isMobile ? 0 : 2}>
                        <Typography variant="h4" component="div" sx={{textAlign:"center"}}> 
                            Currently Achieved:
                        </Typography>
                        <Stack direction="row" spacing={isMobile ? 5 : 10} sx={{alignItems:"center", justifyContent:"center"}}>
                            <Chip label={courseData.totalGrade + "%"} color="secondary" sx={{p: 1, pt: 3, pb: 3, fontSize:30, backgroundColor:"primary.main", borderRadius: 1}} />
                            <Chip label={courseLetter ? courseLetter : "-"} color="secondary" sx={{p: 2, pt: 3, pb: 3, fontSize:30, backgroundColor:"primary.main", borderRadius: 1}} />
                        </Stack>
                    </Stack>

                    {isMobile && <Divider variant="middle" role="presentation" sx={{borderBottomWidth: 5, borderColor:"primary.main", my: 2, mx: 3}} /> }

                    <Stack sx={{flexGrow: 1, flexBasis: 0}}>
                        <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                            Template last updated: {new dayjs(courseData.lastUpdated).format("DD/MM/YYYY")}
                        </Typography>
                        <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                            Last synced to template: {new dayjs(courseData.lastSynced).format("DD/MM/YYYY")}
                        </Typography>
                        <Stack spacing={2} direction="row" sx={{display:"flex", justifyContent:"center", mt: 1.2}}>
                            <Box sx={{alignSelf:"center"}}>
                                <Tooltip title={sessionData && sessionData !== "Reloading" && sessionData.userData.verifiedEmail ? "" : <h3>Please verify your email address to update a template.</h3>} placement="bottom" arrow>
                                    <Box>
                                        <Button variant="contained" sx={{fontSize:"large"}} onClick={() => {setEditTemplate(true)}} disabled={sessionData && sessionData !== "Reloading" && !sessionData.userData.verifiedEmail}> Update Template </Button>
                                    </Box>
                                </Tooltip>
                            </Box>
                            <Box sx={{alignSelf:"center"}}>
                                <Button variant="contained" disabled={changesMade || isMobile} sx={{fontSize:"large"}} onClick={() => {setSyncMenuOpen(true)}}> Sync </Button>
                            </Box>
                            <Box sx={{alignSelf:"center"}}>
                                <Tooltip title={isMobile ? "" : <h3>Remove Course</h3>} placement="bottom" arrow>
                                    <IconButton color="error" size="medium" onClick={() => {setConfirmDelete(true)}} sx={{zIndex: deleteZIndex}}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

            {isMobile && <CourseViewerMobileActionButtons attemptClose={attemptClose} validChanges={validChanges} 
                changesMade={changesMade} apiLoading={apiLoading} saveChanges={saveChanges}
            />}
        </Box>
    );
}

export default CourseViewerHeader; 