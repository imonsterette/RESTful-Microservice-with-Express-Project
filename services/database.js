const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const REGION = process.env.AWS_REGION;
const TABLE_NAME = process.env.DYNAMODB_TABLE;

const client = new DynamoDBClient({
  region: REGION,
});

const docClient = DynamoDBDocumentClient.from(client);

async function putVisit(item) {
  if (!TABLE_NAME) {
    throw new Error('DYNAMODB_TABLE is not set');
  }

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  });

  await docClient.send(command);
  return item;
}

const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

async function scanVisits() {
  if (!TABLE_NAME) {
    throw new Error('DYNAMODB_TABLE is not set');
  }

  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });

  const result = await docClient.send(command);
  return result.Items || [];
}

module.exports = { putVisit, scanVisits };
