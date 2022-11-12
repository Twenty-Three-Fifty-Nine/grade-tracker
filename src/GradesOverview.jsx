import React from 'react';
import { Alert, Box, Fab, Icon, Tab, Tabs } from '@mui/material';
import YearOverview from './YearOverview';

class Course {
    constructor(code, names, weights, deadlines, grades) {
        this.code = code;
        this.names = names;
        this.weights = weights;
        this.deadlines = deadlines;
        this.grades = grades;
    }
}

const GradesOverview = () => {
    const baseYear = 2022;
    const activeTri = {year: 2022, tri: 2};

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const getSessionData = () => {
        return {
            userData: {email: "az.asfari@gmail.com", displayName: "Abdulrahman Asfari"},
            timeInfo: {activeTri, selectedYear: baseYear + value},
            courses: [
                [EEEN202, NWEN241],
                [COMP261, SWEN221],
                []
            ]
        }
    }

    //TEMP THINGS!!!!
    const EEEN202 = new Course("EEEN202", ["A1", "A2", "T1", "A3"], [20.00, 25.00, 50.00, 5.00], [90.00, 87.00, 85.00, 98.00], [new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00')]);
    const NWEN241 = new Course("NWEN241", ["A1", "A2", "T1", "A3"], [20.00, 25.00, 50.00, 5.00], [90.00, 87.00, 85.00, 98.00], [new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00')]);
    const COMP261 = new Course("COMP261", ["A1", "A2", "T1", "A3"], [20.00, 25.00, 50.00, 5.00], [90.00, 87.00, 85.00, 98.00], [new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00')]);
    const SWEN221 = new Course("SWEN221", ["A1", "A2", "T1", "A3"], [20.00, 25.00, 50.00, 5.00], [90.00, 87.00, 85.00, 98.00], [new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00'), new Date('December 17, 1995 03:24:00')]);
    
    return (
        <>        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange}>
                <Tab label="2022" />
                <Tab label="2023" />
            </Tabs>
        </Box>
        <Box>
            { baseYear + value <= new Date().getFullYear() ? 
                <SessionContext.Provider value={getSessionData()}>
                    <YearOverview />
                </SessionContext.Provider> :
                <Alert severity="warning" sx={{marginTop: 1}}> Academic year is not currently active. </Alert>
            }
            <Fab color="primary" disabled={baseYear + value > new Date().getFullYear()} sx={{position: 'absolute', bottom: 32, right: 32}}>
                <Icon>add</Icon>
            </Fab>
        </Box>
        </>
    )
}

export default GradesOverview;
export const SessionContext = React.createContext();