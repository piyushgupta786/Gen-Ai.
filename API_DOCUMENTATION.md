# API Documentation

## Authentication

### Register

POST /api/auth/register

Request

```json
{
  "name": "Piyush",
  "email": "abc@gmail.com",
  "password": "123456"
}
```

Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

### Login

POST /api/auth/login

Request

```json
{
  "email": "abc@gmail.com",
  "password": "123456"
}
```

---

## Resume Upload

POST /api/resume/upload

Form Data

resume : PDF

---

## Generate Interview

POST /api/interview/generate

Body

```json
{
  "jobRole":"Backend Developer"
}
```

---

## User Profile

GET /api/user/profile