const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const crypto = require('crypto');
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
        res.sendStatus(500);
    } else {
        res.send(result);
    }
}

// Hashing function
const getSaltHash = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = getHash(password, salt);

    return {
        salt: salt,
        hash: hash
    };
}

const getHash = (password, salt) => {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    return hash;
}


// ========== Post requests ==========

// Add a new user
app.post('/api/users', (req, res) => {
    const email = req.body.email;
    let password = req.body.password;
    const name = req.body.name;

    const hashedPassword = getSaltHash(password);

    const sqlInsert = "INSERT INTO users (Email, Password, Salt, DisplayName) VALUES (?, ?, ?, ?)";
    db.query(sqlInsert, [email, hashedPassword.hash, hashedPassword.salt, name], (err, result) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});
 
// Add a new course
app.post('/api/courses', (req, res) => {
    const courseCode = req.body.courseCode;
    const courseName = req.body.courseName;
    const trimester = req.body.trimester;

    const sqlInsert = "INSERT INTO courses (CourseCode, CourseName, TrimesterTaught) VALUES (?, ?, ?)";
    db.query(sqlInsert, [courseCode, courseName, trimester], (err, result) => {
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
    const email = req.body.email;
    const password = req.body.password;

    const sqlSelect = "SELECT * FROM users WHERE Email = ?";
    db.query(sqlSelect, [email], (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            if (result.length > 0) {
                const hash = getHash(password, result[0].Salt);
                if (hash === result[0].Password) {
                    res.send({
                        email: result[0].Email,
                        displayName: result[0].DisplayName
                    });
                } else {
                    res.sendStatus(401);
                }
            } else {
                res.sendStatus(401);
            }
        }
    });
});

// Add a course to a user
app.post('/api/user/courses', (req, res) => {
    const userID = req.body.userID;
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
        const sqlSelect = "SELECT * FROM courses WHERE TrimesterTaught = ?";
        db.query(sqlSelect, trimester, (err, result) => {
            reply(res, err, result);
        });
    }
});

// Get user courses with optional filter of year
app.get('/api/user/courses', (req, res) => {
    const userId = req.query.userId;
    const year = req.query.year; 

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
app.put('/api/user', (req, res) => {
    const userId = req.body.userId;
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    
    const sqlUpdate = "UPDATE users SET Email = ?, Password = ?, DisplayName = ? WHERE Email = ?";
    db.query(sqlUpdate, [email, password, name, userId], (err, result) => {
        reply(res, err, result);
    });
});

// Update a user's grades
app.put('/api/courses/', (req, res) => {
    const userId = req.body.userId;
    const courseCode = req.body.courseCode;
    const year = req.body.year;
    const trimester = req.body.trimester;
    const grades = req.body.grades;

    const sqlUpdate = "UPDATE grades SET Grades = ? WHERE Email = ? AND CourseCode = ? AND Year = ? AND Trimester = ?";
    db.query(sqlUpdate, [grades, userId, courseCode, year, trimester], (err, result) => {
        reply(res, err, result);
    });
});


app.listen(PORT, () => {
    console.log('Example app listening on port ' + PORT);
});