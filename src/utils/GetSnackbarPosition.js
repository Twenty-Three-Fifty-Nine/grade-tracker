import { isMobile } from "react-device-detect";

const getSnackbarXPosition = (variable) => {
    if (isMobile) return "center";
    if (variable) return "right";
    return "left";
};

export { getSnackbarXPosition };