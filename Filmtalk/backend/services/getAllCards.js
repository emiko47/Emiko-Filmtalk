import { DynamoDBClient} from '@aws-sdk/client-dynamodb';
const ddbClient = new DynamoDBClient({ region: 'us-east-2' });

async function getAllCards (event) {
    const params = {
        TableName: 'MovieCards'
    };

    try {
        const data = await ddbClient.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to retrieve movie cards', error: error.message })
        };
    }
};
const _getAllCards = getAllCards;
export { _getAllCards as getAllCards };

