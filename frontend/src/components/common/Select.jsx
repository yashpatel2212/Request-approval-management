import { forwardRef } from "react";

export const Select = forwardRef(({ label, error, children, ...props }, ref) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
    <select
      ref={ref}
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-royal-600 focus:ring-2 focus:ring-royal-100"
      {...props}
    >
      {children}
    </select>
    {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
  </label>
));

Select.displayName = "Select";
