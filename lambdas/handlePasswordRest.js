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

import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";
import crypto from "crypto";
import EmailTemplate from "./EmailTemplate.mjs";

const dbClient = new DynamoDBClient({ region: "ap-southeast-2" });
const userTable = "users";

const sesClient = new SESClient({ region: "ap-southeast-2" });
const source = `2359 Admin <no-reply@twentythreefiftynine.com>`;

export const handler = async (event) => {
    if (
        event.requestContext.http.method !== "POST" &&
        event.requestContext.http.method !== "PATCH"
    ) {
        return {
            statusCode: 401,
            body: "Unauthorized",
        };
    }

    const route = event.routeKey.split(" ")[1];

    if (route === "/users/password/forgot") {
        const { email } = JSON.parse(event.body);
        return await handleForgotPassword(email);
    } else if (route === "/users/password/reset") {
        const { email, token, password } = JSON.parse(event.body);
        return await handleResetPassword(email, token, password);
    }

    return {
        statusCode: 404,
        body: JSON.stringify("Not found"),
    };
};

/**
 * Gets the hash of a password
 *
 * @param {String} password The plaintext password
 * @param {String} salt The salt to use
 * @returns {String} The hashed password
 */
function getHash(password, salt) {
    return crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
}

/**
 * Generates a random salt
 * @returns {String} A random salt
 */
function generateSalt() {
    return crypto.randomBytes(16).toString("hex");
}

async function getUser(email) {
    const params = {
        TableName: userTable,
        Key: {
            email: { S: email },
        },
    };
    const command = new GetItemCommand(params);
    const result = await dbClient.send(command);
    return result.Item ? unmarshall(result.Item) : null;
}

async function saveToken(email, token) {
    const data = {
        token: token,
        expiry: Date.now() + 3600000, // 1 hour from now
    };
    // add passwordReset to user
    const params = {
        TableName: userTable,
        Key: {
            email: { S: email },
        },
        UpdateExpression: "SET passwordReset = :r",
        ExpressionAttributeValues: {
            ":r": { M: marshall(data) },
        },
        ReturnValues: "UPDATED_NEW",
    };

    const command = new UpdateItemCommand(params);
    await dbClient.send(command);
}

async function sendEmail(email, displayName, token) {
    const params = {
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: EmailTemplate({
                        email,
                        displayName,
                        token,
                    }),
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Password Reset",
            },
        },
        Source: source,
    };

    const command = new SendEmailCommand(params);
    await sesClient.send(command);
}

async function handleForgotPassword(email) {
    const user = await getUser(email);
    if (!user) {
        return {
            statusCode: 404,
            body: JSON.stringify("User not found"),
        };
    }
    const token = crypto.randomBytes(50).toString("hex");
    await saveToken(email, token);
    await sendEmail(email, user.displayName, token);
}

async function handleResetPassword(email, token, password) {
    const user = await getUser(email);
    if (!user) {
        return {
            statusCode: 404,
            body: JSON.stringify("User not found"),
        };
    }
    if (!user.passwordReset || user.passwordReset.token !== token) {
        return {
            statusCode: 400,
            body: JSON.stringify("Invalid token"),
        };
    }
    if (user.passwordReset.expiry < Date.now()) {
        return {
            statusCode: 400,
            body: JSON.stringify("Token expired"),
        };
    }

    const salt = generateSalt();
    const hash = getHash(password, salt);

    user.password = hash;
    user.salt = salt;
    delete user.passwordReset;

    const params = {
        TableName: userTable,
        Item: marshall(user),
    };

    // A PutItemCommand is used to update as it will also remove the passwordReset attribute
    const command = new PutItemCommand(params);
    await dbClient.send(command);

    return {
        statusCode: 200,
        body: JSON.stringify({
            email: email,
            displayName: user.displayName,
        })
    };
}
