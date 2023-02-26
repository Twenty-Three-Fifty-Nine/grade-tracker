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
    Button,
    Dialog,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    MobileDatePicker,
    LocalizationProvider,
} from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { isMobile } from "react-device-detect";
import { AssessmentNameField, AssessmentWeightField, IsAssignmentToggle } from "./CourseViewerEditorFields";

/** Allows the user to edit an assessment on mobile. */
const CourseViewerEditorMobile = (props) => {
    const {
        currentEdit,
        setCurrentEdit,
        checkChanges,
        assessments,
        changeOverride,
        setChangeOverride,
        checkDuplicateName,
    } = props;

    return (
        <Dialog open={currentEdit !== null && isMobile} onClose={() => setCurrentEdit(null)}>
            <Stack sx={{ display:"flex", alignItems:"center", mx: 3, my: 2 }}>
                <Typography variant="h5" sx={{ mt: 1, mb:0.5, textAlign:"center" }}> Edit { currentEdit && currentEdit.isAss ? "Assignment" : "Test" } </Typography>
                <IsAssignmentToggle currentEdit={currentEdit} checkChanges={checkChanges} 
                    assignmentElement={<Typography> Assignment </Typography>} testElement={<Typography> Test </Typography>}
                />

                <Divider sx={{ width: 240, mt: 2 }} />

                <AssessmentNameField currentEdit={currentEdit} checkDuplicateName={checkDuplicateName} checkChanges={checkChanges} mt={2} />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker label="Due Date" sx={{ width: "20%" }} value={currentEdit ? currentEdit.deadline : ""} inputFormat="DD/MM/YYYY"
                        onChange={(newValue) => {
                            currentEdit.setDeadline(newValue.format("YYYY-MM-DD HH:mm:ss"));
                            checkChanges();
                        }}
                        renderInput={(params) => <TextField {...params} sx={{ width:"90%" }} />}
                    />
                </LocalizationProvider>

                <AssessmentWeightField currentEdit={currentEdit} checkChanges={checkChanges} width="90%" />

                <Stack direction="row" spacing={2} sx={{ display:"flex", justifyContent:"center", mt: 2, mb: 1 }}>
                    <Button variant="outlined" 
                        onClick= {() => {
                            assessments.splice(assessments.indexOf(currentEdit), 1);
                            if (!currentEdit.isNew) setChangeOverride(true);
                            checkChanges(!currentEdit.isNew ? true : changeOverride);
                            setCurrentEdit(null);
                        }}
                    >
                        Delete 
                    </Button>
                    <Button variant="contained" onClick={() => setCurrentEdit(null)}> Close </Button>
                </Stack>
            </Stack>
        </Dialog>
    );
};

export default CourseViewerEditorMobile;