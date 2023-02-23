import React from 'react';
import { Card, CardContent, Stack, Box, IconButton, TextField, ToggleButtonGroup, ToggleButton, Typography} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { DesktopDatePicker, MobileDatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { isMobile } from "react-device-detect";

const CreateAssessmentCard = (props) => {
    const {index, removeAssessment, details, checkFormat, assessments, setParentUpdater, parentUpdater} = props;
    const [updater, setUpdater] = React.useState(false);
    const [nameCheckOn, setNameCheckOn] = React.useState(false);
    const [weightCheckOn, setWeightCheckOn] = React.useState(false);

    const handleNameChange = (e) => {
        let oldName = details.name;
        details.setName(e.target.value);
        setUpdater(!updater);
        updateValidity(oldName);
        setNameCheckOn(true);
    };

    const handleWeightChange = (e) => {
        if(!isNaN(e.target.value)) details.setWeight(e.target.value);
        setUpdater(!updater);
        updateValidity(details.name);
        setWeightCheckOn(true);
    };

    const updateValidity = (oldName) => {
        details.valid = details.name.length > 0 && details.name.length < 31 && details.weight > 0 && details.weight <= 100;
        let matches = 0;
        let oldMatches = 0;
        assessments.forEach((ass) => {
            if(details.name === ass.name && details.name !== ""){
                matches++;
                ass.duplicate = true;
            }else if(ass.name === oldName) oldMatches++;
        })
        if(matches > 1){
            details.valid = false;
        }else{
            details.duplicate = false;
            if(oldMatches === 1){
                assessments.forEach((ass) => {
                    if(ass.name === oldName) ass.duplicate = false;
                })
            }
        }
        setParentUpdater(!parentUpdater)
        checkFormat();
    }

    return (
        <Card sx={{maxWidth: 500}}>
            <CardContent>
                <Stack spacing={2}>
                    <Box sx={{display: 'flex'}}>
                        <TextField label="Assessment Name" fullWidth
                            value={details.name} onChange={handleNameChange} 
                            error={(details.name.length === 0 || details.name.length > 30 || details.duplicate) && nameCheckOn} 
                            helperText={details.name.length === 0 && nameCheckOn ? "This field cannot be empty" : details.name.length > 30 && nameCheckOn ? "This field  is too long" : details.duplicate && nameCheckOn ? "Another assessment has the same name" : ""} 
                        />
                        <Stack sx={{ ml: 2 }}>
                            <ToggleButtonGroup
                                exclusive size="small"
                                value={details.isAssignment ? "ass" : "test"}
                                onChange={(e, newValue) => { details.setIsAssignment(newValue === "ass"); setUpdater(!updater); }}
                            >
                                <ToggleButton value="ass">
                                    <MenuBookRoundedIcon />
                                </ToggleButton>
                                <ToggleButton value="test">
                                    <DescriptionRoundedIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <Typography variant="body2" sx={{ textAlign:"center" }}> { details.isAssignment ? "Assignment" : "Test" } </Typography>
                        </Stack>
                        <IconButton onClick={() => {
                            removeAssessment(index); 
                            let oldName = details.name;
                            details.name = "";
                            updateValidity(oldName);
                        }} sx={{marginLeft: 2, "&:hover": {color: "error.main", backgroundColor: "transparent" }, position: 'relative', top: nameCheckOn && (details.name.length === 0 || details.name.length > 30) ? -11 : 0}}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {isMobile ? 
                                <MobileDatePicker label="Due Date"
                                    value={details.deadline}
                                    inputFormat="DD/MM/YYYY"
                                    onChange={(newValue) => {
                                        details.setDeadline(newValue.format("YYYY-MM-DD HH:mm:ss"));
                                        checkFormat();
                                        setUpdater(!updater);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                    
                                /> :
                                <DesktopDatePicker label="Due Date"
                                    value={details.deadline}
                                    inputFormat="DD/MM/YYYY"
                                    onChange={(newValue) => {
                                        details.setDeadline(newValue.format("YYYY-MM-DD HH:mm:ss"));
                                        checkFormat();
                                        setUpdater(!updater);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                    
                                />
                            }
                        </LocalizationProvider>
                        <TextField label="Grade Weight (%)" InputProps={{ inputProps: { min: 0 } }} value={details.weight} onChange={handleWeightChange} 
                            sx={{ marginLeft: 2}}
                            error={(details.weight <= 0 || details.weight > 100) && weightCheckOn} 
                            helperText={details.weight <= 0 && weightCheckOn ? "The value must be above 0" : details.weight > 100 && weightCheckOn ? "The value cannot be above 100" : ""} 
                        />
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default CreateAssessmentCard;