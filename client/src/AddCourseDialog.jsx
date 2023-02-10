import React from 'react';
import { Alert, Autocomplete, Button, Dialog, DialogContentText, DialogTitle, IconButton, Snackbar, Stack, TextField } from '@mui/material';
import NewCourseDialog from './NewCourseDialog';
import { SessionContext } from './GradesOverview';
import Axios from 'axios';
import { isMobile } from "react-device-detect";
import RefreshIcon from '@mui/icons-material/Refresh';

const AddCourseDialog = (props) => {
    const { onClose, open, activeTri, updateData } = props;
    const session = React.useContext(SessionContext);

    const [courseCode, setCourseCode] = React.useState(null);
    const [courseCreator, setCourseCreator] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [courseList, setCourseList] = React.useState(null);

    const [snackbar, setSnackbar] = React.useState("none");
    const [isSuccess, setIsSuccess] = React.useState("success");
  
    const handleClose = () => {
        setCourseCode(null);
        onClose();
    };

    const handleAddCourse = async (code = courseCode, assessmentCount) => {
        console.log("Adding course " + code + " to user");
        
        let emptyGrades = "";
        if(assessmentCount){
            for(let i = 0; i < assessmentCount; i++) emptyGrades += "null";
        }else{
            await Axios.get("http://localhost:3001/api/" + code + "/assignments?trimester=" + activeTri.tri).then((result) => { 
                result.data.forEach((a) => {
                    emptyGrades += "null";
                })
            });
        }
        
        await Axios.post("http://localhost:3001/api/user/courses", {
            userID: session.userData.email,
            courseCode: code,
            year: activeTri.year,
            trimester: activeTri.tri,
            grades: emptyGrades,
            totalGrade: 0.0
        }).then(() => {
            if(!assessmentCount){
                setSnackbar("success");
                setIsSuccess(true);
            }
            setCourseList((courseList) => courseList.filter((course) => course !== code));
            handleClose();
            updateData();
        }).catch((e) => {
            setSnackbar("error");
            setIsSuccess(false);
        })
    }

    const handleNewCourse = () => {
        handleClose();
        setCourseCreator(true);
    }

    const handleCancelCreation = async (newCourse, assessmentCount) => {
        if(newCourse){
            handleAddCourse(newCourse, assessmentCount);
            getTemplatesList();
        }
        setCourseCreator(false);
    }

    const getTemplatesList = async () => {
        const trimesters = session ? session.courses : null;
        if(!trimesters || loading) return null;
        console.log("Getting Course Templates");
        
        setLoading(true);
        let tempList = [];
        Axios.get("http://localhost:3001/api/courses?trimester=" + activeTri.tri).then((courses) => {
            courses.data.forEach((course) => {
                let courseAdded = false;
                trimesters[activeTri.tri-1].forEach((c) => {
                    if(course.CourseCode === c.code) courseAdded = true;
                })
                if(!courseAdded) tempList.push(course.CourseCode);
            });
            
            setCourseList(tempList);
            setLoading(false);
        });
        
        return "Loading...";
    }

    return (
        <>
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle sx={{ textAlign:"center", padding: 5, pr: isMobile ? 12 : 5, pl: isMobile ? 12 : 5, paddingBottom: 2}}>
                Add Course for {isMobile && <br />} Trimester {activeTri.tri} {activeTri.year}
            </DialogTitle>
            <Stack spacing={2} direction="row" sx={{ margin: "auto", paddingBottom: 2 }}>
                <Autocomplete options={courseList ? courseList : [getTemplatesList()]} sx={{ width: 240 }} 
                renderInput={(params) => <TextField {...params} label="Course Code" />}
                value={courseCode} onChange={(e, value) => { setCourseCode(value); }} />
                <IconButton onClick={() => getTemplatesList()}>
                    <RefreshIcon fontSize='large' />
                </IconButton>
            </Stack>
            <DialogContentText sx={{ margin:"auto", maxWidth: 300, textAlign:"center", paddingTop: 1, paddingBottom: 3}}> 
                If your course is not in this list, you can create an entry for the course offering.
            </DialogContentText>
            <Stack spacing={2} direction="row" sx={{ margin:"auto", paddingTop: 1, paddingBottom: 5 }}>
                <Button onClick={handleNewCourse} variant="outlined">Create New Course</Button>
                <Button disabled={!courseCode} onClick={() => handleAddCourse()} variant="contained">Add Course</Button>
            </Stack>
        </Dialog>
        <Snackbar open={snackbar !== "none"} autoHideDuration={4000} onClose={() => {setSnackbar("none")}}>
            <Alert severity={isSuccess ? "success" : "error"} sx={{ width: isMobile ? '75%' : '100%' }}>
                {isSuccess ? "Course added successfully." : "Course already added."}
            </Alert>
        </Snackbar>
        <NewCourseDialog onClose={handleCancelCreation} open={courseCreator} activeTri={activeTri}/>
        </>
    );
}

export default AddCourseDialog;