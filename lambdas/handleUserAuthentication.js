import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";
import crypto from "crypto";
import VerificationEmailTemplate from "./VerificationEmailTemplate.mjs";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const userTable = "users";

const sesClient = new SESClient({ region: "ap-southeast-2" });
const fromEmail = "2359gradetracker@gmail.com";

export const handler = async (event) => {
    if (event.requestContext.http.method !== "POST" && event.requestContext.http.method !== "PATCH") {
        return {
            statusCode: 401,
            body: "Unauthorized",
        };
    }

    const route = event.routeKey.split(" ")[1];

    if (route === "/users/authorise") {
        return await authenticateUser(event);
    } else if (route === "/users/signup") {
        return await addUser(event);
    } else if (route === "/users/{user}") {
        return await updateUser(event);
    } else if (route === "/users/{user}/verify") {
        return await verifyEmail(event);
    } else {
        return {
            statusCode: 401,
            body: route,
        };
    }
};

/**
 * Adds a year to the user's active years if it does not already exist
 *
 * @param {Object} user The user to add the year to
 * @param {Number} year The year to add
 * @returns {Promise} A promise that resolves when the user has been updated
 */
async function addActiveYear(user, year) {
    let hasYear = false;
    user["years"].forEach((y) => (hasYear = hasYear || y.year === year));

    if (hasYear) return;

    user["years"].push({
        year: year,
        courses: [],
    });

    const command = new PutItemCommand({
        TableName: userTable,
        Item: marshall(user),
    });

    await client.send(command);
}

/**
 * Remove empty years from the user
 *
 * @param {Object} user The user to remove empty years from
 * @param {Number} year The current year to keep
 * @returns {Promise} A promise that resolves when the user has been updated
 */
async function removeEmptyYears(user, year) {
    let newYears = [];
    user["years"].forEach((y) => {
        if (y.courses.length !== 0 || y.year === year) newYears.push(y);
    });

    user["years"] = newYears;

    const command = new PutItemCommand({
        TableName: userTable,
        Item: marshall(user),
    });

    await client.send(command);
}

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
    return await client.send(
        new GetItemCommand({
            TableName: userTable,
            Key: marshall({ email: email }),
        })
    );
}

/**
 * Authenticates a user
 *
 * @param {Object} event The event object from the API Gateway
 * @returns {Promise} A promise that resolves when the user has been authenticated
 */
async function authenticateUser(event) {
    const body = JSON.parse(event.body);
    const {
        email,
        password,
        activeTri: { year },
    } = body;

    // Get the user from the database
    const result = await getUser(email);

    if (result.Item) {
        // Check if the password is correct
        const user = unmarshall(result.Item);
        const hash = getHash(password, user.salt);
        if (hash === user.password) {
            await addActiveYear(user, year);
            await removeEmptyYears(user, year);

            return {
                statusCode: 200,
                body: JSON.stringify({
                    email: user.email,
                    displayName: user.displayName,
                }),
            };
        } else {
            return {
                statusCode: 401,
                body: "Unauthorized",
            };
        }
    } else {
        // User does not exist
        return {
            statusCode: 401,
            body: "Unauthorized",
        };
    }
}

/**
 * Adds a user to the database
 *
 * @param {Object} event The event object from the API Gateway
 * @returns {Promise} A promise that resolves when the user has been added
 */
async function addUser(event, years = []) {
    const body = JSON.parse(event.body);
    const email = body.email;
    const displayName = body.displayName;
    const password = body.password;
    let year = null;

    try {
        year = body.activeTri.year;
    } catch (ignored) {}

    const salt = generateSalt();
    const hash = getHash(password, salt);

    // Check if the user already exists
    const result = await getUser(email);

    if (result.Item) {
        return {
            statusCode: 409,
            body: "User already exists",
        };
    }

    const yearsValue =
        years.length === 0 ? [{ year: year, courses: [] }] : years;

    const token = crypto.randomBytes(50).toString("hex");
    const obj = {
        token: token,
        verified: false,
    };

    // Add the user to the database
    const command = new PutItemCommand({
        TableName: userTable,
        Item: marshall({
            email: email,
            displayName: displayName,
            password: hash,
            salt: salt,
            years: yearsValue,
            verifiedEmail: obj,
        }),
    });

    await client.send(command).then(async (res) => {
        await sendVerificationEmail(email, token, displayName, true);
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            email: email,
            displayName: displayName,
        }),
    };
}

/**
 * Updates a user in the database
 *
 * @param {Object} event The event object from the API Gateway
 * @returns {Promise} A promise that resolves when the user has been updated
 */
async function updateUser(event) {
    const email = event.pathParameters.user;
    const body = JSON.parse(event.body);
    const { newEmail, displayName, oldPassword, newPassword } = body;

    // Check if the user already exists
    const result = await getUser(email);

    if (!result.Item) {
        return {
            statusCode: 404,
            body: "User does not exist",
        };
    }

    const user = unmarshall(result.Item);

    if (oldPassword && newPassword) {
        const hash = getHash(oldPassword, user.salt);
        if (hash !== user.password) {
            return {
                statusCode: 401,
                body: "Unauthorized",
            };
        }
        user.salt = generateSalt();
        user.password = getHash(newPassword, user.salt);
    }

    if (displayName) {
        user.displayName = displayName;
    }

    if (newEmail) {
        const userCheck = await getUser(newEmail);
        if (userCheck.Item) {
            return {
                statusCode: 409,
                body: "User already exists",
            };
        } else {
            user.email = newEmail;
            user.verifiedEmail = {
                token: crypto.randomBytes(50).toString("hex"),
                verified: false,
            };
            await sendVerificationEmail(
                user.email,
                user.verifiedEmail.token,
                user.displayName,
                false
            );
        }
    }

    const command = new PutItemCommand({
        TableName: userTable,
        Item: marshall(user),
    });

    await client.send(command);
    if (newEmail) await deleteUser(email);
    return {
        statusCode: 200,
        body: JSON.stringify({
            email: user.email,
            displayName: user.displayName,
        }),
    };
}

/**
 * Deletes a user from the database
 *
 * @param {String} email The user's email linked to the account being deleted
 */
async function deleteUser(email) {
    const command = new DeleteItemCommand({
        TableName: userTable,
        Key: marshall({ email: email }),
    });

    await client.send(command);
}

async function verifyEmail(event) {
    console.log(event);
    const email = event.pathParameters.user;
    const token = JSON.parse(event.body).token;
    const result = await getUser(email);

    if (!result.Item) {
        return {
            statusCode: 404,
            body: "User does not exist",
        };
    }

    const user = unmarshall(result.Item);

    if (user.verifiedEmail.token === token) {
        user.verifiedEmail.verified = true;
        user.verifiedEmail.token = null;
        const command = new PutItemCommand({
            TableName: userTable,
            Item: marshall(user),
        });

        await client.send(command);
        return {
            statusCode: 200,
            body: "Email verified",
        };
    } else {
        return {
            statusCode: 401,
            body: "Unauthorized",
        };
    }
}

async function sendVerificationEmail(email, token, displayName, newSignUp) {
    const params = {
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: VerificationEmailTemplate({
                        email,
                        displayName,
                        token,
                        newSignUp,
                    }),
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Verify your email",
            },
        },
        Source: fromEmail,
    };

    await sesClient.send(new SendEmailCommand(params));
}