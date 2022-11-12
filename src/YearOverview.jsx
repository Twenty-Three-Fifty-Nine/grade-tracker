import React from 'react';
import { Alert } from '@mui/material';
import TrimesterOverview from './TrimesterOverview';
import { SessionContext } from './GradesOverview';

const YearOverview = () => {
    const getTriInfo = (tri) => {
        const timeInfo = React.useContext(SessionContext).timeInfo;
        return {
            tri,
            isActive: timeInfo.selectedYear === timeInfo.activeTri.year && tri === timeInfo.activeTri.tri,
            isFinished: timeInfo.selectedYear < timeInfo.activeTri.year || (timeInfo.selectedYear === timeInfo.activeTri.year && tri < timeInfo.activeTri.tri)
        }
    }

    return (
        <>
        <TrimesterOverview triInfo={getTriInfo(1)} />
        <TrimesterOverview triInfo={getTriInfo(2)} />
        <TrimesterOverview triInfo={getTriInfo(3)} />
        <Alert severity="info" sx={{marginTop: 1}}>Current GPA for the Year: 8.2</Alert>
        </>
    )
}

export default YearOverview;
