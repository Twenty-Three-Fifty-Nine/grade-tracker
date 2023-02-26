import React from "react";
import {
    TextField,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";

import { getNameHelperText, getWeightHelperText } from "../utils/GetHelperText";

const IsAssignmentToggle = (props) => {
    const {
        currentEdit,
        checkChanges,
        assignmentElement,
        testElement,
    } = props;

    return (
        <ToggleButtonGroup
            exclusive size="small"
            value={ currentEdit && currentEdit.isAss ? "ass" : "test" }
            onChange={(e, newValue) => { 
                currentEdit.setIsAss(newValue === "ass");
                checkChanges();
            }}
        >
            <ToggleButton value="ass">
                {assignmentElement}
            </ToggleButton>
            <ToggleButton value="test">
                {testElement}
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

const AssessmentNameField = (props) =>{
    const {
        currentEdit,
        checkDuplicateName,
        checkChanges,
        mt = 0,
    } = props;

    return (
        <TextField label="Assessment Name"
            sx={{ width: "90%", mb: 2, mt: mt }}
            value={ currentEdit ? currentEdit.name : "" } onChange={(e) => { 
                currentEdit.stopTransition = true;
                currentEdit.setName(e.target.value); 
                checkDuplicateName();
                checkChanges();
            }} 
            error={currentEdit && (currentEdit.name.length === 0 || currentEdit.name.length > 30 || currentEdit.duplicateName)} 
            helperText={ getNameHelperText(currentEdit) }
        />
    );
};

const AssessmentWeightField = (props) => {
    const {
        currentEdit,
        checkChanges,
        width = "100%",
    } = props;

    return (
        <TextField label="Worth (%)" InputProps={{ inputProps: { min: 0 } }} value={ currentEdit ? currentEdit.weight : 0 } sx={{ mt: 2, width: width }}
            onChange={(e) => {
                if (!isNaN(e.target.value) && (!e.target.value.includes(".") || (e.target.value.split(".")[1].length || 0) <= 2)) 
                    currentEdit.setWeight(e.target.value);
                checkChanges();
            }} 
            error={currentEdit && (currentEdit.weight <= 0 || currentEdit.weight > 100)} 
            helperText={ getWeightHelperText(currentEdit) } 
        />
    );
};

export { IsAssignmentToggle, AssessmentNameField, AssessmentWeightField };