export const buildEmail = ({ type, request, recipientName, comment }) => {
  const subjectMap = {
    REQUEST_SUBMITTED: `Request ${request.requestNumber} submitted`,
    REQUEST_APPROVED: `Request ${request.requestNumber} approved`,
    REQUEST_REJECTED: `Request ${request.requestNumber} rejected`,
    REQUEST_CORRECTION: `Request ${request.requestNumber} returned for correction`
  };

  const statusLine = {
    REQUEST_SUBMITTED: "has been submitted and is pending manager review.",
    REQUEST_APPROVED: "has been approved.",
    REQUEST_REJECTED: "has been rejected.",
    REQUEST_CORRECTION: "has been returned for correction."
  };

  const html = `
    <div style="font-family:Arial,sans-serif;color:#172033;line-height:1.5">
      <h2 style="margin:0 0 12px">Request Approval Notification</h2>
      <p>Dear ${recipientName},</p>
      <p>Request <strong>${request.requestNumber}</strong> ${statusLine[type]}</p>
      <table style="border-collapse:collapse;margin:16px 0;width:100%;max-width:640px">
        <tr><td style="padding:8px;border:1px solid #ddd">Subject</td><td style="padding:8px;border:1px solid #ddd">${request.noteSubject}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd">Priority</td><td style="padding:8px;border:1px solid #ddd">${request.priority}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd">Status</td><td style="padding:8px;border:1px solid #ddd">${request.status}</td></tr>
      </table>
      ${comment ? `<p><strong>Remarks:</strong> ${comment}</p>` : ""}
      <p>Regards,<br/>Request & Approval Management System</p>
    </div>
  `;

  return { subject: subjectMap[type], html };
};
