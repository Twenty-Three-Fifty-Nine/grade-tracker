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
    ToggleButtonGroup,
    ToggleButton,
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
                                <ToggleButtonGroup
                                    exclusive size="small"
                                    value={ currentEdit.isAss ? "ass" : "test" }
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
                            <TextField label="Assessment Name"
                                sx={{ width: "90%", mb: 2 }}
                                value={currentEdit.name} onChange={(e) => { 
                                    currentEdit.stopTransition = true;
                                    currentEdit.setName(e.target.value); 
                                    checkDuplicateName();
                                    checkChanges();
                                }} 
                                error={(currentEdit.name.length === 0 || currentEdit.name.length > 30 || currentEdit.duplicateName)} 
                                helperText={ currentEdit.name.length === 0 ? "This field cannot be empty" : currentEdit.name.length > 30 ? "This field  is too long" : 
                                    currentEdit.duplicateName ? "Another assessment has the same name" : "" } 
                            />

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

                            <TextField label="Worth (%)" InputProps={{ inputProps: { min: 0 } }} value={currentEdit.weight} sx={{ mt: 2, width: "74%" }}
                                onChange={(e) => {
                                    if (!isNaN(e.target.value) && (!e.target.value.includes(".") || (e.target.value.split(".")[1].length || 0) <= 2)) 
                                        currentEdit.setWeight(e.target.value);
                                    checkChanges();
                                }} 
                                error={(currentEdit.weight <= 0 || currentEdit.weight > 100)} 
                                helperText={ currentEdit.weight <= 0 ? "The value must be above 0" : currentEdit.weight > 100 ? "The value cannot be above 100" : "" } 
                            />

                            <Button variant="contained" sx={{ mt: 2, mr: 1 }} onClick={() => {setCurrentEdit(null)}}> Close </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CourseViewerEditorDesktop;