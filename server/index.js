const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'grade_tracker'
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3001;

// Handle replies to the client
const reply = (res, err, result) => {
    if (err) {
        console.log(err); // For development only
        res.send(0);
    } else {
        res.send(result);
    }
}


// ========== Post requests ==========

// Add a new user
app.post('/api/users', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const sqlInsert = "INSERT INTO users (email, password, name) VALUES (?, ?, ?)";
    db.query(sqlInsert, [email, password, name], (err, result) => {
        console.log(result);
        if (err) {
            res.send(0);
        } else {
            res.send(1);
        }
    });
});

// Add a new course
app.post('/api/courses', (req, res) => {
    const courseCode = req.body.courseCode;
    const courseName = req.body.courseName;
    const trimesters = req.body.trimesters;

    const sqlInsert = "INSERT INTO courses (CourseCode, CourseName, TrimesterTaught) VALUES (?, ?, ?)";
    db.query(sqlInsert, [courseCode, courseName, trimesters], (err, result) => {
        reply(res, err, result);
    });
});

// Add a new assignment
app.post('/api/assignments', (req, res) => {
    const courseCode = req.body.courseCode;
    const assignmentName = req.body.assignmentName;
    const weight = req.body.weight;
    const dueDate = req.body.dueDate;

    const sqlInsert = "INSERT INTO assignments (CourseCode, AssignmentName, Weight, DueDate) VALUES (?, ?, ?, ?)";
    db.query(sqlInsert, [courseCode, assignmentName, weight, dueDate], (err, result) => {
        reply(res, err, result);
    });
});

// Authenticate a user
app.post('/api/authorise', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const sqlSelect = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sqlSelect, [username, password], (err, result) => {
        if (result.length > 0 && err == null) {
            res.send(result);
        } else {
            res.send(0);
        }
    });
});

// Add a course to a user
app.post('/api/:userID/courses', (req, res) => {
    const userID = req.params.userID;
    const courseCode = req.body.courseCode;
    const year = req.body.year;
    const trimester = req.body.trimester;
    const grades = req.body.grades;

    const sqlInsert = "INSERT INTO grades (Email, CourseCode, Year, Trimester, Grades) VALUES (?, ?, ?, ?, ?)";
    db.query(sqlInsert, [userID, courseCode, year, trimester, grades], (err, result) => {
        reply(res, err, result);
    });
});


// ========== Get requests ==========

// Get all course with filter by tri option
app.get('/api/courses', (req, res) => {
    const trimester = req.query.trimester;
    if (trimester == null) {
        const sqlSelect = "SELECT * FROM courses";
        db.query(sqlSelect, (err, result) => {
            reply(res, err, result);
        });
    } else {
        const sqlSelect = "SELECT * FROM courses WHERE TrimesterTaught LIKE ?";
        db.query(sqlSelect, ['%' + trimester + '%'], (err, result) => {
            reply(res, err, result);
        });
    }
});

// Get user courses with optional filter of year
app.get('/api/:userId/courses/', (req, res) => {
    const userId = req.params.userId;
    const year = req.params.year;

    if (year == null) {
        const sqlSelect = "SELECT * FROM grades WHERE Email = ?";
        db.query(sqlSelect, [userId], (err, result) => {
            reply(res, err, result);
        });
    } else {
        const sqlSelect = "SELECT * FROM grades WHERE Email = ? AND Year = ?";
        db.query(sqlSelect, [userId, year], (err, result) => {
            reply(res, err, result);
        });
    }
});


// ========== Put requests ==========

// Update user details - Could be a better way to do this
app.put('/api/users/:userId', (req, res) => {
    const userId = req.params.userId;
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    
    const sqlUpdate = "UPDATE users SET Email = ?, Password = ?, Name = ? WHERE Email = ?";
    db.query(sqlUpdate, [email, password, name, userId], (err, result) => {
        reply(res, err, result);
    });
});

// Update a user's grades
app.put('/api/:userId/courses/:courseCode', (req, res) => {
    const userId = req.params.userId;
    const courseCode = req.params.courseCode;
    const year = req.params.year;
    const trimester = req.params.trimester;
    const grade = req.params.grade;

    const sqlUpdate = "UPDATE grades SET Grade = ? WHERE Email = ? AND CourseCode = ? AND Year = ? AND Trimester = ?";
    db.query(sqlUpdate, [grade, userId, courseCode, year, trimester], (err, result) => {
        reply(res, err, result);
    });
});


app.listen(PORT, () => {
    console.log('Example app listening on port ' + PORT);
});