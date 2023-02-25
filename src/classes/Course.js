class Course {
    constructor(code, name, url, assessments, totalGrade, lastUpdated, lastSynced, tri, year) {
        this.code = code;
        this.name = name;
        this.assessments = assessments;
        this.totalGrade = totalGrade;
        this.tri = tri;
        this.year = year;
        this.url = url;
        this.lastUpdated = new Date(lastUpdated);
        this.lastSynced = new Date(lastSynced);
    }

    getCourseCompletion() {
        let finished = 0;
        this.assessments.forEach((ass) => {
            if (ass.grade !== -1 && !isNaN(ass.grade)) finished++;
        });
        return finished / this.assessments.length;
    }

    getCourseLetter() {
        if (this.getCourseCompletion() === 0) return "N/A";
        return getLetterGrade(this.totalGrade);
    }

    updateTotal() {
        let temp = 0;
        this.assessments.forEach((ass) => {
            let num = isNaN(ass.grade) ? 0 : ass.grade;
            temp += (num * ass.weight * 0.01);
        });
        this.totalGrade = temp === 0 ? temp : temp.toFixed(2);
    }
}

const getLetterGrade = (grade) => {
    if (grade >= 90) return "A+";
    else if (grade >= 85) return "A";
    else if (grade >= 80) return "A-";
    else if (grade >= 75) return "B+";
    else if (grade >= 70) return "B";
    else if (grade >= 65) return "B-";
    else if (grade >= 60) return "C+";
    else if (grade >= 55) return "C";
    else if (grade >= 50) return "C-";
    else if (grade >= 40) return "D";
    return "E";
};

export default Course;
export { getLetterGrade };