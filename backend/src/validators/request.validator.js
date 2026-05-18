import * as yup from "yup";

export const requestSchema = yup.object({
  approvalType: yup.string().oneOf(["Indirect", "Direct"]).required(),
  sender: yup.string().optional(),
  receiver: yup.string().required(),
  priority: yup.string().oneOf(["Low", "High"]).required(),
  confidentiality: yup.string().oneOf(["Normal", "Confidential"]).required(),
  bookLanguage: yup.string().oneOf(["English"]).default("English"),
  transactionDate: yup.date().optional(),
  transactionType: yup.string().oneOf(["Inner Book", "Outer Book"]).required(),
  noteSubject: yup.string().min(3).max(200).required(),
  notes: yup.string().min(3).required()
});

export const managerActionSchema = yup.object({
  remarks: yup.string().min(3).max(2000).required()
});
