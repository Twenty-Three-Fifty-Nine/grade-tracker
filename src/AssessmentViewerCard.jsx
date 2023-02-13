import React from "react";
import { Card, CardContent, Typography, Divider, Stack, TextField, Box, IconButton, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import EditIcon from '@mui/icons-material/Edit';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';

const AssessmentViewerCard = (props) => {
    const { assData, checkChanges } = props;
    const [updater, setUpdater] = React.useState(false);
    const [ valid, setValid ] = React.useState(isNaN(assData.grade) || (assData.grade >= 0 && assData.grade <= 100));

    const getCourseLetter = () => {
        if(isNaN(assData.grade) || !valid) return "-";
        else if(assData.grade >= 90) return "A+";
        else if(assData.grade >= 85) return "A";
        else if(assData.grade >= 80) return "A-";
        else if(assData.grade >= 75) return "B+";
        else if(assData.grade >= 70) return "B";
        else if(assData.grade >= 65) return "B-";
        else if(assData.grade >= 60) return "C+";
        else if(assData.grade >= 55) return "C";
        else if(assData.grade >= 50) return "C-";
        else if(assData.grade >= 40) return "D";
        return "E";
    }

    const handleGradeChange = (e) => {
        if(e.target.value === "") assData.setGrade(NaN);
        else if(!isNaN(e.target.value)) assData.setGrade(e.target.value.substring(0, 5));
        assData.valid = (isNaN(e.target.value) && e.target.value === "") || (e.target.value >= 0 && e.target.value <= 100);
        setValid(assData.valid);
        checkChanges();
        setUpdater(!updater);
    }

    return (
        <Card>
            <CardContent sx={{display: 'flex'}}>
                <Stack spacing={1}>
                    <Stack direction="row"sx={{display:"flex", minWidth: 350}}>
                        <Typography variant={"h5"} component="div" sx={{mr: 1}}>
                            {assData.name}
                        </Typography>
                        <Tooltip title={<h3>{assData.isAss ? "Assignment" : "Test"}</h3>} placement="right" arrow>
                            {assData.isAss ? <MenuBookRoundedIcon sx={{mt: 0.3}}/> :
                            <DescriptionRoundedIcon sx={{mt: 0.4}}/>}
                        </Tooltip>
                        <Tooltip title={<h3>Edit Assessment</h3>} placement="bottom" arrow>
                            <IconButton sx={{ml:"auto", mt:-0.5}}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Divider />
                    <Typography variant={"h6"} component="div" >
                        Due: {new dayjs(assData.deadline).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant={"h6"} component="div">
                        Worth: {assData.weight}%
                    </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{borderRightWidth: 3, mr: 5, ml: 2}} />
                <Stack spacing={1} sx={{pr: 0, minWidth: 290}} >
                    <Typography variant={"h5"} component="div" sx={{flex:1}}>
                        Grade
                    </Typography>
                    <Stack direction="row">
                        <TextField type="number" InputProps={{ inputProps: { min: 0 }, style: {fontSize: 35} }} 
                            value={isNaN(assData.grade) ? "" : assData.grade} sx={{ fontSize:"large", width: 150}} 
                            error={!valid}
                            onChange={handleGradeChange}
                        />
                        <Box sx={{mt: 0, ml: 3, border: 2, p: 1.4, borderRadius: 1, color: isNaN(assData.grade) ? "grey" : valid ? "primary.main" : "error.main"}}>
                            <Typography variant={"h3"} component="div">
                                {getCourseLetter()}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default AssessmentViewerCard;