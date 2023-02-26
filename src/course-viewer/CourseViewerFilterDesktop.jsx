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
    Chip,
    Collapse,
    IconButton,
    Stack,
    Tooltip,
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import { FilterSelect, SortSelect } from "./CourseViewerFields";

/** Used to choose filter options on desktop. */
const CourseViewerFilterDesktop = (props) => {
    const {
        setFilterPanelOpen,
        filterPanelOpen,
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
        <Stack spacing={2}>
            <Stack spacing={2} direction={"row"}>
                <Tooltip title={<h3> Filter assessments </h3>} placement="top" arrow>
                    <IconButton onClick={() => setFilterPanelOpen(!filterPanelOpen)}>
                        <FilterListIcon fontSize="large"/>
                    </IconButton>
                </Tooltip>

                <SortSelect sortType={sortType} handleChangeSort={handleChangeSort} />
            </Stack>
            <Collapse in={filterPanelOpen}>
                <Card sx={{ width: 300 }}>
                    <CardContent>
                        <FilterSelect finishedFilter={finishedFilter} missingGradeFilter={missingGradeFilter}  pastDeadlineFilter={pastDeadlineFilter} 
                            testFilter={testFilter} assignmentFilter={assignmentFilter} setFinishedFilter={setFinishedFilter} setMissingGradeFilter={setMissingGradeFilter}
                            setPastDeadlineFilter={setPastDeadlineFilter} setTestFilter={setTestFilter} setAssignmentFilter={setAssignmentFilter}
                        />
                    </CardContent>
                </Card>
            </Collapse>
            <Box sx={{ display:"flex", flexWrap:"wrap", gap: 1.5, width:300 }}>
                {finishedFilter && <Chip label="Finished" deleteIcon={<ClearIcon />} onDelete={() => setFinishedFilter(false)} sx={{ width: 100 }} />}
                {missingGradeFilter && <Chip label="Missing Grade" deleteIcon={<ClearIcon />} onDelete={() => setMissingGradeFilter(false)} sx={{ width: 130 }} />}
                {pastDeadlineFilter && <Chip label="Past Deadline" deleteIcon={<ClearIcon />} onDelete={() => setPastDeadlineFilter(false)} sx={{ width: 130 }} />}
                {testFilter && <Chip label="Test" deleteIcon={<ClearIcon />} onDelete={() => setTestFilter(false)} sx={{ width: 75 }} />}
                {assignmentFilter && <Chip label="Assignment" deleteIcon={<ClearIcon />} onDelete={() => setAssignmentFilter(false)} sx={{ width: 120 }} />}
                {(finishedFilter || missingGradeFilter || pastDeadlineFilter || testFilter || assignmentFilter) && 
                    <Chip color="secondary" label="Clear Filters" onClick={() => {
                        setFinishedFilter(false);
                        setMissingGradeFilter(false);
                        setPastDeadlineFilter(false);
                        setTestFilter(false);
                        setAssignmentFilter(false);
                    }
                } sx={{ width: 100 }} />}
            </Box>
        </Stack>
    );
};

export default CourseViewerFilterDesktop;