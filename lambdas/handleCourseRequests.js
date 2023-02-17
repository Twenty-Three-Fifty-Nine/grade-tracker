import {
    DynamoDBClient,
    PutItemCommand,
    ScanCommand,
    GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const courseTable = "courses";

export const handler = async (event) => {
    const httpMethod = event.requestContext.http.method;
    if (httpMethod === "GET") {
        const { year, trimester } = event.queryStringParameters;

        const route = event.routeKey.split(" ")[1];

        if (route === "/courses") {
            return {
                statusCode: 200,
                body: JSON.stringify(await getCourses(year, trimester)),
            };
        } else if (route === "/courses/{course}") {
            const { course } = event.pathParameters;
            return {
                statusCode: 200,
                body: JSON.stringify(
                    unmarshall((await getCourse(course + "|" + year + "|" + trimester)).Item)
                ),
            };
        }

        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Not found" }),
        };
    } else if (httpMethod === "POST" || httpMethod === "PUT") {
        const { body } = event;
        const { codeYearTri, name, assignments, url } = JSON.parse(body);

        const assignmentsParsed = assignments.map((assignment) => {
            const { name, weight, dueDate, grade, isAssignment } = assignment;
            return { name, weight, dueDate, grade, isAssignment };
        });

        // Check if course exists
        const course = await getCourse(codeYearTri);

        if (course.Item && httpMethod === "POST") {
            return {
                statusCode: 409,
                body: JSON.stringify("Course already exists"),
            };
        } else if (!course.Item && httpMethod === "PUT") {
            return {
                statusCode: 404,
                body: JSON.stringify("Course does not exist"),
            };
        }

        try {
            return {
                statusCode: 200,
                body: JSON.stringify(await addCourse(codeYearTri, name, assignmentsParsed, url)),
            };
        } catch (err) {
            console.log("Error adding course: ", err);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Error " + (httpMethod === "POST" ? "adding" : "updating") + " course" }),
            };
        }
    }
};

/**
 * Get the courses for a given year and trimester
 *
 * @param {String} year The year of the course
 * @param {String} trimester The trimester of the course
 * @returns {Object} An array of courses
 */
async function getCourses(year, trimester) {
    const yearTri = `${year}|${trimester}`;

    // Filter courses by year and trimester
    const params = {
        TableName: courseTable,
        FilterExpression: "contains(codeYearTri, :yearTri)",
        ExpressionAttributeValues: {
            ":yearTri": marshall(yearTri),
        },
    };

    const data = await client.send(new ScanCommand(params));

    return data.Items.map(unmarshall);
}


/**
 * Get a course by its codeYearTri
 *
 * @param {String} codeYearTri The codeYearTri of the course to get
 * @returns {Object} The course
 */
async function getCourse(codeYearTri) {
    const params = {
        TableName: courseTable,
        Key: marshall({ codeYearTri: codeYearTri }),
    };

    const data = await client.send(new GetItemCommand(params));

    return data;
}


/**
 * Add a course to the database
 *
 * @param {String} codeYearTri The codeYearTri of the course to add
 * @param {String} name The name of the course
 * @param {Array} assignments The assignments of the course
 * @param {String} url The url of the course page
 * @returns {Object} The course that was added
 */
async function addCourse(codeYearTri, name, assignments, url) {
    const params = {
        TableName: courseTable,
        Item: marshall({
            codeYearTri,
            name,
            assignments,
            url,
            lastUpdated: new Date().toString(),
        }),
    };

    return await client.send(new PutItemCommand(params));
}