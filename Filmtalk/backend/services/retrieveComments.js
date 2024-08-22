import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({ region: 'us-east-2' });

async function retrieveComments(event) {
  if (!event.card_id) {
    return {
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      statusCode: 400,  // Bad Request
      body: JSON.stringify({ message: 'Card ID is required' })
    };
  }
  const card_id = event.card_id;
  console.log(card_id)
  const params = {
    TableName: 'MovieCards',
    Key: { card_id: { S: card_id } },  // Assuming card_id is a string
    ProjectionExpression: 'comments'
  };

  try {
    const data = await ddbClient.send(new GetItemCommand(params));
    return {
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      statusCode: 200,
      body: JSON.stringify(data.Item ? data.Item.comments : [])
    };
  } catch (error) {
    return {
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to retrieve comments', error: error.message })
    };
  }
}

export { retrieveComments };
