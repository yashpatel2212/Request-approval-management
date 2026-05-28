# Royal Group Request & Approval Management System - Complete Learning Guide

This guide explains the full MERN stack project: what each folder does, how data moves through the app, how authentication works, how the approval workflow is implemented, and how AI, email, PDF, uploads, and dashboards fit together.

## 1. Project Purpose

The application is an enterprise request and approval workflow system.

Employees can:

- Log in
- Create requests
- Save drafts
- Submit requests to managers
- Track request status
- Edit corrected requests
- Use AI to draft professional request text

Managers can:

- Log in
- View received requests
- Preview request details
- Download attachments
- Generate PDF reports
- Approve requests
- Reject requests
- Return requests for correction

The system also supports:

- JWT authentication
- Role-based authorization
- MongoDB database storage
- File uploads
- Email notifications
- PDF generation
- Audit logging
- AI request drafting using Gemini

## 2. High-Level Architecture

```txt
React Frontend
   |
   | Axios HTTP requests
   v
Express Backend API
   |
   | Mongoose
   v
MongoDB

Backend also connects to:

- SMTP server for emails
- Gemini API for AI draft generation
- Local uploads folder for attachments
- PDFKit for PDF generation
```

The frontend never talks directly to MongoDB, SMTP, or Gemini. It only talks to the backend.

This is important because API keys, database credentials, and email credentials must stay on the server.

## 3. Root Folder Structure

```txt
New folder/
├── backend/
├── frontend/
├── README.md
├── PROJECT_LEARNING_GUIDE.md
└── .gitignore
```

### `backend/`

Contains the Node.js, Express, MongoDB, email, PDF, upload, and AI logic.

### `frontend/`

Contains the React user interface.

### `README.md`

Quick setup and API summary.

### `PROJECT_LEARNING_GUIDE.md`

This learning guide.

### `.gitignore`

Prevents sensitive or generated files from being committed:

```txt
node_modules/
dist/
.env
uploads/
*.log
```

## 4. Backend Overview

Backend folder:

```txt
backend/
├── package.json
├── .env
├── .env.example
├── README.md
└── src/
```

### `backend/package.json`

Defines dependencies and scripts.

Important scripts:

```json
{
  "dev": "nodemon src/server.js",
  "start": "node src/server.js",
  "seed": "node src/seed.js"
}
```

Use:

```bash
npm run dev
```

to start the backend in development mode.

### `backend/.env`

Contains real secrets and configuration:

```env
MONGO_URI=
JWT_SECRET=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
GEMINI_API_KEY=
```

Never commit this file.

### `backend/.env.example`

A safe template showing which environment variables are needed.

## 5. Backend `src` Structure

```txt
backend/src/
├── app.js
├── server.js
├── seed.js
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── templates/
├── utils/
└── validators/
```

## 6. Backend Entry Files

### `backend/src/server.js`

This starts the backend server.

Responsibilities:

- Connect to MongoDB
- Start Express server
- Listen on configured port

Flow:

```txt
server.js
   |
   v
connectDB()
   |
   v
app.listen(PORT)
```

### `backend/src/app.js`

This configures the Express app.

Responsibilities:

- Enable security headers using Helmet
- Configure CORS
- Parse JSON requests
- Apply rate limiting
- Serve uploaded files
- Mount API routes under `/api`
- Handle 404 errors
- Handle all backend errors centrally

Main request flow:

```txt
Incoming request
   |
   v
Security / CORS / JSON parser / rate limiter
   |
   v
/api routes
   |
   v
controller
   |
   v
service
   |
   v
database or external service
```

## 7. Backend Config Folder

```txt
backend/src/config/
├── db.js
├── env.js
└── multer.js
```

### `env.js`

Reads environment variables from `.env` and exposes a clean config object.

Example:

```js
env.mongoUri
env.jwtSecret
env.mail.host
env.gemini.apiKey
```

This avoids using `process.env` everywhere.

### `db.js`

Connects to MongoDB using Mongoose.

### `multer.js`

Configures attachment uploads.

It controls:

- Upload folder
- File size limit
- Allowed file types
- File naming

Allowed file examples:

```txt
PDF
DOC
DOCX
XLS
XLSX
JPG
PNG
```

## 8. Backend Models Folder

```txt
backend/src/models/
├── user.model.js
├── request.model.js
├── requestComment.model.js
├── notificationLog.model.js
└── auditLog.model.js
```

