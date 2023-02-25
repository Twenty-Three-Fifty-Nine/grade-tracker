import React from "react";
import {
    Box,
    Card,
    CardContent,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

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
        setAssignmentFilter
    } = props;

    return (
        <Box sx={{ position:"fixed", top: 90, right: sliderPos, transition: "all 0.3s linear"}}>
            <Stack direction="row"> 
                <Stack>
                    <Box sx={{backgroundColor: "filterPanel.main", borderRadius: 0, borderBottomLeftRadius: 5, borderTopLeftRadius: 5, mr: -0.25}}>
                        <IconButton onClick={() => {setSliderPos(sliderPos === -270 ? 0 : -270)}} sx={{transition: "all 0.3s linear", transform: sliderPos === -135 ? "rotate(180deg)" : sliderPos === -270 ? "rotate(0deg)" : "rotate(180deg)"}}>
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{visibility: "hidden"}} />
                </Stack>

                <Card sx={{width: 270, borderTopLeftRadius: 0, mt: "-1px", backgroundColor:"filterPanel.main"}}>
                    <CardContent>
                        <Stack spacing={0.5}>
                            <FormControl size="small" sx={{width:200, mb: 1, mt: 1}}>
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

                            <Typography variant="body1" sx={{ml: 1.3 }}> Assessment Filters </Typography>
                            
                            <Divider />
                            
                            <Box sx={{alignSelf:"self-start", display:"flex", flexDirection:"column"}}>
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
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default CourseViewerFilterMobile; 