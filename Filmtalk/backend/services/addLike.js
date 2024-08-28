import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({ region: 'us-east-2' });

async function addLike(event) {
    const username = event.username;
    const card_id = event.card_id;

    // Step 1: Retrieve the current item to check current lists
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
        const getCommand = new GetItemCommand(getParams);
        const getResult = await ddbClient.send(getCommand);
        const item = getResult.Item;

        const currentLikers = item?.likers?.L?.map(el => el.S) || [];
        const currentDislikers = item?.dislikers?.L?.map(el => el.S) || [];
        const likeNo = item?.like_no?.N || '0';
        const dislikeNo = item?.dislike_no?.N || '0';

        // Step 2: Check if the username is already in the likers list
        if (currentLikers.includes(username)) {
            return {
                headers: {
                    "Access-Control-Allow-Origin": "*", 
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
                statusCode: 200,
                body: JSON.stringify({ message: 'Title is already in your likes' })
            };
        }

        // Step 3: Prepare update parameters if username is not already in the likers list
        const updateParams = {
            TableName: 'MovieCards',
            Key: { card_id: { S: card_id } },
            UpdateExpression: `
                SET #likers = list_append(if_not_exists(#likers, :emptyList), :usernameList),
                    #like_no = :newLikeNo,
                    #dislikers = :updatedDislikersList,
                    #dislike_no = :newDislikeNo
            `,
            ExpressionAttributeNames: {
                '#likers': 'likers',
                '#like_no': 'like_no',
                '#dislikers': 'dislikers',
                '#dislike_no': 'dislike_no'
            },
            ExpressionAttributeValues: {
                ':usernameList': { L: [{ S: username }] },
                ':emptyList': { L: [] },
                ':newLikeNo': { N: (parseInt(likeNo) + 1).toString() },
                ':updatedDislikersList': { L: currentDislikers.filter(user => user !== username).map(user => ({ S: user })) },
                ':newDislikeNo': { N: (parseInt(dislikeNo) - (currentDislikers.includes(username) ? 1 : 0)).toString() }
            },
            ReturnValues: 'UPDATED_NEW'
        };

        // Step 4: Perform the update
        const updateCommand = new UpdateItemCommand(updateParams);
        await ddbClient.send(updateCommand);

        return {
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            statusCode: 200,
            body: JSON.stringify({ message: 'Like added successfully' })
        };
    } catch (error) {
        console.error("Error in addLike:", error); // Log error for debugging
        return {
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to add like', error: error.message })
        };
    }
};

const _addLike = addLike;
export { _addLike as addLike };
