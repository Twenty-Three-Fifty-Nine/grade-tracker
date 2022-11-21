import React from 'react';
import { Autocomplete, Button, Dialog, DialogContentText, DialogTitle, Icon, IconButton, Stack, TextField } from '@mui/material';
import NewCourseDialog from './NewCourseDialog';
import { SessionContext } from './GradesOverview';
import Axios from 'axios';

const AddCourseDialog = (props) => {
    const { onClose, open, activeTri, updateData } = props;
    const session = React.useContext(SessionContext);

    const [courseCode, setCourseCode] = React.useState(null);
    const [courseCreator, setCourseCreator] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [courseList, setCourseList] = React.useState(null);
  
    const handleClose = () => {
        setCourseCode(null);
        onClose();
    };

    const handleAddCourse = async (newCourse) => {
        const code = newCourse ? newCourse : courseCode;
        console.log("Adding course " + code + " to user");
        
        let emptyGrades = "";
        await Axios.get("http://localhost:3001/api/" + code + "/assignments?trimester=" + activeTri.tri).then((result) => { 
            result.data.forEach((a) => {
                emptyGrades += "null";
            })
        });
        
        await Axios.post("http://localhost:3001/api/user/courses", {
            userID: session.userData.email,
            courseCode: code,
            year: activeTri.year,
            trimester: activeTri.tri,
            grades: emptyGrades
        })
        handleClose();
        updateData();
    }

    const handleNewCourse = () => {
        handleClose();
        setCourseCreator(true);
    }

    const handleCancelCreation = async (newCourse) => {
        if(newCourse){
            handleAddCourse(newCourse);
            getTemplatesList();
        }
        setCourseCreator(false);
    }

    const getTemplatesList = async () => {
        if(loading) return;
        console.log("Getting Course Templates");
        
        setLoading(true);
        let tempList = [];
        Axios.get("http://localhost:3001/api/courses?trimester=" + activeTri.tri).then((courses) => {
            courses.data.forEach((course) => {
                tempList.push(course.CourseCode);
            });
            setCourseList(tempList);
            setLoading(false);
        });
        
        return "Loading...";
    }

    return (
        <>
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle sx={{ textAlign:"center", padding: 5, paddingBottom: 2 }}>Add Course for Trimester {activeTri.tri} {activeTri.year}</DialogTitle>
            <Stack spacing={2} direction="row" sx={{ margin: "auto", paddingBottom: 2 }}>
                <Autocomplete options={courseList ? courseList : [getTemplatesList()]} sx={{ width: 240 }} 
                renderInput={(params) => <TextField {...params} label="Course Code" />}
                value={courseCode} onChange={(event, newValue) => { setCourseCode(newValue); }} />
                <IconButton onClick={() => getTemplatesList()}>
                    <Icon fontSize="large" sx={{ paddingTop: 0 }}> refresh </Icon>
                </IconButton>
            </Stack>
            <DialogContentText sx={{ margin:"auto", maxWidth: 300, textAlign:"center", paddingTop: 1, paddingBottom: 3}}> 
                If your course is not in this list, you can create an entry for the course offering.
            </DialogContentText>
            <Stack spacing={2} direction="row" sx={{ margin:"auto", paddingTop: 1, paddingBottom: 5 }}>
                <Button onClick={handleNewCourse} variant="outlined">Create New Course</Button>
                <Button disabled={!courseCode} onClick={handleAddCourse} variant="contained">Add Course</Button>
            </Stack>
        </Dialog>
        <NewCourseDialog onClose={handleCancelCreation} open={courseCreator} activeTri={activeTri}/>
        </>
    );
}

export default AddCourseDialog;