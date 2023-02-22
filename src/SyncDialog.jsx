import React, { useEffect } from 'react';
import { AppBar, Box, Dialog, IconButton, Toolbar, Icon, Stack, Typography, Checkbox, Divider, Card, CardContent, FormControlLabel } from '@mui/material';
import { isMobile } from "react-device-detect";
import Axios from 'axios';
import { Assessment } from './CourseViewer';
import SyncAssessmentCard from './SyncAssessmentCard';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

const SyncDialog = (props) => {
    const { onClose, open, courseData, templateData, setTemplateData} = props;
    const [changedAssessments, setChangedAssessments] = React.useState([]);
    const [unchangedAssessments, setUnchangedAssessments] = React.useState([]);
    const [newAssessments, setNewAssessments] = React.useState([]);
    const [equalAssessments, setEqualAssessments] = React.useState([]);
    const [newAssessmentPreference, setNewAssessmentPreference] = React.useState(true);

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
                    newSelected: true,
                    selected: true
                }
            }
            return {
                user: found[0].isUserAss ? found[0] : blankAssessment,
                template: found[0].isUserAss ? blankAssessment : found[0],
                newSelected: false,
                selected: true
            }
        });

        // Remove duplicates
        let filtered = groupedAssignments.filter((assignment, index) => {
            return index === groupedAssignments.findIndex((ass) => { 
                return ass.user.name === assignment.user.name
            })
        });
        
        // setAssignments(filtered);
        filtered.forEach((assessment) => {
            if(assessment.user.name === "") {
                setNewAssessments(curr => [...curr, assessment]);
            }else if (assessment.template.name === "") {
                setUnchangedAssessments(curr => [...curr, assessment]);
            }else if(assessment.user.equalsTemplate(assessment.template)) {
                setEqualAssessments(curr => [...curr, assessment]);
            }else {
                setChangedAssessments(curr => [...curr, assessment]);
            }
        })
    }, [courseData.deadlines, courseData.isAssList, courseData.names, courseData.weights, templateData]);

    useEffect(() => {
        if(!open) return;
        
        setChangedAssessments([]);
        setUnchangedAssessments([]);
        setNewAssessments([]);
        setEqualAssessments([]);
        setNewAssessmentPreference(true);
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
        <Dialog fullScreen open={open} onClose={onClose} sx={{}}>
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
                    <Card sx={{display: "flex", alignItems:"center", justifyContent:"center"}}>
                        <CardContent sx={{width: 800, py: 4}}>
                            <Stack sx={{display: "flex", alignItems:"center", justifyContent:"center"}}>
                                <Stack direction="row" sx={{ display: "flex", alignItems:"center", justifyContent:"center"}}>
                                    <Typography sx={{flexGrow: 1, flexBasis: 0, width: 300, textAlign:"end"}} variant="h6">Current Assessments</Typography>
                                    <IconButton sx={{mx: 2}} 
                                        onClick={() => {
                                            setNewAssessmentPreference(!newAssessmentPreference);
                                            changedAssessments.forEach((assessment) => {
                                                assessment.newSelected = !newAssessmentPreference;
                                            })
                                        }}> 
                                        <ArrowForwardIosIcon sx={{ transition: "all 0.2s linear", transform: newAssessmentPreference ? "rotate(0deg)" : "rotate(-180deg)"}} />
                                    </IconButton>
                                    <Typography variant="h6" sx={{flexGrow: 1, flexBasis: 0, width: 300}}>Template Assessments</Typography>
                                </Stack>

                                <FormControlLabel control={<Checkbox defaultChecked />} 
                                    onChange={(e, newValue) => {
                                        newAssessments.forEach((assessment) => {
                                            assessment.selected = newValue;
                                        })
                                    }} label={<Typography variant="h6">Keep New Assessments</Typography>} labelPlacement="start" 
                                />

                                <FormControlLabel control={<Checkbox defaultChecked />} 
                                    onChange={(e, newValue) => {
                                        unchangedAssessments.forEach((assessment) => {
                                            assessment.selected = newValue;
                                        })
                                    }} label={<Typography variant="h6">Keep Your Assessments</Typography>} labelPlacement="start" 
                                />
                            </Stack>
                        </CardContent>
                    </Card>

                    {changedAssessments.length > 0 && (<>
                        <Typography variant="h5" textAlign="center">Changed Assessments</Typography>
                        <Divider sx={{width: "50%", borderWidth: 2}} />

                        {changedAssessments.map((assignment, i) => {
                            return (
                                <Stack direction="row" key={assignment.user.name} justifyContent="center" alignItems="center">
                                    <SyncAssessmentCard assessment={assignment.user}/>
                                    <Box sx={{mx: 4}}>
                                        <IconButton onClick={() => {assignment.newSelected = !assignment.newSelected}}> 
                                            <ArrowForwardIosIcon sx={{ transition: "all 0.2s linear", transform: assignment.newSelected ? "rotate(0deg)" : "rotate(-180deg)"}} />
                                        </IconButton>
                                    </Box>
                                    <SyncAssessmentCard assessment={assignment.template} />
                                </Stack>
                            )
                        })}
                        <Box visibility="hidden" sx={{mb: 4}} />
                    </>)}
                    
                    
                    

                    {newAssessments.length > 0 && (<>
                        <Typography variant="h5" textAlign="center">New Assessments</Typography>
                        <Divider sx={{width: "50%", borderWidth: 2}} />

                        {newAssessments.map((assignment) => {
                            return (
                                <Stack direction="row" key={assignment.user.name} justifyContent="center" alignItems="center">
                                    <SyncAssessmentCard assessment={assignment.user}/>
                                    <Box sx={{mx: 4}}>
                                        <Checkbox checked={assignment.selected} onChange={() => {assignment.selected = !assignment.selected;}} />
                                    </Box>
                                    <SyncAssessmentCard assessment={assignment.template} />
                                </Stack>
                            )
                        })}
                        <Box visibility="hidden" sx={{mb: 4}} />
                    </>)}

                    
                    {unchangedAssessments.length > 0 && (<>
                        <Typography variant="h5" textAlign="center">Your Assessments </Typography>
                        <Divider sx={{width: "50%", borderWidth: 2}} />

                        {unchangedAssessments.map((assignment) => {
                            return (
                                <Stack direction="row" key={assignment.user.name} justifyContent="center" alignItems="center">
                                    <SyncAssessmentCard assessment={assignment.user}/>
                                    <Box sx={{mx: 4}}>
                                        <Checkbox checked={assignment.selected} onChange={() => {assignment.selected = !assignment.selected;}} />
                                    </Box>
                                    <SyncAssessmentCard assessment={assignment.template} />
                                </Stack>
                            )
                        })}
                        <Box visibility="hidden" sx={{mb: 4}} />
                    </>)} 

                    {equalAssessments.length > 0 && (<>
                        <Typography variant="h5" textAlign="center">Equal Assessments</Typography>
                        <Divider sx={{width: "50%", borderWidth: 2}} />

                        {equalAssessments.map((assignment) => {
                            return (
                                <Stack direction="row" key={assignment.user.name} justifyContent="center" alignItems="center">
                                    <SyncAssessmentCard assessment={assignment.user}/>
                                    <Box sx={{mx: 5.1}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 10H5V8h14v2m0 6H5v-2h14v2Z" /></svg>
                                    </Box>
                                    <SyncAssessmentCard assessment={assignment.template} />
                                </Stack>
                            )
                        })}
                        <Box visibility="hidden" sx={{mb: 4}} />
                    </>)}
                </Stack>
            </Box>
        </Dialog>
    )
}

export default SyncDialog;
