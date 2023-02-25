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

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#7E7F34",
        },
        background: {
            default: "#20231c",
            paper: "#1c2116",
        },
        info: {
            main: "#339ace",
        },
        warning: {
            main: "#d6ae2a",
        },
        secondary: {
            main: "rgba(126, 127, 52, .6)",
        },
        success: {
            main: "#ffffff",
        },
        successAlt: {
            main: "#388c17"
        },
        error: {
            main: "rgb(200, 100, 0)",
        },
        highlight: {
            main: "#545650",
        },
        filterPanel: {
            main: "#32382c"
        },
        passing: {
            main: "#49a527",
        }
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                standardInfo: {
                    backgroundColor: "rgba(36, 112, 150, .3)",
                    color: "#ffffff",
                },
                standardSuccess: {
                    backgroundColor: "#507841",
                    color: "#ffffff",
                },
                standardWarning: {
                    backgroundColor: "rgba(126, 127, 52, .8)",
                    color: "#ffffff",
                }
            }
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: "#32382c",
                },
            }
        },
        MuiChip: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: "rgba(100, 100, 100, 0.8)",
                    color: "#ffffff",
                },
                colorSuccess: {
                    backgroundColor: "rgba(36, 112, 150, .8)",
                    color: "#ffffff",
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#2c382c",
                }
            }
        }
    }
});

export default darkTheme;