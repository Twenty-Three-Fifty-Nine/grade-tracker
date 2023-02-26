import { isMobile } from "react-device-detect";

/**
 * Returns snackbar horizontal anchoring based on a provided
 * variable and whether or not the user is on mobile.
 * 
 * @param variable - A boolean used to determine the horizontal anchor value. 
 * @returns The snackbar horizontal anchoring.
 */
const getSnackbarXPosition = (variable) => {
    if (isMobile) return "center";
    if (variable) return "right";
    return "left";
};

export { getSnackbarXPosition };