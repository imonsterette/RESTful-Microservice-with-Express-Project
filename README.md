# 🔮 Clouded Oracle V2

A RESTful microservice built with Express, DynamoDB, Docker, and Terraform. The service logs “oracle visits” and returns a themed **prophecy / blessing / curse** response.

Each visit is stored as a log entry in DynamoDB (table: `OracleVisits`).

---

## Project Purpose

This project was built to demonstrate backend system design using Express, with a focus on:

- clear API contracts
- request validation
- deterministic business logic
- persistence using DynamoDB
- local-first development with Docker
- infrastructure-as-code readiness with Terraform

The goal was not only to make the system work, but to understand how each layer communicates.

---

## Features

- RESTful API supporting the full visit lifecycle (create, read, update note, delete)
- Joi validation (including conditional fields)
- Clean JSON error responses (invalid JSON, validation errors, not found)
- Jest + Supertest integration tests
- DynamoDB persistence via AWS SDK v3 (DocumentClient)

---

## Tech Stack

- Node.js + Express
- Joi (validation)
- Jest + Supertest (testing)
- AWS SDK v3 (`@aws-sdk/*`) for DynamoDB
- Docker + Docker Compose (local development)
- Terraform (infrastructure as code)

---

## High-Level Architecture

A client sends a request to the Express API.
The request is validated using Joi schemas.
An oracle response is generated from seeded message pools based on request type and aspect.
The visit is then persisted to DynamoDB.
The API responds with a structured JSON payload.

When running locally with Docker, DynamoDB Local is used via Docker Compose.
The same database abstraction is designed to work with AWS DynamoDB without changing application code.

---

## API Contract

Base path: `/visits`

| Route                | Purpose                        | Success                 | Errors                            |
| -------------------- | ------------------------------ | ----------------------- | --------------------------------- |
| GET `/health`        | health check                   | 200                     | —                                 |
| GET `/visits`        | list visits                    | 200 `[Visit]`           | —                                 |
| GET `/visits/:id`    | get one                        | 200 `Visit`             | 404                               |
| POST `/visits`       | create visit + oracle response | 201 `{ message, data }` | 400 validation · 400 invalid JSON |
| PUT `/visits/:id`    | update visit note              | 200 `Visit`             | 400 validation · 404              |
| DELETE `/visits/:id` | delete visit                   | 204                     | 404                               |

---

## Data Model: Visit

**Required:**

- `id` (uuid, server-generated)
- `seekerName` (string)
- `requestType` (`prophecy` | `blessing` | `curse`)
- `aspect` (`health` | `reputation` | `wealth` | `love` | `productivity` | `technology` | `travel` | `luck`)
- `resultText` (string, generated from seeded oracle messages)
- `createdAt` (ISO string)

**Conditional:**

- `targetName` (required for `blessing` / `curse`, omitted for `prophecy`)

**Optional:**

- `note` (string)
- `updatedAt` (ISO string)

---

## Setup (Local Node)

### 1) Install dependencies

```bash
npm install
```

### 2) Environment variables

Copy the example file and fill values locally:

```bash
cp .env.example .env
```

Example `.env` values:

```env
PORT=3000
AWS_REGION=us-east-1
DYNAMODB_TABLE=OracleVisits
```

Additional variables used when running with Docker:

```env
DYNAMODB_ENDPOINT=http://dynamodb:8000
```

This endpoint is injected via Docker Compose and points the API container to DynamoDB Local.

> Do NOT commit `.env`.

### 3) Run tests

```bash
npm test
```

### 4) Run the server

```bash
npm start
```

Health check:

- `GET http://localhost:3000/health`

### Creating the DynamoDB table (local)

DynamoDB Local runs in-memory by default. After starting Docker Compose, create the table once per session:

```bash
aws dynamodb create-table \
  --table-name OracleVisits \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000
```

---

## Example API Usage

### POST /visits (prophecy)

**Request:**

```json
{
  "seekerName": "Hawra",
  "requestType": "prophecy",
  "aspect": "luck"
}
```

**Response (201):**

```json
{
  "message": "Visit recorded",
  "data": {
    "id": "uuid-here",
    "seekerName": "Hawra",
    "requestType": "prophecy",
    "aspect": "luck",
    "resultText": "🜁 The winds say luck is nearby.",
    "createdAt": "2026-01-07T16:25:03.502Z"
  }
}
```

### GET /visits

```bash
curl http://localhost:3000/visits
```

Returns an array of recorded visits.

---

## Docker (Local Development)

The project includes Docker support for local development.

Docker Compose runs:

- the Express API container (port 3000)
- a DynamoDB Local container (port 8000)

DynamoDB Local is configured with `-sharedDb` to ensure the API container and AWS CLI access the same local database.

### Run with Docker

```bash
docker compose up --build
```

Health check:

- `GET http://localhost:3000/health`

---

## Terraform (Infrastructure as Code)

Terraform configuration is included to provision the DynamoDB table (`OracleVisits`) using on-demand billing.

### Terraform commands

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

**Current status:**

- `aws sts get-caller-identity` succeeds
- `terraform init` succeeds
- `terraform plan` fails with `InvalidClientTokenId` in the course WhizLabs sandbox

Terraform apply will be completed once sandbox permissions/configuration are availble.

---

## Testing

- Integration tests written with Jest + Supertest
- Run with `npm test`
- Tests validate API behavior independently of Docker

---

## Repo Notes / Workflow

- App / server split keeps tests clean
- Test-driven approach (RED → YELLOW → GREEN with incremental commits)
- Conventional commit-style messages (`feat(api)`, `feat(db)`, `chore(docker)`, `chore(terraform)`, `docs`)

---

## Conclusion

This project emphasizes clarity, correctness, and understanding over feature volume.
Each phase was built incrementally with testing and reproducibility in mind.

## Attributions / References

- Express.js documentation
- Joi validation library documentation
- AWS SDK for JavaScript v3 documentation
- DynamoDB Local Docker image
- Terraform AWS Provider documentation
