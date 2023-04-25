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

import ConfirmDialog from "../ConfirmDialog";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";

import DeleteIcon from "@mui/icons-material/Delete";
import LaunchIcon from "@mui/icons-material/Launch";
import CourseViewerMobileActionButtons from "./CourseViewerMobileActionButtons";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

/** 
 * The main header for the course viewer, changes based on 
 * whether the user is on mobile/desktop.
 */
const CourseViewerHeader = (props) => {
    const {
        apiLoading,
        attemptClose,
        changesMade,
        courseCompletion,
        courseData,
        courseLetter,
        deleteZIndex,
        saveChanges,
        sessionData,
        setConfirmDelete,
        setEditTemplate,
        setSyncMenuOpen,
        validChanges,
    } = props;

    return (
        <Box sx={{ mt: 3, pb: 3 }}>
            <Typography variant="h6" component="div" sx={{textAlign:"center"}}> 
                {courseData.name}
            </Typography>

            <Stack spacing={ isMobile ? 0 : 20 } direction={ isMobile ? "column" : "row" } sx={{ display: isMobile ? "block" : "flex", flexDirection: "row", 
                justifyContent: "space-between", alignItems:"baseline", ml: isMobile ? 0 : 2, mr: isMobile ? 0 : 2, mt: isMobile ? 0 : 2 }}
            >
                <Stack sx={{ flexGrow: 1, flexBasis: 0 }}>
                    {   !isMobile && 
                        <Typography variant="h6" component="div" sx={{ textAlign:"center" }}> 
                            Trimester {courseData.tri} - {courseData.year}
                        </Typography>
                    }

                    <Typography variant="h6" component="div" sx={{ textAlign:"center" }}> 
                        { !isNaN(courseCompletion) ? courseCompletion : "?" }% Completed
                    </Typography>

                    <Box sx={{ alignSelf:"center" }}>
                        <Button disabled={courseData.url === ""} variant="contained" href={courseData.url} target="_blank" 
                            sx={{ fontSize:"large", pt: 1, mt: 1 }}
                        > {courseData.code} Course Page <LaunchIcon sx={{ ml: 1, mt: -0.2 }} /> 
                        </Button>
                    </Box>
                </Stack>

                {isMobile && <Divider variant="middle" role="presentation" sx={{ borderBottomWidth: 5, borderColor:"primary.main", my: 2, mx: 3 }} /> }

                {   isMobile ? 
                    <TemplateRelatedDisplay courseData={courseData} sessionData={sessionData} changesMade={changesMade} deleteZIndex={deleteZIndex} 
                        setEditTemplate={setEditTemplate} setSyncMenuOpen={setSyncMenuOpen} setConfirmDelete={setConfirmDelete} 
                    /> : 
                    <CurrentlyAchievedDisplay courseData={courseData} courseLetter={courseLetter} />
                }
                
                {isMobile && <Divider variant="middle" role="presentation" sx={{ borderBottomWidth: 5, borderColor:"primary.main", my: 2, mx: 3 }} /> }

                {   isMobile ? 
                    <CurrentlyAchievedDisplay courseData={courseData} courseLetter={courseLetter} /> :
                    <TemplateRelatedDisplay courseData={courseData} sessionData={sessionData} changesMade={changesMade} deleteZIndex={deleteZIndex} 
                        setEditTemplate={setEditTemplate} setSyncMenuOpen={setSyncMenuOpen} setConfirmDelete={setConfirmDelete} 
                    />
                }
            </Stack>

            {   isMobile && 
                <CourseViewerMobileActionButtons attemptClose={attemptClose} validChanges={validChanges} 
                    changesMade={changesMade} apiLoading={apiLoading} saveChanges={saveChanges}
                />
            }
        </Box>
    );
};

