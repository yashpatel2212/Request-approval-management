export const StatCard = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-royal-900">{value ?? 0}</p>
  </div>
);
