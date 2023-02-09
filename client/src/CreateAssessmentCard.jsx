import React from 'react';
import { Card, CardContent, Stack, Box, IconButton, TextField } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";

const CreateAssessmentCard = (props) => {
    const {index, removeAssessment, details, checkFormat} = props;
    const [updater, setUpdater] = React.useState(false);

    const addLeadingZeros = (num, totalLength) => {
        return String(num).padStart(totalLength, '0');
    }

    const dateToStr = (date) => {
        if(!date) return null;
        return date.getFullYear() + "-" + addLeadingZeros(date.getMonth() + 1, 2) + "-" + addLeadingZeros(date.getDate(), 2) + 
               "T" + addLeadingZeros(date.getHours(), 2) + ":" + addLeadingZeros(date.getMinutes(), 2);
    }

    const handleNameChange = (e) => {
        details.name = e.target.value;
        setUpdater(!updater);
        updateValidity();
    };

    const handleWeightChange = (e) => {
        details.weight = e.target.value;
        setUpdater(!updater);
        updateValidity();
    };

    const updateValidity = () => {
        details.valid = details.name.length > 0 && details.name.length < 31 && details.weight > 0 && details.weight <= 100;
        checkFormat();
    }

    return (
        <Card sx={{maxWidth: 500}}>
            <CardContent>
                <Stack spacing={2}>
                    <Box sx={{display: 'flex'}}>
                        <TextField label="Assessment Name" sx={{ width: 400, paddingRight: 5}} 
                            value={details.name} onChange={handleNameChange} 
                            error={details.name.length === 0 || details.name.length > 30} 
                            helperText={details.name.length === 0 ? "This field cannot be empty" : details.name.length > 30 ? "This field  is too long" : ""} 
                        />
                        <IconButton onClick={() => removeAssessment(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <TextField label="Due Date" type="datetime-local" defaultValue={dateToStr(details.deadline)} 
                            onChange={(e) => {details.deadline = new Date(e.target.value)}} sx={{ paddingRight: 2}}
                        />
                        <TextField label="Grade Weight (%)" type="number" value={details.weight} onChange={handleWeightChange} 
                            error={details.weight <= 0 || details.weight > 100} 
                            helperText={details.weight <= 0 ? "The value must be above 0" : details.weight > 100 ? "The value cannot be above 100" : ""} 
                        />
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default CreateAssessmentCard;