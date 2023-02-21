import React, { useEffect } from 'react';
import { AppBar, Box, Dialog, IconButton, Toolbar, Icon, Stack, Typography, Checkbox } from '@mui/material';
import { isMobile } from "react-device-detect";
import Axios from 'axios';
import { Assessment } from './CourseViewer';
import SyncAssessmentCard from './SyncAssessmentCard';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

const SyncDialog = (props) => {
    const { onClose, open, courseData, templateData, setTemplateData} = props;
    const [assignments, setAssignments] = React.useState(null);

    const loadAssesmentList = React.useCallback((data = templateData) => {
        let assignments = [];
        for (const assignment of data.assignments) {
            let assessment = new Assessment(assignment.name, Number(assignment.weight), -1, assignment.dueDate, assignment.isAssignment, false);
            assessment.isUserAss = false;
            assignments.push(assessment);
        }    
        for (let i = 0; i < courseData.names.length; i++) {
            let assessment = new Assessment(courseData.names[i], courseData.weights[i], -1, courseData.deadlines[i], courseData.isAssList[i], false);
            assessment.isUserAss = true;
            assignments.push(assessment);
        }

        const blankAssessment = new Assessment("", 0, -1, "", null, false);

        const groupedAssignments = assignments.map((assignment) => {
            let found = assignments.filter((ass) => ass.name === assignment.name)
            if (found.length === 2) {
                let a1 = found[0]
                let a2 = found[1]
                return {
                    user: a1.isUserAss ? a1 : a2,
                    template: a2.isUserAss ? a1 : a2,
                    newer: 1
                }
            }
            return {
                user: found[0].isUserAss ? found[0] : blankAssessment,
                template: found[0].isUserAss ? blankAssessment : found[0],
                newer: -1
            }
        });

        // Remove duplicates
        let filtered = groupedAssignments.filter((assignment, index) => {
            return index === groupedAssignments.findIndex((ass) => { 
                return ass.user.name === assignment.user.name
            })
        });
        
        setAssignments(filtered);
    }, [courseData.deadlines, courseData.isAssList, courseData.names, courseData.weights, templateData]);

    useEffect(() => {
        if(!open) return;
        
        setAssignments(null)
        if(templateData){
            loadAssesmentList();
        }else{
            Axios.get("https://b0d0rkqp47.execute-api.ap-southeast-2.amazonaws.com/test/courses/" + courseData.code + "?year=" + courseData.year + "&trimester=" + courseData.tri).then((response) => {
                setTemplateData(response.data)
                loadAssesmentList(response.data);
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [courseData, loadAssesmentList, open, setTemplateData, templateData]);

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <AppBar position="fixed" component="nav">
                <Toolbar>
                    <IconButton color="inherit" onClick={onClose}>
                        <Icon>close</Icon>
                    </IconButton>
                    <Typography sx={{ paddingLeft: 1 }} variant={isMobile ? "body1" : "h6"}> { courseData ? "Syncing " + courseData.code + " to it's template" : "" } </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ mt: 10, mb: 10 }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography variant="h4" textAlign="center">{courseData.code}</Typography>
                    <HelpRoundedIcon sx={{ fontSize: 40, color: "grey", ml: 2, "&:hover": {color: "white" }, transition: "0.2s", cursor: "pointer" }} />
                </Box>
                
                <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                    {assignments && assignments.map((assignment) => {
                        return (
                            <Stack direction="row" key={assignment.user.name + String(assignment.newer)} justifyContent="center" alignItems="center">
                                <SyncAssessmentCard assessment={assignment.user}/>
                                <Box sx={{mx: 4}}>
                                    {assignment.newer === -1 ? <Checkbox defaultChecked /> : 
                                    assignment.newer === 1 ? <ArrowForwardIosIcon sx={{mx: 1.1}} /> : <ArrowForwardIosIcon sx={{ transform: "rotate(180deg)", mx: 1.1 }} />}
                                </Box>
                                <SyncAssessmentCard assessment={assignment.template} />
                            </Stack>
                        )
                    })}
                </Stack>
            </Box>
        </Dialog>
    )
}

export default SyncDialog;
