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