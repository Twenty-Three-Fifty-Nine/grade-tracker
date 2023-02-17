import React from 'react';
import { Alert, Autocomplete, Button, Dialog, DialogContentText, DialogTitle, IconButton, Snackbar, Stack, TextField } from '@mui/material';
import NewCourseDialog from './NewCourseDialog';
import { SessionContext } from './GradesOverview';
import Axios from 'axios';
import { isMobile } from "react-device-detect";
import RefreshIcon from '@mui/icons-material/Refresh';

const AddCourseDialog = (props) => {
    const { onClose, open, activeTri, updateData, courseList, setCourseList } = props;
    const session = React.useContext(SessionContext);

    const [courseCode, setCourseCode] = React.useState(null);
    const [courseCreator, setCourseCreator] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [snackbar, setSnackbar] = React.useState("none");
    const [isSuccess, setIsSuccess] = React.useState("success");
  
    const handleClose = () => {
        setCourseCode(null);
        onClose();
    };

    const handleAddCourse = async (code = courseCode, isNewTemplate) => {
        console.log("Adding course " + code + " to user");
        
        await Axios.patch("https://b0d0rkqp47.execute-api.ap-southeast-2.amazonaws.com/test/users/" + session.userData.email + "/courses", {
            courseCode: code,
            year: activeTri.year,
            trimester: activeTri.tri,
        }).then(() => {
            if(!isNewTemplate){
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

    const handleCancelCreation = async (newCourse, isNewTemplate) => {
        if(newCourse){
            handleAddCourse(newCourse, isNewTemplate);
        }
        setCourseCreator(false);
    }

    const getTemplatesList = async () => {
        const trimesters = session && session !== "Reloading" ? session.courses[session.timeInfo.selectedYear] : null;
        if(!trimesters || loading) return null;
        console.log("Getting Course Templates");
        
        setLoading(true);
        let tempList = [];
        Axios.get("https://b0d0rkqp47.execute-api.ap-southeast-2.amazonaws.com/test/courses?year=" + activeTri.year + "&trimester=" + activeTri.tri).then((courses) => {
            courses.data.forEach((course) => {
                let courseAdded = false;
                const courseCode = course.codeYearTri.split("|")[0];
                trimesters[activeTri.tri - 1].forEach((c) => {
                    if (courseCode === c.code) courseAdded = true;
                })
                if (!courseAdded) tempList.push(courseCode);
            });
            setCourseList(tempList.sort());
            setLoading(false);
        });
        
        return "Loading...";
    }

    return (
        <>
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle sx={{ textAlign:"center", padding: 5, pr: 5, pl: 5, paddingBottom: 2}}>
                Add Course for {isMobile && <br />} Trimester {activeTri.tri} {activeTri.year}
            </DialogTitle>
            <Stack spacing={2} direction="row" sx={{ margin: "auto", paddingBottom: 2 }}>
                <Autocomplete options={courseList ? courseList : [getTemplatesList()]} sx={{ width: isMobile ? 200 : 240 }} 
                renderInput={(params) => <TextField {...params} label="Course Code" />}
                value={courseCode} onChange={(e, value) => { setCourseCode(value); }} />
                <IconButton onClick={() => getTemplatesList()}>
                    <RefreshIcon fontSize='large' />
                </IconButton>
            </Stack>
            <DialogContentText sx={{ margin:"auto", maxWidth: 300, textAlign:"center", paddingTop: 1, paddingBottom: 3, pr: isMobile ? 4 : 0, pl: isMobile ? 4 : 0}}> 
                If your course is not in this list, you can create an entry for the course offering.
            </DialogContentText>
            <Stack spacing={2} direction="row" sx={{ margin:"auto", paddingTop: 1, paddingBottom: 5 }}>
                <Button onClick={handleNewCourse} variant="outlined" size={isMobile ? "small" : "medium"}>Create New Course</Button>
                <Button disabled={!courseCode} onClick={() => handleAddCourse()} variant="contained" size={isMobile ? "small" : "medium"}>Add Course</Button>
            </Stack>
        </Dialog>
        <Snackbar open={snackbar !== "none"} autoHideDuration={4000} onClose={() => {setSnackbar("none")}}
            anchorOrigin={{ vertical: "bottom", horizontal: isMobile ? "center" : "left" }}
        >
            <Alert severity={isSuccess ? "success" : "error"} sx={{ width: isMobile ? '75%' : '100%', mb: isMobile ? 9 : 0 }}>
                {isSuccess ? "Course added successfully." : "Error adding course."}
            </Alert>
        </Snackbar>
        <NewCourseDialog onClose={handleCancelCreation} open={courseCreator} activeTri={activeTri}/>
        </>
    );
}

export default AddCourseDialog;