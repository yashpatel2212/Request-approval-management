import { generateRequestDraft } from "../services/ai.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const draftAssistant = asyncHandler(async (req, res) => {
  const draft = await generateRequestDraft(req.body);
  res.json(new ApiResponse("AI draft generated", draft));
});
