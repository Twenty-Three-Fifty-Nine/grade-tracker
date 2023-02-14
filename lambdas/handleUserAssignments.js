import {
    DynamoDBClient,
    UpdateItemCommand,
    GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const userTable = "users";

export const handler = async (event) => {
    const httpMethod = event.requestContext.http.method;

    if (httpMethod === "PATCH") {
        const { user: userId, course: courseCode } = event.pathParameters;

        const body = JSON.parse(event.body);
        const { year, totalGrade, assignments } = body;

        if (!assignments) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "No assignments provided" }),
            };
        }

        let newAssignmentValues = [];
        assignments.forEach((assignment) => {
            newAssignmentValues.push({
                name: assignment.name,
                dueDate: assignment.deadline,
                grade: Number(assignment.grade),
                weight: Number(assignment.weight),
                isAssignment: assignment.isAss,
            });
        });

        let params = {
            TableName: userTable,
            Key: marshall({ email: userId }),
        };

        const data = await client.send(new GetItemCommand(params));
        const user = unmarshall(data.Item);
        const years = user.years;

        const course = years
            .find((y) => y.year === year)
            .courses.find((course) => course.courseCode === courseCode);
        course.assignments = newAssignmentValues;
        course.totalGrade = totalGrade;

        params = {
            TableName: userTable,
            Key: marshall({ email: userId }),
            UpdateExpression: "set years = :y",
            ExpressionAttributeValues: marshall({ ":y": years }),
            ReturnValues: "UPDATED_NEW",
        };

        await client.send(new UpdateItemCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Successfully updated" }),
        };
    }
};
