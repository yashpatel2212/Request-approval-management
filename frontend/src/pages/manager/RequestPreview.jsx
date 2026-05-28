import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  approveRequestApi,
  downloadAttachmentApi,
  downloadPdfApi,
  rejectRequestApi,
  requestByIdApi,
  returnCorrectionApi
} from "../../api/requestApi";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { ManagerActionModal } from "../../components/requests/ManagerActionModal";
import { downloadBlob } from "../../utils/downloadFile";

export const RequestPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [action, setAction] = useState(null);

  useEffect(() => {
    requestByIdApi(id).then((res) => setData(res.data.data));
  }, [id]);

  const submitAction = async (remarks) => {
    try {
      if (action === "approve") await approveRequestApi(id, remarks);
      if (action === "reject") await rejectRequestApi(id, remarks);
      if (action === "correction") await returnCorrectionApi(id, remarks);
      toast.success("Request action completed");
      navigate("/manager/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
  };

  const downloadPdf = async () => {
    const response = await downloadPdfApi(request._id);
    downloadBlob(response.data, `${request.requestNumber}.pdf`);
  };

  const downloadAttachment = async (file) => {
    const response = await downloadAttachmentApi(request._id, file._id);
    downloadBlob(response.data, file.originalName);
  };

  if (!data) return <p>Loading...</p>;
  const { request, comments } = data;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-royal-900">{request.requestNumber}</h1>
          <p className="text-sm text-slate-500">{request.noteSubject}</p>
        </div>
        <Badge status={request.status} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-lg border bg-white p-5 lg:col-span-2">
          <h2 className="font-semibold text-royal-900">Request Notes</h2>
          <div className="prose mt-3 max-w-none" dangerouslySetInnerHTML={{ __html: request.notes }} />
        </section>
        <aside className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold text-royal-900">Details</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div><dt className="text-slate-500">Creator</dt><dd>{request.transactionCreator?.name}</dd></div>
            <div><dt className="text-slate-500">Sender</dt><dd>{request.sender?.name}</dd></div>
            <div><dt className="text-slate-500">Priority</dt><dd>{request.priority}</dd></div>
            <div><dt className="text-slate-500">Confidentiality</dt><dd>{request.confidentiality}</dd></div>
            <div><dt className="text-slate-500">Type</dt><dd>{request.transactionType}</dd></div>
          </dl>
          <button className="mt-4 block text-sm font-medium text-royal-700" onClick={downloadPdf}>
            Download PDF
          </button>
        </aside>
      </div>
      {request.attachments?.length ? (
        <section className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold text-royal-900">Attachments</h2>
          <div className="mt-3 space-y-2">
            {request.attachments.map((file) => (
              <button key={file._id} className="block text-sm text-royal-700" onClick={() => downloadAttachment(file)}>
                {file.originalName}
              </button>
            ))}
          </div>
        </section>
      ) : null}
      {request.status === "Pending" ? (
        <div className="flex flex-wrap gap-3">
          <Button variant="success" onClick={() => setAction("approve")}>Approve</Button>
          <Button variant="danger" onClick={() => setAction("reject")}>Reject</Button>
          <Button variant="warning" onClick={() => setAction("correction")}>Return for Correction</Button>
        </div>
      ) : null}
      <section className="rounded-lg border bg-white p-5">
        <h2 className="font-semibold text-royal-900">History</h2>
        <div className="mt-3 space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="border-l-2 border-royal-600 pl-3 text-sm">
              <p className="font-medium">{comment.action} by {comment.user?.name}</p>
              <p className="text-slate-600">{comment.comment}</p>
            </div>
          ))}
        </div>
      </section>
      {action ? <ManagerActionModal action={action} onClose={() => setAction(null)} onSubmit={submitAction} /> : null}
    </div>
  );
};
