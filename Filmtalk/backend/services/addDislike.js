import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({ region: 'us-east-2' });

async function addDislike(event) {
    const { username, card_id } = JSON.parse(event.body);

    // Parameters to retrieve the current item
    const getParams = {
        TableName: 'MovieCards',
        Key: { card_id: { S: card_id } },
        ProjectionExpression: '#likers, #like_no, #dislikers, #dislike_no',
        ExpressionAttributeNames: {
            '#likers': 'likers',
            '#like_no': 'like_no',
            '#dislikers': 'dislikers',
            '#dislike_no': 'dislike_no'
        }
    };

    try {
        // Retrieve the current item
        const getCommand = new GetItemCommand(getParams);
        const getResult = await ddbClient.send(getCommand);
        const item = getResult.Item;

        // Extract current values or initialize
        const currentLikers = item?.likers?.L?.map(el => el.S) || [];
        const currentDislikers = item?.dislikers?.L?.map(el => el.S) || [];
        const likeNo = item?.like_no?.N || '0';
        const dislikeNo = item?.dislike_no?.N || '0';

        // Parameters to update the item
        const updateParams = {
            TableName: 'MovieCards',
            Key: { card_id: { S: card_id } },
            UpdateExpression: `
                SET #dislikers = list_append(if_not_exists(#dislikers, :emptyList), :usernameList),
                    #dislike_no = :newDislikeNo,
                    #likers = :updatedLikersList,
                    #like_no = :newLikeNo
            `,
            ConditionExpression: 'NOT contains(#dislikers, :username)',
            ExpressionAttributeNames: {
                '#likers': 'likers',
                '#like_no': 'like_no',
                '#dislikers': 'dislikers',
                '#dislike_no': 'dislike_no'
            },
            ExpressionAttributeValues: {
                ':username': { L: [{ S: username }] },
                ':usernameList': { L: [{ S: username }] },
                ':emptyList': { L: [] },
                ':newDislikeNo': { N: (parseInt(dislikeNo) + 1).toString() },
                ':updatedLikersList': { L: currentLikers.filter(user => user !== username).map(user => ({ S: user })) },
                ':newLikeNo': { N: (parseInt(likeNo) - (currentLikers.includes(username) ? 1 : 0)).toString() }
            },
            ReturnValues: 'UPDATED_NEW'
        };

        // Execute the update command
        const updateCommand = new UpdateItemCommand(updateParams);
        await ddbClient.send(updateCommand);

        // Return success response
        return {
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            statusCode: 200,
            body: JSON.stringify({ message: 'Dislike added successfully' })
        };
    } catch (error) {
        // Return error response
        return {
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to add dislike', error: error.message })
        };
    }
};

const _addDislike = addDislike;
export { _addDislike as addDislike };