/** Displays the currently achieved grade. */
const CurrentlyAchievedDisplay = (props) => {
    const { 
        courseData,
        courseLetter,
    } = props;

    let sum = courseData.assessments.map((assessment) => assessment.weight).reduce((a, b) => a + b, 0);

    const [incompleteDialogOpen, setIncompleteDialogOpen] = React.useState(false);
    
    return (
        <Stack spacing={ isMobile ? 0 : 2 }>
            <Typography variant="h4" component="div" sx={{ textAlign:"center" }}> 
                Currently Achieved:
            </Typography>
            <Stack direction="row" spacing={ isMobile ? 5 : 7 } sx={{ alignItems:"center", justifyContent:"center" }}>
                <Stack direction="row" gap={1}>
                    <Chip label={courseData.totalGrade + "%"} color="secondary" sx={{ p: 1, pt: 3, pb: 3, fontSize:30, backgroundColor:"primary.main", borderRadius: 1 }} />
                    {sum < 100 && (
                        isMobile ? (
                            <>
                                <Chip label={<WarningRoundedIcon />} color="secondary" sx={{ py: 3, fontSize:30, backgroundColor:"error.main", borderRadius: 1 }} onClick={() => setIncompleteDialogOpen(true)} />

                                <ConfirmDialog open={incompleteDialogOpen} handleClose={() => setIncompleteDialogOpen(false)} buttonText={"Ok"} message={"Assessment weights"}
                                    subMessage={"The assessment weights don't add up to 100%. This likely means that the course may have incomplete assessments."}
                                />
                            </>
                        ) : (
                            <Tooltip title={<h3>The assessment weights don't add up to 100%. This likely means that the course may have incomplete assessments.</h3>} arrow>
                                <Chip label={<WarningRoundedIcon />} color="secondary" sx={{ py: 3, fontSize:30, backgroundColor:"error.main", borderRadius: 1 }} />
                            </Tooltip>
                        )
                    )}
                </Stack>
                <Chip label={courseLetter ? courseLetter : "-"} color="secondary" sx={{ p: 2, pt: 3, pb: 3, fontSize:30, backgroundColor:"primary.main", borderRadius: 1 }} />
            </Stack>
        </Stack>
    );
};

/** 
 * Displays last synced/updated dates, as well as
 * the option to update the template or sync.
 */
const TemplateRelatedDisplay = (props) => {
    const { 
        courseData, 
        sessionData, 
        changesMade, 
        deleteZIndex,
        setEditTemplate, 
        setSyncMenuOpen, 
        setConfirmDelete,
    } = props;

    return (
        <Stack sx={{ flexGrow: 1, flexBasis: 0 }}>
            <Typography variant="h6" component="div" sx={{ textAlign:"center" }}> 
                Template last updated: {new dayjs(courseData.lastUpdated).format("DD/MM/YYYY")}
            </Typography>
            <Typography variant="h6" component="div" sx={{ textAlign:"center" }}> 
                Last synced to template: {new dayjs(courseData.lastSynced).format("DD/MM/YYYY")}
            </Typography>
            <Stack spacing={2} direction="row" sx={{ display:"flex", justifyContent:"center", mt: 1.2 }}>
                <Box sx={{ alignSelf:"center" }}>
                    <Tooltip title={ sessionData && sessionData !== "Reloading" && sessionData.userData.verifiedEmail ? "" : 
                        <h3> Please verify your email address to update a template. </h3> } placement="bottom" arrow
                    >
                        <Box>
                            <Button variant="contained" sx={{ fontSize:"large" }} onClick={() => setEditTemplate(true)} 
                                disabled={sessionData && sessionData !== "Reloading" && !sessionData.userData.verifiedEmail}
                            > 
                            
                                Update Template 
                            </Button>
                        </Box>
                    </Tooltip>
                </Box>
                <Box sx={{ alignSelf:"center" }}>
                    <Button variant="contained" disabled={changesMade || isMobile} sx={{ fontSize:"large" }} onClick={() => setSyncMenuOpen(true)}> Sync </Button>
                </Box>
                <Box sx={{ alignSelf:"center" }}>
                    <Tooltip title={ isMobile ? "" : <h3> Remove Course </h3> } placement="bottom" arrow>
                        <IconButton color="error" size="medium" onClick={() => setConfirmDelete(true)} sx={{ zIndex: deleteZIndex }}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Stack>
        </Stack>      
    );
};

export default CourseViewerHeader; 