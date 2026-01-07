const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');

// Region/table are provided via environment variables.
// - In AWS mode: omit DYNAMODB_ENDPOINT and the SDK will talk to AWS.
// - In local mode (DynamoDB Local): set DYNAMODB_ENDPOINT (e.g. http://localhost:8000)
//   and we provide dummy credentials because the local emulator doesn't validate them,
//   but the AWS SDK expects a credentials shape.
const REGION = process.env.AWS_REGION || 'us-east-1';
const TABLE_NAME = process.env.DYNAMODB_TABLE;
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

/** @type {import('@aws-sdk/client-dynamodb').DynamoDBClientConfig} */
const clientConfig = {
  region: REGION,
};

if (DYNAMODB_ENDPOINT) {
  clientConfig.endpoint = DYNAMODB_ENDPOINT;
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
  };
}

const client = new DynamoDBClient(clientConfig);

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

async function getVisitById(id) {
  if (!TABLE_NAME) {
    throw new Error('DYNAMODB_TABLE is not set');
  }

  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });

  const result = await docClient.send(command);
  return result.Item || null;
}

async function updateVisit(id, patch) {
  if (!TABLE_NAME) {
    throw new Error('DYNAMODB_TABLE is not set');
  }

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET #note = :note, #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#note': 'note',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':note': patch.note,
      ':updatedAt': patch.updatedAt,
    },
    ReturnValues: 'ALL_NEW',
  });

  const result = await docClient.send(command);
  return result.Attributes;
}

async function deleteVisitById(id) {
  if (!TABLE_NAME) {
    throw new Error('DYNAMODB_TABLE is not set');
  }

  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });

  await docClient.send(command);
  return true;
}

module.exports = { putVisit, scanVisits, getVisitById, updateVisit, deleteVisitById };
