import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({ region: 'us-east-2' });

async function saveComment(event) {
    const card_id = event.card_id;
    const username = event.username;
    const comment = event.comment;

    // Generate the current date (MM/DD/YYYY)
    const time = new Date().toLocaleDateString('en-US');

    const newComment = {
        M: {
            username: { S: username },
            comment: { S: comment },
            time: { S: time }
        }
    };

    const params = {
        TableName: 'MovieCards',
        Key: { card_id: { S: card_id } },
        UpdateExpression: 'SET comments = list_append(if_not_exists(comments, :emptyList), :newComment)',
        ExpressionAttributeValues: {
            ':emptyList': { L: [] },
            ':newComment': { L: [newComment] }
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        await ddbClient.send(new UpdateItemCommand(params));
        return {
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            statusCode: 200,
            body: JSON.stringify({ message: 'Comment added successfully' })
        };
    } catch (error) {
        return {
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to add comment', error: error.message })
        };
    }
}

const _saveComment = saveComment;
export { _saveComment as saveComment };
