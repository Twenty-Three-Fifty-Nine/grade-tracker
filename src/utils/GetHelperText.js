const getNameHelperText = (details, nameCheckOn = true) => {
    if (!nameCheckOn) return "";
    if (details.name.length === 0) return "The name cannot be empty";
    if (details.name.length > 30) return "The name cannot be longer than 30 characters";
    if (details.duplicate) return "Another assessment has the same name";
    return "";
};

const getWeightHelperText = (details, weightCheckOn = true) => {
    if (!weightCheckOn) return "";
    if (details.weight <= 0) return "The weight must be greater than 0";
    if (details.weight > 100) return "The weight must be less than or equal to 100";
    return "";
};

export { getNameHelperText, getWeightHelperText };