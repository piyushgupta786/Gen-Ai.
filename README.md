# Interview-Prep-Ai

An AI-powered interview preparation platform that analyzes your resume and a target job description to generate personalized technical & behavioral interview questions, skill-gap analysis, a day-wise preparation roadmap, and a tailored, AI-rewritten resume — all in one place.

![Node](https://img.shields.io/badge/Node.js-Express-green)
![React](https://img.shields.io/badge/React-Vite-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange)

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Request Flow](#request-flow)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Roadmap](#roadmap)

---

## Features

- **Personalized Interview Report** — Upload a resume (PDF), paste a job description, and/or add a quick self-description to get:
  - Technical & behavioral interview questions (with intention + model answers)
  - Match score against the job description
  - Skill-gap analysis with severity ratings
  - A day-wise preparation roadmap
- **AI-Tailored Resume Generation** — Rewrites your resume to align with a job description, using only facts already present in the original (no hallucinated content), exported as a downloadable PDF.
- **Secure Authentication** — JWT-based auth with httpOnly cookies and bcrypt password hashing.
- **Report History** — Revisit any previously generated interview report.

---

## Architecture

The backend follows a **4-layer architecture**, separating concerns so each layer only knows about the one directly below it:

```mermaid
graph TD
    A["Presentation Layer<br/>React + Vite (Components, Pages, Hooks)"] -->|HTTP / Axios, withCredentials| B

    subgraph Backend["Backend — Node.js + Express"]
        B["Routes Layer<br/>auth.routes.js / interview.routes.js"]
        C["Controller Layer<br/>auth.controller.js / interview.controller.js<br/>(request parsing, validation, response shaping)"]
        D["Service Layer<br/>ai.service.js<br/>(Gemini integration, prompt building, PDF generation)"]
        E["Data Layer<br/>Mongoose Models<br/>(user.model.js, interviewReport.model.js)"]
    end

    B --> C
    C --> D
    C --> E
    D -->|Structured JSON via schema| F[("Google Gemini API")]
    D -->|HTML to PDF| G["Puppeteer"]
    E --> H[("MongoDB")]

    style A fill:#61dafb,color:#000
    style F fill:#f9a825,color:#000
    style H fill:#4caf50,color:#000
```

**Layer responsibilities:**

| Layer | Responsibility |
|---|---|
| **Presentation** | React UI — forms, dropzone, report display, auth pages |
| **Routes** | Maps HTTP endpoints to controller functions, applies auth middleware |
| **Controller** | Validates input, orchestrates service calls, shapes the HTTP response |
| **Service** | Business logic — resume text extraction, Gemini prompt construction, PDF generation, retry/rate-limit handling |
| **Data** | Mongoose schemas and MongoDB persistence |

---

## Request Flow

Flow for the core "Generate Interview Report" feature:

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as React Frontend
    participant R as Express Route
    participant C as Controller
    participant S as AI Service
    participant G as Gemini API
    participant DB as MongoDB

    U->>F: Fills Job Description + uploads Resume/Self-Description
    F->>R: POST /api/interview/ (multipart/form-data)
    R->>C: generateInterViewReportController
    C->>C: Extract resume text (pdf-parse)
    C->>C: Validate: resume OR self-description required
    alt Both missing
        C-->>F: 400 - "Either a Resume or a Self Description is required"
    else At least one provided
        C->>S: generateInterviewReport({ resume, selfDescription, jobDescription })
        S->>G: Structured prompt + JSON schema
        alt Rate limit (429)
            G-->>S: 429 Too Many Requests
            S->>S: Exponential backoff retry (up to 3x)
            S->>G: Retry request
        end
        G-->>S: JSON (questions, skillGaps, roadmap, matchScore)
        S-->>C: Parsed report object
        C->>DB: Save interviewReport document
        DB-->>C: Saved document
        C-->>F: 201 - Full interview report
        F-->>U: Renders report (questions, skill gaps, roadmap)
    end
```

**Resume Download flow** works similarly, but pulls the saved `resume` / `jobDescription` / `selfDescription` from an existing report in MongoDB, sends it to Gemini for a tailored HTML resume, then converts that HTML to a PDF via **Puppeteer** before streaming it back to the client.

---

## Tech Stack

**Frontend:** React (Vite), React Router, Sass (SCSS), Axios
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose
**AI:** Google Gemini API (structured JSON schema output — no free-form parsing)
**PDF Handling:** `pdf-parse` (resume text extraction), Puppeteer (PDF generation)
**Auth:** JWT, bcrypt, httpOnly cookies
**Tools:** Git, GitHub, Postman, MongoDB Compass, Chrome DevTools

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- A Google Gemini API key

### Installation

```bash
git clone https://github.com/piyushgupta786/Interview-Prep-Ai.git
cd Interview-Prep-Ai

cd BACKEND
npm install

cd ../FRONTEND
npm install
```

### Environment Variables

Create a `.env` file inside `BACKEND/`:


### Running Locally

```bash
# Backend (from BACKEND/)
npm start

# Frontend (from FRONTEND/)
npm run dev
```

Frontend: `http://localhost:5173` · Backend: `http://localhost:3000`

---

## API Documentation

Full endpoint reference (request/response formats, error codes) available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

---

## Roadmap

- [ ] Deploy to production (Render + Vercel + MongoDB Atlas)
- [ ] Redesign login/register UI
- [ ] Add Google email verification
- [ ] Add ATS (Applicant Tracking System) compatibility score check

---

## Author

**Piyush Gupta**
[GitHub](https://github.com/piyushgupta786) · [LinkedIn](www.linkedin.com/in/piyushgupta786)