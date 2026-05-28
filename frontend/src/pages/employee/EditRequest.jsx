import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { downloadPdfApi, requestByIdApi } from "../../api/requestApi";
import { RequestForm } from "../../components/requests/RequestForm";
import { Badge } from "../../components/common/Badge";
import { downloadBlob } from "../../utils/downloadFile";

export const EditRequest = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    requestByIdApi(id).then((res) => setData(res.data.data));
  }, [id]);

  if (!data) return <p>Loading...</p>;
  const { request, comments } = data;
  const editable = request.status === "Draft";
  const downloadPdf = async () => {
    const response = await downloadPdfApi(request._id);
    downloadBlob(response.data, `${request.requestNumber}.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-royal-900">{request.requestNumber}</h1>
          <p className="text-sm text-slate-500">{request.noteSubject}</p>
        </div>
        <Badge status={request.status} />
      </div>
      {editable ? <RequestForm existingRequest={request} /> : null}
      {!editable ? (
        <div className="rounded-lg border bg-white p-5">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: request.notes }} />
          <button className="mt-4 inline-block text-royal-700" onClick={downloadPdf}>
            Download PDF
          </button>
        </div>
      ) : null}
      <div className="rounded-lg border bg-white p-5">
        <h2 className="font-semibold text-royal-900">History</h2>
        <div className="mt-3 space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="border-l-2 border-royal-600 pl-3 text-sm">
              <p className="font-medium">{comment.action}</p>
              <p className="text-slate-600">{comment.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
