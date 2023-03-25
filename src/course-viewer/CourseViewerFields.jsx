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
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";

import { isMobile } from "react-device-detect";

/** Used to select the type of sorting the viewer will use. */
const SortSelect = (props) => {
    const {
        sortType,
        handleChangeSort,
        mb = 0,
        mt = 0,
        size = "medium",
    } = props;

    return (
        <FormControl size={size} sx={{ width: 200, mb: mb, mt: mt }}>
            <InputLabel> Sort By </InputLabel>
            <Select value={sortType} label="Sort By" onChange={handleChangeSort}>
                <MenuItem value={"name-a"}> Name (Ascending) </MenuItem>
                <MenuItem value={"name-d"}> Name (Descending) </MenuItem>
                <MenuItem value={"deadline-a"}> Due Date (Closest) </MenuItem>
                <MenuItem value={"deadline-d"}> Due Date (Furthest) </MenuItem>
                <MenuItem value={"weight-a"}> Weight (Highest) </MenuItem>
                <MenuItem value={"weight-d"}> Weight (Lowest) </MenuItem>
                <MenuItem value={"grade-a"}> Grade (Highest) </MenuItem>
                <MenuItem value={"grade-d"}> Grade (Lowest) </MenuItem>
            </Select>
        </FormControl>
    );
};

/** Used to select filter options for the viewer to use. */
const FilterSelect = (props) => {
    const {
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
        <Stack spacing={isMobile ? 0 : 0.5}>
            { !isMobile && <Typography variant="h5" sx={{ ml: 1.3 }}> Assessment Filters </Typography> }
            { !isMobile && <Divider /> }
                
            <FormControlLabel control={<Checkbox checked={finishedFilter} 
                onChange={() => setFinishedFilter(!finishedFilter)} />} label="Finished" />
            <FormControlLabel control={<Checkbox checked={missingGradeFilter} 
                onChange={() => setMissingGradeFilter(!missingGradeFilter)} />} label="Missing Grade" />
            <FormControlLabel control={<Checkbox checked={pastDeadlineFilter} 
                onChange={() => setPastDeadlineFilter(!pastDeadlineFilter)} />} label="Past Deadline" />
            <FormControlLabel control={<Checkbox checked={testFilter} 
                onChange={() => setTestFilter(!testFilter)} />} label="Test" />
            <FormControlLabel control={<Checkbox checked={assignmentFilter} 
                onChange={() => setAssignmentFilter(!assignmentFilter)} />} label="Assignment" />
        </Stack>
    );
};

export { SortSelect, FilterSelect };