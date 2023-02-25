import React from "react";
import {
    Box,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Collapse,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";

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
        setAssignmentFilter
    } = props;

    return (
        <Stack spacing={2}>
            <Stack spacing={2} direction={"row"}>
                <Tooltip title={<h3>Filter assessments</h3>} placement="top" arrow>
                    <IconButton onClick={() => {setFilterPanelOpen(!filterPanelOpen)}}>
                        <FilterListIcon fontSize="large"/>
                    </IconButton>
                </Tooltip>
                <FormControl sx={{width:200}}>
                    <InputLabel> Sort By </InputLabel>
                    <Select value={sortType} label="Sort By" onChange={handleChangeSort}>
                        <MenuItem value={"name-a"}>Name (Ascending)</MenuItem>
                        <MenuItem value={"name-d"}>Name (Descending)</MenuItem>
                        <MenuItem value={"deadline-a"}>Due Date (Closest)</MenuItem>
                        <MenuItem value={"deadline-d"}>Due Date (Furthest)</MenuItem>
                        <MenuItem value={"weight-a"}>Weight (Highest)</MenuItem>
                        <MenuItem value={"weight-d"}>Weight (Lowest)</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
            <Collapse in={filterPanelOpen}>
                <Card sx={{width: 300}}>
                    <CardContent>
                        <Stack spacing={0.5}>
                            <Typography variant="h5" sx={{ml: 1.3 }}> Assessment Filters </Typography>
                            <Divider />
                            <FormControlLabel control={<Checkbox checked={finishedFilter} 
                                onChange={() => {setFinishedFilter(!finishedFilter)}} />} label="Finished" />
                            <FormControlLabel control={<Checkbox checked={missingGradeFilter} 
                                onChange={() => {setMissingGradeFilter(!missingGradeFilter)}} />} label="Missing Grade" />
                            <FormControlLabel control={<Checkbox checked={pastDeadlineFilter} 
                                onChange={() => {setPastDeadlineFilter(!pastDeadlineFilter)}} />} label="Past Deadline" />
                            <FormControlLabel control={<Checkbox checked={testFilter} 
                                onChange={() => {setTestFilter(!testFilter)}} />} label="Test" />
                            <FormControlLabel control={<Checkbox checked={assignmentFilter} 
                                onChange={() => {setAssignmentFilter(!assignmentFilter)}} />} label="Assignment" />
                        </Stack>
                    </CardContent>
                </Card>
            </Collapse>
            <Box sx={{display:"flex", flexWrap:"wrap", gap: 1.5, width:300}}>
                {finishedFilter && <Chip label="Finished" deleteIcon={<ClearIcon />} onDelete={() => {setFinishedFilter(false)}} sx={{width: 100}} />}
                {missingGradeFilter && <Chip label="Missing Grade" deleteIcon={<ClearIcon />} onDelete={() => {setMissingGradeFilter(false)}} sx={{width: 130}} />}
                {pastDeadlineFilter && <Chip label="Past Deadline" deleteIcon={<ClearIcon />} onDelete={() => {setPastDeadlineFilter(false)}} sx={{width: 130}} />}
                {testFilter && <Chip label="Test" deleteIcon={<ClearIcon />} onDelete={() => {setTestFilter(false)}} sx={{width: 75}} />}
                {assignmentFilter && <Chip label="Assignment" deleteIcon={<ClearIcon />} onDelete={() => {setAssignmentFilter(false)}} sx={{width: 120}} />}
                {(finishedFilter || missingGradeFilter || pastDeadlineFilter || testFilter || assignmentFilter) && 
                    <Chip color="secondary" label="Clear Filters" onClick={() => {
                        setFinishedFilter(false);
                        setMissingGradeFilter(false);
                        setPastDeadlineFilter(false);
                        setTestFilter(false);
                        setAssignmentFilter(false);
                    }
                } sx={{width: 100}} />}
            </Box>
        </Stack>
    );
};

export default CourseViewerFilterDesktop;