import { createTheme } from "@mui/material";

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
            main: "#1b440b",
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
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                standardInfo: {
                    backgroundColor: "rgba(43, 131, 175, .4)",
                    color: "#000000",
                },
                standardSuccess: {
                    backgroundColor: "rgba(50, 150, 10, .5)",
                    color: "#000000",
                },
                standardWarning: {
                    backgroundColor: "rgba(234, 71, 42, 0.2)",
                    color: "#000000",
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: "#c4c389",
                },
            },
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
                },
            },
        },
    },
});

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
            main: "#388c17",
        },
        error: {
            main: "rgb(200, 100, 0)",
        },
        highlight: {
            main: "#545650",
        },
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                standardInfo: {
                    backgroundColor: "rgba(36, 112, 150, .3)",
                    color: "#ffffff",
                },
                standardSuccess: {
                    backgroundColor: "rgba(50, 150, 10, .5)",
                    color: "#ffffff",
                },
                standardWarning: {
                    backgroundColor: "rgba(126, 127, 52, .8)",
                    color: "#ffffff",
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: "#32382c",
                },
            },
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
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#2c382c",
                },
            },
        },
    },
});

export { lightTheme, darkTheme };
