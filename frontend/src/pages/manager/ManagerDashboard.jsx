import { useEffect, useState } from "react";
import { managerDashboardApi } from "../../api/dashboardApi";
import { receivedRequestsApi } from "../../api/requestApi";
import { StatCard } from "../../components/dashboard/StatCard";
import { RequestTable } from "../../components/requests/RequestTable";
import { Select } from "../../components/common/Select";

export const ManagerDashboard = () => {
  const [dashboard, setDashboard] = useState({ stats: {}, recent: [] });
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [search, setSearch] = useState("");

  useEffect(() => {
    managerDashboardApi().then((res) => setDashboard(res.data.data));
  }, []);

  useEffect(() => {
    receivedRequestsApi({ status, search }).then((res) => setRequests(res.data.data));
  }, [status, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-royal-900">Manager Dashboard</h1>
        <p className="text-sm text-slate-500">Review requests and take approval actions.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Received" value={dashboard.stats.total} />
        <StatCard label="Pending" value={dashboard.stats.pending} />
        <StatCard label="Approved" value={dashboard.stats.approved} />
        <StatCard label="Rejected" value={dashboard.stats.rejected} />
        <StatCard label="Returned" value={dashboard.stats.returned} />
      </div>
      <div className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-3">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search subject" className="rounded-md border px-3 py-2 text-sm" />
        <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Draft</option>
        </Select>
      </div>
      <RequestTable requests={requests} role="manager" />
    </div>
  );
};
