import * as yup from "yup";
import { ROLES } from "../utils/constants.js";

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
});

export const registerSchema = yup.object({
  name: yup.string().min(2).required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  role: yup.string().oneOf(Object.values(ROLES)).required(),
  department: yup.string().required(),
  designation: yup.string().required()
});
