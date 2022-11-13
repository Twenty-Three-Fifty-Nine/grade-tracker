import React from 'react';
import { Card, CardActionArea, CardContent, Chip, Divider, Typography } from '@mui/material';

const CourseOverview = ({courseInfo}) => {
    return (
        <Card sx={{maxWidth: 500}}>
            <CardActionArea>
                <CardContent sx={{display: 'flex'}}>
                    <Typography variant="h5" component="div" sx={{minWidth: 130}}>
                        {courseInfo.code}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Chip label={courseInfo.getCourseCompletion() * 100 + "% Completed"} sx={{marginRight: 2, marginLeft: 2}} />
                    <Chip label="93% | A+" sx={{marginRight: 2}} />
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default CourseOverview;
