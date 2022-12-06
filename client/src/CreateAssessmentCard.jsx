import React from 'react';
import { Card, CardContent, Stack,Box, IconButton, Icon, TextField } from '@mui/material';

const CreateAssessmentCard = (props) => {
    const {index, removeAssessment, details} = props;

    const addLeadingZeros = (num, totalLength) => {
        return String(num).padStart(totalLength, '0');
    }

    const dateToStr = (date) => {
        if(!date) return null;
        return date.getFullYear() + "-" + addLeadingZeros(date.getMonth() + 1, 2) + "-" + addLeadingZeros(date.getDate(), 2) + 
               "T" + addLeadingZeros(date.getHours(), 2) + ":" + addLeadingZeros(date.getMinutes(), 2);
    }

    return (
        <Card sx={{maxWidth: 500}}>
            <CardContent>
                <Stack spacing={2}>
                    <Box sx={{display: 'flex'}}>
                        <TextField label="Assessment Name" sx={{ width: 400, paddingRight: 5}} defaultValue={details.name ? details.name : ""} onChange={(e) => {details.name = e.target.value}} />
                        <IconButton onClick={() => removeAssessment(index)}>
                            <Icon>delete</Icon>
                        </IconButton>
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <TextField label="Due Date" type="datetime-local" defaultValue={dateToStr(details.deadline)} onChange={(e) => {details.deadline = new Date(e.target.value)}} sx={{ paddingRight: 2}}/>
                        <TextField label="Grade Weight (%)" defaultValue={details.weight ? details.weight : ""} onChange={(e) => {details.weight = e.target.value}} />
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default CreateAssessmentCard;