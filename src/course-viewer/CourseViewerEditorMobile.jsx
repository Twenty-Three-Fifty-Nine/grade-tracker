import React from "react";
import {
    Button,
    Dialog,
    Divider,
    Stack,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    Typography,
} from "@mui/material";

import {
    MobileDatePicker,
    LocalizationProvider,
} from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { isMobile } from "react-device-detect";

const CourseViewerEditorMobile = (props) => {
    const {
        currentEdit,
        setCurrentEdit,
        checkChanges,
        assessments,
        changeOverride,
        setChangeOverride,
        checkDuplicateName
    } = props;

    return (
        <Dialog open={currentEdit !== null && isMobile} onClose={() => {setCurrentEdit(null)}}>
            <Stack sx={{display:"flex", alignItems:"center", mx: 3, my: 2}}>
                <Typography variant="h5" sx={{mt: 1, mb:0.5, textAlign:"center"}}> Edit {currentEdit && currentEdit.isAss ? "Assignment" : "Test"} </Typography>

                <ToggleButtonGroup
                    exclusive size="small"
                    value={currentEdit && currentEdit.isAss ? "ass" : "test"}
                    onChange={(e, newValue) => { 
                        currentEdit.setIsAss(newValue === "ass");
                        checkChanges();
                    }}
                >
                    <ToggleButton value="ass">
                        <Typography> Assignment </Typography>
                    </ToggleButton>
                    <ToggleButton value="test">
                        <Typography> Test </Typography>
                    </ToggleButton>
                </ToggleButtonGroup>

                <Divider sx={{width: 240, mt: 2}} />

                <TextField label="Assessment Name"
                    sx={{width: "90%", mb: 2, mt: 2}}
                    value={currentEdit ? currentEdit.name : ""} onChange={(e) => { 
                        currentEdit.stopTransition = true;
                        currentEdit.setName(e.target.value); 
                        checkDuplicateName();
                        checkChanges();
                    }} 
                    error={currentEdit && (currentEdit.name.length === 0 || currentEdit.name.length > 30 || currentEdit.duplicateName)} 
                    helperText={!currentEdit ? "" : currentEdit.name.length === 0 ? "This field cannot be empty" : currentEdit.name.length > 30 ? "This field  is too long" : currentEdit.duplicateName ? "Another assessment has the same name" : ""} 
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker label="Due Date" sx={{width: "20%"}}
                        value={currentEdit ? currentEdit.deadline : ""}
                        inputFormat="DD/MM/YYYY"
                        onChange={(newValue) => {
                            currentEdit.setDeadline(newValue.format("YYYY-MM-DD HH:mm:ss"));
                            checkChanges();
                        }}
                        renderInput={(params) => <TextField {...params} sx={{width:"90%"}} />}
                    />
                </LocalizationProvider>

                <TextField label="Worth (%)" type="number" InputProps={{ inputProps: { min: 0 } }} value={currentEdit ? currentEdit.weight : "0"} sx={{ mt: 2, width: "90%"}}
                    onChange={(e) => {
                        currentEdit.setWeight(e.target.value);
                        checkChanges();
                    }} 
                    error={currentEdit && (currentEdit.weight <= 0 || currentEdit.weight > 100)} 
                    helperText={!currentEdit ? "" : currentEdit.weight <= 0 ? "The value must be above 0" : currentEdit.weight > 100 ? "The value cannot be above 100" : ""} 
                    onKeyDown={(e) => {
                        if(((isNaN(e.key) && e.key !== ".") || currentEdit.weight.toString().length === 5) && e.key !== "Backspace" && e.key !== "Delete"){
                            e.preventDefault();
                        } 
                    }}
                />

                <Stack direction="row" spacing={2} sx={{display:"flex", justifyContent:"center", mt: 2, mb: 1}}>
                    <Button variant="outlined" 
                        onClick={() => {
                            assessments.splice(assessments.indexOf(currentEdit), 1);
                            if(!currentEdit.isNew) setChangeOverride(true);
                            checkChanges(!currentEdit.isNew ? true : changeOverride);
                            setCurrentEdit(null);
                        }}
                    >
                        Delete 
                    </Button>
                    <Button variant="contained"  onClick={() => {setCurrentEdit(null)}}> Close </Button>
                </Stack>
            </Stack>
        </Dialog>
    );
};

export default CourseViewerEditorMobile;