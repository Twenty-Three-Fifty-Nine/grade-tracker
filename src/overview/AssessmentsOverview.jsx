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
    Button,
    Card,
    CardContent,
    Fab,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import dayjs from "dayjs";
import { isMobile } from "react-device-detect";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const AssessmentsOverview = (props) => {
    const {
        setViewedCourse,
        setViewAssessments,
        viewAssessments,
    } = props;

    const { triInfo, courses } = viewAssessments;

    const [assessments, setAssessments] = React.useState([]);

    React.useEffect(() => {
        const asses = courses.map((course) => course.assessments.map((assessment) => {
            assessment.course = course.code;
            return assessment;
        })).flat().filter((assessment) => {
            return isNaN(assessment.grade);
        }).sort((a, b) => {
            return new dayjs(a.deadline).isBefore(new dayjs(b.deadline)) ? -1 : 1;
        })
        setAssessments(asses);
    }, [courses])

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Assessments for trimester {triInfo.tri}, {triInfo.year}
            </Typography>

            <Stack spacing={2} sx={{ mb: 5 }}>
                {assessments.map((assessment) => (
                    <Card key={assessment.deadline + assessment.name + assessment.course} sx={{ width: isMobile ? 300 : 500 }}>
                        <CardContent>
                            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="h6" sx={[{ flexGrow: 1, width: isMobile ? 200 : 275, mr: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }]}>
                                    {assessment.name}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">{assessment.course}</Typography>
                            </Box>

                            <Box>
                                <Typography variant={"body1"} component="div" >
                                    Due: {new dayjs(assessment.deadline).format("DD/MM/YYYY")}
                                    {new dayjs(assessment.deadline).isBefore(new dayjs()) && <Typography color="error">Overdue</Typography>}
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography variant={"body1"} component="div">
                                        Worth: {assessment.weight}%
                                    </Typography>
                                    <Button variant="text" onClick={() => {
                                        setViewAssessments(null);
                                        setViewedCourse(courses.find((course) => course.code === assessment.course));
                                    }}>Update</Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))
                }
            </Stack>

            { !isMobile && (
                <Tooltip title={<h3> Return to overview </h3>} placement="right" arrow>
                    <Fab color="primary" sx={{ position: "fixed", bottom: 32, left: 32 }} onClick={() => {setViewAssessments(null)}}>
                        <KeyboardArrowLeftIcon fontSize="large" />
                    </Fab>
                </Tooltip>
            )}
        </Box>
    )
}

export default AssessmentsOverview;