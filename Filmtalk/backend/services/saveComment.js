import { DynamoDBClient} from '@aws-sdk/client-dynamodb';
const ddbClient = new DynamoDBClient({ region: 'us-east-2' });

async function saveComment (event) {
    const { movie_name, username, comment, time } = JSON.parse(event.body);

    const newComment = {
        username: username,
        comment: comment,
        time: time
    };

    const params = {
        TableName: 'MovieCards',
        Key: { movie_name: movie_name },
        UpdateExpression: 'SET comments = list_append(comments, :newComment)',
        ExpressionAttributeValues: {
            ':newComment': [newComment]
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        await ddbClient.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Comment added successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to add comment', error: error.message })
        };
    }
};
const _saveComment = saveComment;
export { _saveComment as saveComment };
