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