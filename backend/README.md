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
