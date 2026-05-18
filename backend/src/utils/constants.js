export const ROLES = Object.freeze({
  EMPLOYEE: "employee",
  MANAGER: "manager"
});

export const REQUEST_STATUS = Object.freeze({
  DRAFT: "Draft",
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  RETURNED: "Returned for Correction"
});

export const COMMENT_ACTION = Object.freeze({
  CREATED: "Created",
  SUBMITTED: "Submitted",
  UPDATED: "Updated",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  RETURNED: "Returned for Correction",
  RESUBMITTED: "Resubmitted"
});

export const EMAIL_TYPES = Object.freeze({
  REQUEST_SUBMITTED: "REQUEST_SUBMITTED",
  REQUEST_APPROVED: "REQUEST_APPROVED",
  REQUEST_REJECTED: "REQUEST_REJECTED",
  REQUEST_CORRECTION: "REQUEST_CORRECTION"
});

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png"
];
