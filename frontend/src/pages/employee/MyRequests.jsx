import { useEffect, useState } from "react";
import { myRequestsApi } from "../../api/requestApi";
import { RequestTable } from "../../components/requests/RequestTable";
import { Select } from "../../components/common/Select";

export const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    myRequestsApi({ status, search }).then((res) => setRequests(res.data.data));
  }, [status, search]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-royal-900">My Requests</h1>
        <p className="text-sm text-slate-500">Search, filter, view, and edit draft requests.</p>
      </div>
      <div className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-3">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search subject" className="rounded-md border px-3 py-2 text-sm" />
        <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All</option>
          <option>Draft</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </Select>
      </div>
      <RequestTable requests={requests} role="employee" />
    </div>
  );
};
