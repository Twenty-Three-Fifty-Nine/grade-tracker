import React from 'react';
import { Alert, Stack } from '@mui/material';
import TrimesterOverview from './TrimesterOverview';
import { SessionContext } from './GradesOverview';

const YearOverview = () => {
    const session = React.useContext(SessionContext);

    const getTriInfo = (tri) => {
        const timeInfo = session ? session.timeInfo : null;
        if(!timeInfo) return null;
        return {
            tri,
            year: timeInfo.selectedYear,
            isActive: timeInfo.selectedYear === timeInfo.activeTri.year && tri === timeInfo.activeTri.tri,
            isFinished: timeInfo.selectedYear < timeInfo.activeTri.year || (timeInfo.selectedYear === timeInfo.activeTri.year && tri < timeInfo.activeTri.tri)
        }
    }

    return (
        <>
        <Stack spacing={1}>
            <TrimesterOverview triInfo={getTriInfo(1)} />
            <TrimesterOverview triInfo={getTriInfo(2)} />
            <TrimesterOverview triInfo={getTriInfo(3)} />
        </Stack>
        <Alert severity="info" sx={{marginTop: 1}}>Current GPA for the Year: 8.2</Alert>
        </>
    )
}

export default YearOverview;
