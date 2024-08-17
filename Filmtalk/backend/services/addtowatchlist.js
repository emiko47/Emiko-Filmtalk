import { DynamoDBClient} from '@aws-sdk/client-dynamodb';
const ddbClient = new DynamoDBClient({ region: 'us-east-2' });

async function addtowatchlist (event) {
    const { username, movie_name } = JSON.parse(event.body);

    const params = {
        TableName: 'MovieCards',
        Key: { movie_name: movie_name },
        UpdateExpression: 'SET watchlisters = list_append(if_not_exists(watchlisters, :emptyList), :username)',
        ConditionExpression: 'not contains(watchlisters, :username)',
        ExpressionAttributeValues: {
            ':username': [username],
            ':emptyList': []
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        await ddbClient.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Title has been added to your watchlist' })
        };
    } catch (error) {
        return {
            statusCode: error.code === 'ConditionalCheckFailedException' ? 401 : 500,
            body: JSON.stringify({ message: error.code === 'ConditionalCheckFailedException' ? 'This title is already in your watchlist' : 'Failed to add to watchlist', error: error.message })
        };
    }
};

const _addtowatchlist = addtowatchlist;
export { _addtowatchlist as addtowatchlist };

