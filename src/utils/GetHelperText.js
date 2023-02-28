/**
 * Returns helper text for assessment name fields.
 * 
 * @param details - The assessment object. 
 * @param nameCheckOn - Whether or not the name should be checked for validity. 
 * @returns The helper text
 */
const getNameHelperText = (details, nameCheckOn = true) => {
    if (!nameCheckOn || !details) return "";
    if (details.name.length === 0) return "The name cannot be empty";
    if (details.name.length > 60) return "The name cannot be longer than 60 characters";
    if (details.duplicate) return "Another assessment has the same name";
    return "";
};

/**
 * Returns helper text for assessment weight fields.
 * 
 * @param details - The assessment object. 
 * @param weightCheckOn - Whether or not the weight should be checked for validity. 
 * @returns The helper text
 */
const getWeightHelperText = (details, weightCheckOn = true) => {
    if (!weightCheckOn || !details) return "";
    if (details.weight <= 0) return "The weight must be greater than 0";
    if (details.weight > 100) return "The weight must be less than or equal to 100";
    return "";
};

export { getNameHelperText, getWeightHelperText };