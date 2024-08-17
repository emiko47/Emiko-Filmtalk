import { DynamoDBClient} from '@aws-sdk/client-dynamodb';
const ddbClient = new DynamoDBClient({ region: 'us-east-2' });

async function retrieveComments (event) {
    const { movie_name } = JSON.parse(event.body);

    const params = {
        TableName: 'MovieCards',
        Key: { movie_name: movie_name },
        ProjectionExpression: 'comments'
    };

    try {
        const data = await ddbClient.get(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Item.comments)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to retrieve comments', error: error.message })
        };
    }
};
const _retrieveComments = retrieveComments;
export { _retrieveComments as retrieveComments };

