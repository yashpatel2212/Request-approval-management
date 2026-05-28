import PDFDocument from "pdfkit";
import sanitizeHtml from "sanitize-html";

const writePdfContent = (doc, request) => {
  doc.fontSize(18).text("Royal Group Request Report", { align: "center" });
  doc.moveDown();

  const row = (label, value) => {
    doc.fontSize(10).fillColor("#555").text(label, { continued: true, width: 170 });
    doc.fillColor("#111").text(String(value || "-"));
  };

  row("Request Number: ", request.requestNumber);
  row("Subject: ", request.noteSubject);
  row("Status: ", request.status);
  row("Approval Type: ", request.approvalType);
  row("Priority: ", request.priority);
  row("Confidentiality: ", request.confidentiality);
  row("Transaction Type: ", request.transactionType);
  row("Transaction Date: ", request.transactionDate?.toDateString());
  row("Creator: ", request.transactionCreator?.name);
  row("Sender: ", request.sender?.name);
  row("Receiver: ", request.receiver?.name);

  doc.moveDown();
  doc.fontSize(13).fillColor("#111").text("Notes");
  doc.fontSize(10).text(sanitizeHtml(request.notes || "", { allowedTags: [], allowedAttributes: {} }));

  doc.moveDown();
  doc.fontSize(13).text("Manager Remarks");
  doc.fontSize(10).text(request.managerRemarks || request.correctionNotes || "-");

  doc.moveDown();
  doc.fontSize(13).text("Attachments");
  if (request.attachments?.length) {
    request.attachments.forEach((file) => {
      doc.fontSize(10).text(`- ${file.originalName} (${Math.round(file.size / 1024)} KB)`);
    });
  } else {
    doc.fontSize(10).text("-");
  }
};

export const createRequestPdfBuffer = (request) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    writePdfContent(doc, request);
    doc.end();
  });

export const streamRequestPdf = (request, res) => {
  const doc = new PDFDocument({ margin: 50 });
  const fileName = `${request.requestNumber}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  doc.pipe(res);
  writePdfContent(doc, request);
  doc.end();
};
