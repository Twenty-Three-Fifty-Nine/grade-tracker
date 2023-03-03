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
    Card,
    CardContent,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import dayjs from "dayjs";
import { getLetterGrade } from "../classes/Course";
import { isMobile } from "react-device-detect";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import EditIcon from "@mui/icons-material/Edit";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AssessmentViewerGrades from "./AssessmentViewerGrades";

/** Displays detailed information about an assessment. */
const AssessmentViewerCard = (props) => {
    const { 
        assData,
        checkChanges,
        setCurrentEdit,
        filter,
    } = props;
    
    // Used to update components when details are updated. 
    const [updater, setUpdater] = React.useState(false);

    /** Gets the current grade letter for the assessment. */
    const getAssessmentLetter = () => {
        if (isNaN(assData.grade) || !assData.gradeValid || parseInt(assData.grade) === -1) return "-";
        else return getLetterGrade(parseFloat(assData.grade));
    };

    /**
     * Updates the assessment grade if it is a number, and then checks
     * if it is a valid number. 
     */
    const handleGradeChange = (e) => {
        if(e.target.value === "") assData.setGrade(NaN);
        else if(!isNaN(e.target.value) && (!e.target.value.includes(".") || (e.target.value.split(".")[1].length || 0) <= 2)) {
            let weight = e.target.value.replace(/^0+/, '0');
            if (parseInt(weight) > 0) weight = weight.replace(/^0+/, '');
            assData.setGrade(weight);
        }
        assData.gradeValid = isNaN(assData.grade) || (!isNaN(assData.grade) && assData.grade >= 0 && assData.grade <= 100);
        assData.checkValid();
        checkChanges();
        setUpdater(!updater);
    };

    /** Stops transitions from being blocked after the updated assessment is mounted. */
    React.useEffect(() => {
        assData.stopTransition = false;
    }, [assData]);

    return (
        <Card>
            <CardContent sx={{ display: "flex" }}>
                <Stack spacing={1}>
                    <Stack direction="row" sx={{ display:"flex", minWidth: isMobile ? 310 : 350 }}>
                        <Tooltip title={<h3> { assData.name === "" ? "..." : assData.name } </h3>} placement="top" arrow>
                            <Typography variant={"h5"} component="div" sx={[{ flexGrow: 1, width: isMobile ? 200 : 275 }, !isMobile ? { mr: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } : { mr: 1 }]}>
                                { assData.name === "" ? "..." : assData.name }
                            </Typography>
                        </Tooltip>
                        <Stack direction="row" spacing={1} sx={{ alignSelf: "baseline", alignItems:"center" }}>
                            <Tooltip title={isMobile ? "" : <h3> { assData.isAss ? "Assignment" : "Test" } </h3>} placement="bottom" arrow>
                                {   assData.isAss ? 
                                    <MenuBookRoundedIcon /> :
                                    <DescriptionRoundedIcon /> 
                                }
                            </Tooltip>
                            <Tooltip title={ isMobile ? "" : <h3> Edit Assessment </h3> } placement="bottom" arrow>
                                <IconButton sx={{ ml:"auto" }} onClick={() => {setCurrentEdit(assData)}}>    
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        
                    </Stack>

                    <Divider />

                    <Typography variant={"h6"} component="div" >
                        Due: {new dayjs(assData.deadline).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant={"h6"} component="div">
                        Worth: {assData.weight}%
                    </Typography>

                    { isMobile && <AssessmentViewerGrades assData={assData} handleGradeChange={handleGradeChange} getAssessmentLetter={getAssessmentLetter} filter={filter} />}
                </Stack>

                {!isMobile && <AssessmentViewerGrades assData={assData} handleGradeChange={handleGradeChange} getAssessmentLetter={getAssessmentLetter} filter={filter} />}
            </CardContent>
        </Card>
    );
};

export default AssessmentViewerCard;