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
    Typography,
} from "@mui/material";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { FilterSelect, SortSelect } from "./CourseViewerFields";

/** Used to choose filter options on mobile. */
const CourseViewerFilterMobile = (props) => {
    const {
        sliderPos,
        setSliderPos,
        sortType,
        handleChangeSort,
        finishedFilter,
        missingGradeFilter,
        pastDeadlineFilter,
        testFilter,
        assignmentFilter,
        setFinishedFilter,
        setMissingGradeFilter,
        setPastDeadlineFilter,
        setTestFilter,
        setAssignmentFilter,
    } = props;

    return (
        <Box sx={{ position:"fixed", top: 90, right: sliderPos, transition: "all 0.3s linear" }}>
            <Stack direction="row"> 
                <Stack>
                    <Box sx={{ backgroundColor: "filterPanel.main", borderRadius: 0, borderBottomLeftRadius: 5, borderTopLeftRadius: 5, mr: -0.25 }}>
                        <IconButton onClick={() => setSliderPos(sliderPos === -270 ? 0 : -270)} sx={{ transition: "all 0.3s linear", 
                            transform: sliderPos === -270 ? "rotate(0deg)" : "rotate(180deg)" }}
                        >
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ visibility: "hidden" }} />
                </Stack>

                <Card sx={{ width: 270, borderTopLeftRadius: 0, mt: "-1px", backgroundColor:"filterPanel.main" }}>
                    <CardContent>
                        <Stack spacing={0.5}>
                            <SortSelect sortType={sortType} handleChangeSort={handleChangeSort} mb={1} mt={1} size={"small"} />

                            <Typography variant="body1" sx={{ ml: 1.3  }}> Assessment Filters </Typography>
                            
                            <Divider />
                            
                            <FilterSelect finishedFilter={finishedFilter} missingGradeFilter={missingGradeFilter}  pastDeadlineFilter={pastDeadlineFilter} 
                                testFilter={testFilter} assignmentFilter={assignmentFilter} setFinishedFilter={setFinishedFilter} setMissingGradeFilter={setMissingGradeFilter}
                                setPastDeadlineFilter={setPastDeadlineFilter} setTestFilter={setTestFilter} setAssignmentFilter={setAssignmentFilter}
                            />
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default CourseViewerFilterMobile; 