import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required")
});

export const requestFormSchema = yup.object({
  approvalType: yup.string().required("Approval type is required"),
  receiver: yup.string().required("Receiver is required"),
  priority: yup.string().required("Priority is required"),
  confidentiality: yup.string().required("Confidentiality is required"),
  transactionType: yup.string().required("Transaction type is required"),
  noteSubject: yup.string().min(3).required("Subject is required"),
  notes: yup.string().min(3, "Notes are required")
});
