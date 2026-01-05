# 🔮 Clouded Oracle V2

A RESTful microservice (Express + DynamoDB) that logs “oracle visits” and returns a themed prophecy/blessing/curse response.

Each visit is stored as a log entry in DynamoDB (table: `OracleVisits`).

---

## Features

- Full CRUD REST API for visits
- Joi validation (including conditional fields)
- Clean JSON errors (invalid JSON, validation, not found)
- Jest + Supertest integration tests
- DynamoDB persistence via AWS SDK v3 (DocumentClient)

> Note: Terraform + Docker are planned next. Terraform `plan/apply` is currently blocked by AWS sandbox auth mismatch (AWS CLI works, Terraform plan fails with `InvalidClientTokenId`). See “Terraform (Planned)” section.

---

## Tech Stack

- Node.js + Express
- Joi (validation)
- Jest + Supertest (tests)
- AWS SDK v3 (`@aws-sdk/*`) for DynamoDB

---

## API Contract

Base path: `/visits`

| Route                | Purpose                        | Success                 | Errors                            |
| -------------------- | ------------------------------ | ----------------------- | --------------------------------- |
| GET `/health`        | health check                   | 200                     | —                                 |
| GET `/visits`        | list visits                    | 200 `[Visit]`           | —                                 |
| GET `/visits/:id`    | get one                        | 200 `Visit`             | 404                               |
| POST `/visits`       | create visit + oracle response | 201 `{ message, data }` | 400 validation · 400 invalid JSON |
| PUT `/visits/:id`    | update visit (note)            | 200 `Visit`             | 400 validation · 404              |
| DELETE `/visits/:id` | delete visit                   | 204                     | 404                               |

---

## Data Model: Visit

Required:

- `id` (uuid, server-generated)
- `seekerName` (string)
- `requestType` (`prophecy` | `blessing` | `curse`)
- `aspect` (`health` | `reputation` | `wealth` | `love` | `productivity` | `technology` | `travel` | `luck`)
- `resultText` (string, generated from seeded oracle messages)
- `createdAt` (ISO string)

Conditional:

- `targetName` (required for `blessing`/`curse`, omitted for `prophecy`)

Optional:

- `note` (string)
- `updatedAt` (ISO string)

---

## Setup

### 1) Install dependencies

```bash
npm install

2) Environment variables

Copy the example and fill values locally:

cp .env.example .env

Example .env values:

PORT=3000
AWS_REGION=us-east-1
DYNAMODB_TABLE=OracleVisits

Do NOT commit .env.

3) Run tests

npm test

4) Run the server

npm start

Health check:
	•	GET http://localhost:3000/health

⸻

Example Requests

POST /visits (prophecy)

Request:

{
  "seekerName": "Hawra",
  "requestType": "prophecy",
  "aspect": "luck"
}

Response (201):

{
  "message": "Visit recorded",
  "data": {
    "id": "uuid-here",
    "seekerName": "Hawra",
    "requestType": "prophecy",
    "aspect": "luck",
    "resultText": "…",
    "createdAt": "…"
  }
}

PUT /visits/:id (update note)

Request:

{
  "note": "I trust the omen."
}

Response (200): includes updatedAt.

DELETE /visits/:id

Response: 204 No Content

⸻

Terraform (Planned)

Terraform is planned to provision the DynamoDB table OracleVisits (PAY_PER_REQUEST, hash key id).

Current status:
	•	aws sts get-caller-identity succeeds
	•	terraform init succeeds
	•	terraform plan fails with InvalidClientTokenId in the course WhizLabs sandbox

This will be completed once sandbox permissions/config are confirmed by instructors.

⸻

Docker (Planned)

A Dockerfile is planned to containerize the service and run on port 3000, reading environment variables from .env.

⸻

Repo Notes / Workflow
	•	App/server split kept tests clean
	•	Test-driven approach (RED → YELLOW → GREEN)
	•	Conventional-ish commit messages (feat(api), feat(db), chore(terraform), chore(docker), docs)

---

```
