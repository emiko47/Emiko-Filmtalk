import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({ region: 'us-east-2' });

async function removefromwatchlist(event) {
    const username = event.username;
    const card_id = event.card_id;

    try {
        // Get the existing item to find the index of the username
        const getItemParams = {
            TableName: 'MovieCards',
            Key: { card_id: { S: card_id } },
            ProjectionExpression: 'watchlisters'
        };
        
        const getItemCommand = new GetItemCommand(getItemParams);
        const data = await ddbClient.send(getItemCommand);
        
        const watchlisters = data.Item?.watchlisters?.L?.map(item => item.S);
        if (!watchlisters || !watchlisters.includes(username)) {
            return {
                headers: {
                    "Access-Control-Allow-Origin": "*", 
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
                statusCode: 401,
                body: JSON.stringify({ message: 'This title is not in your watchlist' })
            };
        }
        
        const index = watchlisters.indexOf(username);
        const updateExpression = `REMOVE watchlisters[${index}]`;

        const updateParams = {
            TableName: 'MovieCards',
            Key: { card_id: { S: card_id } },
            UpdateExpression: updateExpression,
            ConditionExpression: 'contains(watchlisters, :username)',
            ExpressionAttributeValues: {
                ':username': { S: username },
            },
            ReturnValues: 'UPDATED_NEW'
        };

        // Remove the username from the watchlisters list
        const command = new UpdateItemCommand(updateParams);
        await ddbClient.send(command);
        
        return {
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
              },
            statusCode: 200,
            body: JSON.stringify({ message: 'Title has been removed from your watchlist' })
        };
    } catch (error) {
        return {
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
              },
            statusCode: error.name === 'ConditionalCheckFailedException' ? 401 : 500,
            body: JSON.stringify({ message: error.name === 'ConditionalCheckFailedException' ? 'This title is not in your watchlist' : 'Failed to remove from watchlist', error: error.message })
        };
    }
}

const _removefromwatchlist = removefromwatchlist;
export { _removefromwatchlist as removefromwatchlist };
