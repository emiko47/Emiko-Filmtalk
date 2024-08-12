import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { buildResponse } from '../utils/util.js';
import bcrypt from 'bcryptjs';
const { hashSync } = bcrypt;

const ddb = new DynamoDBClient({ region: 'us-east-2' });
const userTable = 'Filmtalk';

async function register(userInfo) {
    const { email, password, name, username } = userInfo;//reverse access: userInfo.email, userInfo.password, userInfo.name, userInfo.username
    if (!email || !password || !name || !username) {
        return buildResponse(401, { message: 'Missing the required fields' });//checking for missing fields
    }

    const dynamoUser = await getUser(username.toLowerCase().trim());//checking if user already exists
    if (dynamoUser && dynamoUser.username) {
        return buildResponse(401, { message: 'Username already exists! Please choose a different username.' });
    }

    const encryptedPassword = hashSync(password.trim(), 10);//password is encrypted here
    const user = {
        email,
        password: encryptedPassword,
        name,
        username: username.toLowerCase().trim(),
    };

    //Now we save the new user object to the database
    const saveUserResponse = await saveUser(user);
    if (!saveUserResponse) {
        return buildResponse(503, { message: 'Server Error. Error saving user. Please try again later' });
    }

    return buildResponse(200, { username, message: 'User registered successfully.' });
}

async function getUser(username) {//DynamoDB operation getUser
    const params = {
        TableName: userTable,
        Key: {
            username: { S: username }
        }
    };

    try {
        const data = await ddb.send(new GetItemCommand(params));
        if (!data.Item) {
            return null;
        }
        return {
            email: data.Item.email.S,
            password: data.Item.password.S,
            name: data.Item.name.S,
            username: data.Item.username.S,
        };
    } catch (error) {
        console.error('There is an error in getUser: ', error);
        return null;
    }
}

async function saveUser(user) {//DynamoDB operation saveUser
    const params = {
        TableName: userTable,
        Item: {
            email: { S: user.email },
            password: { S: user.password },
            name: { S: user.name },
            username: { S: user.username }
        }
    };

    try {
        await ddb.send(new PutItemCommand(params));
        return true;
    } catch (error) {
        console.error('There is an error in saveUser: ', error);
        return false;
    }
}

const _register = register;
export { _register as register };
