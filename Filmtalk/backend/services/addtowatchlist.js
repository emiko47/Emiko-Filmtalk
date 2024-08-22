import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({ region: 'us-east-2' });

async function addtowatchlist(event) {
    const username = event.username;
    const card_id = event.card_id;

    const params = {
        TableName: 'MovieCards',
        Key: { card_id: { S: card_id } },
        UpdateExpression: 'SET watchlisters = list_append(if_not_exists(watchlisters, :emptyList), :usernameList)',
        ConditionExpression: 'NOT contains(watchlisters, :username)',
        ExpressionAttributeValues: {
            ':username': { S: username }, // String value for condition check
            ':usernameList': { L: [{ S: username }] }, // List containing the string to append
            ':emptyList': { L: [] } // Empty list to initialize if not exists
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const command = new UpdateItemCommand(params);
        await ddbClient.send(command);
        return {
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
              },
            statusCode: 200,
            body: JSON.stringify({ message: 'Title has been added to your watchlist' })
        };
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            return {
                headers: {
                    "Access-Control-Allow-Origin": "*", 
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                  },
                statusCode: 401,
                body: JSON.stringify({ message: 'This title is already in your watchlist' })
            };
        } else {
            return {
                headers: {
                    "Access-Control-Allow-Origin": "*", 
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                  },
                statusCode: 500,
                body: JSON.stringify({ message: 'Failed to add to watchlist', error: error.message })
            };
        }
    }
}

const _addtowatchlist = addtowatchlist;
export { _addtowatchlist as addtowatchlist };
