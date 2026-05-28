import { Link } from "react-router-dom";
import { Badge } from "../common/Badge";
import { EmptyState } from "../common/EmptyState";

export const RequestTable = ({ requests, role }) => {
  if (!requests?.length) return <EmptyState title="No requests found" />;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Request No.</th>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">{role === "manager" ? "Sender" : "Receiver"}</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {requests.map((request) => (
            <tr key={request._id}>
              <td className="px-4 py-3 font-medium">{request.requestNumber}</td>
              <td className="px-4 py-3">{request.noteSubject}</td>
              <td className="px-4 py-3">{role === "manager" ? request.sender?.name : request.receiver?.name}</td>
              <td className="px-4 py-3">{request.priority}</td>
              <td className="px-4 py-3">
                <Badge status={request.status} />
              </td>
              <td className="px-4 py-3">
                <Link className="font-medium text-royal-700" to={role === "manager" ? `/manager/requests/${request._id}` : `/employee/requests/${request._id}`}>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
