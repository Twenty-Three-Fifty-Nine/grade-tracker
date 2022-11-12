import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import GradesOverview from './GradesOverview';

const App = () => {
    return (
        <>
            <AppBar position="static" component="nav">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Temp Grade Tracker Thingy Thing
                    </Typography>
                </Toolbar>
            </AppBar>

            <GradesOverview />
        </>
    )
}

export default App;
