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

import React from "react";
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContentText,
    DialogTitle,
    IconButton,
    Snackbar,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material";

import Axios from "axios";
import { isMobile } from "react-device-detect";
import RefreshIcon from "@mui/icons-material/Refresh";
import { SessionContext } from "../overview/GradesOverview";
import TemplateEditor from "./TemplateEditor";

/** 
 * A dialog where a user can either add a course
 * from a list of existing courses or choose to open
 * the course template creator.
 */
const AddCourseDialog = (props) => {
    const {
        activeTri,
        courseList,
        onClose,
        open,
        setCourseList,
        updateData,
        courseCreator,
        setCourseCreator,
    } = props;

    // Uses the session data object.
    const session = React.useContext(SessionContext);

    // Tracks what course the user intends to add, if any.
    const [courseCode, setCourseCode] = React.useState(null);

    // States for visual feedback.
    const [loadingList, setLoadingList] = React.useState(false);
    const [loadingAddRequest, setLoadingAddRequest] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState("none");
    const [isSuccess, setIsSuccess] = React.useState("success");
  
    /** Closes the dialog. */
    const handleClose = () => {
        setCourseCode(null);
        onClose();
    };

    /**
     * Attempts to add a course to the users course list.
     * A snackbar is then displayed.
     * 
     * @param code - The course code.
     * @param isNewTemplate - Whether this is an existing course or a new one.
     */
    const handleAddCourse = async (code = courseCode, isNewTemplate = false) => {
        setLoadingAddRequest(true);

        await Axios.patch("https://api.twentythreefiftynine.com/users/" + session.userData.email + "/courses", {
            courseCode: code,
            year: activeTri.year,
            trimester: activeTri.tri
        }).then(() => {
            if (!isNewTemplate) {
                setSnackbar("success");
                setIsSuccess(true);
            }
            setCourseList((courseList) => courseList.filter((course) => course !== code));
            handleClose();
            updateData();
        }).catch((e) => {
            setSnackbar("error");
            setIsSuccess(false);
        });

        setLoadingAddRequest(false);
    };

    /** Opens the course creator. */
    const handleNewCourse = () => {
        handleClose();
        setCourseCreator(true);
    };

    /** Cancels course creation and adds the course if it was created. */
    const handleCancelCreation = async (newCourse, isNewTemplate) => {
        if (newCourse) handleAddCourse(newCourse, isNewTemplate);
        setCourseCreator(false);
    };

    /** Loads a list of templates that can be added to the users account. */
    const getTemplatesList = async () => {
        const trimesters = session && session !== "Reloading" ? session.courses[session.timeInfo.selectedYear] : null;
        if(!trimesters || loadingList) return null;
        
        setLoadingList(true);

        let tempList = [];
        await Axios.get("https://api.twentythreefiftynine.com/courses?year=" + activeTri.year + "&trimester=" + activeTri.tri).then((courses) => {
            courses.data.forEach((course) => {
                let courseAdded = false;
                const courseCode = course.codeYearTri.split("|")[0];
                trimesters[activeTri.tri - 1].forEach((c) => {
                    if (courseCode === c.code) courseAdded = true;
                })
                if (!courseAdded) tempList.push(courseCode);
            });
            setCourseList(tempList.sort());
        });

        setLoadingList(false);
        
        return "Loading...";
    };

    return (
        <Box>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle sx={{ textAlign:"center", p: 5, pb: 2 }}>
                    Add Course for {isMobile && <br />} Trimester {activeTri.tri} {activeTri.year}
                </DialogTitle>

                <Stack spacing={2} direction="row" sx={{ m: "auto", pb: 2 }}>
                    <Autocomplete options={courseList ? courseList : [getTemplatesList()]} sx={{ width: isMobile ? 200 : 240 }} 
                        renderInput={(params) => <TextField {...params} label="Course Code" />}
                        value={courseCode} onChange={(e, value) => setCourseCode(value)} 
                    />
                    <Box sx={{ position: "relative" }}>
                        <IconButton onClick={() => getTemplatesList()} sx={{zIndex: 1}}>
                            <RefreshIcon fontSize="large" />
                        </IconButton>
                        {loadingList && <CircularProgress size={46} sx={{ position: "absolute", top: "50%", left: "50%", mt: "-25px", ml: "-23px" }} />}
                    </Box>
                </Stack>

                <DialogContentText sx={{ m: "auto", maxWidth: 300, textAlign: "center", pt: 1, pb: 3, pr: isMobile ? 4 : 0, pl: isMobile ? 4 : 0}}> 
                    If your course is not in this list, you can create an entry for the course offering.
                </DialogContentText>

                <Stack spacing={2} direction={isMobile ? "column" : "row"} sx={{ m:"auto", pt: 1, pb: 5 }}>
                    <Tooltip title={ session && session !== "Reloading" && session.userData.verifiedEmail ? "" : 
                        <h3> Please verify your email address to create a new course. </h3> } 
                        placement="bottom" arrow
                    >
                        <Box>
                            <Button onClick={handleNewCourse} variant="outlined" disabled={session && session !== "Reloading" && !session.userData.verifiedEmail}> 
                                Create New Course
                            </Button>
                        </Box>
                    </Tooltip>

                    <Box sx={{ position: "relative" }}>
                        <Button disabled={!courseCode || loadingAddRequest} onClick={() => handleAddCourse()} variant="contained" fullWidth> Add Course </Button>
                        { loadingAddRequest && <CircularProgress size={24} sx={{ position: "absolute", top: "50%", left: "50%", mt: "-12px", ml: "-12px" }} /> }
                    </Box>
                </Stack>
            </Dialog>

            <Snackbar open={snackbar !== "none"} autoHideDuration={4000} onClose={() => setSnackbar("none")}
                anchorOrigin={{ vertical: "bottom", horizontal: isMobile ? "center" : "left" }}
            >
                <Alert severity={isSuccess ? "success" : "error"} sx={{ width: isMobile ? "75%" : "100%", mb: isMobile ? 9 : 0 }}>
                    {isSuccess ? "Course added successfully." : "Error adding course."}
                </Alert>
            </Snackbar>
            <TemplateEditor onClose={handleCancelCreation} open={courseCreator} activeTri={activeTri}/>
        </Box>
    );
};

export default AddCourseDialog;