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
        const year = event.queryStringParameters.year;
        const trimester = event.queryStringParameters.trimester;

        const yearTri = `${year}|${trimester}`;

        // Filter courses by year and trimester
        const params = {
            TableName: courseTable,
            FilterExpression: "contains(codeYearTri, :yearTri)",
            ExpressionAttributeValues: {
                ":yearTri": marshall(yearTri),
            },
        };

        try {
            const data = await client.send(new ScanCommand(params));
            
            return {
                statusCode: 200,
                body: JSON.stringify(data.Items.map(unmarshall)),
            };
        } catch (err) {
            console.log("Error getting courses: ", params);
            console.log(err);

            return {
                statusCode: 501,
                body: JSON.stringify({ message: "Error getting courses" }),
            };
        }
    }
};
