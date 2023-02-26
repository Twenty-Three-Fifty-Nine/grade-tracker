/** Used to store course information loaded and stored in session data. */
class Course {
    /**
     * Creates a new course object using the provided information.
     * 
     * @param code - The course code.
     * @param name - The course name.
     * @param url - The course page URL.
     * @param assessments - A list of the courses assessments.
     * @param totalGrade - The total grade obtained for the course.
     * @param lastUpdated - When the course template was last updated.
     * @param lastSynced - When this instance of the course was last synced.
     * @param tri - The trimester this course is being taken in.
     * @param year - The year this course is being taken in.
     */
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

    /** @returns The % of assessments that have been completed in this course. */
    getCourseCompletion() {
        let finished = 0;
        this.assessments.forEach((ass) => {
            if (ass.grade !== -1 && !isNaN(ass.grade)) finished++;
        });
        return finished / this.assessments.length;
    }

    /** @returns The grade obtained so far in this course. */
    getCourseLetter() {
        if (this.getCourseCompletion() === 0) return "N/A";
        return getLetterGrade(this.totalGrade);
    }

    /** Updates the total course grade. */
    updateTotal() {
        let temp = 0;
        this.assessments.forEach((ass) => {
            let num = isNaN(ass.grade) ? 0 : ass.grade;
            temp += (num * ass.weight * 0.01);
        });
        this.totalGrade = temp === 0 ? temp : temp.toFixed(2);
    }
}

/**
 * Takes in a grade and returns a letter grade.
 * 
 * @param grade - The grade used to calculate the letter.  
 * @returns The letter grade.
 */
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