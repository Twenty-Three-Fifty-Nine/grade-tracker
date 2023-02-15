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
    if (httpMethod === "POST") {
        const { body } = event;
        const { codeYearTri, name, assignments, url } = JSON.parse(body);

        const assignmentsParsed = assignments.map((assignment) => {
            const { name, weight, dueDate, grade, isAssignment } = assignment;
            return {
                name,
                weight,
                dueDate,
                grade,
                isAssignment,
            };
        });

        // Check if course exists
        const course = await client.send(
            new GetItemCommand({
                TableName: courseTable,
                Key: marshall({ codeYearTri }),
            })
        );

        if (course.Item) {
            return {
                statusCode: 409,
                body: JSON.stringify("Course already exists"),
            };
        }

        // Add course
        const params = {
            TableName: courseTable,
            Item: marshall({
                codeYearTri,
                name,
                assignments: assignmentsParsed,
                url,
                lastUpdated: new Date().toString(),
            }),
        };

        try {
            const data = await client.send(new PutItemCommand(params));
            return {
                statusCode: 200,
                body: JSON.stringify(data.Item),
            };
        } catch (err) {
            console.log("Error adding course: ", err);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Error adding course" }),
            };
        }
    } else if (httpMethod === "GET") {
        const { year, trimester } = event.queryStringParameters;

        const route = event.routeKey.split(" ")[1];

        if (route === "/courses") {
            return await getCourses(year, trimester);
        } else if (route === "/courses/{course}") {
            const { course } = event.pathParameters;
            return await getCourse(course + "|" + year + "|" + trimester);
        }

        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Not found" }),
        };
    }
};

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

    return {
        statusCode: 200,
        body: JSON.stringify(data.Items.map(unmarshall)),
    };
}

async function getCourse(codeYearTri) {
    const params = {
        TableName: courseTable,
        Key: marshall({ codeYearTri: codeYearTri }),
    };

    const data = await client.send(new GetItemCommand(params));

    return {
        statusCode: 200,
        body: JSON.stringify(unmarshall(data.Item)),
    };
}