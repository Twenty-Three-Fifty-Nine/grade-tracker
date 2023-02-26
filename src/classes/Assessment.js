/**
 * Primarily stored inside a course object but copies of an assessment 
 * will be created when viewing a course, editing a template, or syncing.
 */
class Assessment {
    /**
     * Creates a new assessment using the provided information and
     * prepares the flags that are used to correctly manipulate an 
     * assessment.
     * 
     * @param name - The name of the assessment 
     * @param weight - The weight of the assessment 
     * @param grade - The grade of the assessment 
     * @param deadline - The deadline of the assessment 
     * @param isAss - Whether the assessment is an assignment or test.
     * @param isNew - If this assessment is newly created or being loaded.
     * @param valid - Tracks the validity of the assessment information.
     */
    constructor(name, weight, grade, deadline, isAss, isNew, valid = true) {
        this.name = name;
        this.weight = weight;
        this.grade = grade === -1 ? NaN : grade;
        this.deadline = deadline;

        this.gradeValid = true;
        this.valid = valid;
        this.isNew = isNew;

        this.duplicateName = false;

        this.isAss = isAss;
        this.hasChanged = isNew;
        this.stopTransition = false;

        this.initName = name;
        this.initDeadline = deadline;
        this.initGrade = grade === -1 ? NaN : grade;
        this.initAss = isAss;
        this.initWeight = weight;
    }

    /** Checks if the assessment has valid information. */
    checkValid() {
        let nameValid = !(this.name.length === 0 || this.name.length > 30 || this.duplicateName);
        let weightValid = this.weight > 0 && this.weight <= 100;
        this.valid = nameValid && this.gradeValid && weightValid;
    }

    /** Checks if the information has changed from the state reset. */
    checkIfChanged() {
        let gradeChanged = isNaN(this.grade) ? !isNaN(this.initGrade) : this.grade !== this.initGrade;
        let nameChanged = this.name !== this.initName;
        let deadlineChanged = this.deadline !== this.initDeadline;
        let isAssChanged = this.isAss !== this.initAss;
        let weightChanged = this.weight !== this.initWeight;
        this.hasChanged = this.isNew || gradeChanged || nameChanged || deadlineChanged || isAssChanged || weightChanged;
    }

    /** Sets the assessment grade and then checks if changes have been made. */
    setGrade(grade) {
        this.grade = grade;
        this.checkIfChanged();
    }

    /** Sets the assessment grade and then checks if changes have been made. */
    setName(name) {
        this.name = name;
        this.checkIfChanged();
        this.checkValid();
    }

    /** Sets the assessment deadline and then checks if changes have been made. */
    setDeadline(deadline) {
        this.deadline = deadline;
        this.checkIfChanged();
    }

    /** Sets the assessment weight and then checks if changes have been made. */
    setWeight(weight) {
        this.weight = weight;
        this.checkValid();
        this.checkIfChanged();
    }

    /** Sets the isAss flag and then checks if changes have been made. */
    setIsAss(isAss) {
        this.isAss = isAss;
        this.checkIfChanged();
    }

    /** Resets the flags that are used to detect changes made. */
    resetStates() {
        this.hasChanged = false;
        this.isNew = false;
        this.initGrade = parseFloat(this.grade);
        this.initName = this.name;
        this.initAss = this.isAss;
        this.initDeadline = this.deadline; 
    }

    /**
     * Checks if this assessment is equal to a given
     * assessment template.
     * 
     * @param template - The assessment to compare to this one.
     * @returns A boolean indicating whether or not the assessments are equal.
     */
    equalsTemplate(template) {
        return this.name === template.name && this.deadline === template.deadline && 
            this.isAss === template.isAss && this.weight.toString() === template.weight.toString();
    }

    /** @returns A copy of this assessment. */
    clone() {
        return new Assessment(this.name, this.weight, this.grade, this.deadline, this.isAss, this.isNew, this.valid);
    }
} 

export default Assessment;