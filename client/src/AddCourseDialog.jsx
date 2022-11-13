import React from 'react';
import { Autocomplete, Button, Dialog, DialogContentText, DialogTitle, Stack, TextField } from '@mui/material';
import NewCourseDialog from './NewCourseDialog';

const AddCourseDialog = (props) => {
    const { onClose, open, activeTri } = props;

    const [courseCode, setCourseCode] = React.useState(null);
    const [courseCreator, setCourseCreator] = React.useState(false);
  
    const handleClose = () => {
        onClose(false, null);
    };

    const handleAddCourse = () => {
        onClose(false, courseCode);
    }

    const handleNewCourse = () => {
        onClose(true, null);
        setCourseCreator(true);
    }

    const handleCancelCreation = () => {
        setCourseCreator(false);
    }
  
    return (
        <>
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle sx={{ textAlign:"center", padding: 5, paddingBottom: 2 }}>Add Course for Trimester {activeTri.tri} {activeTri.year}</DialogTitle>
            <Autocomplete options={["COMP261", "EEEN202", "NWEN241", "SWEN221"]} sx={{ width: 300, margin: "auto", paddingBottom: 2 }} 
            renderInput={(params) => <TextField {...params} label="Course Code" />}
            value={courseCode} onChange={(event, newValue) => { setCourseCode(newValue); }} />
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