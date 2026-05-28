# Backend

Express, MongoDB, JWT, Multer, Nodemailer, PDFKit, Yup validation, OpenAI-backed AI draft assistance, and MVC/service architecture.

Main entrypoint: `src/server.js`.

Use `.env.example` as the environment template.

To enable AI Request Draft Assistant with Gemini, set:

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
