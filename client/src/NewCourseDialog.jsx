import React, { useEffect } from 'react';
import { FormControlLabel, Stack, AppBar, Box, Button, Checkbox, Dialog, Divider, IconButton, Toolbar, Icon, Typography, TextField } from '@mui/material';
import CreateAssessmentCard from './CreateAssessmentCard';

class Assessment {
    constructor(name, weight, deadline) {
        this.name = name;
        this.weight = weight;
        this.deadline = deadline;
    }
} 

const AlwaysScrollToBottom = ({active}) => {
    const elementRef = React.useRef();
    useEffect(() => {if(active) elementRef.current.scrollIntoView()});
    return <div ref={elementRef} />;
  };

const NewCourseDialog = (props) => {
    const { onClose, open, activeTri } = props;

    const [assessments, setAssessments] = React.useState([]);
    const [scrollActive, setScrollActive] = React.useState(false);

    const addAssessment = () => {
        setScrollActive(true);
        setAssessments(oldArray => [...oldArray, new Assessment(null, null, null)] );
    }

    const removeAssessment = (index) => {
        setScrollActive(false);
        setAssessments(assessments.filter((a, i) => i !== index));
    }

    const stopCreating = () => {
        setAssessments([]);
        onClose();
    }

    return (
        <Dialog fullScreen open={open} onClose={stopCreating}>
            <AppBar position="static" component="nav">
                <Toolbar>
                    <IconButton color="inherit" onClick={stopCreating}>
                        <Icon>close</Icon>
                    </IconButton>
                    <Typography sx={{ flex: 1 }} variant="h6"> Create New Course for Trimester {activeTri.tri} </Typography>
                    <Button color="inherit" onClick={stopCreating}> Create </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{padding: 3, margin: "auto", marginTop: 0}}>
                <Typography variant="h5"> Basic Info </Typography>
                <Divider sx={{marginBottom: 3}}></Divider>
                <Stack spacing={2}>
                    <TextField label="Course Name" sx={{ width: 450 }} />
                    <Box>
                        <TextField label="Course Code" sx={{ width: 150 }} />
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Course Info Incomplete" sx={{padding: 0.7, paddingLeft: 6}}/>
                    </Box>
                </Stack>

                <Typography variant="h5" sx={{paddingTop: 5}}> Course Assessments </Typography>
                <Divider sx={{marginBottom: 3}}></Divider>
                <Stack spacing={2}>
                    {assessments.map((assessment, i) => {
                        return (
                            <CreateAssessmentCard key={i} index={i} details={assessment} removeAssessment={removeAssessment} />
                        )
                    })}
                    <Button variant="contained" sx={{ width: 200 }} onClick={addAssessment}> Add New Assessment </Button>
                    <AlwaysScrollToBottom active={scrollActive} />
                </Stack>
            </Box>
        </Dialog>
    )
}

export default NewCourseDialog;
