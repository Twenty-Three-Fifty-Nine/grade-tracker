import React from 'react';
import { Alert, Stack } from '@mui/material';
import TrimesterOverview from './TrimesterOverview';
import { SessionContext } from './GradesOverview';
import { useEffect } from 'react';

const YearOverview = () => {
    const session = React.useContext(SessionContext);

    const [accordionsOpen, setAccordionsOpen] = React.useState([false, false, false]);

    useEffect(() => {
        if(session && session !== "Reloading") setAccordionsOpen([getTriInfo(1).isActive, getTriInfo(2).isActive, getTriInfo(3).isActive]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

    const toggleAccordion = (tri) => {
        const tempOpen = [...accordionsOpen];
        tempOpen[tri - 1] = !tempOpen[tri - 1];
        setAccordionsOpen([...tempOpen]);
    }

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
            <TrimesterOverview triInfo={getTriInfo(1)} open={accordionsOpen ? accordionsOpen[0] : false} toggleAccordion={toggleAccordion} />
            <TrimesterOverview triInfo={getTriInfo(2)} open={accordionsOpen ? accordionsOpen[1] : false} toggleAccordion={toggleAccordion} />
            <TrimesterOverview triInfo={getTriInfo(3)} open={accordionsOpen ? accordionsOpen[2] : false} toggleAccordion={toggleAccordion} />
        </Stack>
        <Alert severity="info" sx={{marginTop: 1}}>Current GPA for the Year: 8.2</Alert>
        </>
    )
}

export default YearOverview;
