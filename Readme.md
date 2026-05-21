# API Contract Drift Detector

A backend system that automatically detects **API contract drift** by comparing real API responses with their **OpenAPI specifications**.

The system parses an OpenAPI contract, executes endpoints, validates responses, detects mismatches, and stores reports for analysis.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Pipeline](#pipeline)
- [Backend Modules](#backend-modules)
- [Database Models](#database-models)
- [API Workflow](#api-workflow)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Endpoints Reference](#api-endpoints-reference)
- [Public APIs for Testing](#public-apis-for-testing)
- [Drift Types Detected](#drift-types-detected)
- [Example Request and Response](#example-request-and-response)

---

## Overview

APIs often change over time, but documentation may not be updated accordingly. When an API response no longer matches the documented contract, **contract drift** occurs.

This system automatically detects such inconsistencies by running a full validation pipeline triggered by a single API call.

### What is Contract Drift?

Contract drift happens when:
- A field documented in the OpenAPI spec is missing from the actual response
- A field returns a different data type than documented
- The API returns extra undocumented fields
- Status codes differ from what the spec defines

---

## Architecture

The backend follows a **Modular Monolith Architecture**.

<img width="583" height="451" alt="Screenshot 2026-05-21 234221" src="https://github.com/user-attachments/assets/0add9111-e729-4c72-b4ea-319d101d7827" />

### Why Modular Monolith?

| Concern | Decision |
|---|---|
| Pipeline stages are tightly sequenced | Modules call each other directly — no network overhead |
| Clear domain boundaries | Each module owns its own routes, controller, service, and models |
| Simple deployment | One Node.js process, one server to run |
| Easy to test | Each module can be tested in isolation |
| Future-ready | Modules can be extracted into microservices later if needed |

---

## Pipeline

Every call to `POST /checks/run` executes the full drift detection pipeline automatically:

```
OpenAPI Contract (JSON/YAML)
        │
        ▼
  1. Parse Endpoints          ← Contract Module
        │
        ▼
  2. Execute API Calls        ← Runner Module (Axios)
        │
        ▼
  3. Validate Response Schema ← Validation Module (AJV)
        │
        ▼
  4. Detect Contract Drift    ← Drift Detection Module
        │
        ▼
  5. Generate Reports         ← Reports Module
        │
        ▼
  6. Store Results            ← MongoDB (Mongoose)
```

---

## Backend Modules

### 1. Project Module

Manages API projects.

**Features:**
- Create new project
- Store base API URL
- Store contract path
- Retrieve project details

**Endpoints:**

```
POST   /projects
GET    /projects
GET    /projects/:id
```

---

### 2. Contract Module

Parses OpenAPI contracts and extracts API endpoints.

**Extracted data includes:**
- Endpoint path
- HTTP method
- Parameters
- Request schema
- Response schemas

**Endpoint:**

```
POST /contracts/parse
```

---

### 3. Runner Module

Executes API endpoints extracted from the contract.

**Features:**
- Calls API endpoints automatically
- Collects response data
- Captures status code
- Measures response time

**Endpoint:**

```
POST /runner/run
```

---

### 4. Validation Module

Validates API responses against the schema defined in the OpenAPI contract.

Uses **AJV JSON Schema Validator**.

**Features:**
- Schema validation
- Error detection
- Validation reports

**Endpoint:**

```
POST /validation/validate
```

---

### 5. Drift Detection Module

Detects contract drift based on validation results.

**Drift types detected:**

| Type | Description |
|---|---|
| `missing_field` | A field defined in the spec is absent from the response |
| `type_mismatch` | A field returns a different data type than documented |
| `unexpected_field` | The response contains fields not defined in the spec |

Detected issues are classified by severity and stored.

**Endpoint:**

```
POST /drift/detect
```

---

### 6. Reports Module

Stores API drift reports generated during checks.

**Report contains:**
- `endpoint` — the API path that was checked
- `severity` — `low`, `medium`, or `high`
- `issues` — list of detected drift issues
- `timestamp` — when the check ran

**Endpoints:**

```
POST   /reports
GET    /reports
GET    /reports/:id
```

---

### 7. Check Module (Automation Engine)

Runs the **entire drift detection pipeline automatically**.

**Workflow:**

```
Parse Contract → Run Endpoints → Validate Responses → Detect Drift → Generate Reports → Store Check Run
```

**Endpoint:**

```
POST /checks/run
```

---

## Database Models

The system uses **MongoDB** for storing results.

### Collections

```
projects
contracts
reports
driftissues
checkruns
```

---

### Project Model

Stores API project information.

| Field | Type | Description |
|---|---|---|
| `name` | String | Project name |
| `baseUrl` | String | Base URL of the API |
| `contractPath` | String | Path or URL to the OpenAPI spec |
| `createdAt` | Date | Creation timestamp |

---

### Contract Model

Stores contract metadata.

| Field | Type | Description |
|---|---|---|
| `projectId` | ObjectId | Reference to project |
| `filePath` | String | URL or path to the spec file |
| `uploadedAt` | Date | Upload timestamp |

---

### Report Model

Stores drift detection reports.

| Field | Type | Description |
|---|---|---|
| `projectId` | ObjectId | Reference to project |
| `endpoint` | String | API endpoint checked |
| `severity` | String | `low` / `medium` / `high` |
| `issues` | Array | List of drift issues |
| `createdAt` | Date | Report generation timestamp |

---

### DriftIssue Model

Stores individual drift issues.

| Field | Type | Description |
|---|---|---|
| `reportId` | ObjectId | Reference to report |
| `type` | String | `missing_field` / `type_mismatch` / `unexpected_field` |
| `field` | String | The affected field name |
| `severity` | String | Severity level |
| `message` | String | Human-readable description |

---

### CheckRun Model

Tracks automated test runs.

| Field | Type | Description |
|---|---|---|
| `projectId` | ObjectId | Reference to project |
| `startedAt` | Date | Run start time |
| `finishedAt` | Date | Run end time |
| `driftDetected` | Boolean | Whether any drift was found |

---

## API Workflow

### Full pipeline example

**Request:**

```
POST /checks/run
```

```json
{
  "projectId": "YOUR_PROJECT_ID",
  "filePath": "https://petstore3.swagger.io/api/v3/openapi.json",
  "baseUrl": "https://petstore3.swagger.io/api/v3"
}
```

**What happens internally:**

```
1. Contract Parsing     — Fetches and parses the OpenAPI spec
2. Endpoint Execution   — Calls each endpoint using Axios
3. Response Validation  — Validates responses using AJV
4. Drift Detection      — Classifies validation errors as drift issues
5. Report Generation    — Creates a report for each endpoint
6. Database Storage     — Saves reports, issues, and check run to MongoDB
```

---

## Technologies Used

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | HTTP server and routing |

### API Processing

| Technology | Purpose |
|---|---|
| OpenAPI Parser | Parses and resolves OpenAPI specs |
| AJV JSON Schema Validator | Validates response bodies against schemas |

### Database

| Technology | Purpose |
|---|---|
| MongoDB | Persistent storage for reports and runs |
| Mongoose | ODM for schema definition and queries |

### HTTP

| Technology | Purpose |
|---|---|
| Axios | Makes HTTP requests to target API endpoints |

---

## Project Structure

```
api-drift-detector/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── models/
│   │   ├── checkRun.model.js
│   │   ├── contract.model.js
│   │   ├── driftIssue.model.js
│   │   ├── project.model.js
│   │   └── report.model.js
│   │
│   ├── modules/
│   │   ├── checkModule/
│   │   │   ├── check.controller.js
│   │   │   ├── check.routes.js
│   │   │   └── check.service.js
│   │   │
│   │   ├── contractModule/
│   │   │   ├── contract.controller.js
│   │   │   ├── contract.routes.js
│   │   │   ├── contract.service.js
│   │   │   └── contractParser.js
│   │   │
│   │   ├── driftModule/
│   │   │   ├── drift.controller.js
│   │   │   ├── drift.routes.js
│   │   │   └── drift.service.js
│   │   │
│   │   ├── projectModule/
│   │   │   ├── project.controller.js
│   │   │   ├── project.routes.js
│   │   │   └── project.service.js
│   │   │
│   │   ├── reportsModule/
│   │   │   ├── reports.controller.js
│   │   │   ├── reports.routes.js
│   │   │   └── reports.service.js
│   │   │
│   │   ├── runnerModule/
│   │   │   ├── runner.controller.js
│   │   │   ├── runner.routes.js
│   │   │   └── runner.service.js
│   │   │
│   │   └── validationModule/
│   │       ├── validation.controller.js
│   │       ├── validation.routes.js
│   │       └── validation.service.js
│   │
│   └── app.js                       # Express app setup
│
├── sample-api.json                  # Sample OpenAPI spec for testing
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/api-drift-detector.git

# Navigate into the project
cd api-drift-detector

# Install dependencies
npm install
```

---

## Environment Variables

Create a `.env` file in the root of the project:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/api-drift-detector
```

---

## Running the Project

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts on `http://localhost:3000`.

---

## API Endpoints Reference

### Projects

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/projects` | Create a new project |
| `GET` | `/projects` | List all projects |
| `GET` | `/projects/:id` | Get project by ID |

### Contracts

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/contracts/parse` | Parse an OpenAPI spec |

### Runner

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/runner/run` | Execute API endpoints |

### Validation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/validation/validate` | Validate responses against schema |

### Drift Detection

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/drift/detect` | Detect drift from validation results |

### Reports

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/reports` | Create a report |
| `GET` | `/reports` | List all reports |
| `GET` | `/reports/:id` | Get report by ID |

### Checks (Full Pipeline)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/checks/run` | Run the complete drift detection pipeline |

---

## Public APIs for Testing

You can test the system against real public APIs:

| API | OpenAPI Spec URL |
|---|---|
| Petstore | `https://petstore3.swagger.io/api/v3/openapi.json` |
| GitHub | `https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json` |
| Stripe | `https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.json` |
| OpenAPI Directory | `https://apis.guru` |

### Petstore example

```json
{
  "projectId": "YOUR_PROJECT_ID",
  "filePath": "https://petstore3.swagger.io/api/v3/openapi.json",
  "baseUrl": "https://petstore3.swagger.io/api/v3"
}
```

---

## Drift Types Detected

| Drift Type | Severity | Description |
|---|---|---|
| `missing_field` | High | A required field from the spec is absent in the response |
| `type_mismatch` | Medium | A field value does not match the expected type |
| `unexpected_field` | Low | The response contains fields not declared in the spec |

---

## Example Request and Response

### Request

```bash
curl -X POST http://localhost:3000/checks/run \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "664f1a2b3c4d5e6f7a8b9c0d",
    "filePath": "https://petstore3.swagger.io/api/v3/openapi.json",
    "baseUrl": "https://petstore3.swagger.io/api/v3"
  }'
```

### Response

```json
{
  "checkRunId": "664f1a2b3c4d5e6f7a8b9c01",
  "projectId": "664f1a2b3c4d5e6f7a8b9c0d",
  "driftDetected": true,
  "startedAt": "2024-05-21T10:00:00.000Z",
  "finishedAt": "2024-05-21T10:00:04.231Z",
  "reports": [
    {
      "endpoint": "GET /pet/{petId}",
      "severity": "high",
      "issues": [
        {
          "type": "missing_field",
          "field": "category.name",
          "severity": "high",
          "message": "Expected field 'category.name' is missing from the response"
        },
        {
          "type": "type_mismatch",
          "field": "status",
          "severity": "medium",
          "message": "Expected type 'string' but received 'number' for field 'status'"
        }
      ]
    }
  ]
}
```

---

## License

MIT
