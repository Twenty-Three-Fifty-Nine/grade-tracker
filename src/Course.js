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
        if(this.getCourseCompletion() === 0) return "N/A";
        else if(this.totalGrade >= 90) return "A+";
        else if(this.totalGrade >= 85) return "A";
        else if(this.totalGrade >= 80) return "A-";
        else if(this.totalGrade >= 75) return "B+";
        else if(this.totalGrade >= 70) return "B";
        else if(this.totalGrade >= 65) return "B-";
        else if(this.totalGrade >= 60) return "C+";
        else if(this.totalGrade >= 55) return "C";
        else if(this.totalGrade >= 50) return "C-";
        else if(this.totalGrade >= 40) return "D";
        return "E";
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

export default Course;