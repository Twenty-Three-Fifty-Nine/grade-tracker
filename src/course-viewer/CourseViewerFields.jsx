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
            </Select>
        </FormControl>
    );
};

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