Models define MongoDB collections.

### `user.model.js`

Stores employees and managers.

Fields:

```txt
name
email
password
role
department
designation
isActive
lastLoginAt
```

Important logic:

- Password is hashed with bcrypt before saving.
- Password is not returned by default because of `select: false`.
- User can compare login password using `comparePassword`.

### `request.model.js`

Main business document.

Stores:

```txt
requestNumber
approvalType
transactionCreator
sender
receiver
priority
confidentiality
bookLanguage
transactionDate
transactionType
noteSubject
notes
attachments
status
correctionNotes
managerRemarks
submittedAt
approvedAt
rejectedAt
returnedAt
```

Statuses:

```txt
Draft
Pending
Approved
Rejected
Returned for Correction
```

In the current workflow, when a manager returns for correction, the request becomes editable again using `Draft` status, while correction history is preserved in comments and audit logs.

### `requestComment.model.js`

Stores request history.

Examples:

```txt
Created
Submitted
Updated
Resubmitted
Approved
Rejected
Returned for Correction
```

### `notificationLog.model.js`

Stores email notification results.

Useful for debugging email delivery.

### `auditLog.model.js`

Tracks important system actions.

Examples:

```txt
LOGIN
CREATE_DRAFT
SUBMIT_REQUEST
APPROVE_REQUEST
REJECT_REQUEST
RETURN_CORRECTION
```

## 9. Backend Routes Folder

```txt
backend/src/routes/
├── index.js
├── auth.routes.js
├── user.routes.js
├── request.routes.js
├── dashboard.routes.js
├── notification.routes.js
└── ai.routes.js
```

Routes define API endpoints.

### `index.js`

Combines all route groups:

```txt
/api/auth
/api/users
/api/requests
/api/dashboard
/api/notifications
/api/ai
```

Also provides:

```txt
GET /api/health
```

### `auth.routes.js`

Authentication routes:

```txt
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
```

### `user.routes.js`

User lookup routes:

```txt
GET /api/users/managers
GET /api/users/employees
```

### `request.routes.js`

Main workflow routes:

```txt
POST   /api/requests/draft
POST   /api/requests/submit
GET    /api/requests/my
GET    /api/requests/received
GET    /api/requests/:id
PUT    /api/requests/:id/draft
PUT    /api/requests/:id/resubmit
PUT    /api/requests/:id/approve
PUT    /api/requests/:id/reject
PUT    /api/requests/:id/return-correction
POST   /api/requests/:id/attachments
GET    /api/requests/:id/pdf
GET    /api/requests/:id/attachments/:attachmentId/download
DELETE /api/requests/:id/attachment/:attachmentId
```

### `dashboard.routes.js`

Dashboard APIs:

```txt
GET /api/dashboard/employee
GET /api/dashboard/manager
```

### `notification.routes.js`

Manager-only notification log APIs.

### `ai.routes.js`

AI assistant route:

```txt
POST /api/ai/request-draft
```

This route is protected and employee-only.

## 10. Backend Controllers Folder

```txt
backend/src/controllers/
├── auth.controller.js
├── user.controller.js
├── request.controller.js
├── dashboard.controller.js
├── notification.controller.js
└── ai.controller.js
```

Controllers receive HTTP requests and return HTTP responses.

They should stay thin.

Example:

```txt
Route
   |
   v
Controller
   |
   v
Service
```

### `auth.controller.js`

Handles:

- Login
- Register
- Current user
- Logout

### `request.controller.js`

Handles:

- Save draft
- Submit request
- Update draft
- Resubmit
- Approve
- Reject
- Return for correction
- Download attachment
- Generate PDF

### `ai.controller.js`

Receives rough request text from the frontend and calls the AI service.

## 11. Backend Services Folder

```txt
backend/src/services/
├── auth.service.js
├── request.service.js
├── email.service.js
├── pdf.service.js
├── ai.service.js
└── audit.service.js
```

Services contain business logic.

### `auth.service.js`

Handles login logic:

```txt
find user by email
compare password
generate JWT
return user and token
```

### `request.service.js`

This is the core workflow file.

It handles:

- Creating draft requests
- Submitting requests
- Updating draft requests
- Resubmitting corrected requests
- Manager approval
- Manager rejection
- Return for correction
- Sending emails
- Attaching PDFs and uploaded documents
- Loading request details
- Removing attachments

### `email.service.js`

