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

import { createTheme } from "@mui/material";

/** The light theme for the website. */
const lightTheme = createTheme({
    palette: {
        type: "light",
        background: {
            default: "#f4ede3",
            paper: "#EDE1CF",
        },
        primary: {
            main: "#7E7F34",
        },
        secondary: {
            main: "rgba(51, 94, 30, .7)",
            contrastText: "#ffffff",
        },
        success: {
            main: "#ffffff",
        },
        successAlt: {
            main: "#1b440b"
        },
        error: {
            main: "rgb(200, 0, 0)",
        },
        warning: {
            main: "#8e2613",
        },
        info: {
            main: "#12394c",
        },
        highlight: {
            main: "#c6c0b6",
        },
        filterPanel: {
            main: "#c4c389"
        },
        passing: {
            main: "#49a527",
        },
        disabled: {
            main: "lightgrey"
        }
    },

    components: {
        MuiAlert: {
            styleOverrides: {
                standardInfo: {
                    backgroundColor: "rgba(43, 131, 175, .4)",
                    color: "#000000",
                },
                standardSuccess: {
                    backgroundColor: "#507841",
                    color: "#ffffff",
                },
                standardWarning: {
                    backgroundColor: "rgba(234, 71, 42, 0.2)",
                    color: "#000000",
                }
            }
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: "#c4c389",
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: "rgba(100, 100, 100, 0.8)",
                    color: "#ffffff",
                },
                colorSuccess: {
                    backgroundColor: "rgba(43, 131, 175, .8)",
                    color: "#ffffff",
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                input: {
                    "&:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px #ede1cf inset",
                        WebkitTextFillColor: "black",
                    }
                }
            }
        }
    }
});

export default lightTheme;