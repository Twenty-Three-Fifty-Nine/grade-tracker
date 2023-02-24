/**
 * Twenty Three Fifty Nine - Grade tracking tool
 * Copyright (C) 2023  Abdulrahman Asfari and Christopher E Sa
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

import React from 'react';
import { Alert, Autocomplete, Button, Dialog, DialogContentText, DialogTitle, IconButton, Snackbar, Stack, TextField, CircularProgress, Box, Tooltip } from '@mui/material';
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
    const [loadingAddRequest, setLoadingAddRequest] = React.useState(false);

    const [snackbar, setSnackbar] = React.useState("none");
    const [isSuccess, setIsSuccess] = React.useState("success");
  
    const handleClose = () => {
        setCourseCode(null);
        onClose();
    };

    const handleAddCourse = async (code = courseCode, isNewTemplate) => {
        console.log("Adding course " + code + " to user");
        
        setLoadingAddRequest(true);
        await Axios.patch("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/users/" + session.userData.email + "/courses", {
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
        setLoadingAddRequest(false);
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
        Axios.get("https://x912h9mge6.execute-api.ap-southeast-2.amazonaws.com/test/courses?year=" + activeTri.year + "&trimester=" + activeTri.tri).then((courses) => {
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
            <Stack spacing={2} direction={isMobile ? "column" : "row"} sx={{ margin:"auto", paddingTop: 1, paddingBottom: 5 }}>
                <Tooltip title={session && session !== "Reloading" && session.userData.verifiedEmail ? "" : <h3>Please verify your email address to create a new course.</h3>} placement="bottom" arrow>
                    <Box>
                        <Button onClick={handleNewCourse} variant="outlined" disabled={session && session !== "Reloading" && !session.userData.verifiedEmail} >Create New Course</Button>
                    </Box>
                </Tooltip>
                <Box sx={{ position: 'relative' }}>
                    <Button disabled={!courseCode || loadingAddRequest} onClick={() => handleAddCourse()} variant="contained" >Add Course</Button>
                    {loadingAddRequest &&
                        <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px', }} />
                    }
                </Box>
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