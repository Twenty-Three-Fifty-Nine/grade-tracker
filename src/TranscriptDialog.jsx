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

import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, FormLabel, Stack, TextField } from '@mui/material';
import { Document, Font, Page, StyleSheet, Text, pdf, View } from '@react-pdf/renderer';
import { getLetterGrade } from './classes/Course';

const tableRow = (course) => {
    return (
        <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={[styles.text, { width: "65%" }]}>{`${course.code} - ${course.name}`}</Text>
            <Text style={[styles.text, { width: "10%" }]}>{`${course.totalGrade}%`}</Text>
            <Text style={styles.text}>{getLetterGrade(course.totalGrade)}</Text>
        </View>
    )
}

const generateTranscript = (name, studentId, years) => {
    const doc = (
        <Document title={name + " Academic Transcript"} producer="23:59">
            <Page size="A4" style={styles.body}>
                <Text style={styles.title}>Academic Transcript</Text>
                <View style={{ display: "flex", maxWidth: "100%" }}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={[styles.text, { width: "15%" }]}>Name: </Text>
                        <Text style={styles.text}>{name}</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={[styles.text, { width: "15%" }]}>Student ID: </Text>
                        <Text style={styles.text}>{studentId}</Text>
                    </View>
                </View>

                {
                    Object.entries(years).map(([year, tris]) => {
                        return (
                            <>
                                <Text style={styles.subtitle}>{year}</Text>
                                {
                                    Object.entries(tris).map(([tri, courses]) => {
                                        if (courses.length === 0) return (<></>);

                                        return (
                                            <>
                                                <Text style={styles.header}>Trimester {parseInt(tri) + 1}</Text>
                                                {courses.map((course) => tableRow(course))}
                                            </>
                                        )
                                    })
                                }
                            </>
                        )
                    })
                }
                <Text style={styles.footnote}>This is not an official transcript. It is for personal use only.</Text>
            </Page>
        </Document>
    );

    pdf(doc).toBlob().then((blob) => {
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "transcript.pdf";
        a.click();

        URL.revokeObjectURL(url);

    });
}

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 24,
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: 'Oswald'
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 18,
        margin: "20px 0 0 0",
        fontFamily: 'Oswald',
        color: 'red',
    },
    text: {
        margin: 1,
        fontSize: 10,
        textAlign: 'justify',
        fontFamily: 'Times-Roman'
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        fontSize: 12,
        margin: "15px 0 10px 0",
        color: 'grey',
    },
    footnote: {
        position: 'absolute',
        fontSize: 8,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
});

const TranscriptDialog = (props) => {
    const {
        open,
        onClose,
        sessionData
    } = props;

    const [name, setName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [years, setYears] = useState({});
    const [selectedYears, setSelectedYears] = useState({});
    const [overallGPA, setOverallGPA] = useState(true);
    const [yearlyGPA, setYearlyGPA] = useState(true);
    const [currentTri, setCurrentTri] = useState(false);

    useEffect(() => {
        const courses = sessionData?.courses;
        const userData = sessionData?.userData;

        console.log(sessionData)

        if (userData) setName(userData.displayName);
        setName("Christopher Oscar E Sa")
        setStudentId("300570735")
        if (courses && courses !== "Reloading") {
            setYears(courses);
            setSelectedYears(courses);
        }
    }, [sessionData]);

    const handleClose = () => {
        setName("");
        setStudentId("");
        setSelectedYears(years);

        onClose();
    }

    const handleYearSelect = (e) => {
        const year = e.target.id;
        const courses = years[year];
        const checked = e.target.checked;

        if (checked) setSelectedYears({ ...years, [year]: courses });
        else {
            const tempYears = JSON.parse(JSON.stringify(selectedYears));
            delete tempYears[year];
            setSelectedYears(tempYears);
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Create Transcript</DialogTitle>
            <DialogContent sx={{ mt: 1 }}>
                <Stack spacing={2}>
                    <TextField sx={{ mt: 1}} value={name} label="Name to display" onChange={(e) => setName(e.target.value)} />
                    <TextField value={studentId} label="Student ID" onChange={(e) => setStudentId(e.target.value)} />
                    <FormGroup>
                        <FormLabel component="legend">Years to include</FormLabel>
                        <Stack direction="row">
                            {years && Object.entries(years).map(([year]) => {
                                return (
                                    <FormControlLabel
                                        key={year}
                                        control={<Checkbox defaultChecked id={year} onChange={handleYearSelect} />}
                                        label={year}
                                    />
                                )
                            })}
                        </Stack>
                    </FormGroup>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={() => generateTranscript(name, studentId, selectedYears)}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TranscriptDialog;