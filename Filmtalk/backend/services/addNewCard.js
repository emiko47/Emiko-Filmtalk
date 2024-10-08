import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
const ddbClient = new DynamoDBClient({ region: 'us-east-2' });
import { v4 as uuidv4 } from 'uuid';

async function addNewCard(event) {
    const movie_name = event.movie_name;
    const genre1 = event.genre1;
    const genre2 = event.genre2;
    const year = event.year;
    const img_src = event.img_src;
    const about = event.about;
    const username = event.username;
    const rating = event.rating;

    const card_id = uuidv4();

    const params = {
        TableName: 'MovieCards',
        Item: {
            card_id: { S: card_id },
            movie_name: { S: movie_name || 'UnknownName' },
            genre1: { S: genre1 || 'Unknown' },
            genre2: { S: genre2 || 'Unknown' },
            year: { S: year || 'Unknown' },
            img_src: { S: img_src || 'N/A' },
            rating: {N: rating || '0'},
            about: { S: about || 'No description' },
            username: { S: username || 'Anonymous' },
            watchlisters: { L: [] },  // Assuming watchlisters is a list
            comments: { L: [] },       // Assuming comments is a list
            likers: {L: []},
            like_no: {N: '0'},
            dislikers: {L: []},
            dislike_no: {N: '0'}
        }
    };

    try {
        await ddbClient.send(new PutItemCommand(params));
        return {
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
              },
            statusCode: 201,
            body: JSON.stringify({ message: 'Movie card created successfully', card_id: card_id })
        };
    } catch (error) {
        return {
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
              },
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to create movie card', error: error.message })
        };
    }
};
const _addNewCard = addNewCard;
export { _addNewCard as addNewCard };
