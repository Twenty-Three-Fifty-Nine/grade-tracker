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

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Alert, Chip, Icon, Skeleton, Stack, Typography } from '@mui/material';
import CourseOverview from './CourseOverview';
import { SessionContext } from './GradesOverview';

const TrimesterOverview = ({triInfo, open, toggleAccordion, setViewedCourse}) => {
    const courses = React.useContext(SessionContext).courses;
    
    return (
        <>
            {
                triInfo ?
                <Accordion expanded={open} onChange={() => toggleAccordion(triInfo.tri)} key={triInfo.tri}>
                    <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                        <Typography sx={{paddingTop: 0.5}}> Trimester {triInfo.tri} </Typography>
                        { 
                            triInfo.isActive ? 
                            <Chip label="Current" color="success" sx={{marginLeft: 1}} /> :
                            triInfo.isFinished ?
                            <Chip label="Finished" color="secondary" sx={{marginLeft: 1}} /> :
                            <Chip label="Inactive" color="primary" sx={{marginLeft: 1}} /> 
                        } 
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={2}>
                            {
                                courses[triInfo.year][triInfo.tri - 1][0] ?
                                courses[triInfo.year][triInfo.tri - 1].map((courseInfo) => {
                                    return (
                                        <CourseOverview key={courseInfo.code} courseInfo={courseInfo} setViewedCourse={setViewedCourse} />
                                    )
                                }) :
                                <Alert severity="warning" sx={{marginTop: 1}}> 
                                    { 
                                        triInfo.isFinished ? 
                                        "No courses were taken this trimester." :
                                        "No courses added to this trimester yet." 
                                    }
                                </Alert>
                            }
                        </Stack>
                    </AccordionDetails>
                </Accordion> :
                <Skeleton variant="rounded" height={60} />
            }
        </>
    )
}

export default TrimesterOverview;
