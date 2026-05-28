import { RequestForm } from "../../components/requests/RequestForm";

export const CreateRequest = () => (
  <div className="space-y-4">
    <div>
      <h1 className="text-2xl font-bold text-royal-900">Create Request</h1>
      <p className="text-sm text-slate-500">Save as draft or submit directly to a manager.</p>
    </div>
    <RequestForm />
  </div>
);