Uses Nodemailer.

Responsibilities:

- Build email
- Send email through SMTP
- Log success/failure in `NotificationLog`

If SMTP is not configured, notification logs are still created for development.

### `pdf.service.js`

Uses PDFKit.

Generates request PDF containing:

- Request number
- Subject
- Status
- Sender and receiver
- Notes
- Manager remarks
- Attachment metadata

### `ai.service.js`

Uses Gemini API by default.

Input:

```txt
rough employee request text
```

Output:

```json
{
  "noteSubject": "...",
  "notes": "...",
  "priority": "Low",
  "confidentiality": "Normal",
  "transactionType": "Inner Book",
  "approvalType": "Direct",
  "missingInformation": []
}
```

The frontend uses this output to fill the request form.

### `audit.service.js`

Creates audit logs for important actions.

## 12. Backend Middleware Folder

```txt
backend/src/middlewares/
├── auth.middleware.js
├── role.middleware.js
├── validate.middleware.js
├── error.middleware.js
└── rateLimiter.middleware.js
```

### `auth.middleware.js`

Checks JWT token.

Flow:

```txt
read Authorization header
verify JWT
find user
attach user to req.user
```

### `role.middleware.js`

Checks role access.

Example:

```js
authorize("manager")
```

### `validate.middleware.js`

Validates request body using Yup schemas.

### `error.middleware.js`

Centralized error response handler.

### `rateLimiter.middleware.js`

Limits repeated API calls.

## 13. Backend Validators Folder

```txt
backend/src/validators/
├── auth.validator.js
├── request.validator.js
└── ai.validator.js
```

Validators protect the backend from bad input.

### `ai.validator.js`

Validates AI assistant input:

```txt
roughText is required
minimum 10 characters
maximum 4000 characters
```

## 14. Backend Utils Folder

```txt
backend/src/utils/
├── ApiError.js
├── ApiResponse.js
├── asyncHandler.js
├── constants.js
├── generateToken.js
└── sanitizeHtml.js
```

### `ApiError.js`

Standard error object.

### `ApiResponse.js`

Standard success response format.

### `asyncHandler.js`

Avoids repetitive try/catch blocks.

### `constants.js`

Central place for:

```txt
roles
statuses
email types
allowed file types
```

### `generateToken.js`

Creates JWT tokens.

### `sanitizeHtml.js`

Sanitizes rich text notes to reduce XSS risk.

## 15. Backend Email Templates

```txt
backend/src/templates/emailTemplates.js
```

Builds HTML emails for:

- Request submitted
- Request approved
- Request rejected
- Request returned for correction

## 16. Backend Seed File

```txt
backend/src/seed.js
```

Creates demo users.

Run:

```bash
cd backend
npm run seed
```

## 17. Frontend Overview

Frontend folder:

```txt
frontend/
├── package.json
├── .env
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
```

### `frontend/package.json`

Defines frontend dependencies and scripts.

Important scripts:

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### `frontend/.env`

Contains frontend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not put backend secrets or AI keys here.

## 18. Frontend Source Structure

```txt
frontend/src/
├── main.jsx
├── index.css
├── app/
├── api/
├── components/
├── features/
├── hooks/
├── layouts/
├── pages/
├── routes/
└── utils/
```

## 19. Frontend Entry Files

### `frontend/src/main.jsx`

Starts React.

Wraps app with:

- Redux Provider
- BrowserRouter
- Toast notifications

### `frontend/src/index.css`

Tailwind CSS and global styles.

## 20. Frontend App Store

```txt
frontend/src/app/store.js
```

Creates Redux store.

Currently includes:

```txt
auth reducer
```

## 21. Frontend API Folder

```txt
frontend/src/api/
├── axiosInstance.js
├── authApi.js
├── requestApi.js
├── dashboardApi.js
└── aiApi.js
```

### `axiosInstance.js`

Creates shared Axios client.

Automatically attaches JWT token:

```txt
Authorization: Bearer token
```

### `authApi.js`

Login and current user APIs.

### `requestApi.js`

Request workflow APIs.

### `dashboardApi.js`

Dashboard APIs.

### `aiApi.js`

Calls:

```txt
POST /api/ai/request-draft
```

## 22. Frontend Auth Feature

```txt
frontend/src/features/auth/authSlice.js
```

Redux auth state:

```txt
user
token
loading
```

It stores token and user in `localStorage` so login survives page refresh.

