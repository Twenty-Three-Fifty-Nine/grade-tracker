/**
 * Twenty Three Fifty Nine - Grade tracking tool
 * Copyright (C) 2023  Abdulrahman Asfari and Christopher E Sa
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import FeedbackEmailTemplate from "./FeedbackEmailTemplate.mjs";

const sesClient = new SESClient({ region: "ap-southeast-2" });

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
            ToAddresses: [`2359gradetracker+${feedbackType}@gmail.com`],
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
        Source: `${toTitleCase(feedbackType)} 2359 <${feedbackType}@twentythreefiftynine.com>`,
        ReplyToAddresses: [
            email
        ]
    };

    const command = new SendEmailCommand(params);
    await sesClient.send(command);

    if (feedbackType === "bug" || feedbackType === "suggestion") {
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
        body: JSON.stringify('Success'),
    };
    return response;
};

const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};