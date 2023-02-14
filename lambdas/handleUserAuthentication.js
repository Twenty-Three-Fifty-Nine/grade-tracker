import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const tableName = "users";

export const handler = async (event) => {
    console.log(event);
    if (event.requestContext.http.method !== "POST") {
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
    user["years"].forEach((y) => hasYear = hasYear || y.year === year);

    if (hasYear) return;

    user["years"].push({
        year: year,
        courses: [],
    });

    const command = new PutItemCommand({
        TableName: tableName,
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
        TableName: tableName,
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


/**
 * Authenticates a user
 *
 * @param {Object} event The event object from the API Gateway
 * @returns {Promise} A promise that resolves when the user has been authenticated
 */
async function authenticateUser(event) {
    const body = JSON.parse(event.body);
    const { email, password, activeTri: { year } } = body;

    // Get the user from the database
    const result = await client.send(
        new GetItemCommand({
            TableName: tableName,
            Key: marshall({ email: email }),
        })
    );

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
async function addUser(event) {
    const body = JSON.parse(event.body);
    const email = body.email;
    const displayName = body.displayName;
    const password = body.password;
    const year = body.activeTri.year;

    const salt = generateSalt();
    const hash = getHash(password, salt);

    // Check if the user already exists
    const result = await client.send(new GetItemCommand({
        TableName: tableName,
        Key: marshall({ email: email }),
    }));

    if (result.Item) {
        return {
            statusCode: 409,
            body: "User already exists",
        };
    }

    // Add the user to the database
    const command = new PutItemCommand({
        TableName: tableName,
        Item: marshall({
            email: email,
            displayName: displayName,
            password: hash,
            salt: salt,
            years: [{
                year: year,
                courses: [],
            }],
        }),
    });

    await client.send(command);

    return {
        statusCode: 200,
        body: JSON.stringify({
            email: email,
            displayName: displayName,
        }),
    };
}
