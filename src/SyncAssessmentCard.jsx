import React from 'react';
import { Card, CardContent, Stack, Box, IconButton, TextField, ToggleButtonGroup, ToggleButton, Typography} from '@mui/material';
import dayjs from "dayjs";

import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';

const Field = (props) => {
    const { text } = props;
    return (
        <Box sx={{ width: "100%", minWidth: 168, borderRadius: 2, border: "1px solid gray", p: 1 }}>
            {text}
        </Box>
    )
}

const SyncAssessmentCard = (props) => {
    const { assessment } = props;
    return (
        assessment.name !== "" ? (
        <Card sx={{ width: 400, minHeight: 200 }} >
            <CardContent>
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", mb: 1 }}>
                        <Typography variant="body1" fontWeight="fontWeightMedium" fontSize="large">Assessment Name</Typography>
                    
                        { assessment.isAss ?  <MenuBookRoundedIcon /> : <DescriptionRoundedIcon /> }
                    </Box>
                    <Field text={assessment.name} />
                </Box>
                <Box sx={{ display:"flex", flexDirection:"row", gap: 4, alignItems:"center" }}>
                    <Box>
                        <Typography variant="body1" fontWeight="fontWeightMedium" fontSize="large">Weight</Typography>
                        <Field text={assessment.weight} />
                    </Box>
                    <Box>
                        <Typography variant="body1" fontWeight="fontWeightMedium" fontSize="large">Due date</Typography>
                        <Field text={new dayjs(assessment.deadline).format("DD/MM/YYYY")} />
                    </Box>
                </Box>
                
            </CardContent>
        </Card>
        ) : (
            <Card sx={{ width: 400}} >
                <CardContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200  }}>
                    <Typography variant="h5">No Assessment</Typography>
                </CardContent>
            </Card>
        )
    )
}

export default SyncAssessmentCard;

//