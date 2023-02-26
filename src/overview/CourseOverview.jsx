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
    CardActionArea,
    CardContent,
    Chip,
    Divider,
    Typography,
} from "@mui/material";

import { isMobile } from "react-device-detect";

/** Displays a brief overview of a course including it's code, grade, and completion. */
const CourseOverview = (props) => {
    const {
        courseInfo,
        setViewedCourse,
    } = props;
    
    return (
        <Card sx={{ maxWidth: 500 }} onClick={() => setViewedCourse(courseInfo)} >
            <CardActionArea>
                <CardContent sx={{ display: "flex" }}>
                    <Typography variant={ isMobile ? "h6" : "h5" } component="div" sx={{ minWidth: isMobile ? 110 : 130 }}>
                        {courseInfo.code}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Chip label={Math.round(courseInfo.getCourseCompletion() * 100) + "% " + ( isMobile ? "Done" : "Completed" )} 
                        sx={{ mr: isMobile ? 1 : 2, ml: isMobile ? 1 : 2}} 
                    />
                    <Chip label={courseInfo.totalGrade + "% | " + courseInfo.getCourseLetter()} sx={{ mr: 2 }} />
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default CourseOverview;
