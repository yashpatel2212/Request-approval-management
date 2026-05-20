import { yupResolver } from "@hookform/resolvers/yup";
import ReactQuill from "react-quill-new";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { generateRequestDraftApi } from "../../api/aiApi";
import { getManagersApi, saveDraftApi, submitRequestApi, updateDraftApi, resubmitRequestApi } from "../../api/requestApi";
import { requestFormSchema } from "../../utils/validationSchemas";

export const RequestForm = ({ existingRequest }) => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [files, setFiles] = useState([]);
  const [roughText, setRoughText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [missingInformation, setMissingInformation] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(requestFormSchema),
    defaultValues: {
      approvalType: existingRequest?.approvalType || "Direct",
      receiver: existingRequest?.receiver?._id || "",
      priority: existingRequest?.priority || "Low",
      confidentiality: existingRequest?.confidentiality || "Normal",
      transactionType: existingRequest?.transactionType || "Inner Book",
      noteSubject: existingRequest?.noteSubject || "",
      notes: existingRequest?.notes || "",
      bookLanguage: "English"
    }
  });

  useEffect(() => {
    getManagersApi().then((res) => setManagers(res.data.data));
  }, []);

  const generateDraft = async () => {
    if (roughText.trim().length < 10) {
      toast.error("Enter a little more detail for the AI assistant");
      return;
    }

    setAiLoading(true);
    try {
      const values = getValues();
      const response = await generateRequestDraftApi({
        roughText,
        department: "",
        transactionType: values.transactionType,
        approvalType: values.approvalType
      });
      const draft = response.data.data;

      setValue("noteSubject", draft.noteSubject, { shouldValidate: true, shouldDirty: true });
      setValue("notes", draft.notes, { shouldValidate: true, shouldDirty: true });
      setValue("priority", draft.priority, { shouldValidate: true, shouldDirty: true });
      setValue("confidentiality", draft.confidentiality, { shouldValidate: true, shouldDirty: true });
      setValue("transactionType", draft.transactionType, { shouldValidate: true, shouldDirty: true });
      setValue("approvalType", draft.approvalType, { shouldValidate: true, shouldDirty: true });
      setMissingInformation(draft.missingInformation || []);
      toast.success("AI draft applied");
    } catch (error) {
      toast.error(error?.response?.data?.message || "AI assistant failed");
    } finally {
      setAiLoading(false);
    }
  };

  const buildFormData = (values) => {
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => data.append(key, value));
    files.forEach((file) => data.append("attachments", file));
    return data;
  };

  const save = async (values, mode) => {
    try {
      const data = buildFormData(values);
      if (existingRequest?._id && mode === "draft") await updateDraftApi(existingRequest._id, data);
      else if (existingRequest?._id && mode === "submit") await resubmitRequestApi(existingRequest._id, data);
      else if (mode === "draft") await saveDraftApi(data);
      else await submitRequestApi(data);
      toast.success(mode === "draft" ? "Draft saved" : "Request submitted");
      navigate("/employee/requests");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Request could not be saved");
    }
  };

  return (
    <form className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <section className="rounded-lg border border-royal-100 bg-royal-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-royal-900">AI Request Draft Assistant</h2>
            <p className="text-sm text-slate-600">Paste a rough idea and let AI prepare the subject, notes, and suggested settings.</p>
          </div>
          <Button type="button" onClick={generateDraft} disabled={aiLoading}>
            {aiLoading ? "Generating..." : "Generate Draft"}
          </Button>
        </div>
        <textarea
          value={roughText}
          onChange={(event) => setRoughText(event.target.value)}
          className="mt-4 h-28 w-full rounded-md border border-slate-300 bg-white p-3 text-sm outline-none focus:border-royal-600 focus:ring-2 focus:ring-royal-100"
          placeholder="Example: Need approval to buy 20 laptops for the Operations team because new joiners are starting next month. Vendor quotation is attached."
        />
        {missingInformation.length ? (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-medium">Consider adding:</p>
            <ul className="mt-1 list-disc pl-5">
              {missingInformation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Approval Type" error={errors.approvalType?.message} {...register("approvalType")}>
          <option>Direct</option>
          <option>Indirect</option>
        </Select>
        <Select label="Receiver" error={errors.receiver?.message} {...register("receiver")}>
          <option value="">Select manager</option>
          {managers.map((manager) => (
            <option key={manager._id} value={manager._id}>
              {manager.name} - {manager.designation}
            </option>
          ))}
        </Select>
        <Select label="Priority" error={errors.priority?.message} {...register("priority")}>
          <option>Low</option>
          <option>High</option>
        </Select>
        <Select label="Confidentiality" error={errors.confidentiality?.message} {...register("confidentiality")}>
          <option>Normal</option>
          <option>Confidential</option>
        </Select>
        <Input label="Book Language" value="English" readOnly />
        <Select label="Transaction Type" error={errors.transactionType?.message} {...register("transactionType")}>
          <option>Inner Book</option>
          <option>Outer Book</option>
        </Select>
        <Input className="md:col-span-2" label="Note Subject" error={errors.noteSubject?.message} {...register("noteSubject")} />
      </div>
      <div>
        <span className="mb-1 block text-sm font-medium text-slate-700">Notes on Request</span>
        <Controller name="notes" control={control} render={({ field }) => <ReactQuill theme="snow" {...field} />} />
        {errors.notes ? <span className="mt-1 block text-xs text-rose-600">{errors.notes.message}</span> : null}
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Attachments</span>
        <input type="file" multiple onChange={(event) => setFiles(Array.from(event.target.files || []))} className="w-full rounded-md border bg-white p-2 text-sm" />
      </label>
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={handleSubmit((values) => save(values, "draft"))}>
          Save as Draft
        </Button>
        <Button type="button" disabled={isSubmitting} onClick={handleSubmit((values) => save(values, "submit"))}>
          Submit Request
        </Button>
      </div>
    </form>
  );
};
