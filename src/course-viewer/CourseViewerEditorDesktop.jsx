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
    Card,
    CardContent,
    Divider,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    DesktopDatePicker,
    LocalizationProvider,
} from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { AssessmentNameField, AssessmentWeightField, IsAssignmentToggle } from "./CourseViewerEditorFields";

/** Allows the user to edit an assessment on desktop. */
const CourseViewerEditorDesktop = (props) => {
    const {
        currentEdit,
        setCurrentEdit,
        checkChanges,
        assessments,
        setAssessments,
        changeOverride,
        setChangeOverride,
        checkDuplicateName,
    } = props;

    // Used to update components when details are updated. 
    const [updater, setUpdater] = React.useState(false);

    return (
        <Box sx={{ flexGrow: 1, flexBasis: 0, display:"flex", justifyContent:"end", alignItems:"baseline" }}>
            <Card sx={{ width: 360, m: 0, display: "flex", alignItems:"baseline" }}>
                <CardContent sx={{ pt: 1, pr: 5, display: "flex", alignItems:"baseline" }}>
                    <Stack>
                        <Stack direction="row" spacing={0}>
                            <Typography variant="h5" sx={{ mt: 1, ml: 0.3, width: 210 }}> Edit { currentEdit.isAss ? "Assignment" : "Test" } </Typography>
                            <IsAssignmentToggle currentEdit={currentEdit} checkChanges={checkChanges} setAssessments={setAssessments}
                                assignmentElement={<MenuBookRoundedIcon />} testElement={<DescriptionRoundedIcon />}
                            />

                            <Tooltip title={ assessments.length > 1 ? <h3> Delete Assessment </h3> : <h3> Cannot delete assessment </h3> } placement="bottom" arrow>
                                <Box>
                                    <IconButton color="error" sx={{ ml: 1 }} disabled={assessments.length === 1}
                                        onClick={() => {
                                            assessments.splice(assessments.indexOf(currentEdit), 1);
                                            if (!currentEdit.isNew) setChangeOverride(true);
                                            checkChanges(!currentEdit.isNew ? true : changeOverride);
                                            setCurrentEdit(null);
                                        }}
                                    >    
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Tooltip>
                        </Stack>

                        <Divider sx={{ mb: 1.5, mt: 0.5 }}/>
                        
                        <Stack>
                            <AssessmentNameField currentEdit={currentEdit} checkDuplicateName={checkDuplicateName} checkChanges={checkChanges} setAssessments={setAssessments} />

                            <Box>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker label="Due Date" value={currentEdit.deadline} inputFormat="DD/MM/YYYY"
                                        onChange={(newValue) => {
                                            currentEdit.setDeadline(newValue.format("YYYY-MM-DD HH:mm:ss"));
                                            checkChanges();
                                            setUpdater(!updater);
                                            setAssessments(curr => [...curr]);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                        
                                    />
                                </LocalizationProvider>
                            </Box>

                            <AssessmentWeightField currentEdit={currentEdit} checkChanges={checkChanges} width="74%" setAssessments={setAssessments} />

                            <Button variant="contained" sx={{ mt: 2, mr: 1 }} onClick={() => {setCurrentEdit(null)}}> Close </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CourseViewerEditorDesktop;