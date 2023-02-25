/**
 * Twenty Three Fifty Nine - Grade tracking tool
 * Copyright (C) 2023  Abdulrahman Asfari and Christopher E Sa
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

import React from "react";
import {
    Box,
    Card,
    CardContent,
    Divider,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import dayjs from "dayjs";
import { isMobile } from "react-device-detect";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import EditIcon from "@mui/icons-material/Edit";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";

const AssessmentViewerCard = (props) => {
    const {
        assData,
        checkChanges,
        setCurrentEdit
    } = props;
    
    const [updater, setUpdater] = React.useState(false);

    const getCourseLetter = () => {
        if(isNaN(assData.grade) || !assData.gradeValid) return "-";
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
        else if(!isNaN(e.target.value) && (!e.target.value.includes(".") || (e.target.value.split(".")[1].length || 0) <= 2)) assData.setGrade(e.target.value);
        assData.gradeValid = isNaN(assData.grade) || (!isNaN(assData.grade) && assData.grade >= 0 && assData.grade <= 100);
        assData.checkValid();
        checkChanges();
        setUpdater(!updater);
    }

    React.useEffect(() => {
        assData.stopTransition = false;
    }, [assData])

    return (
        <Card>
            <CardContent sx={{display: 'flex'}}>
                <Stack spacing={1}>
                    <Stack direction="row"sx={{display:"flex", minWidth: isMobile ? 300 : 350}}>
                        <Typography variant={"h5"} component="div" sx={{mr: 1}}>
                            {assData.name === "" ? "..." : assData.name}
                        </Typography>
                        <Tooltip title={<h3>{assData.isAss ? "Assignment" : "Test"}</h3>} placement="right" arrow>
                            {assData.isAss ? <MenuBookRoundedIcon sx={{mt: 0.3}}/> :
                            <DescriptionRoundedIcon sx={{mt: 0.4}}/>}
                        </Tooltip>
                        <Tooltip title={isMobile ? "" : <h3>Edit Assessment</h3>} placement="bottom" arrow>
                            <IconButton sx={{ml:"auto", mt:-0.5}} onClick={() => {setCurrentEdit(assData)}}>    
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
                    {isMobile && (<>
                    <Divider />
                    <Typography variant={"h5"} component="div" sx={{flex:1}}>
                        Grade:
                    </Typography>
                    <Stack direction="row">
                        <TextField InputProps={{ inputProps: { min: 0 }, style: {fontSize: 35}}} 
                            value={isNaN(assData.grade) ? "" : assData.grade} sx={{ fontSize:"large", width: 180}} 
                            error={!assData.gradeValid}
                            onChange={handleGradeChange}
                        />
                        <Box sx={{mt: 0, ml: 3, border: 2, p: 1.4, borderRadius: 1, minWidth: 85, color: isNaN(assData.grade) ? "grey" : assData.gradeValid ? "primary.main" : "error.main"}}>
                            <Typography variant={"h3"} component="div" sx={{textAlign:"center"}}>
                                {getCourseLetter()}
                            </Typography>
                        </Box>
                    </Stack></>)}
                </Stack>
                {!isMobile && (<>
                <Divider orientation="vertical" flexItem sx={{borderRightWidth: 3, mr: 5, ml: 2}} />
                <Stack spacing={1} sx={{pr: 0, minWidth: isMobile ? 0 : 290}} >
                    <Typography variant={"h5"} component="div" sx={{flex:1}}>
                        Grade
                    </Typography>
                    <Stack direction="row">
                        <TextField 
                        InputProps={{ inputProps: { min: 0 }, style: {fontSize: 35}}} 
                            value={isNaN(assData.grade) ? "" : assData.grade} sx={{ fontSize:"large", width: isMobile ? 50 : 150}} 
                            error={!assData.gradeValid}
                            onChange={handleGradeChange}
                        />
                        <Box sx={{mt: 0, ml: 3, border: 2, p: 1.4, borderRadius: 1, minWidth: 85, color: isNaN(assData.grade) ? "grey" : assData.gradeValid ? "primary.main" : "error.main"}}>
                            <Typography variant={"h3"} component="div" sx={{textAlign:"center"}}>
                                {getCourseLetter()}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack></>)}
            </CardContent>
        </Card>
    );
}

export default AssessmentViewerCard;