import React from 'react';
import { Card, CardActionArea, CardContent, Chip, Divider, Typography } from '@mui/material';
import { isMobile } from "react-device-detect";

const CourseOverview = ({courseInfo}) => {
    return (
        <Card sx={{maxWidth: 500}}>
            <CardActionArea>
                <CardContent sx={{display: 'flex'}}>
                    <Typography variant={isMobile ? "h6" : "h5"} component="div" sx={{minWidth: isMobile ? 110 : 130}}>
                        {courseInfo.code}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Chip label={Math.round(courseInfo.getCourseCompletion() * 100) + "% Completed"} sx={{marginRight: 2, marginLeft: 2}} />
                    <Chip label={courseInfo.totalGrade + "% | " + courseInfo.getCourseLetter()} sx={{marginRight: 2}} />
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default CourseOverview;
