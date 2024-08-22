import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({ region: 'us-east-2' });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

async function getAllCards() {
    const params = {
        TableName: 'MovieCards',
    };

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            statusCode: 200,
            body: JSON.stringify(data.Items)
        };
    } catch (error) {
        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to retrieve movie cards', error: error.message })
        };
    }
};
const _getAllCards = getAllCards;
export { _getAllCards as getAllCards };