## 23. Frontend Routes

```txt
frontend/src/routes/
├── AppRoutes.jsx
├── ProtectedRoute.jsx
└── RoleRoute.jsx
```

### `AppRoutes.jsx`

Defines all frontend pages:

```txt
/login
/employee/dashboard
/employee/requests/new
/employee/requests
/employee/requests/:id
/manager/dashboard
/manager/requests/:id
```

### `ProtectedRoute.jsx`

Redirects unauthenticated users to login.

### `RoleRoute.jsx`

Ensures only the correct role can access a section.

## 24. Frontend Layout

```txt
frontend/src/layouts/AppLayout.jsx
```

Shared logged-in layout.

Contains:

- Sidebar
- Topbar
- Role-based menu
- Logout button
- Page outlet

## 25. Frontend Components

```txt
frontend/src/components/
├── common/
├── dashboard/
└── requests/
```

### Common components

```txt
Button.jsx
Input.jsx
Select.jsx
Badge.jsx
EmptyState.jsx
```

Reusable UI controls.

`Input` and `Select` use `forwardRef`, which is important for React Hook Form.

### Dashboard components

```txt
StatCard.jsx
```

Used for dashboard count cards.

### Request components

```txt
RequestForm.jsx
RequestTable.jsx
ManagerActionModal.jsx
```

`RequestForm.jsx` is one of the most important frontend files.

It contains:

- AI draft assistant
- Manager dropdown
- Request fields
- Rich text editor
- Attachment upload
- Save draft button
- Submit button

## 26. Frontend Pages

```txt
frontend/src/pages/
├── auth/
├── employee/
├── manager/
└── NotFound.jsx
```

### `auth/LoginPage.jsx`

Login screen.

Uses:

- React Hook Form
- Yup validation
- Redux login thunk

### Employee pages

```txt
EmployeeDashboard.jsx
CreateRequest.jsx
MyRequests.jsx
EditRequest.jsx
```

### Manager pages

```txt
ManagerDashboard.jsx
RequestPreview.jsx
```

`RequestPreview.jsx` allows the manager to:

- View request
- Download attachments
- Download PDF
- Approve
- Reject
- Return for correction

## 27. Frontend Utils

```txt
frontend/src/utils/
├── constants.js
├── validationSchemas.js
└── downloadFile.js
```

### `constants.js`

Status labels and badge colors.

### `validationSchemas.js`

Yup validation for forms.

### `downloadFile.js`

Downloads PDFs and attachments from protected API responses.

## 28. Authentication Flow

```txt
User enters email/password
   |
   v
Frontend calls POST /api/auth/login
   |
   v
Backend checks user and password
   |
   v
Backend returns JWT
   |
   v
Frontend stores JWT in localStorage
   |
   v
Axios sends JWT on protected requests
   |
   v
Backend verifies JWT in auth middleware
```

JWT payload contains:

```txt
user id
role
expiry
```

## 29. Employee Request Flow

```txt
Employee logs in
   |
   v
Opens Create Request
   |
   v
Optionally uses AI Draft Assistant
   |
   v
Fills request form
   |
   v
Save Draft or Submit
```

If saved as draft:

```txt
status = Draft
```

If submitted:

```txt
status = Pending
email notifications are triggered
manager can review
```

## 30. Manager Approval Flow

```txt
Manager logs in
   |
   v
Manager Dashboard
   |
   v
Open request preview
   |
   v
Approve / Reject / Return Correction
```

Approve:

```txt
status = Approved
manager remarks saved
email sent
PDF generated
```

Reject:

```txt
status = Rejected
manager remarks saved
email sent
PDF generated
```

Return correction:

```txt
status = Draft
correction notes saved
employee can edit and resubmit
```

## 31. AI Request Draft Assistant Flow

```txt
Employee enters rough text
   |
   v
Frontend calls POST /api/ai/request-draft
   |
   v
Backend validates roughText
   |
   v
Backend calls Gemini API
   |
   v
Gemini returns structured JSON
   |
   v
Frontend fills form fields
```

Example rough text:

```txt
Need approval to buy 20 laptops for operations because new employees are joining next month.
```

AI output:

```txt
Subject: Approval Request for Procurement of 20 Laptops
Priority: High
Confidentiality: Normal
Notes: Professional formatted request body
Missing information: vendor quote, budget code
```

## 32. Email Flow

