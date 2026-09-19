# API Documentation

Base URL (local): `http://localhost:3000`

All authenticated endpoints require the `token` cookie (set automatically on login/register) — requests must be made with `withCredentials: true`.

---

## Auth Routes

### Register

`POST /api/auth/register`

**Request Body**

```json
{
  "username": "piyush",
  "email": "piyush@example.com",
  "password": "yourpassword"
}
```

**Response — 201 Created**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "664f...",
    "username": "piyush",
    "email": "piyush@example.com"
  }
}
```

Sets an httpOnly `token` cookie (JWT, 1-day expiry).

**Errors**
- `400` — missing username/email/password
- `400` — user already exists with this email or username

---

### Login

`POST /api/auth/login`

**Request Body**

```json
{
  "email": "piyush@example.com",
  "password": "yourpassword"
}
```

**Response — 200 OK**

```json
{
  "message": "User logged in successfully",
  "user": {
    "id": "664f...",
    "username": "piyush",
    "email": "piyush@example.com"
  }
}
```

**Errors**
- `400` — email or password incorrect

---

### Logout

`GET /api/auth/logout`

**Response — 200 OK**

```json
{ "message": "User logged out successfully" }
```

---

### Get Current User

`GET /api/auth/get-me`

**Response — 200 OK**

```json
{
  "message": "User fetched successfully",
  "user": {
    "id": "664f...",
    "username": "piyush",
    "email": "piyush@example.com"
  }
}
```

**Errors**
- `401` — not authenticated / invalid or missing token

---

## Interview Report Routes

All routes below require authentication (`token` cookie).

### Generate Interview Report

`POST /api/interview/`

**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|---|---|---|
| `jobDescription` | text | ✅ Yes |
| `selfDescription` | text | Either this or `resume` |
| `resume` | file (PDF) | Either this or `selfDescription` |

**Response — 201 Created**

```json
{
  "message": "Interview report generated successfully.",
  "interviewReport": {
    "_id": "664f...",
    "title": "Associate System Engineer Interview Report",
    "matchScore": 85,
    "technicalQuestions": [
      { "question": "...", "intention": "...", "answer": "..." }
    ],
    "behavioralQuestions": [ /* same shape */ ],
    "skillGaps": [
      { "skills": "System design fundamentals", "severity": "medium" }
    ],
    "preparationPlan": [
      { "day": 1, "focus": "...", "task": "..." }
    ],
    "createdAt": "2026-09-19T..."
  }
}
```

**Errors**
- `400` — job description missing, or neither resume nor self-description provided
- `500` — Gemini API rate limit exceeded after retries

---

### Get Report by ID

`GET /api/interview/report/:interviewId`

**Response — 200 OK** — full report object (same shape as above)

**Errors**
- `404` — report not found

---

### Get All Reports (Current User)

`GET /api/interview/`

**Response — 200 OK**

```json
{
  "message": "Interview reports fetched successfully.",
  "interviewReports": [
    { "_id": "664f...", "title": "...", "matchScore": 85, "createdAt": "..." }
  ]
}
```

---

### Generate & Download Tailored Resume PDF

`POST /api/interview/resume/pdf/:interviewReportId`

**Response — 200 OK** — binary PDF, `Content-Disposition: attachment`

**Errors**
- `404` — report not found
- `500` — Gemini API failure after retries

---

## Error Response Format

```json
{ "message": "Description of what went wrong." }
```