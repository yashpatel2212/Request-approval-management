import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { employeeDashboardApi } from "../../api/dashboardApi";
import { StatCard } from "../../components/dashboard/StatCard";
import { RequestTable } from "../../components/requests/RequestTable";
import { Button } from "../../components/common/Button";

export const EmployeeDashboard = () => {
  const [data, setData] = useState({ stats: {}, recent: [] });

  useEffect(() => {
    employeeDashboardApi().then((res) => setData(res.data.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-royal-900">Employee Dashboard</h1>
          <p className="text-sm text-slate-500">Track requests, drafts, and manager decisions.</p>
        </div>
        <Link to="/employee/requests/new">
          <Button>Raise New Request</Button>
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Requests" value={data.stats.total} />
        <StatCard label="Pending" value={data.stats.pending} />
        <StatCard label="Approved" value={data.stats.approved} />
        <StatCard label="Rejected" value={data.stats.rejected} />
        <StatCard label="Draft" value={data.stats.draft} />
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold text-royal-900">Recent Requests</h2>
        <RequestTable requests={data.recent} role="employee" />
      </section>
    </div>
  );
};