```txt
Business action happens
   |
   v
Request service calls email service
   |
   v
Email template is generated
   |
   v
Nodemailer sends email through SMTP
   |
   v
NotificationLog stores result
```

Email events:

- Request submitted
- Request approved
- Request rejected
- Request returned for correction

## 33. PDF Flow

```txt
Manager or employee clicks Download PDF
   |
   v
Frontend calls protected PDF API
   |
   v
Backend loads request
   |
   v
PDFKit creates PDF
   |
   v
Browser downloads file
```

Final approval/rejection emails also attach generated PDF.

## 34. File Upload Flow

```txt
Employee selects files
   |
   v
FormData sent to backend
   |
   v
Multer validates and saves file
   |
   v
Attachment metadata saved in request document
```

Attachments are downloaded through protected backend routes.

## 35. Dashboard Flow

Employee dashboard counts:

- Total
- Pending
- Approved
- Rejected
- Draft

Manager dashboard counts:

- Received
- Pending
- Approved
- Rejected
- Returned

## 36. Security Features

Implemented:

- JWT authentication
- Password hashing
- Role-based access control
- Input validation
- File type validation
- File size limits
- Rate limiting
- CORS allowlist
- Helmet security headers
- Rich text sanitization
- API keys stored only in backend `.env`

## 37. How to Run the Project

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open:

```txt
http://127.0.0.1:5173
```

Backend health:

```txt
http://localhost:5000/api/health
```

## 38. Demo Login

```txt
Employee:
employee@royalgroup.local
Password123

Manager:
manager@royalgroup.local
Password123
```

## 39. Learning Path

Recommended order:

1. Read `backend/src/server.js`
2. Read `backend/src/app.js`
3. Read `backend/src/routes/index.js`
4. Read `backend/src/routes/auth.routes.js`
5. Read `backend/src/controllers/auth.controller.js`
6. Read `backend/src/services/auth.service.js`
7. Read `backend/src/models/user.model.js`
8. Read `backend/src/models/request.model.js`
9. Read `backend/src/routes/request.routes.js`
10. Read `backend/src/services/request.service.js`
11. Read `frontend/src/main.jsx`
12. Read `frontend/src/routes/AppRoutes.jsx`
13. Read `frontend/src/pages/auth/LoginPage.jsx`
14. Read `frontend/src/components/requests/RequestForm.jsx`
15. Read `frontend/src/pages/manager/RequestPreview.jsx`
16. Read `backend/src/services/ai.service.js`

## 40. Important Mental Model

The project follows this pattern:

```txt
Frontend Page
   |
   v
API function
   |
   v
Express route
   |
   v
Middleware
   |
   v
Controller
   |
   v
Service
   |
   v
Model / Database / External API
```

Once you understand this flow, the whole project becomes much easier to read.

## 41. Common Development Tasks

### Add a new backend endpoint

1. Add validator if input is needed.
2. Add service function.
3. Add controller function.
4. Add route.
5. Add frontend API function.
6. Call it from a page/component.

### Add a new frontend page

1. Create page in `frontend/src/pages`.
2. Add route in `AppRoutes.jsx`.
3. Add sidebar link in `AppLayout.jsx` if needed.
4. Add API functions if needed.

### Add a new database field

1. Update Mongoose model.
2. Update validator.
3. Update service/controller usage.
4. Update frontend form.
5. Update table/preview display if needed.

## 42. Production Notes

Before real deployment:

- Use MongoDB Atlas or secured MongoDB server.
- Use strong JWT secret.
- Use real SMTP credentials.
- Use HTTPS.
- Store uploads in cloud storage such as S3.
- Add admin user management.
- Add password reset.
- Add logs/monitoring.
- Add stricter audit reporting.
- Add automated tests.
- Add CI/CD.

## 43. Summary

This project is a production-style MERN application with:

- Clean backend MVC/service architecture
- Secure authentication
- Role-based workflows
- MongoDB data modeling
- Enterprise request approval logic
- File uploads
- Email notifications
- PDF reports
- AI draft generation
- Responsive React dashboard UI

The most important files to understand deeply are:

```txt
backend/src/app.js
backend/src/routes/index.js
backend/src/models/request.model.js
backend/src/services/request.service.js
backend/src/services/ai.service.js
frontend/src/routes/AppRoutes.jsx
frontend/src/components/requests/RequestForm.jsx
frontend/src/pages/manager/RequestPreview.jsx
```

