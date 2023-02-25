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

const CourseViewerEditorDesktop = (props) => {
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
        <Box sx={{ flexGrow: 1, flexBasis: 0, display:"flex", justifyContent:"end", alignItems:"baseline" }}>
            <Card sx={{ width: 360, m: 0, display: "flex", alignItems:"baseline" }}>
                <CardContent sx={{ pt: 1, pr: 5, display: "flex", alignItems:"baseline" }}>
                    <Stack>
                        <Stack direction="row" spacing={0}>
                            <Typography variant="h5" sx={{ mt: 1, ml: 0.3, width: 210 }}> Edit { currentEdit.isAss ? "Assignment" : "Test" } </Typography>
                            <IsAssignmentToggle currentEdit={currentEdit} checkChanges={checkChanges} 
                                assignmentElement={<MenuBookRoundedIcon />} testElement={<DescriptionRoundedIcon />}
                            />

                            <Tooltip title={<h3> Delete Assessment </h3>} placement="bottom" arrow>
                                <IconButton color="error" sx={{ ml: 1 }} 
                                    onClick={() => {
                                        assessments.splice(assessments.indexOf(currentEdit), 1);
                                        if (!currentEdit.isNew) setChangeOverride(true);
                                        checkChanges(!currentEdit.isNew ? true : changeOverride);
                                        setCurrentEdit(null);
                                    }}
                                >    
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>

                        <Divider sx={{ mb: 1.5, mt: 0.5 }}/>
                        
                        <Stack>
                            <AssessmentNameField currentEdit={currentEdit} checkDuplicateName={checkDuplicateName} checkChanges={checkChanges} />

                            <Box>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker label="Due Date" value={currentEdit.deadline} inputFormat="DD/MM/YYYY"
                                        onChange={(newValue) => {
                                            currentEdit.setDeadline(newValue.format("YYYY-MM-DD HH:mm:ss"));
                                            checkChanges();
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                        
                                    />
                                </LocalizationProvider>
                            </Box>

                            <AssessmentWeightField currentEdit={currentEdit} checkChanges={checkChanges} width="74%" />

                            <Button variant="contained" sx={{ mt: 2, mr: 1 }} onClick={() => {setCurrentEdit(null)}}> Close </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CourseViewerEditorDesktop;