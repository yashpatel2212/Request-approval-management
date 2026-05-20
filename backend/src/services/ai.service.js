import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const draftAssistantSchema = {
  type: "object",
  additionalProperties: false,
  propertyOrdering: [
    "noteSubject",
    "notes",
    "priority",
    "confidentiality",
    "transactionType",
    "approvalType",
    "missingInformation"
  ],
  properties: {
    noteSubject: {
      type: "string",
      description: "A concise enterprise request subject under 120 characters."
    },
    notes: {
      type: "string",
      description: "Professional HTML body for a request note. Use simple paragraphs and bullet lists only."
    },
    priority: {
      type: "string",
      enum: ["Low", "High"]
    },
    confidentiality: {
      type: "string",
      enum: ["Normal", "Confidential"]
    },
    transactionType: {
      type: "string",
      enum: ["Inner Book", "Outer Book"]
    },
    approvalType: {
      type: "string",
      enum: ["Indirect", "Direct"]
    },
    missingInformation: {
      type: "array",
      items: { type: "string" },
      description: "Important details the employee should consider adding before submission."
    }
  },
  required: [
    "noteSubject",
    "notes",
    "priority",
    "confidentiality",
    "transactionType",
    "approvalType",
    "missingInformation"
  ]
};

const systemInstruction =
  "You are an enterprise request writing assistant. Rewrite rough employee input into a clear, formal approval request. Do not invent vendor names, prices, dates, or approvals. If information is missing, list it in missingInformation instead. Return only data matching the schema.";

const extractResponseText = (response) => {
  if (response.output_text) return response.output_text;

  const chunks = [];
  for (const item of response.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) chunks.push(content.text);
    }
  }
  return chunks.join("");
};

const normalizeDraft = (draft) => ({
  noteSubject: draft.noteSubject || "Approval Request",
  notes: draft.notes || "<p>Please review and approve this request.</p>",
  priority: ["Low", "High"].includes(draft.priority) ? draft.priority : "Low",
  confidentiality: ["Normal", "Confidential"].includes(draft.confidentiality) ? draft.confidentiality : "Normal",
  transactionType: ["Inner Book", "Outer Book"].includes(draft.transactionType) ? draft.transactionType : "Inner Book",
  approvalType: ["Indirect", "Direct"].includes(draft.approvalType) ? draft.approvalType : "Direct",
  missingInformation: Array.isArray(draft.missingInformation) ? draft.missingInformation : []
});

const generateWithOpenAI = async ({ roughText, department, transactionType, approvalType }) => {
  if (!env.openai.apiKey) {
    throw new ApiError(503, "AI assistant is not configured. Add OPENAI_API_KEY in backend/.env.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openai.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.openai.model,
      instructions: systemInstruction,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify({
                roughText,
                department,
                transactionType,
                approvalType
              })
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "request_draft_assistant",
          strict: true,
          schema: draftAssistantSchema
        }
      },
      max_output_tokens: 1400
    })
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, payload.error?.message || "AI assistant request failed");
  }

  const text = extractResponseText(payload);
  if (!text) throw new ApiError(502, "AI assistant returned an empty response");

  try {
    return normalizeDraft(JSON.parse(text));
  } catch {
    throw new ApiError(502, "AI assistant returned invalid JSON");
  }
};

const generateWithGemini = async ({ roughText, department, transactionType, approvalType }) => {
  if (!env.gemini.apiKey) {
    throw new ApiError(503, "AI assistant is not configured. Add GEMINI_API_KEY in backend/.env.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.gemini.model}:generateContent`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-goog-api-key": env.gemini.apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: JSON.stringify({
                roughText,
                department,
                transactionType,
                approvalType
              })
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
        responseJsonSchema: draftAssistantSchema
      }
    })
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, payload.error?.message || "Gemini assistant request failed");
  }

  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
  if (!text) throw new ApiError(502, "Gemini assistant returned an empty response");

  try {
    return normalizeDraft(JSON.parse(text));
  } catch {
    throw new ApiError(502, "Gemini assistant returned invalid JSON");
  }
};

export const generateRequestDraft = async (payload) => {
  if (env.aiProvider === "openai") return generateWithOpenAI(payload);
  return generateWithGemini(payload);
};
