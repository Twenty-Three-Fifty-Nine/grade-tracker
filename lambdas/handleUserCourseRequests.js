import {
    DynamoDBClient,
    GetItemCommand,
    UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const userTable = "users";
const courseTable = "courses";

export const handler = async (event) => {
    const httpMethod = event.requestContext.http.method;

    if (httpMethod === "GET") {
        // Get user's courses
        const userId = event.pathParameters.user;
        let year = null;

        try {
            year = event.queryStringParameters.year;
        } catch (ignore) {}

        return await getUserCourses(userId, year);
    } else if (httpMethod === "PATCH") {
        // Update user's course
        const userId = event.pathParameters.user;
        const { body } = event;
        const { courseCode, year, trimester } = JSON.parse(body);

        return await addUserCourse(userId, courseCode, year, trimester);
    } else if (httpMethod === "DELETE") {
        const { user, course, year } = event.pathParameters;
        await deleteUserCourse(user, course, year);
    }
};

/**
 * Gets a user from the database
 *
 * @param {String} userId User's email
 * @returns {Object} User object
 */
async function getUser(userId) {
    const params = {
        TableName: userTable,
        Key: marshall({ email: userId }),
    };

    const data = await client.send(new GetItemCommand(params));

    return unmarshall(data.Item);
}

/**
 * Returns a 404 error response
 *
 * @param {String} type Type of object not found
 * @returns {Object} Error response
 */
function error404(type) {
    return {
        statusCode: 404,
        body: JSON.stringify({ message: type + " not found" }),
    };
}

/**
 * Updates the lastUpdated dates of the courses in the user's years
 *
 * @param {Array} years User's years
 * @returns {Promise} Promise that resolves to a JSON string of the user's years with updated dates
 */
async function updateAllDates(years) {
    for (const year of years) {
        for (const course of year["courses"]) {
            let params = {
                TableName: courseTable,
                Key: marshall({
                    codeYearTri:
                        course["courseCode"] +
                        "|" +
                        year["year"] +
                        "|" +
                        course["trimester"],
                }),
            };

            let data = await client.send(new GetItemCommand(params));
            const template = unmarshall(data.Item);

            course["lastUpdated"] = template["lastUpdated"];
        }
    }

    return JSON.stringify(years);
}

/**
 * Updates the lastUpdated dates of the courses in the a year
 *
 * @param {Array} courses Courses to update
 * @returns {Promise} Promise that resolves to a JSON string of the courses with updated dates
 */
async function updateCourseDates(courses) {
    for (const course of courses[0]["courses"]) {
        let params = {
            TableName: courseTable,
            Key: marshall({
                codeYearTri:
                    course["courseCode"] +
                    "|" +
                    courses[0]["year"] +
                    "|" +
                    course["trimester"],
            }),
        };

        let data = await client.send(new GetItemCommand(params));
        const template = unmarshall(data.Item);

        course["lastUpdated"] = template["lastUpdated"];
    }

    return JSON.stringify(courses);
}

/**
 * Gets a user's course from
 *
 * @param {String} courseCode The course code of the course to get
 * @param {Number} year The year of the course to get
 * @param {Array} years The user's years
 * @returns {Object} The course and its index in the user's years
 */
async function getUserCourse(courseCode, year, years) {
    const yearIndex = years.findIndex((y) => y["year"] === Number(year));
    const courses = years[yearIndex]["courses"];
    const courseIndex = courses.findIndex((c) => c["course"] === courseCode);

    return {
        courseIndex: courseIndex,
        courses: courses,
        yearIndex: yearIndex,
    };
}

/**
 * Gets a user's courses
 *
 * @param {String} userId The user's email
 * @param {String} year The year to get courses for
 * @returns {Object} An http response
 */
async function getUserCourses(userId, year) {
    const user = await getUser(userId);
    if (!user) return error404("User");

    // Get all courses
    if (!year) {
        const dates = await updateAllDates(user["years"]);
        return {
            statusCode: 200,
            body: dates,
        };
    }

    // Get courses for a specific year
    const courses = await updateCourseDates(
        user["years"].filter((y) => y["year"] === Number(year))
    );
    return {
        statusCode: 200,
        body: courses,
    };
}

/**
 * Updates a user's course
 *
 * @param {String} userId The user's email
 * @param {String} courseCode The course code of the course to update
 * @param {String} year The year of the course to update
 * @param {String} trimester The trimester of the course to update
 * @returns {Object} An http response
 */
async function addUserCourse(userId, courseCode, year, trimester) {
    const user = await getUser(userId);
    if (!user) return error404("User");

    // Get course template
    let params = {
        TableName: courseTable,
        Key: marshall({
            codeYearTri: courseCode + "|" + year + "|" + trimester,
        }),
    };
    
    let data = await client.send(new GetItemCommand(params));
    const course = unmarshall(data.Item);

    if (!course) return error404("Course");

    // Create user course instance
    const userCourse = {
        courseName: course["name"],
        courseCode: courseCode,
        totalGrade: 0,
        assignments: course["assignments"],
        trimester: trimester,
        url: course["url"],
        lastSynced: new Date().toString(),
    };

    let years = user["years"];

    // Update user course instance
    const { courseIndex, courses, yearIndex } = await getUserCourse(
        courseCode,
        year,
        years
    );

    if (courseIndex === -1) {
        // Add course
        courses.push(userCourse);
    } else {
        // Update course
        courses[courseIndex] = userCourse;
    }

    years[yearIndex]["courses"] = courses;

    params = {
        TableName: userTable,
        Key: marshall({ email: userId }),
        UpdateExpression: "set years = :y",
        ExpressionAttributeValues: {
            ":y": marshall(years),
        },
    };

    await client.send(new UpdateItemCommand(params));

    return {
        statusCode: 200,
        body: JSON.stringify(userCourse),
    };
}

/**
 * Deletes a user's course
 *
 * @param {String} userId The user's email
 * @param {String} courseCode The course code of the course to update
 * @param {String} year The year of the course to update
 * @returns {Object} An http response
 */
async function deleteUserCourse(userId, courseCode, year) {
    const user = await getUser(userId);
    if (!user) error404("User");

    const { index, courses, yearIndex } = await getUserCourse(
        courseCode,
        year,
        user["years"]
    );
    if (index === -1) return error404("Course");

    let years = user["years"];
    years[yearIndex]["courses"] = courses.splice(index, 1);

    const params = {
        TableName: userTable,
        Key: marshall({ email: userId }),
        UpdateExpression: "set years = :y",
        ExpressionAttributeValues: {
            ":y": marshall(years),
        },
    };

    try {
        await client.send(new UpdateItemCommand(params));
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Course deleted" }),
    };
}
