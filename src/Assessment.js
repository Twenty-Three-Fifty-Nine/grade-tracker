class Assessment {
    constructor(name, weight, grade, deadline, isAss, isNew) {
        this.name = name;
        this.weight = weight;
        this.grade = grade === -1 ? NaN : grade;
        this.deadline = deadline;

        this.gradeValid = true;
        this.valid = true;
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

    checkValid() {
        let nameValid = !(this.name.length === 0 || this.name.length > 30 || this.duplicateName);
        let weightValid = this.weight > 0 && this.weight <= 100;
        this.valid = nameValid && this.gradeValid && weightValid;
    }

    checkIfChanged() {
        let gradeChanged = isNaN(this.grade) ? !isNaN(this.initGrade) : this.grade !== this.initGrade;
        let nameChanged = this.name !== this.initName;
        let deadlineChanged = this.deadline !== this.initDeadline;
        let isAssChanged = this.isAss !== this.initAss;
        let weightChanged = this.weight !== this.initWeight;
        this.hasChanged = this.isNew || gradeChanged || nameChanged || deadlineChanged || isAssChanged || weightChanged;
    }

    setGrade(grade) {
        this.grade = grade;
        this.checkIfChanged();
    }

    setName(name) {
        this.name = name;
        this.checkIfChanged();
        this.checkValid();
    }

    setDeadline(deadline) {
        this.deadline = deadline;
        this.checkIfChanged();
    }

    setWeight(weight){
        this.weight = weight;
        this.checkValid();
        this.checkIfChanged();
    }

    setIsAss(isAss) {
        this.isAss = isAss;
        this.checkIfChanged();
    }

    resetStates() {
        this.hasChanged = false;
        this.isNew = false;
        this.initGrade = parseInt(this.grade);
        this.initName = this.name;
        this.initAss = this.isAss;
        this.initDeadline = this.deadline; 
    }

    equalsTemplate(template) {
        return this.name === template.name && this.deadline === template.deadline && 
            this.isAss === template.isAss && this.weight.toString() === template.weight.toString();
    }

    clone() {
        return new Assessment(this.name, this.weight, this.grade, this.deadline, this.isAss, this.isNew);
    }
} 

export default Assessment;