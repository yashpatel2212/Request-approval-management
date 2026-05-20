# Request & Approval Management System

Production-oriented MERN stack request workflow application for employees and managers.

## What is Included

- JWT authentication with employee and manager roles
- Employee request creation, draft save, edit, resubmit, and status tracking
- Manager dashboard, request preview, approve, reject, and return for correction
- MongoDB schemas for users, requests, comments, notifications, and audit logs
- Secure attachment upload and authenticated download
- Email notification service with notification logging
- Dynamic PDF generation with PDFKit
- AI Request Draft Assistant for employees
- React dashboard UI with protected and role-based routing
- Tailwind CSS, Redux Toolkit, React Hook Form, Yup, Axios, React Quill, and toast notifications

## Setup

Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Install dependencies:

```bash
cd backend
npm install
cd ../frontend
npm install
```

Seed demo users:

```bash
cd backend
npm run seed
```

Run backend:

```bash
cd backend
npm run dev
```

Run frontend:

```bash
cd frontend
npm run dev
```

Demo credentials:

```txt
Employee: employee@royalgroup.local / Password123
Manager:  manager@royalgroup.local / Password123
```

AI setup:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

The AI key belongs only in `backend/.env`. The frontend calls the protected backend endpoint and never receives the API key.

## API Summary

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/requests/draft`
- `POST /api/requests/submit`
- `GET /api/requests/my`
- `GET /api/requests/received`
- `PUT /api/requests/:id/draft`
- `PUT /api/requests/:id/resubmit`
- `PUT /api/requests/:id/approve`
- `PUT /api/requests/:id/reject`
- `PUT /api/requests/:id/return-correction`
- `GET /api/requests/:id/pdf`
- `GET /api/dashboard/employee`
- `GET /api/dashboard/manager`
- `POST /api/ai/request-draft`

## Workflow

Employee creates a draft or submits a request. Submitted requests become `Pending` and notify sender and receiver. Managers can approve, reject, or return for correction. Correction returns the request to editable `Draft` status while preserving the historical action in comments and audit logs.
