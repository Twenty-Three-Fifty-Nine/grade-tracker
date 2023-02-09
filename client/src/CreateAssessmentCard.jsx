import React from 'react';
import { Card, CardContent, Stack, Box, IconButton, TextField } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { DesktopDatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const CreateAssessmentCard = (props) => {
    const {index, removeAssessment, details, checkFormat} = props;
    const [updater, setUpdater] = React.useState(false);
    const [nameCheckOn, setNameCheckOn] = React.useState(false);
    const [weightCheckOn, setWeightCheckOn] = React.useState(false);

    const handleNameChange = (e) => {
        details.name = e.target.value;
        setUpdater(!updater);
        updateValidity();
        setNameCheckOn(true);
    };

    const handleWeightChange = (e) => {
        details.weight = e.target.value;
        setUpdater(!updater);
        updateValidity();
        setWeightCheckOn(true);
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
                            error={(details.name.length === 0 || details.name.length > 30) && nameCheckOn} 
                            helperText={details.name.length === 0 && nameCheckOn ? "This field cannot be empty" : details.name.length > 30 && nameCheckOn ? "This field  is too long" : ""} 
                        />
                        <IconButton onClick={() => removeAssessment(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker label="Due Date"
                                value={details.deadline}
                                onChange={(newValue) => {
                                    details.deadline = newValue.toDate();
                                    setUpdater(!updater);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                                
                            />
                        </LocalizationProvider>
                        <TextField label="Grade Weight (%)" type="number" InputProps={{ inputProps: { min: 0 } }} value={details.weight} onChange={handleWeightChange} 
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