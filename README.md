# AI-Powered Interview Preparation Platform

An AI-powered full-stack web application that helps users prepare for technical interviews through AI-generated questions, resume analysis, and personalized interview assistance.

## Features

- Secure user authentication using JWT
- AI-powered interview question generation using Google Gemini AI
- Resume upload and processing
- PDF parsing for resume analysis
- Responsive user interface
- RESTful backend APIs
- Secure password hashing with bcrypt
- MongoDB database integration

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- Sass

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Multer
- Google Gemini AI
- PDF-Parse
- Puppeteer
- Zod

## Project Structure

```
Frontend/
Backend/
```

## Installation

### Clone Repository

```bash
git clone https://github.com/piyushgupta786/AI-Powered-Interview-Prep.git
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the Backend directory.

Example:

```env
PORT=

MONGODB_URI=

JWT_SECRET=

GEMINI_API_KEY=
```

## Future Improvements

- Mock interview voice support
- AI interview feedback
- Dashboard analytics
- Interview history
- Performance optimization

## Author

**Piyush Gupta**

GitHub: https://github.com/piyushgupta786