const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');

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
