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
    Card,
    CardContent,
    Stack,
    Box,
    IconButton,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    Typography,
} from "@mui/material";

import {
    DesktopDatePicker,
    MobileDatePicker,
    LocalizationProvider,
} from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getNameHelperText, getWeightHelperText } from "../utils/GetHelperText";
import { isMobile } from "react-device-detect";

import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

const CreateAssessmentCard = (props) => {
    const {
        assessments,
        checkFormat,
        details,
        index,
        parentUpdater,
        removeAssessment,
        setParentUpdater,
    } = props;

    const [updater, setUpdater] = React.useState(false);
    const [nameCheckOn, setNameCheckOn] = React.useState(false);
    const [weightCheckOn, setWeightCheckOn] = React.useState(false);

    const handleNameChange = (e) => {
        let oldName = details.name;
        details.setName(e.target.value);
        setUpdater(!updater);
        updateValidity(oldName);
        setNameCheckOn(true);
    };

    const handleWeightChange = (e) => {
        if (!isNaN(e.target.value) && (!e.target.value.includes(".") || (e.target.value.split(".")[1].length || 0) <= 2)) details.setWeight(e.target.value);
        setUpdater(!updater);
        updateValidity(details.name);
        setWeightCheckOn(true);
    };

    const updateValidity = (oldName) => {
        details.valid = details.name.length > 0 && details.name.length < 31 && details.weight > 0 && details.weight <= 100;
        let matches = 0;
        let oldMatches = 0;
        assessments.forEach((ass) => {
            if (details.name === ass.name && details.name !== "") {
                matches++;
                ass.duplicate = true;
            } else if(ass.name === oldName) oldMatches++;
        })

        if (matches > 1) {
            details.valid = false;
        } else {
            details.duplicate = false;
            if (oldMatches === 1) {
                assessments.forEach((ass) => {
                    if (ass.name === oldName) ass.duplicate = false;
                })
            }
        }
        setParentUpdater(!parentUpdater)
        checkFormat();
    };

    return (
        <Card sx={{ maxWidth: 500 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Box sx={{ display: "flex" }}>
                        <TextField label="Assessment Name" fullWidth value={details.name} onChange={handleNameChange} 
                            error={(details.name.length === 0 || details.name.length > 30 || details.duplicate) && nameCheckOn} 
                            helperText={ getNameHelperText(details, nameCheckOn) }
                        />
                        <Stack sx={{ ml: 2 }}>
                            <ToggleButtonGroup exclusive size="small" value={details.isAss ? "ass" : "test"}
                                onChange={(e, newValue) => { details.setIsAss(newValue === "ass"); setUpdater(!updater); }}
                            >
                                <ToggleButton value="ass">
                                    <MenuBookRoundedIcon />
                                </ToggleButton>
                                <ToggleButton value="test">
                                    <DescriptionRoundedIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <Typography variant="body2" sx={{ textAlign:"center" }}> { details.isAss ? "Assignment" : "Test" } </Typography>
                        </Stack>
                        <IconButton sx={{ ml: 2, "&:hover": {color: "error.main", backgroundColor: "transparent" }, position: "relative", 
                            top: nameCheckOn && (details.name.length === 0 || details.name.length > 30) ? -11 : 0 }}
                            onClick={() => {
                                removeAssessment(index); 
                                let oldName = details.name;
                                details.name = "";
                                updateValidity(oldName);
                            }} 
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: "flex" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {   isMobile ? 
                                <MobileDatePicker label="Due Date" value={details.deadline}
                                    inputFormat="DD/MM/YYYY" renderInput={(params) => <TextField {...params} />}
                                    onChange={(newValue) => {
                                        details.setDeadline(newValue.format("YYYY-MM-DD HH:mm:ss"));
                                        checkFormat();
                                        setUpdater(!updater);
                                    }}
                                /> :
                                <DesktopDatePicker label="Due Date" value={details.deadline}
                                    inputFormat="DD/MM/YYYY" renderInput={(params) => <TextField {...params} />}
                                    onChange={(newValue) => {
                                        details.setDeadline(newValue.format("YYYY-MM-DD HH:mm:ss"));
                                        checkFormat();
                                        setUpdater(!updater);
                                    }}
                                />
                            }
                        </LocalizationProvider>

                        <TextField label="Grade Weight (%)" InputProps={{ inputProps: { min: 0 } }} value={details.weight} onChange={handleWeightChange} 
                            sx={{ ml: 2 }} error={(details.weight <= 0 || details.weight > 100) && weightCheckOn} 
                            helperText={ getWeightHelperText(details, weightCheckOn) }
                        />
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default CreateAssessmentCard;