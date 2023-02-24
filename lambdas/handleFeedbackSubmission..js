import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import FeedbackEmailTemplate from "./FeedbackEmailTemplate.mjs";

const sesClient = new SESClient({ region: "ap-southeast-2" });
const fromEmail = "2359gradetracker@gmail.com";
const bugEmail = "2359gradetracker+bugs@gmail.com";
const suggestionEmail = "2359gradetracker+suggestions@gmail.com";
const supportEmail = "2359gradetracker+support@gmail.com";

export const handler = async(event) => {
    if(event.requestContext.http.method !== "POST") {
        return {
            statusCode: 401,
            body: "Unauthorized",
        };
    }
    
    const {subject, message, feedbackType, email, displayName} = JSON.parse(event.body);
    
    const params = {
        Destination: {
            ToAddresses: [feedbackType === "bug" ? bugEmail : feedbackType === "suggestion" ? suggestionEmail : supportEmail],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: FeedbackEmailTemplate({
                        email,
                        displayName, 
                        message,
                        feedbackType,
                    }),
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: fromEmail,
    };

    const command = new SendEmailCommand(params);
    await sesClient.send(command);

    if (feedbackType !== "bug" || feedbackType !== "suggestion") {
        const githubResponse = await fetch("https://api.github.com/repos/Twenty-Three-Fifty-Nine/grade-tracker/issues", {
            method: "POST",
            body: JSON.stringify({
                title: subject,
                body: message,
                labels: [feedbackType],
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
        });

        if(githubResponse.status !== 201) {
            console.log("Failed to create GitHub issue");
            console.log(await githubResponse.json());
        }
    }
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
