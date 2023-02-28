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
    TextField,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";

import { getNameHelperText, getWeightHelperText } from "../utils/GetHelperText";

/** Used to toggle an assessment between assignment and test. */
const IsAssignmentToggle = (props) => {
    const {
        currentEdit,
        checkChanges,
        assignmentElement,
        testElement,
        setAssessments,
        filter,
    } = props;

    // Used to update components when details are updated. 
    const [updater, setUpdater] = React.useState(false);

    return (
        <ToggleButtonGroup
            exclusive size="small"
            value={ currentEdit && currentEdit.isAss ? "ass" : "test" }
            onChange={(e, newValue) => { 
                currentEdit.setIsAss(newValue === "ass");
                checkChanges();
                setUpdater(!updater);
                setAssessments(curr => [...curr]);
                filter();
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

/** Used to input an assessment's name. */
const AssessmentNameField = (props) =>{
    const {
        currentEdit,
        checkDuplicateName,
        checkChanges,
        setAssessments,
        filter,
        mt = 0,
    } = props;

    // Used to update components when details are updated. 
    const [updater, setUpdater] = React.useState(false);

    return (
        <TextField label="Assessment Name"
            sx={{ width: "90%", mb: 2, mt: mt }}
            value={ currentEdit ? currentEdit.name : "" } onChange={(e) => { 
                currentEdit.stopTransition = true;
                currentEdit.setName(e.target.value); 
                checkDuplicateName();
                checkChanges();
                setUpdater(!updater);
                setAssessments(curr => [...curr]);
                filter();
            }} 
            error={currentEdit && (currentEdit.name.length === 0 || currentEdit.name.length > 60 || currentEdit.duplicateName)} 
            helperText={ getNameHelperText(currentEdit) }
        />
    );
};

/** Used to input an assessment's weight. */
const AssessmentWeightField = (props) => {
    const {
        currentEdit,
        checkChanges,
        setAssessments,
        filter,
        width = "100%",
    } = props;

    // Used to update components when details are updated. 
    const [updater, setUpdater] = React.useState(false);

    return (
        <TextField label="Worth (%)" InputProps={{ inputProps: { min: 0 } }} value={ currentEdit ? currentEdit.weight : 0 } sx={{ mt: 2, width: width }}
            onChange={(e) => {
                if (!isNaN(e.target.value) && (!e.target.value.includes(".") || (e.target.value.split(".")[1].length || 0) <= 2)) {
                    let weight = e.target.value.replace(/^0+/, '0');
                    if (parseInt(weight) > 0) weight = weight.replace(/^0+/, '');
                    currentEdit.setWeight(weight);
                    setUpdater(!updater);
                    setAssessments(curr => [...curr]);
                    filter();
                }
                checkChanges();
            }} 
            error={currentEdit && (currentEdit.weight <= 0 || currentEdit.weight > 100)} 
            helperText={ getWeightHelperText(currentEdit) } 
        />
    );
};

export { IsAssignmentToggle, AssessmentNameField, AssessmentWeightField };