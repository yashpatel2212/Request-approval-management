import { useState } from "react";
import { Button } from "../common/Button";

export const ManagerActionModal = ({ action, onClose, onSubmit }) => {
  const [remarks, setRemarks] = useState("");

  const titles = {
    approve: "Approve Request",
    reject: "Reject Request",
    correction: "Return for Correction"
  };

  return (
    <div className="fixed inset-0 grid place-items-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
        <h2 className="text-lg font-semibold text-royal-900">{titles[action]}</h2>
        <textarea
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
          className="mt-4 h-32 w-full rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-royal-600"
          placeholder="Enter manager remarks"
        />
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSubmit(remarks)} disabled={remarks.length < 3}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};
