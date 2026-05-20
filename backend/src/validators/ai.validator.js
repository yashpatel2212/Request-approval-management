import * as yup from "yup";

export const draftAssistantSchema = yup.object({
  roughText: yup.string().trim().min(10).max(4000).required(),
  department: yup.string().trim().max(120).optional(),
  transactionType: yup.string().oneOf(["Inner Book", "Outer Book"]).optional(),
  approvalType: yup.string().oneOf(["Indirect", "Direct"]).optional()
});
