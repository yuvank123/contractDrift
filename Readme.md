# API Contract Drift Detector

A backend system that automatically detects **API contract drift** by comparing real API responses with their **OpenAPI specifications**.

The system parses an OpenAPI contract, executes endpoints, validates responses, detects mismatches, and stores reports for analysis.

---

# Overview

APIs often change over time, but documentation may not be updated accordingly. When an API response no longer matches the documented contract, **contract drift** occurs.

This system automatically detects such inconsistencies by running the following pipeline:


OpenAPI Contract
↓
Parse Endpoints
↓
Execute API Calls
↓
Validate Response Schema
↓
Detect Contract Drift
↓
Generate Reports
↓
Store Results


---

# Architecture

The backend follows a **Modular Monolith Architecture**.


src
│
├── modules
│ ├── projectModule
│ ├── contractModule
│ ├── runnerModule
│ ├── validationModule
│ ├── driftModule
│ ├── reportsModule
│ └── checkModule
│
├── models
│ ├── project.model.js
│ ├── contract.model.js
│ ├── report.model.js
│ ├── driftIssue.model.js
│ └── checkRun.model.js
│
└── server.js


Each module handles a specific part of the system.

---

# Backend Modules

## 1. Project Module

Manages API projects.

Features:
- Create new project
- Store base API URL
- Store contract path
- Retrieve project details

Endpoints:


POST /projects
GET /projects
GET /projects/:id


---

## 2. Contract Module

Parses OpenAPI contracts and extracts API endpoints.

Extracted data includes:
- endpoint path
- HTTP method
- parameters
- request schema
- response schemas

Endpoint:


POST /contracts/parse


---

## 3. Runner Module

Executes API endpoints extracted from the contract.

Features:
- Calls API endpoints automatically
- Collects response data
- Captures status code
- Measures response time

Endpoint:


POST /runner/run


---

## 4. Validation Module

Validates API responses against the schema defined in the OpenAPI contract.

Uses **AJV JSON Schema Validator**.

Features:
- schema validation
- error detection
- validation reports

Endpoint:


POST /validation/validate


---

## 5. Drift Detection Module

Detects contract drift based on validation results.

Drift types detected:


Missing fields
Type mismatch
Unexpected fields


Detected issues are classified and stored.

Endpoint:


POST /drift/detect


---

## 6. Reports Module

Stores API drift reports generated during checks.

Report contains:


endpoint
severity
issues
timestamp


Endpoints:


POST /reports
GET /reports
GET /reports/:id


---

## 7. Check Module (Automation Engine)

Runs the **entire drift detection pipeline automatically**.

Workflow:


Parse Contract
↓
Run Endpoints
↓
Validate Responses
↓
Detect Drift
↓
Generate Reports
↓
Store Check Run


Endpoint:


POST /checks/run


Example Request:


POST /checks/run


```json
{
  "projectId": "PROJECT_ID",
  "filePath": "https://petstore3.swagger.io/api/v3/openapi.json",
  "baseUrl": "https://petstore3.swagger.io/api/v3"
}
Database Models

The system uses MongoDB for storing results.

Collections:

projects
contracts
reports
driftissues
checkruns
Project Model

Stores API project information.

Fields:

name
baseUrl
contractPath
createdAt
Contract Model

Stores contract metadata.

Fields:

projectId
filePath
uploadedAt
Report Model

Stores drift detection reports.

Fields:

projectId
endpoint
severity
issues
createdAt
DriftIssue Model

Stores individual drift issues.

Fields:

reportId
type
field
severity
message
CheckRun Model

Tracks automated test runs.

Fields:

projectId
startedAt
finishedAt
driftDetected
API Workflow

Example execution:

POST /checks/run

Pipeline execution:

Contract Parsing
↓
Endpoint Execution
↓
Response Validation
↓
Drift Detection
↓
Report Generation
↓
Database Storage
Technologies Used

Backend:

Node.js
Express.js

API Processing:

OpenAPI Parser
AJV JSON Schema Validator

Database:

MongoDB
Mongoose

HTTP Requests:

Axios
Public APIs for Testing

You can test the system using real APIs.

Petstore API

https://petstore3.swagger.io/api/v3/openapi.json

GitHub API

https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json

Stripe API

https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.json

OpenAPI Directory

https://apis.guru