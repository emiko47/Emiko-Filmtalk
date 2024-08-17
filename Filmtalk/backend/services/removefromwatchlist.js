import { DynamoDBClient} from '@aws-sdk/client-dynamodb';
const ddbClient = new DynamoDBClient({ region: 'us-east-2' });

async function removefromwatchlist (event) {
    const { username, movie_name } = JSON.parse(event.body);

    const params = {
        TableName: 'MovieCards',
        Key: { movie_name: movie_name },
        UpdateExpression: 'REMOVE watchlisters[ :usernameIndex ]',
        ConditionExpression: 'contains(watchlisters, :username)',
        ExpressionAttributeValues: {
            ':username': username,
            ':usernameIndex': ddbClient.createSet([username])
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        await ddbClient.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Title has been removed from your watchlist' })
        };
    } catch (error) {
        return {
            statusCode: error.code === 'ConditionalCheckFailedException' ? 401 : 500,
            body: JSON.stringify({ message: error.code === 'ConditionalCheckFailedException' ? 'This title is not in your watchlist' : 'Failed to remove from watchlist', error: error.message })
        };
    }
};

const _removefromwatchlist = removefromwatchlist;
export { _removefromwatchlist as removefromwatchlist };

