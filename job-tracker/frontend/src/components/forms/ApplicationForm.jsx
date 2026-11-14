
import { useState } from "react";

const EMPTY_FORM = {
  company: "",
  role: "",
  status: "wishlist",
  job_url: "",
  location: "",
  applied_on: "",
  notes: "",
};

export default function ApplicationForm({
  initialData,
  onSubmit,
  onCancel,
  saving,
}) {
  const [form, setForm] = useState(() =>
    initialData
      ? {
          company: initialData.company || "",
          role: initialData.role || "",
          status: initialData.status || "wishlist",
          job_url: initialData.job_url || "",
          location: initialData.location || "",
          applied_on: initialData.applied_on || "",
          notes: initialData.notes || "",
        }
      : { ...EMPTY_FORM }
  );

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.company.trim() || !form.role.trim()) {
      setError("Company and job role are required.");
      return;
    }

    onSubmit({
      ...form,
      company: form.company.trim(),
      role: form.role.trim(),
      job_url: form.job_url.trim() || null,
      location: form.location.trim() || null,
      applied_on: form.applied_on || null,
      notes: form.notes.trim() || null,
    });
  };

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Company name *</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="e.g. Infosys"
            required
          />
        </div>

        <div className="form-group">
          <label>Job role *</label>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="e.g. Backend Developer"
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="wishlist">Wishlist</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Hyderabad"
          />
        </div>

        <div className="form-group">
          <label>Job URL</label>
          <input
            type="url"
            name="job_url"
            value={form.job_url}
            onChange={handleChange}
            placeholder="https://company.com/jobs/..."
          />
        </div>

        <div className="form-group">
          <label>Applied date</label>
          <input
            type="date"
            name="applied_on"
            value={form.applied_on}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label>Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Add interview details, recruiter information, follow-up notes..."
            rows={4}
          />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : initialData
              ? "Save Changes"
              : "Add Application"}
        </button>
      </div>
    </form>
  );
}
