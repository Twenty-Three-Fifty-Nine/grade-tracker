import React from "react";
import { Card, CardContent, Typography, Divider, Stack, TextField, Box, IconButton, Avatar, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import EditIcon from '@mui/icons-material/Edit';

const AssessmentViewerCard = (props) => {
    const { name, deadline, weight, constGrade} = props;
    const [ grade, setGrade ] = React.useState(constGrade);
    const [ valid, setValid ] = React.useState(isNaN(grade) || (grade >= 0 && grade <= 100));

    const getCourseLetter = () => {
        if(isNaN(grade) || !valid) return "-";
        else if(grade >= 90) return "A+";
        else if(grade >= 85) return "A";
        else if(grade >= 80) return "A-";
        else if(grade >= 75) return "B+";
        else if(grade >= 70) return "B";
        else if(grade >= 65) return "B-";
        else if(grade >= 60) return "C+";
        else if(grade >= 55) return "C";
        else if(grade >= 50) return "C-";
        else if(grade >= 40) return "D";
        return "E";
    }

    const handleGradeChange = (e) => {
        if(e.target.value === "") setGrade(NaN);
        else setGrade(e.target.value);
        setValid(isNaN(e.target.value) || (e.target.value >= 0 && e.target.value <= 100))
    }

    return (
        <Card>
            <CardContent sx={{display: 'flex'}}>
                <Stack spacing={1}>
                    <Stack direction="row"sx={{display:"flex", minWidth: 350}}>
                        <Typography variant={"h5"} component="div" sx={{mr: 1}}>
                            {name}
                        </Typography>
                        <Tooltip title={<h3>Assignment</h3>} placement="right" arrow>
                            <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
                        </Tooltip>
                        <Tooltip title={<h3>Edit Assessment</h3>} placement="bottom" arrow>
                            <IconButton sx={{ml:"auto", mt:-0.5}}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Divider />
                    <Typography variant={"h6"} component="div" >
                        Due: {new dayjs(deadline).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant={"h6"} component="div">
                        Worth: {weight}%
                    </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{borderRightWidth: 3, mr: 5, ml: 2}} />
                <Stack spacing={1} sx={{pr: 0, minWidth: 290}} >
                    <Typography variant={"h5"} component="div" sx={{flex:1}}>
                        Grade
                    </Typography>
                    <Stack direction="row">
                        <TextField type="number" InputProps={{ inputProps: { min: 0 }, style: {fontSize: 35} }} 
                            value={isNaN(grade) ? "" : grade} sx={{ fontSize:"large", width: 150}} 
                            error={!valid}
                            onChange={handleGradeChange}
                        />
                        <Box sx={{mt: 0, ml: 3, border: 2, p: 1.4, borderRadius: 1, color: isNaN(grade) ? "grey" : valid ? "primary.main" : "error.main"}}>
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