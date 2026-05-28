import { statusColor } from "../../utils/constants";

export const Badge = ({ status }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[status] || "bg-slate-100 text-slate-700"}`}>
    {status}
  </span>
);
